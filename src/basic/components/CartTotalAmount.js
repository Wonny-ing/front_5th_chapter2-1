import {calculatePoint} from "../utils/index.js";

const CartTotalAmount = ({ totalAmount, discountRate }) => {
  const point = calculatePoint(totalAmount);

  return /* html */`
    <div id="cart-total" class="text-xl font-bold my-4">
      총액: ${totalAmount}원
      <span class="text-green-500 ml-2">(${discountRate}% 할인 적용)</span>
      <span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${point})</span>
    </div>
  `;
}

export default CartTotalAmount;