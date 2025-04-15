import { productInitialState } from './product';
import { cartInitialState } from './cart';
import createStore from "../lib/createStore.js";

const initialState = {
  ...productInitialState,
  ...cartInitialState
};

const store = createStore(initialState);

export default store;