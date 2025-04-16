import productReducer from './productReducer.js';
import cartReducer from './cartReducer.js';

// 초기 상태 정의
export const initialState = {
  products: [
    {id: 'p1', name: '상품1', val: 10000, q: 50 },
    {id: 'p2', name: '상품2', val: 20000, q: 30 },
    {id: 'p3', name: '상품3', val: 30000, q: 20 },
    {id: 'p4', name: '상품4', val: 15000, q: 0 },
    {id: 'p5', name: '상품5', val: 25000, q: 10 }
  ],
  cart: {},
  lastSelected: null,
  bonusPoints: 0,
  totalAmount: 0,
  itemCount: 0,
  discountRate: 0,
  appliedDiscounts: []
};

// 루트 리듀서 - 액션 타입에 따라 적절한 리듀서 호출
const rootReducer = (state = initialState, action) => {
  // console.log('state:',state)
  // 액션이 없거나 타입이 없는 경우 원래 상태 반환
  if (!action || !action.type) {
    return state;
  }

  // 액션 타입의 네임스페이스(첫 부분)에 따라 처리할 리듀서 결정
  const [namespace] = action.type.split('/');

  switch (namespace) {
    case 'PRODUCT':
      return productReducer(state, action);
    case 'CART':
      return cartReducer(state, action);
    default:
      return state;
  }
};

export default rootReducer;
