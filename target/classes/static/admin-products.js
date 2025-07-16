const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "ADMIN") {
  alert("Access denied. Admins only.");
  window.location.href = "login.html";
}

const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer " + token
};

async function loadProducts() {
  const res = await fetch("http://localhost:8080/api/products", { headers });
  const data = await res.json();
  const tbody = document.querySelector("#productTable tbody");
  tbody.innerHTML = "";

  data.forEach(product => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.id}</td>
      <td><input value="${product.name}" onchange="editField(this, ${product.id}, 'name')"></td>
      <td><input value="${product.category || ''}" onchange="editField(this, ${product.id}, 'category')"></td>
      <td><input type="number" value="${product.price}" onchange="editField(this, ${product.id}, 'price')"></td>
      <td><input type="number" value="${product.stock}" onchange="editField(this, ${product.id}, 'stock')"></td>
      <td><img src="${product.imageUrl}" width="60"/></td>
      <td>
        <button class="update" onclick="updateProduct(${product.id})">Update</button>
        <button class="delete" onclick="deleteProduct(${product.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function editField(input, id, field) {
  if (!window.updatedProducts) window.updatedProducts = {};
  if (!window.updatedProducts[id]) window.updatedProducts[id] = {};
  window.updatedProducts[id][field] = input.value;
}

async function updateProduct(id) {
  const row = [...document.querySelectorAll("#productTable tbody tr")]
                .find(r => r.querySelector("td")?.textContent == id);

  const updatedProduct = {
    name: row.children[1].querySelector("input").value,
    category: row.children[2].querySelector("input").value,
    price: parseFloat(row.children[3].querySelector("input").value),
    stock: parseInt(row.children[4].querySelector("input").value),
    imageUrl: row.children[5].querySelector("img").getAttribute("src")
  };

  const res = await fetch(`http://localhost:8080/api/products/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(updatedProduct)
  });

  if (res.ok) {
    showToast("✅ Product updated");
    loadProducts();
  } else {
    showToast("❌ Update failed");
  }
}

async function deleteProduct(id) {
  if (!confirm("Are you sure?")) return;
  const res = await fetch(`http://localhost:8080/api/products/${id}`, {
    method: "DELETE",
    headers
  });

  if (res.ok) {
    alert("Product deleted");
    loadProducts();
  } else {
    alert("Delete failed");
  }
}

async function addProduct() {
  const product = {
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    price: parseFloat(document.getElementById("price").value),
    stock: parseInt(document.getElementById("stock").value),
    imageUrl: document.getElementById("imageUrl").value
  };

  const res = await fetch("http://localhost:8080/api/products", {
    method: "POST",
    headers,
    body: JSON.stringify(product)
  });

  if (res.ok) {
    alert("Product added!");
    loadProducts();
    formReset();
  } else {
    alert("Failed to add product");
  }
}

function formReset() {
  ["name", "category", "price", "stock", "imageUrl"].forEach(id => {
    document.getElementById(id).value = "";
  });
}

loadProducts();
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // Hide after 3 seconds
}

