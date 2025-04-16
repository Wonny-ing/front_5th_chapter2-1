// 상품 할인 적용 액션
import {calculateCart} from "./cartActions.js";
import store from "../index.js";
import {APPLY_SALE, SET_LAST_SELECTED, UPDATE_PRODUCT_QUANTITY} from "../reducers/productReducer.js";

export const applySale = (productId, discountPercent) => {
  // 액션 디스패치
  store.dispatch({
    type: APPLY_SALE,
    payload: { productId, discountPercent }
  });

  // 할인이 적용되면 장바구니 총액 재계산
  calculateCart();

  return { productId, discountPercent };
};

// 상품 수량 업데이트 (내부 함수)
export const updateProductQuantity = (productId, quantityChange) => {
  return store.dispatch({
    type: UPDATE_PRODUCT_QUANTITY,
    payload: { productId, quantityChange }
  });
};

// 마지막 선택 상품 설정
export const setLastSelected = (productId) => {
  return store.dispatch({
    type: SET_LAST_SELECTED,
    payload: productId
  });
};

// 번개세일 설정
export const setupRandomSales = () => {
  // 번개세일 설정 (랜덤 상품 20% 할인)
  setTimeout(() => {
    setInterval(() => {
      const state = store.getState();
      const luckyItem = state.products[Math.floor(Math.random() * state.products.length)];

      if (Math.random() < 0.3 && luckyItem.q > 0) {
        applySale(luckyItem.id, 20);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
      }
    }, 30000);
  }, Math.random() * 10000);

  // 추천 상품 설정 (5% 할인)
  setTimeout(() => {
    setInterval(() => {
      const state = store.getState();

      if (state.lastSelected) {
        const suggest = state.products.find(item =>
          item.id !== state.lastSelected && item.q > 0);

        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          applySale(suggest.id, 5);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};