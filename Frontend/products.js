/**
 * products.js - Works WITHOUT a backend using localStorage.
 * When backend IS running, set USE_BACKEND = true in config.js
 */

let allProducts = [];
let allUOMs = [
  {uom_id:1,uom_name:'kg'},
  {uom_id:2,uom_name:'litre'},
  {uom_id:3,uom_name:'dozen'},
  {uom_id:4,uom_name:'piece'},
  {uom_id:5,uom_name:'packet'},
  {uom_id:6,uom_name:'gram'},
  {uom_id:7,uom_name:'ml'},
];
let editingId = null;
let nextLocalId = 100;

// ── Seed data so the page is never empty on first load ──
const SEED_PRODUCTS = [
  {product_id:1, name:'Basmati Rice',    uom_id:1, uom_name:'kg',     price_per_unit:85},
  {product_id:2, name:'Wheat Flour',     uom_id:1, uom_name:'kg',     price_per_unit:45},
  {product_id:3, name:'Mustard Oil',     uom_id:2, uom_name:'litre',  price_per_unit:180},
  {product_id:4, name:'Full Cream Milk', uom_id:2, uom_name:'litre',  price_per_unit:58},
  {product_id:5, name:'Eggs',            uom_id:3, uom_name:'dozen',  price_per_unit:75},
  {product_id:6, name:'Onion',           uom_id:1, uom_name:'kg',     price_per_unit:30},
  {product_id:7, name:'Tomato',          uom_id:1, uom_name:'kg',     price_per_unit:40},
  {product_id:8, name:'Sugar',           uom_id:1, uom_name:'kg',     price_per_unit:42},
  {product_id:9, name:'Salt',            uom_id:6, uom_name:'gram',   price_per_unit:20},
  {product_id:10,name:'Tea Leaves',      uom_id:5, uom_name:'packet', price_per_unit:90},
];

// ── localStorage helpers ──
function saveLocal()    { localStorage.setItem('gm_products', JSON.stringify(allProducts)); }
function loadLocal()    {
  const raw = localStorage.getItem('gm_products');
  if (raw) { allProducts = JSON.parse(raw); return true; }
  allProducts = JSON.parse(JSON.stringify(SEED_PRODUCTS)); // clone seed
  saveLocal();
  return false;
}

document.addEventListener("DOMContentLoaded", async () => {
  initSidebarToggle();
  initClock();
  populateUOMs();
  await loadProducts();
  setupFormSubmit();
});

function populateUOMs() {
  const select = document.getElementById("uom-select");
  if (!select) return;
  select.innerHTML = '<option value="">Select unit...</option>' +
    allUOMs.map(u => `<option value="${u.uom_id}">${u.uom_name}</option>`).join('');
}

async function loadProducts() {
  const tbody   = document.getElementById("products-tbody");
  const countEl = document.getElementById("product-count");

  // Try backend first; fall back to localStorage silently
  if (typeof CONFIG !== 'undefined' && CONFIG.USE_BACKEND) {
    try {
      allProducts = await apiRequest("/products");
      renderTable(tbody, countEl);
      return;
    } catch (e) { /* fall through to local */ }
  }

  loadLocal();
  renderTable(tbody, countEl);
}

function renderTable(tbody, countEl) {
  if (countEl) countEl.textContent = allProducts.length;

  if (allProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <h5>No products yet</h5>
        <p>Use the form on the left to add your first product.</p>
      </div></td></tr>`;
    return;
  }

  tbody.innerHTML = allProducts.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>
        <div class="product-name-cell">
          <div class="product-avatar">${getProductEmoji(p.name)}</div>
          <span style="font-weight:600;">${escapeHtml(p.name)}</span>
        </div>
      </td>
      <td><span class="badge-uom">${escapeHtml(p.uom_name)}</span></td>
      <td style="font-family:var(--font-display);font-weight:600;color:var(--primary);">
        ${formatCurrency(p.price_per_unit)}
      </td>
      <td>
        <div style="display:flex;gap:6px;">
          <button class="btn-edit-custom" onclick="openEdit(${p.product_id})">✏️ Edit</button>
          <button class="btn-danger-custom" onclick="deleteProduct(${p.product_id},'${escapeHtml(p.name)}')">🗑️ Delete</button>
        </div>
      </td>
    </tr>`).join('');
}

function setupFormSubmit() {
  const form = document.getElementById("product-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name  = document.getElementById("product-name").value.trim();
    const uomId = parseInt(document.getElementById("uom-select").value);
    const price = parseFloat(document.getElementById("product-price").value);

    if (!name)          { showToast("Product name is required.", "error"); return; }
    if (!uomId)         { showToast("Please select a unit.", "error");     return; }
    if (!price || price <= 0) { showToast("Enter a valid price.", "error"); return; }

    const uomObj  = allUOMs.find(u => u.uom_id === uomId);
    const uomName = uomObj ? uomObj.uom_name : '';

    const btn = document.getElementById("save-btn");
    btn.disabled = true;
    btn.innerHTML = '⏳ Saving...';

    if (editingId !== null) {
      // UPDATE
      const idx = allProducts.findIndex(p => p.product_id === editingId);
      if (idx > -1) allProducts[idx] = { product_id: editingId, name, uom_id: uomId, uom_name: uomName, price_per_unit: price };
      showToast("Product updated! ✨");
    } else {
      // ADD
      allProducts.push({ product_id: nextLocalId++, name, uom_id: uomId, uom_name: uomName, price_per_unit: price });
      showToast("Product added! 🎉");
    }

    saveLocal();
    resetForm();
    await loadProducts();
    btn.disabled = false;
    btn.innerHTML = editingId !== null ? "💾 Update Product" : "➕ Add Product";
  });
}

function openEdit(productId) {
  const p = allProducts.find(p => p.product_id === productId);
  if (!p) return;
  editingId = productId;
  document.getElementById("product-name").value  = p.name;
  document.getElementById("uom-select").value    = p.uom_id;
  document.getElementById("product-price").value = p.price_per_unit;
  document.getElementById("save-btn").innerHTML  = "💾 Update Product";
  document.getElementById("form-title").textContent = "✏️ Edit Product";
  document.getElementById("cancel-edit-btn").style.display = "inline-flex";
  document.getElementById("product-form").scrollIntoView({ behavior: "smooth" });
}

function cancelEdit() { resetForm(); }

function resetForm() {
  editingId = null;
  document.getElementById("product-form").reset();
  document.getElementById("save-btn").innerHTML = "➕ Add Product";
  document.getElementById("form-title").textContent = "➕ Add New Product";
  document.getElementById("cancel-edit-btn").style.display = "none";
}

async function deleteProduct(productId, productName) {
  if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return;
  allProducts = allProducts.filter(p => p.product_id !== productId);
  saveLocal();
  showToast(`"${productName}" deleted.`);
  await loadProducts();
}

function escapeHtml(str = "") {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
