// store/actions/cartActions.js
import store from '../index.js';
import {
  UPDATE_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_TOTALS
} from '../reducers/cartReducer.js';
import {
  updateProductQuantity,
  setLastSelected
} from './productActions.js';

// 장바구니에 상품 추가
export const addToCart = (productId, quantity = 1) => {
  const state = store.getState();
  const product = state.products.find(p => p.id === productId);

  if (!product || product.q < quantity) {
    alert('재고가 부족합니다.');
    return false;
  }

  // 상품 재고 감소
  updateProductQuantity(productId, -quantity);

  // 장바구니에 추가
  store.dispatch({
    type: UPDATE_CART,
    payload: { productId, quantity }
  });

  // 마지막 선택 상품 기록
  setLastSelected(productId);

  // 총액 다시 계산
  calculateCart();

  return true;
};

// 장바구니 수량 업데이트
// 장바구니 수량 업데이트
export const updateCartQuantity = (productId, quantityChange) => {
  console.log('quantityChange!',quantityChange)
  const state = store.getState();
  const product = state.products.find(p => p.id === productId);
  const currentQty = state.cart[productId] || 0;

  // 수량 감소 시 현재 수량보다 많이 감소할 수 없음
  if (quantityChange < 0 && Math.abs(quantityChange) > currentQty) {
    quantityChange = -currentQty;
  }

  // 수량 증가 시 재고 확인
  if (quantityChange > 0) {
    // 실제 재고가 요청 수량보다 적은 경우 경고
    if (product.q < quantityChange) {
      window.alert('재고가 부족합니다');
      return false;
    }
  }

  // 상품 재고 업데이트 (반대 부호로)
  updateProductQuantity(productId, -quantityChange);

  // 장바구니 수량 업데이트
  store.dispatch({
    type: UPDATE_CART,
    payload: { productId, quantity: quantityChange }
  });

  // 총액 다시 계산
  calculateCart();

  return true;
};

// 장바구니에서 상품 제거
export const removeFromCart = (productId) => {
  const state = store.getState();
  const quantity = state.cart[productId] || 0;

  if (quantity > 0) {
    // 재고 복원
    updateProductQuantity(productId, quantity);

    // 장바구니에서 제거
    store.dispatch({
      type: REMOVE_FROM_CART,
      payload: { productId }
    });

    // 총액 다시 계산
    calculateCart();
  }
};

// 장바구니 총액 및 할인 계산
export const calculateCart = () => {
  const state = store.getState();
  let subtotal = 0;
  let itemCount = 0;
  let appliedDiscounts = [];

  // 기본 금액 계산
  Object.entries(state.cart).forEach(([productId, quantity]) => {
    const product = state.products.find(p => p.id === productId);
    subtotal += product.val * quantity;
    itemCount += quantity;
  });

  // 원래 금액 저장 (할인율 계산용)
  const originalSubtotal = subtotal;

  // 적용할 할인들을 계산
  let totalDiscountAmount = 0;

  // 1. 개별 상품 할인 (특정 상품 10개 이상 구매 시)
  const itemDiscounts = {};
  Object.entries(state.cart).forEach(([productId, quantity]) => {
    if (quantity >= 10) {
      const product = state.products.find(p => p.id === productId);
      const discountRates = {
        'p1': 0.1, 'p2': 0.15, 'p3': 0.2, 'p4': 0.05, 'p5': 0.25
      };

      const discount = discountRates[productId] || 0;
      if (discount > 0) {
        const itemTotal = product.val * quantity;
        const itemDiscount = itemTotal * discount;
        itemDiscounts[productId] = itemDiscount;
        subtotal -= itemDiscount;
        totalDiscountAmount += itemDiscount;

        appliedDiscounts.push({
          name: '대량 개별 상품 할인',
          amount: itemDiscount,
          description: `${product.name} ${quantity}개: ${itemDiscount}원 할인`
        });
      }
    }
  });

  // 2. 대량 구매 할인 (30개 이상)
  if (itemCount >= 30) {
    const bulkDiscount = originalSubtotal * 0.25;
    const itemDiscountTotal = Object.values(itemDiscounts).reduce((sum, val) => sum + val, 0);

    if (bulkDiscount > itemDiscountTotal) {
      // 대량 구매 할인이 더 큰 경우, 개별 상품 할인 대신 대량 구매 할인 적용
      subtotal = originalSubtotal * 0.75;
      totalDiscountAmount = bulkDiscount;

      // 할인 적용 목록 초기화 (개별 상품 할인 제거)
      appliedDiscounts = [{
        name: '대량 구매 할인',
        amount: bulkDiscount,
        description: `30개 이상 구매로 ${bulkDiscount}원 할인`
      }];
    }
  }

  // 3. 화요일 할인 (화요일에 모든 상품 10% 할인)
  if (new Date().getDay() === 2) { // 화요일(2)
    const tuesdayDiscount = subtotal * 0.1;
    subtotal -= tuesdayDiscount;
    totalDiscountAmount += tuesdayDiscount;

    appliedDiscounts.push({
      name: '화요일 특별 할인',
      amount: tuesdayDiscount,
      description: '화요일 특별 할인 10%'
    });
  }

  // 4. 여름 쿠폰 할인 (5만원 이상 구매 시 5천원 할인, 6/1~8/31 기간 한정)
  const now = new Date();
  const startDate = new Date('2025-06-01');
  const endDate = new Date('2025-08-31');

  if (now >= startDate && now <= endDate && originalSubtotal >= 50000) {
    const couponDiscount = 5000;
    subtotal -= couponDiscount;
    totalDiscountAmount += couponDiscount;

    appliedDiscounts.push({
      name: '여름 쿠폰 할인',
      amount: couponDiscount,
      description: '5만원 이상 구매 시 5천원 할인'
    });
  }

  // 할인율 계산
  const discountRate = originalSubtotal > 0 ? totalDiscountAmount / originalSubtotal : 0;

  // 보너스 포인트 계산
  const bonusPoints = Math.floor(subtotal / 1000);

  // 총액 업데이트
  store.dispatch({
    type: UPDATE_CART_TOTALS,
    payload: {
      totalAmount: Math.round(subtotal),
      itemCount,
      discountRate,
      appliedDiscounts,
      bonusPoints
    }
  });
};