import store from "../index.js";

// 모든 상품 목록 가져오기
export const getProducts = () => {
  const state = store.getState();
  return state.products;
};

// 특정 ID의 상품 가져오기
export const getProductById = (productId) => {
  const state = store.getState();
  return state.products.find(product => product.id === productId);
};

// 재고가 있는 상품만 가져오기
export const getAvailableProducts = () => {
  const state = store.getState();
  return state.products.filter(product => product.q > 0);
};

// 가격 범위 내 상품 가져오기
export const getProductsByPriceRange = (minPrice, maxPrice) => {
  const state = store.getState();
  return state.products.filter(product =>
    product.val >= minPrice && product.val <= maxPrice
  );
};

// 재고가 부족한 상품 가져오기 (5개 이하)
export const getLowStockProducts = () => {
  const state = store.getState();
  return state.products.filter(product => product.q > 0 && product.q <= 5);
};

// 품절된 상품 가져오기
export const getOutOfStockProducts = () => {
  const state = store.getState();
  return state.products.filter(product => product.q === 0);
};

// 마지막으로 선택한 상품 ID 가져오기
export const getLastSelectedProductId = () => {
  const state = store.getState();
  return state.lastSelected;
};

// 마지막으로 선택한 상품 가져오기
export const getLastSelectedProduct = () => {
  const state = store.getState();
  if (!state.lastSelected) return null;

  return state.products.find(product => product.id === state.lastSelected);
};