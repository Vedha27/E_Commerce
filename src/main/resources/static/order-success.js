const token = localStorage.getItem("token");
const orderId = new URLSearchParams(window.location.search).get("orderId");

if (orderId && token) {
  fetch("http://localhost:8080/api/orders/by-id/" + orderId, {
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(res => res.json())
  .then(order => {
    document.getElementById("orderDetails").innerText =
      `🧾 Order ID: ${order.id}\n💰 Total: ₹${order.totalAmount}`;
  })
  .catch(err => {
    alert("❌ Failed to load order details.");
    console.error(err);
  });
}
function goHome() {
  window.location.href = "customer-products.html";
}

function goToOrders() {
  window.location.href = "my-orders.html"; // Create this page to show user's past orders
}
