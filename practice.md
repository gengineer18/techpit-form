#
## ディレクトリ構成
```
.
├── components
├── domain
│   ├── entity
│   └── services
└── store
    ├── alert
    ├── colleges
    ├── profile
    └── validation
```

### components/
表示に関わるコンポーネントを配置している場所です。全て単体のファイルで構成されています。表示だけを行い、状態の管理やロジックは内包しません。

### domain/entity/
データ構造を定義する場所です。profile やバリデーションの項目がどのようなデータを持っているのかを定義しています。

### domain/services/
ビジネスロジックを記載しています。具体的には、郵便番号に関わる処理や定数などを定義しています。この層があることでビューとロジックを分離できます。

### store/
状態管理を行う場所です。redux の action や reducer を記載します。

## redux の状態
このアプリでは、以下の 4 つの状態を管理しています。

alert
colleges
profile
validation
これらの状態に関しては、出てきたときに説明していきます。


## TS オプショナルな属性
```js
// このようなtypeがあったとしましょう。
type OptionalObject =
  | undefined
  | {
      name: string;
    };

// どちらのも型を満たしています。
const hoge = { name: "hoge" };
const fuga = undefined;

// このような呼び出しでエラーとなってしまうため、nameにアクセスするには hoge やfugaがundefinedでないことをチェックしないといけません。
const piyo = fuga.name;

// そのため、以下のようなチェックをする必要があります。

// ifでチェック①
if (hoge) {
  const piyo = fuga.name;
}

// 論理演算②
const piyo = fuga && fuga.name;

// これだと面倒なので、Optional Chainingの登場です。
// やっていることは②と同じです。
const piyo = fuga?.name;
```

## Generics
React の props なんかは Generics を使わないと宣言できません。
```js
const someFunc = (name: T)<T> => {
    return name
}

const hoge = someFunc<string>("hoge") // hogeはstring型
```

##  Redux with TypeScript
redux を TypeScript で記述するのはとても大変。
アクションタイプによって渡される payload は異なるのですが、それをswitch caseでうまく扱うことは難しい。

```js
// このような型だとします。
type Todo = {
    id: number;
    content: string;
}
type State = Todo[]

const todoReducer = (state: State = init, action: Action) => { // ←Action型は複数のactionの複合型
    switch {
        case ADD_TODO:
            return [...state, action.payload] // payload: Todo
        case DELETE_TODO:
            return state.filter(s => s.id === action.payload) // payload(id): number
        default:
            return state
    }
}
```
typescript-fsaというライブラリを用いることでこの問題を解決できます。Redux with TypeScript の開発ではデファクトとなっている。
typescript-fsaを用いることでかなりスッキリかつ型安全にコードを記述していくことができます

## Redux with hooks
Redux を React で用いるときはreact-reduxのconnect()で接続するのがデファクトだったが難しい、、
React の hooks API の登場とともにreact-reduxも hooks に対応して一気に使いやすくなりました

```js
import React from "react";
import { useSelector } from "react-redux";

export const CounterComponent = () => {
  const counter = useSelector(state => state.counter);
  return <div>{counter}</div>;
};
```
状態を参照したいところでuseSelectorを使うことで store から状態を参照することができるようになります
dispatchも以下のようにすぐに使えるようになって便利
```js
const dispatch = useDispatch();
```

## 実装の流れ
- ディレクトリ構成を理解しよう
- データ構造を定義しよう
- action を作成しよう
- reducer を作成しよう
- store をアプリケーションに登録しよう

## re-ducksパターン
redux のディレクトリ構成として re-ducks パターンというものを採用
redux で管理する状態単位で module に分けていく構成

https://noah.plus/blog/021/
Ducks パターンが解決すること： actionType、action、reducerが散らばっててつらい
Re-ducksパターンが解決すること：ducksパターンにおける module がだんだん肥大化していってつらい

## actionの設定
typescript-fsaを使うことで型情報を失わず簡単に定義することができます。actionCreatorにはジェネリクス（型引数）が使われています。setProfileという action のpayload（reducer に渡す値）の型をこれで定義することができます。

また、Partial<Profile>という記法ができました。これは、Profileという型の部分集合で、Profileの項目のうち必要なものだけを渡すことができます。含まれなかったProfileの項目はundefinedとして扱われます。そもそもProfileに含まれない項目を含んでいる場合はコンパイルエラーとなります。

input での入力を制御するときは、{ name: "入力された値" }や{ gender: "male" }のように一つずつ更新していきたいので、Partial<Profile>としました。{ name: "入力された値", gender: "male" }とすることもできますが、今回はこのような複数の項目を同時に渡すような実装はありません。

## reducerの設定
まずは、Profile型のinitという初期値を定義。redux では reducer で state の初期値を定義するのが一般的です。
```js
const init: Profile = {
  name: "",
  description: "",
  birthday: "",
  gender: ""
}
```
reducerWithInitialStateというtypescript-fsa-reducersの関数に渡す。これで reducer が作成される
```js
const profileReducer = reducerWithInitialState(init);
```
そこに.case()をチェーンさせることでそれぞれのアクションでの処理を記述していっています。このcase()は第一引数にアクションを第二引数にコールバック関数を渡しています。この第二引数の関数の引数は、第一引数が直前のprofileという state そのもの、第二引数がアクションから渡ってきたpayloadとなっています。そして新しい state を return します。
```js
const profileReducer = reducerWithInitialState(init).case(
  profileActions.setProfile,
  (state, payload) => ({
    ...state,
    ...payload
  })
);
```
payloadがPartial<Profile>なので、もとのstateに今回の更新分を反映した新しいProfileを return しています。
JavaScript では、Object 内に同じ項目があった場合は後の項目が優先されるので、payloadを後からスプレッド構文で展開することで、payloadの分だけ更新した新しい配列を返すことができます。

## store をアプリケーションに登録
combineReducersという redux の API を用いて reducer をひとつにまとめます
それをcreateStoreという API に食わせることで store として動くようになります。

## componentからredux に接続
まず接続用関数を準備
```js
import React from "react";
// 以下の行を追加
import { useDispatch, useSelector } from "react-redux";
import { TextField } from "@material-ui/core";

import useStyles from "./styles";
// 以下の行を追加
import { RootState } from "../domain/entity/rootState";

const Basic = () => {
  // ==========ここから追加する==========
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);
  // ==========ここまで追加する==========

  const classes = useStyles();

  return (
    // ...
  );
};

export default Basic;
```

useDispatch()関数と、useSelector(state => state.profile)関数準備

2. actionの読み込み

3. jsx
```jsx
<TextField
  fullWidth
  className={classes.formField}
  label="名前"
  value={profile.name}
  onChange={e => handleChange({name: e.target.value})}
/>
```

4. ハンドリング
```js
const handleChange = (member: Partial<Profile>) => {
  dispatch(profileActions.setProfile(member))
}
```

useDispatch()という hooks がでてきました。redux の状態を更新するために新しい状態を送ることを dispatch というのですが、その dispatch をするための関数を作成してくれる hooks です。

handleChange()では、更新したい項目だけを受け取って reducer に dispatch しています。また、それぞれのTextFiledコンポーネントで value として store の値を、ハンドラとしてhandleChangeを渡しています。


## 定数を定義
ラベリングなどはserviceディレクトリに持たせる

## コンポーネント名の競合
コンポーネント名と型名がどちらもAddressで競合してしまうことです。2 回宣言したと見なされるのでコンパイルエラーとなってしまいます。ここでは、別名で import することで回避しています。

import { Address as IAddress } from "../domain/entity/address";
IAddressという名前で import していて、Iは interface の略です。このように命名する慣習があるのでそれに従いました。

## フォーマット判定はserviceでやる
正しいフォーマットかどうかを判定するコードを実装しましょう。まずは、ファイルを作成しましょう。これはロジックにあたるのでservices配下に作成します。

$ touch src/domain/services/address.ts

## actionの非同期処理
actionCreator.async()を使うことで、非同期処理用のstart、done、failの 3 つの action を作成することができます。generics の 3 つの型引数はこのstart、done、failに対応していて、そのときにどんな型の payload を渡すのかを定義できます。

今回は、done のときしか必要ないので引数の 2 つ目だけ定義しています。（本当は要件的にはactionCreator()で十分なのですが、機能の紹介として今回はあえてactionCreator.async()を使っています。）

## redux-thunk
applyMiddlewareは redux-thunk という外部ライブラリを redux に登録するためのものだと思ってください。composeは Redux Dev Tool と middleware をまとめて store に登録するものだという認識で ok です。

## 非同期アクションを実装しよう
非同期アクションを作成していきます。redux-thunk では、dispatch 関数を引数にとる関数を返す関数（高階関数）を非同期 action として扱います。actions に書いてもいいのですが、わかりやすいように新しいファイルを作成しましょう。

effectsという名前は副作用がある関数ということを明示しています。副作用とは関数型での考え方で、副作用がある関数というとインプット（＝引数）が同じでも実行するタイミングによって結果が変わる関数を指します。結果が変わる原因としては内部に状態を持っていたり通信処理を含んでいたりということが挙げられます。今回の action では通信を含む非同期処理が副作用にあたります。

一方、actions.tsに書いていた関数は副作用がない関数（＝純粋な関数）で、引数が同じであれば何度実行しても同じ Object しか得られません。

## dispatchとは
actionの実行

component->(effects->)action->reducer
