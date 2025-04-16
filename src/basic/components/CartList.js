import CartItem from "./CartItem.js"
import {getCart} from "../store/cart.js";
import store from "../store/index.js";
const CartList = () => {
  const cartItems = getCart(store.getState()).cartItems;
  return /* html */`
    <div id="cart-items">
      ${cartItems.map(cartItem => CartItem(cartItem)).join('')}
    </div>
  `;
};

export default CartList