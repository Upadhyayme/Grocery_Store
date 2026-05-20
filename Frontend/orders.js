/**
 * orders.js - Works WITHOUT a backend using localStorage.
 */

let productsCache = [];
let orderItems    = [];
let itemCounter   = 0;
let nextOrderId   = 1;

const SEED_PRODUCTS = [
  {product_id:1,name:'Basmati Rice',   uom_name:'kg',    price_per_unit:85},
  {product_id:2,name:'Wheat Flour',    uom_name:'kg',    price_per_unit:45},
  {product_id:3,name:'Mustard Oil',    uom_name:'litre', price_per_unit:180},
  {product_id:4,name:'Full Cream Milk',uom_name:'litre', price_per_unit:58},
  {product_id:5,name:'Eggs',           uom_name:'dozen', price_per_unit:75},
  {product_id:6,name:'Onion',          uom_name:'kg',    price_per_unit:30},
  {product_id:7,name:'Tomato',         uom_name:'kg',    price_per_unit:40},
  {product_id:8,name:'Sugar',          uom_name:'kg',    price_per_unit:42},
  {product_id:9,name:'Salt',           uom_name:'gram',  price_per_unit:20},
  {product_id:10,name:'Tea Leaves',    uom_name:'packet',price_per_unit:90},
];

function loadLocalProducts() {
  const raw = localStorage.getItem('gm_products');
  return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(SEED_PRODUCTS));
}
function loadLocalOrders()  { return JSON.parse(localStorage.getItem('gm_orders')  || '[]'); }
function saveLocalOrders(o) { localStorage.setItem('gm_orders', JSON.stringify(o)); }

document.addEventListener("DOMContentLoaded", async () => {
  initSidebarToggle();
  initClock();
  productsCache = loadLocalProducts();
  // sync next order id
  const existing = loadLocalOrders();
  if (existing.length) nextOrderId = Math.max(...existing.map(o=>o.order_id)) + 1;
  addOrderItem();
  setupPlaceOrderBtn();
  await loadOrders();
});

function addOrderItem() {
  orderItems.push({ id: itemCounter++, product_id:'', quantity:'', total_price:0 });
  renderOrderItems();
}

function removeOrderItem(id) {
  orderItems = orderItems.filter(i => i.id !== id);
  if (!orderItems.length) addOrderItem();
  else renderOrderItems();
}

function buildProductOptions(currentVal) {
  return '<option value="">Select product...</option>' +
    productsCache.map(p =>
      `<option value="${p.product_id}" data-price="${p.price_per_unit}" ${p.product_id==currentVal?'selected':''}>
        ${p.name} (${formatCurrency(p.price_per_unit)}/${p.uom_name})
      </option>`
    ).join('');
}

function renderOrderItems() {
  const c = document.getElementById("order-items-container");
  if (!c) return;
  c.innerHTML = orderItems.map(item => `
    <div class="order-item-row" id="row-${item.id}">
      <select class="form-control-custom" id="product-${item.id}" onchange="onProductChange(${item.id})">
        ${buildProductOptions(item.product_id)}
      </select>
      <input type="number" class="form-control-custom" id="qty-${item.id}"
        placeholder="Qty" min="0.01" step="0.01" value="${item.quantity}"
        oninput="onQtyChange(${item.id})" />
      <input type="text" class="form-control-custom" id="total-${item.id}"
        value="${item.total_price ? formatCurrency(item.total_price) : ''}"
        readonly placeholder="Total" style="background:#f8fafc;cursor:default;" />
      <button class="btn-danger-custom" onclick="removeOrderItem(${item.id})">✕</button>
    </div>`).join('');
  updateGrandTotal();
}

function onProductChange(id) {
  const sel = document.getElementById(`product-${id}`);
  const price = parseFloat(sel.options[sel.selectedIndex].getAttribute('data-price')) || 0;
  const item = orderItems.find(i => i.id === id);
  item.product_id = sel.value;
  item.price = price;
  if (item.quantity) {
    item.total_price = price * parseFloat(item.quantity);
    document.getElementById(`total-${id}`).value = formatCurrency(item.total_price);
  }
  updateGrandTotal();
}

function onQtyChange(id) {
  const qty  = parseFloat(document.getElementById(`qty-${id}`).value);
  const item = orderItems.find(i => i.id === id);
  item.quantity = qty || '';
  const price = item.price || 0;
  if (!isNaN(qty) && qty > 0 && price > 0) {
    item.total_price = price * qty;
    document.getElementById(`total-${id}`).value = formatCurrency(item.total_price);
  } else {
    item.total_price = 0;
    document.getElementById(`total-${id}`).value = '';
  }
  updateGrandTotal();
}

function updateGrandTotal() {
  const total = orderItems.reduce((s,i) => s + (i.total_price||0), 0);
  const el = document.getElementById("grand-total");
  if (el) el.textContent = formatCurrency(total);
  return total;
}

function setupPlaceOrderBtn() {
  const btn = document.getElementById("place-order-btn");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const customerName = document.getElementById("customer-name").value.trim();
    if (!customerName) { showToast("Enter customer name.", "error"); return; }

    const details = [];
    for (const item of orderItems) {
      if (!item.product_id) continue;
      const qty = parseFloat(document.getElementById(`qty-${item.id}`).value);
      if (!qty || qty <= 0) { showToast("Enter valid quantity for all items.", "error"); return; }
      const prod = productsCache.find(p => p.product_id == item.product_id);
      details.push({ product_id: parseInt(item.product_id), product_name: prod?.name||'', quantity: qty, total_price: item.total_price });
    }
    if (!details.length) { showToast("Add at least one product.", "error"); return; }

    const grandTotal = updateGrandTotal();
    const orders = loadLocalOrders();
    const newOrder = {
      order_id: nextOrderId++,
      customer_name: customerName,
      total: grandTotal,
      datetime: new Date().toISOString(),
      order_details: details,
    };
    orders.unshift(newOrder);
    saveLocalOrders(orders);

    showToast(`Order #${newOrder.order_id} placed! 🎉`);
    document.getElementById("customer-name").value = '';
    orderItems = []; itemCounter = 0;
    addOrderItem();
    await loadOrders();
  });
}

async function loadOrders() {
  const container = document.getElementById("orders-list");
  const countEl   = document.getElementById("orders-count");
  if (!container) return;

  const orders = loadLocalOrders();
  if (countEl) countEl.textContent = orders.length;

  if (!orders.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><h5>No orders yet</h5><p>Place your first order above.</p></div>`;
    return;
  }

  container.innerHTML = orders.map(order => `
    <div style="border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:12px;overflow:hidden;">
      <div style="background:#f8fafc;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        <div>
          <span style="font-family:var(--font-display);font-weight:700;font-size:15px;">Order #${order.order_id}</span>
          <span style="margin-left:10px;font-size:13px;color:var(--text-muted);">👤 ${escapeHtml(order.customer_name)}</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:12px;color:var(--text-muted);">📅 ${formatDateTime(order.datetime)}</span>
          <span style="font-family:var(--font-display);font-weight:700;color:var(--primary);font-size:15px;">${formatCurrency(order.total)}</span>
          <span class="badge-status success">Completed</span>
        </div>
      </div>
      <div style="padding:12px 18px;">
        <table class="custom-table" style="font-size:12.5px;">
          <thead><tr><th>Product</th><th>Qty</th><th>Line Total</th></tr></thead>
          <tbody>
            ${order.order_details.map(d=>`
              <tr>
                <td>${escapeHtml(d.product_name)}</td>
                <td>${d.quantity}</td>
                <td style="font-weight:600;">${formatCurrency(d.total_price)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`).join('');
}

function escapeHtml(str=''){
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
