import * as productActions from './productActions.js';
import * as cartActions from './cartActions.js';

// 모든 액션을 하나의 객체로 내보내기
export default {
  ...productActions,
  ...cartActions
};

// 각 액션 모듈도 개별적으로 내보내기
export { productActions, cartActions };