import {calculatePoint} from "../utils/index.js";

const CartTotalAmount = ({ total, discountRate, discounts, bonusPoints }) => {
  const point = calculatePoint(totalAmount);

  return /* html */`
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {total}원
      {discountRate > 0 && (
        <>
          <span className="text-green-500 ml-2">
            ({(discountRate * 100).toFixed(1)}% 할인 적용)
          </span>
          {discounts?.length > 0 && (
            <div className="text-sm text-gray-600 mt-1">
              {discounts.map((d, idx) => (
                <div key={idx}>
                  {d.name}: {d.description || '-'}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <span id="loyalty-points" className="text-blue-500 ml-2">
        (포인트: {bonusPoints})
      </span>
    </div>
  `;
}

export default CartTotalAmount;