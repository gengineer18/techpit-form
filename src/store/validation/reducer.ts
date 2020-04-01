import { Validation, ValidationState } from "../../domain/entity/validation";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import validationActions from "./actions";

const init: ValidationState = {
  isStartValidation: false,
  message: {
    name: "",
    description: "",
    birthday: "",
    gender: "",
    address: {
      postalcode: "",
      prefecture: "",
      town: "",
      restAddress: ""
    },
    college: {
      faculty: ""
    },
    career: []
  }
};

const validationReducer = reducerWithInitialState(init)
  .case(validationActions.setIsStartvalidation, (state, payload) => ({
    ...state,
    isStartValidation: payload
  }))
  .case(validationActions.setValidation, (state, payload) => ({
    ...state,
    message: payload
  }));

export default validationReducer;