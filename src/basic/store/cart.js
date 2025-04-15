export const cartInitialState = {
  cart: {
    cartItems: [], // 장바구니에 담긴 아이템들
    totalPrice: 0, // 장바구니 총 가격
  },
};

// Selector
export const getCart = (state) => state.cart;
