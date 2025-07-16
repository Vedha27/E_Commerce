const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "CUSTOMER") {
  alert("Access denied. Only customers can view this page.");
  window.location.href = "login.html";
}

const headers = {
  "Authorization": "Bearer " + token
};

let allProducts = [];

async function loadProducts() {
  try {
    const res = await fetch("http://localhost:8080/api/products", { headers });
    if (!res.ok) throw new Error("Failed to fetch products");

    allProducts = await res.json();
    renderProducts(allProducts);
  } catch (err) {
    alert("❌ Error loading products.");
    console.error(err);
  }
}

function renderProducts(products) {
  const container = document.getElementById("productsContainer");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img class="product-image" src="${product.imageUrl}" alt="${product.name}">
      <div class="product-details">
        <h4>${product.name}</h4>
        <p>Category: ${product.category || 'N/A'}</p>
        <p>Price: ₹${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function addToCart(productId) {
  fetch(`http://localhost:8080/api/cart/add?productId=${productId}&quantity=1`, {
    method: "POST",
    headers
  })
    .then(res => {
      if (res.ok) {
        alert("✅ Product added to cart!");
      } else {
        alert("❌ Could not add to cart.");
      }
    })
    .catch(() => alert("❌ Network error."));
}

function goToCart() {
  window.location.href = "cart.html";
}

document.getElementById("searchInput").addEventListener("input", () => {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(query) ||
    (p.category && p.category.toLowerCase().includes(query))
  );
  renderProducts(filtered);
});

document.getElementById("sortSelect").addEventListener("change", () => {
  const value = document.getElementById("sortSelect").value;
  let sorted = [...allProducts];

  switch (value) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "category-asc":
      sorted.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
      break;
    case "category-desc":
      sorted.sort((a, b) => (b.category || "").localeCompare(a.category || ""));
      break;
  }

  renderProducts(sorted);
});

loadProducts();
