import createStore from "../lib/createStore.js";
import rootReducer, {initialState} from "./reducers/index.js";

// 스토어 생성
const store = createStore(initialState, rootReducer);

export default store;