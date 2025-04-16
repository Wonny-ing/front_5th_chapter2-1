// app.js - 메인 애플리케이션 파일
import store from './store/index.js';
import actions from './store/actions/index.js';
import selectors from './store/selectors/index.js';

// 사용자 인터페이스 관리
const UI = {
  elements: {
    root: null,
    container: null,
    cartItems: null,
    cartTotal: null,
    productSelect: null,
    addButton: null,
    stockInfo: null
  },

  // UI 초기화
  initialize() {
    // 기본 엘리먼트 생성
    this.elements.root = document.getElementById('app');
    this.elements.container = this.createElement('div', { className: 'bg-gray-100 p-8' });
    const wrapper = this.createElement('div', {
      className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'
    });

    // 헤더 생성
    const header = this.createElement('h1', {
      className: 'text-2xl font-bold mb-4',
      textContent: '장바구니'
    });

    // 카트 관련 엘리먼트
    this.elements.cartItems = this.createElement('div', { id: 'cart-items' });
    this.elements.cartTotal = this.createElement('div', {
      id: 'cart-total',
      className: 'text-xl font-bold my-4'
    });

    // 상품 선택 UI
    this.elements.productSelect = this.createElement('select', {
      id: 'product-select',
      className: 'border rounded p-2 mr-2'
    });

    this.elements.addButton = this.createElement('button', {
      id: 'add-to-cart',
      className: 'bg-blue-500 text-white px-4 py-2 rounded',
      textContent: '추가'
    });

    // 재고 정보
    this.elements.stockInfo = this.createElement('div', {
      id: 'stock-status',
      className: 'text-sm text-gray-500 mt-2'
    });

    // UI 구조 조립
    wrapper.append(
      header,
      this.elements.cartItems,
      this.elements.cartTotal,
      this.elements.productSelect,
      this.elements.addButton,
      this.elements.stockInfo
    );

    this.elements.container.appendChild(wrapper);
    this.elements.root.appendChild(this.elements.container);

    // 이벤트 리스너 등록
    this.setupEventListeners();

    // Store 상태 변경 구독
    store.subscribe(state => {
      this.renderAll();
    });

    // 초기 렌더링
    this.renderAll();
  },

  // DOM 엘리먼트 생성 헬퍼
  createElement(tag, attributes = {}) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'textContent') {
        element.textContent = value;
      } else {
        element[key] = value;
      }
    });
    return element;
  },

  // 이벤트 리스너 설정
  setupEventListeners() {
    // 상품 추가 버튼 리스너
    this.elements.addButton.addEventListener('click', () => {
      const selectedProductId = this.elements.productSelect.value;
      actions.addToCart(selectedProductId);
    });

    // 카트 아이템 수량 변경 및 삭제 이벤트 (이벤트 위임)
    this.elements.cartItems.addEventListener('click', (event) => {
      const target = event.target;

      if (target.classList.contains('quantity-change')) {
        const productId = target.dataset.productId;
        const change = parseInt(target.dataset.change);
        actions.updateCartQuantity(productId, change);
      } else if (target.classList.contains('remove-item')) {
        const productId = target.dataset.productId;
        actions.removeFromCart(productId);
      }
    });
  },

  // 모든 UI 요소 렌더링
  renderAll() {
    this.renderProductSelect();
    this.renderCartItems();
    this.renderCartTotal();
    this.renderStockInfo();
  },

  // 상품 선택 드롭다운 렌더링
  renderProductSelect() {
    this.elements.productSelect.innerHTML = '';
    const products = selectors.getProducts();

    products.forEach(product => {
      const option = this.createElement('option', {
        value: product.id,
        textContent: `${product.name} - ${product.val}원`
      });

      if (product.q === 0) {
        option.disabled = true;
      }

      this.elements.productSelect.appendChild(option);
    });
  },

  // 장바구니 아이템 렌더링
  renderCartItems() {
    this.elements.cartItems.innerHTML = '';
    const cartItems = selectors.getCartItems();

    cartItems.forEach(item => {
      const itemElement = this.createElement('div', {
        id: item.id,
        className: 'flex justify-between items-center mb-2'
      });

      const itemInfo = this.createElement('span', {
        textContent: `${item.name} - ${item.price}원 x ${item.quantity}`
      });

      const controlsContainer = this.createElement('div');

      const decreaseButton = this.createElement('button', {
        className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
        textContent: '-'
      });
      decreaseButton.dataset.productId = item.id;
      decreaseButton.dataset.change = '-1';

      const increaseButton = this.createElement('button', {
        className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
        textContent: '+'
      });
      increaseButton.dataset.productId = item.id;
      increaseButton.dataset.change = '1';

      const removeButton = this.createElement('button', {
        className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
        textContent: '삭제'
      });
      removeButton.dataset.productId = item.id;

      controlsContainer.append(decreaseButton, increaseButton, removeButton);
      itemElement.append(itemInfo, controlsContainer);
      this.elements.cartItems.appendChild(itemElement);
    });
  },

  // 장바구니 총액 렌더링
  renderCartTotal() {
    this.elements.cartTotal.innerHTML = '';
    const total = selectors.getCartTotal();
    const discountRate = selectors.getDiscountRate();
    const appliedDiscounts = selectors.getAppliedDiscounts();
    const bonusPoints = selectors.getBonusPoints();

    this.elements.cartTotal.textContent = `총액: ${total}원`;

    // 할인 정보 표시
    if (discountRate > 0) {
      const discountInfo = this.createElement('span', {
        className: 'text-green-500 ml-2',
        textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`
      });
      this.elements.cartTotal.appendChild(discountInfo);

      // 적용된 할인 정책 상세 정보 표시
      if (appliedDiscounts && appliedDiscounts.length > 0) {
        const discountDetails = this.createElement('div', {
          className: 'text-sm text-gray-600 mt-1'
        });

        appliedDiscounts.forEach(discount => {
          const discountItem = this.createElement('div', {
            textContent: `${discount.name}: ${discount.description || '-'}`
          });
          discountDetails.appendChild(discountItem);
        });

        this.elements.cartTotal.appendChild(discountDetails);
      }
    }

    // 포인트 정보 표시
    const pointsInfo = this.createElement('span', {
      id: 'loyalty-points',
      className: 'text-blue-500 ml-2',
      textContent: `(포인트: ${bonusPoints})`
    });
    this.elements.cartTotal.appendChild(pointsInfo);
  },

  // 재고 정보 렌더링
  renderStockInfo() {
    let infoMsg = '';
    const lowStockProducts = selectors.getLowStockProducts();
    const outOfStockProducts = selectors.getOutOfStockProducts();

    lowStockProducts.forEach(product => {
      infoMsg += `${product.name}: 재고 부족 (${product.q}개 남음)\n`;
    });

    outOfStockProducts.forEach(product => {
      infoMsg += `${product.name}: 품절\n`;
    });

    this.elements.stockInfo.textContent = infoMsg;
  }
};

// 애플리케이션 초기화 및 실행
function initApp() {
  // UI 초기화
  UI.initialize();

  // 랜덤 세일 설정
  actions.setupRandomSales();
}

// 앱 시작
initApp()