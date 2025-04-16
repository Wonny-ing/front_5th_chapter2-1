import {getProducts} from "../store/product.js";
import store from "../store/index.js";

const AddToCartForm = () => {
  const products = getProducts(store.getState());
  return /* html */`
    <select id="product-select" class="border rounded p-2 mr-2">
      ${products.map(product => `<option value="${product.id}" ${product.quantity === 0 ? 'disabled' : ''}>${product.name} - ${product.price}원</option>`).join("")}
    </select>
    
    <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
  `;
}

export default AddToCartForm;