// 장바구니 관련 액션 타입
export const UPDATE_CART = 'CART/UPDATE_CART';
export const REMOVE_FROM_CART = 'CART/REMOVE_FROM_CART';
export const UPDATE_CART_TOTALS = 'CART/UPDATE_CART_TOTALS';

// 장바구니 리듀서 - 액션에 따라 장바구니 관련 상태 업데이트
const cartReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_CART: {
      const { productId, quantity } = action.payload;

      // 현재 장바구니 복사 (불변성 유지)
      const updatedCart = { ...state.cart };

      // 기존 수량에 새 수량 추가 (없으면 0에서 시작)
      updatedCart[productId] = (updatedCart[productId] || 0) + quantity;

      // 수량이 0 이하면 항목 제거
      if (updatedCart[productId] <= 0) {
        delete updatedCart[productId];
      }

      return {
        ...state,
        cart: updatedCart
      };
    }

    case REMOVE_FROM_CART: {
      const { productId } = action.payload;

      // 현재 장바구니 복사 (불변성 유지)
      const updatedCart = { ...state.cart };

      // 해당 항목 제거
      delete updatedCart[productId];

      return {
        ...state,
        cart: updatedCart
      };
    }

    case UPDATE_CART_TOTALS: {
      const {
        totalAmount,
        itemCount,
        discountRate,
        appliedDiscounts,
        bonusPoints
      } = action.payload;

      return {
        ...state,
        totalAmount,
        itemCount,
        discountRate,
        appliedDiscounts,
        bonusPoints
      };
    }

    default:
      return state;
  }
};

export default cartReducer;