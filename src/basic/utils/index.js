export const updateStockInfo = (products)=> {
  let infoMessage='';
  products.forEach(function (item) {
    if(item.quantity < 5) {infoMessage += item.name + ': ' + (item.quantity > 0 ? '재고 부족 ('+item.quantity+'개 남음)' : '품절') + '\n';
    }
  });
  return infoMessage
}

/** 카트의 총액을 계산하는 함수 */
export const calculateCartTotal=(cart)=> {
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

  return {
    totalAmount,
    discountRate
  };
}

/** 포인트를 계산하는 함수 */
export const calculatePoint=(totalAmount) => {
  const point = Math.floor(totalAmount / 1000);
  return point;
};