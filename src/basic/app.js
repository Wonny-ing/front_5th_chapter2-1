import CartList from "./components/CartList.js";
import CartTotalAmount from "./components/CartTotalAmount.js";
import {getCart} from "./store/cart.js";
import store from "./store/index.js";
import AddToCartForm from "./components/AddToCartForm.js";
import {calculateCartTotal, updateStockInfo} from "./utils/index.js";

export function App() {
  const cart = getCart(store.getState());
  const { totalAmount, discountRate } = calculateCartTotal(cart)
  const stockStatus = updateStockInfo()

  return /* html */`
    <main id="app">
      <div class="bg-gray-100 p-8">
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          <h1 class="text-2xl font-bold mb-4">장바구니</h1>
          ${CartList(cart)}
          ${CartTotalAmount({totalAmount, discountRate})}
          ${AddToCartForm()}
          <div id="stock-status" class="text-sm text-gray-500 mt-2">
            ${stockStatus}
          </div>
        </div>
      </div>
    </main>
  `
}