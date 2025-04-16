// store/selectors/cartSelectors.js
import store from '../index.js';

// 장바구니 객체 가져오기
export const getCart = () => {
  const state = store.getState();
  return state.cart;
};

// 장바구니 아이템 목록 가져오기 (상품 정보 포함)
export const getCartItems = () => {
  const state = store.getState();
  const cartItems = [];

  Object.entries(state.cart).forEach(([productId, quantity]) => {
    if (quantity > 0) {
      const product = state.products.find(p => p.id === productId);

      if (product) {
        cartItems.push({
          id: productId,
          name: product.name,
          price: product.val,
          quantity,
          total: product.val * quantity
        });
      }
    }
  });

  return cartItems;
};

// 장바구니의 총 상품 개수 가져오기
export const getCartItemCount = () => {
  const state = store.getState();
  return state.itemCount;
};

// 장바구니 총액 가져오기
export const getCartTotal = () => {
  const state = store.getState();
  return state.totalAmount;
};

// 할인율 가져오기
export const getDiscountRate = () => {
  const state = store.getState();
  return state.discountRate;
};

// 적용된 할인 정책 목록 가져오기
export const getAppliedDiscounts = () => {
  const state = store.getState();
  return state.appliedDiscounts;
};

// 적립 포인트 가져오기
export const getBonusPoints = () => {
  const state = store.getState();
  return state.bonusPoints;
};

// 장바구니가 비어있는지 확인
export const isCartEmpty = () => {
  const state = store.getState();
  return Object.keys(state.cart).length === 0;
};

// 특정 상품의 장바구니 수량 가져오기
export const getCartItemQuantity = (productId) => {
  const state = store.getState();
  return state.cart[productId] || 0;
};

// 장바구니 소계(할인 전 금액) 계산하기
export const getCartSubtotal = () => {
  const state = store.getState();
  let subtotal = 0;

  Object.entries(state.cart).forEach(([productId, quantity]) => {
    const product = state.products.find(p => p.id === productId);
    if (product) {
      subtotal += product.val * quantity;
    }
  });

  return subtotal;
};

// 할인 금액 계산하기
export const getTotalDiscountAmount = () => {
  const subtotal = getCartSubtotal();
  const total = getCartTotal();
  return subtotal - total;
};