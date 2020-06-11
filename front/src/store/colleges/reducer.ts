import { reducerWithInitialState } from "typescript-fsa-reducers"
import { Colleges } from "../../domain/entity/college"
import { collegesActions } from './actions'

const init: Colleges = {
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
