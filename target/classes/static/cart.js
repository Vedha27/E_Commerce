const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "CUSTOMER") {
  alert("Access denied. Please login as a customer.");
  window.location.href = "login.html";
}

const headers = {
  "Authorization": "Bearer " + token
};

async function loadCart() {
  try {
    const res = await fetch("http://localhost:8080/api/cart/view", { headers });
    if (!res.ok) throw new Error("Failed to fetch cart");

    const data = await res.json();
    const container = document.getElementById("cartItems");
    const totalSpan = document.getElementById("totalAmount");
    let total = 0;

    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "cart-item";

      const price = item.product.price * item.quantity;
      total += price;

      div.innerHTML = `
        <div class="info">
          <h4>${item.product.name}</h4>
          <p>Price: ₹${item.product.price} × ${item.quantity} = ₹${price}</p>
        </div>
      `;

      container.appendChild(div);
    });

    totalSpan.textContent = `₹${total}`;
  } catch (err) {
    alert("❌ Error loading cart.");
    console.error(err);
  }
}

function placeOrder() {
  if (!token || role !== "CUSTOMER") {
    alert("❌ You must login to place an order.");
    window.location.href = "login.html";
    return;
  }

  fetch("http://localhost:8080/api/orders/place", {
    method: "POST",
    headers
  })
    .then(res => {
      if (res.ok) {
        alert("✅ Order placed successfully!");
        window.location.href = "order-success.html";
      } else {
        alert("❌ Failed to place order.");
      }
    })
    .catch(() => alert("❌ Network error"));
}

function goBack() {
  window.location.href = "customer-products.html";
}

loadCart();
function goToOrders() {
  window.location.href = "my-orders.html";
}
