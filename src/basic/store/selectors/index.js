import * as productSelectors from './productSelectors.js';
import * as cartSelectors from './cartSelectors.js';

// 모든 셀렉터를 하나의 객체로 내보내기
export default {
  ...productSelectors,
  ...cartSelectors
};

// 각 셀렉터 모듈도 개별적으로 내보내기
export { productSelectors, cartSelectors };