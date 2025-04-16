import {calculateCart} from "../store/actions/cartActions.js";
import store from "../store/index.js";

const DiscountManager = {
  discounts: [],

  // 할인 정책 등록
  registerDiscount(discount) {
    if (!discount.name || typeof discount.apply !== 'function') {
      console.error('할인 정책은 name과 apply 함수를 가져야 합니다.');
      return false;
    }

    // 이미 등록된 이름이면 업데이트
    const existingIndex = this.discounts.findIndex(_discount => _discount.name === discount.name);
    if (existingIndex >= 0) {
      this.discounts[existingIndex] = discount;
    } else {
      this.discounts.push(discount)
    }

    // 이미 상품이 장바구니에 있으면 총액 재계산
    const state = store.getState();
    if (Object.keys(state.cart).length > 0) {
      calculateCart()
    }

    return true;
  },

  // 할인 정책 제거
  removeDiscount(discountName) {
    const initialLength = this.discounts.length;
    this.discounts = this.discounts.filter(d => d.name !== discountName);

    // 변경이 있고 장바구니에 상품이 있으면 총액 재계산
    if (initialLength !== this.discounts.length) {
      const state = store.getState();
      if (Object.keys(state.cart).length > 0) {
        calculateCart();
      }
    }

    return initialLength !== this.discounts.length;
  },

  // 활성화된 할인 정책만 반환
  getActiveDiscounts() {
    const state = store.getState();
    return this.discounts.filter(discount =>
      !discount.isActive || discount.isActive(state));
  },

  // 모든 할인 정책 반환
  getAllDiscounts() {
    return [...this.discounts];
  },

  // 할인 정책 초기화
  resetDiscounts() {
    this.discounts = [];

    // 장바구니에 상품이 있으면 총액 재계산
    const state = store.getState();
    if (Object.keys(state.cart).length > 0) {
      calculateCart();
    }
  }
}

// 기본 할인 정책 초기화 : 애플리케이션 시작 시 기본 할인 정책을 등록하는 함수
export const initializeDefaultDiscounts = () => {
  // 대량 구매 할인 (30개 이상 구매 시 25% 할인)
  DiscountManager.registerDiscount({
    name: '대량 구매 할인',
    description: '30개 이상 구매 시 25% 할인',
    apply({itemCount, subtotal}) {
      if (itemCount >= 30) {
        const discountAmount = subtotal * 0.25;
        return {
          applied: true,
          total: subtotal * 0.75,
          discountAmount,
          description: `30개 이상 구매로 ${discountAmount}원 할인`
        };
      }
      return { applied: false };
    }
  });

  // 개별 상품 할인 (특정 상품 10개 이상 구매)
  DiscountManager.registerDiscount({
    name: '대량 개별 상품 할인',
    apply({cart, state, subtotal}) {
      let totalDiscount = 0;
      let applied = false;
      let descriptions = [];

      const discountRates = {
        'p1': 0.1, 'p2': 0.15, 'p3': 0.2, 'p4': 0.05, 'p5': 0.25
      };

      Object.entries(cart).forEach(([productId, quantity]) => {
        if (quantity >= 10) {
          const product = state.products.find(p => p.id === productId);
          const discountRate = discountRates[productId] || 0;

          if (discountRate > 0) {
            const itemTotal = product.val * quantity;
            const itemDiscount = itemTotal * discountRate;
            totalDiscount += itemDiscount;
            applied = true;
            descriptions.push(`${product.name} ${quantity}개: ${itemDiscount}원 할인`);
          }
        }
      });

      if (applied) {
        return {
          applied: true,
          discountAmount: totalDiscount,
          total: subtotal - totalDiscount,
          description: descriptions.join(', ')
        };
      }

      return { applied: false };
    }
  });

  // 화요일 할인 (화요일에 모든 상품 10% 할인)
  DiscountManager.registerDiscount({
    name: '화요일 특별 할인',
    isActive() {
      return new Date().getDay() === 2; // 화요일(2)일 때만 활성화
    },
    apply({subtotal}) {
      const discountAmount = subtotal * 0.1;
      return {
        applied: true,
        total: subtotal * 0.9,
        discountAmount,
        description: '화요일 특별 할인 10%'
      };
    }
  });

};

// 할인 정책 관리 API : 관리자 또는 외부 시스템이 할인 정책을 관리할 수 있는 인터페이스
export const AdminDiscountAPI = {
  // 새 할인 정책 추가/수정
  addDiscount(discountConfig) {
    return DiscountManager.registerDiscount(discountConfig);
  },

  // 할인 정책 제거
  removeDiscount(discountName) {
    return DiscountManager.removeDiscount(discountName);
  },

  // 모든 할인 정책 조회
  listAllDiscounts() {
    return DiscountManager.getAllDiscounts();
  }
};

export default DiscountManager;
