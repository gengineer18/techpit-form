import { reducerWithInitialState } from "typescript-fsa-reducers"
import { Colleges } from "../../domain/entity/college"
import { collegesActions } from './actions'

const init: Colleges = {
  result: [],
  search: ''
}

export const collegesReducer = reducerWithInitialState(init)
  .case(
    collegesActions.setSearchWord,
    (state, payload) => (
      {
        ...state,
        search: payload
      }
    )
)
  .case(
    collegesActions.searchCollege.done,
    (state, payload) => (
      {
        ...state,
        result: payload.result
      }
    )
  )
