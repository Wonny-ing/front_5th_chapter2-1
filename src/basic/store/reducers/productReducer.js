// 상품 관련 액션 타입
export const APPLY_SALE = 'PRODUCT/APPLY_SALE';
export const UPDATE_PRODUCT_QUANTITY = 'PRODUCT/UPDATE_PRODUCT_QUANTITY';
export const SET_LAST_SELECTED = 'PRODUCT/SET_LAST_SELECTED';

// 상품 리듀서 - 액션에 따라 상품 관련 상태 업데이트
const productReducer = (state, action) => {
  switch (action.type) {
    case APPLY_SALE: {
      const { productId, discountPercent } = action.payload;

      // 상품 가격 할인 적용 (불변성 유지)
      const updatedProducts = state.products.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            val: Math.round(product.val * (1 - discountPercent / 100))
          };
        }
        return product;
      });

      return {
        ...state,
        products: updatedProducts
      };
    }

    case UPDATE_PRODUCT_QUANTITY: {
      const { productId, quantityChange } = action.payload;

      // 상품 수량 업데이트 (불변성 유지)
      const updatedProducts = state.products.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            q: Math.max(0, product.q + quantityChange) // 음수 방지
          };
        }
        return product;
      });

      return {
        ...state,
        products: updatedProducts
      };
    }

    case SET_LAST_SELECTED: {
      return {
        ...state,
        lastSelected: action.payload
      };
    }

    default:
      return state;
  }
};

export default productReducer;