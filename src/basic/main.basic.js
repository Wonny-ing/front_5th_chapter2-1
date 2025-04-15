import store from "../basic/store/index.js"
import {getProducts} from "./store/product.js";
import {getCart} from "./store/cart.js";

let productSelectEl, addToCartEl, cartListEl, cartTotalEl, stockInfoEl;
let lastSel;

const products = getProducts(store.getState());

function main() {
  let root=document.getElementById('app');
  let cont=document.createElement('div');
  let wrap=document.createElement('div');
  let hTxt=document.createElement('h1');
  cartListEl=document.createElement('div');
  cartTotalEl=document.createElement('div');
  productSelectEl=document.createElement('select');
  addToCartEl=document.createElement('button');
  stockInfoEl=document.createElement('div');
  cartListEl.id='cart-items';
  cartTotalEl.id='cart-total';
  productSelectEl.id='product-select';
  addToCartEl.id='add-to-cart';
  stockInfoEl.id='stock-status';
  cont.className='bg-gray-100 p-8';
  wrap.className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  hTxt.className='text-2xl font-bold mb-4';
  cartTotalEl.className='text-xl font-bold my-4';
  productSelectEl.className='border rounded p-2 mr-2';
  addToCartEl.className='bg-blue-500 text-white px-4 py-2 rounded';
  stockInfoEl.className='text-sm text-gray-500 mt-2';
  hTxt.textContent='장바구니';
  addToCartEl.textContent='추가';

  renderSelectOptions();

  wrap.appendChild(hTxt);
  wrap.appendChild(cartListEl);
  wrap.appendChild(cartTotalEl);
  wrap.appendChild(productSelectEl);
  wrap.appendChild(addToCartEl);
  wrap.appendChild(stockInfoEl);
  cont.appendChild(wrap);
  root.appendChild(cont);

  calculateCartTotal();
  // setTimeout(function () {
  //   setInterval(function () {
  //     let luckyItem=products[Math.floor(Math.random() * products.length)];
  //     if(Math.random() < 0.3 && luckyItem.q > 0) {
  //       luckyItem.val=Math.round(luckyItem.val * 0.8);
  //       alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
  //       renderSelectOptions();
  //     }
  //   }, 30000);
  // }, Math.random() * 10000);
  //
  // setTimeout(function () {
  //   setInterval(function () {
  //     if(lastSel) {
  //       let suggest=products.find(function (item) { return item.id !== lastSel && item.quantity > 0; });
  //       if(suggest) {
  //         alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
  //         suggest.val=Math.round(suggest.val * 0.95);
  //         renderSelectOptions();
  //       }
  //     }
  //   }, 60000);
  // }, Math.random() * 20000);
};

/** select option을 렌더하는 함수 */
function renderSelectOptions() {
  productSelectEl.innerHTML = products.map(product =>
    `<option value="${product.id}" ${product.quantity === 0 ? 'disabled' : ''}>${product.name} - ${product.price}원</option>`
  ).join('');
}

/** 카트의 총액을 계산하는 함수 */
function calculateCartTotal() {
  const state = store.getState();
  const cart = getCart(state);

  let totalAmount = 0;
  let subtotal = 0;

  for (let i = 0; i < cart.cartItems.length; i++) {
    const currentItem = products.find(p => p.id === cart.cartItems[i].id);
    const quantity = cart.cartItems[i].quantity;

    const itemTotal = currentItem.price * quantity;
    let discount = 0;

    subtotal += itemTotal;

    if (quantity >= 10) {
      if (currentItem.id === 'p1') discount = 0.1;
      else if (currentItem.id === 'p2') discount = 0.15;
      else if (currentItem.id === 'p3') discount = 0.2;
      else if (currentItem.id === 'p4') discount = 0.05;
      else if (currentItem.id === 'p5') discount = 0.25;
    }
    totalAmount += itemTotal * (1 - discount);
  }

  let discountRate = 0;
  if (cart.cartItems.length >= 30) {
    const bulkDisc = totalAmount * 0.25;
    const itemDisc = subtotal - totalAmount;
    if (bulkDisc > itemDisc) {
      totalAmount = subtotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subtotal - totalAmount) / subtotal;
    }
  } else {
    discountRate = (subtotal - totalAmount) / subtotal;
  }

  // 화요일일 경우에 총액(totalAmount)에 추가로 10% 할인을 적용
  const isTuesday = new Date().getDay() === 2
  if (isTuesday) {
    totalAmount *= 0.9;
    discountRate = Math.max(discountRate, 0.1);
  }

  cartTotalEl.textContent = '총액: ' + Math.round(totalAmount) + '원';

  if(discountRate > 0) {
      const span=document.createElement('span');
      span.className='text-green-500 ml-2';
      span.textContent='(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
      cartTotalEl.appendChild(span);
  }

  // 카트 상태 갱신
  store.setState({
    cart: {
      ...state.cart,
      totalPrice: totalAmount,
    },
  });

  updateStockInfo();
  renderPoints();
}

/** 포인트를 계산하는 함수 */
const renderPoints=() => {
  const state = store.getState();
  const cart = getCart(state);
  const point = Math.floor(cart.totalPrice / 1000);
  let pointTag=document.getElementById('loyalty-points');
  if(!pointTag) {
    pointTag=document.createElement('span');
    pointTag.id='loyalty-points';
    pointTag.className='text-blue-500 ml-2';
    cartTotalEl.appendChild(pointTag);
  }
  pointTag.textContent='(포인트: ' + point + ')';
};

/** */
function updateStockInfo() {
  let infoMessage='';
  products.forEach(function (item) {
    if(item.quantity < 5) {infoMessage += item.name + ': ' + (item.quantity > 0 ? '재고 부족 ('+item.quantity+'개 남음)' : '품절') + '\n';
    }
  });
  stockInfoEl.textContent=infoMessage;
}

main();

/** 이벤트 핸들러 */
// 상품 추가 버튼 클릭 이벤트
addToCartEl.addEventListener('click', function () {
  const selectedItemId = productSelectEl.value;
  const selectedProduct = products.find((product) => product.id === selectedItemId);

  if (!selectedProduct || selectedProduct.quantity <= 0) return;

  const state = store.getState();
  const cartItems = state.cart.cartItems;
  const existingCartItem = cartItems.find((item) => item.id === selectedProduct.id);

  // 새롭게 생성될 카트
  let newCartItems;

  if (existingCartItem) {
    const newQuantity = existingCartItem.quantity + 1;

    if (newQuantity > selectedProduct.quantity) {
      alert('재고가 부족합니다.');
      return;
    }
    newCartItems = cartItems.map(item => item.id === selectedProduct.id ? {...item, quantity: newQuantity} : item);
  } else {
    newCartItems = [...cartItems, { ...selectedProduct, quantity: 1 }];
  }

  console.log('newCartItems:',newCartItems)

  // 재고 차감
  selectedProduct.quantity--;

  // 카트 상태 갱신
  store.setState({
    cart: {
      ...state.cart,
      cartItems: newCartItems,
    },
  });

  // DOM 갱신
  const itemElement = document.getElementById(selectedProduct.id);
  const qty = existingCartItem ? existingCartItem.quantity + 1 : 1;

  if (itemElement) {
    itemElement.querySelector('span').textContent = `${selectedProduct.name} - ${selectedProduct.price}원 x ${qty}`;
  } else {
    const newItem = document.createElement('div');
    newItem.id = selectedProduct.id;
    newItem.className = 'flex justify-between items-center mb-2';
    newItem.innerHTML = `
      <span>${selectedProduct.name} - ${selectedProduct.price}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-change="1" data-product-id="${selectedProduct.id}">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${selectedProduct.id}">삭제</button>
      </div>
    `;
    cartListEl.appendChild(newItem);
  }

  calculateCartTotal(); // 총액 표시 갱신
  lastSel = selectedItemId;
});

// 카트 수량 stepper 버튼 클릭이벤트
cartListEl.addEventListener('click', function (event) {
  const target = event.target;
  if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item')) return;

  const targetProductId = target.dataset.productId;
  const cartItemEl = document.getElementById(targetProductId);
  const selectedProduct = products.find(product => product.id === targetProductId);

  const state = store.getState();
  const cartItems = state.cart.cartItems;
  const cartItem = cartItems.find(item => item.id === targetProductId);
  const currentQuantity = cartItem?.quantity || 0;

  if (!cartItem || !selectedProduct || !cartItemEl) return;

  let updatedCartItems = [...cartItems];

  if (target.classList.contains('quantity-change')) {
    // 변경될 수량 (증가/감소값)
    const quantityChange = parseInt(target.dataset.change, 10);
    // 변경 후 수량
    const updatedQuantity = currentQuantity + quantityChange;

    const availableStock = selectedProduct.quantity + currentQuantity;

    if (updatedQuantity > 0 && updatedQuantity <= availableStock) {
      // 수량 변경
      updatedCartItems = cartItems.map(item =>
        item.id === targetProductId ? { ...item, quantity: updatedQuantity } : item
      );

      // 재고 차감 or 복원
      selectedProduct.quantity = availableStock - updatedQuantity;

      // DOM 업데이트
      cartItemEl.querySelector('span').textContent = `${selectedProduct.name} - ${selectedProduct.price}원 x ${updatedQuantity}`;
    } else if (updatedQuantity <= 0) {
      // 장바구니에서 제거
      updatedCartItems = cartItems.filter(item => item.id !== targetProductId);
      selectedProduct.quantity = availableStock;

      // DOM 제거
      cartItemEl.remove();
    } else {
      alert('재고가 부족합니다.');
      return;
    }

  } else if (target.classList.contains('remove-item')) {
    // 수량만큼 재고 복원
    selectedProduct.quantity += currentQuantity;

    // 장바구니에서 제거
    updatedCartItems = cartItems.filter(item => item.id !== targetProductId);

    // DOM 제거
    cartItemEl.remove();
  }

  // 상태 업데이트
  store.setState({
    cart: {
      ...state.cart,
      cartItems: updatedCartItems,
    },
  });

  // 총액 다시 계산해서 화면 반영
  calculateCartTotal();
});