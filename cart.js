document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // === Получаем корзину из localStorage ===
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // === Функция для обновления корзины ===
  function updateCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="empty-cart">Ваша корзина пуста 🛒</p>`;
      cartTotal.textContent = "0 ₽";
      return;
    }

    let total = 0;

    // Создаем элементы для каждого товара
    cart.forEach((item, index) => {
      const itemBox = document.createElement("div");
      itemBox.classList.add("cart-item");

      itemBox.innerHTML = `
        <div class="item-info">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div>
            <h3>${item.name}</h3>
            <p class="item-price">${item.price} ₽</p>
          </div>
        </div>

        <div class="item-controls">
          <button class="qty-btn minus" data-index="${index}">−</button>
          <span class="item-qty">${item.quantity}</span>
          <button class="qty-btn plus" data-index="${index}">+</button>
        </div>

        <div class="item-total">
          ${(item.price * item.quantity).toLocaleString()} ₽
        </div>
      `;

      cartItemsContainer.appendChild(itemBox);
      total += item.price * item.quantity;
    });

    cartTotal.textContent = `${total.toLocaleString()} ₽`;
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // === Увеличение и уменьшение количества ===
  cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("plus")) {
      const index = e.target.dataset.index;
      cart[index].quantity++;
      updateCart();
    }

    if (e.target.classList.contains("minus")) {
      const index = e.target.dataset.index;
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
      } else {
        cart.splice(index, 1); // удаляем товар, если количество 0
      }
      updateCart();
    }
  });

  // === Кнопка "Заказать" ===
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Корзина пуста!");
      return;
    }

    alert("Ваш заказ оформлен! Спасибо ❤️");
    localStorage.removeItem("cart");
    cart = [];
    updateCart();
  });

  // === Первоначальное обновление ===
  updateCart();
});
localStorage.setItem("cart", JSON.stringify([
  { name: "Дисплей iPhone 11", price: 3500, quantity: 1, image: "img/display.png" },
  { name: "Аккумулятор Samsung", price: 1500, quantity: 2, image: "img/battery.png" }
]));