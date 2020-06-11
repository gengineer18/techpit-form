import actionCreatorFactory from "typescript-fsa"

const actionCreator = actionCreatorFactory()

export const collegesActions = {
  setSearchWord: actionCreator<string>("SET_SEARCH_WORD")
}
