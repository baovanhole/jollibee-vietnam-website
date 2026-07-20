/* ============================================================
   JOLLIBEE – main.js
   Chức năng: Khung ảnh, Giỏ hàng, Toast, Nút giỏ nổi, UI
   ============================================================ */

// ── KHUNG ẢNH (.img-slot) ────────────────────────────────────
// Nếu file ảnh chưa tồn tại → thêm class .is-empty để CSS hiện
// khung gợi ý (tên file + kích thước). Khi nhóm copy ảnh vào đúng
// đường dẫn thì ảnh tự hiện, KHÔNG cần sửa code.
//
// Hàm này phải được gọi lại sau khi render HTML bằng JS
// (ví dụ lưới sản phẩm ở thucdon.html) → ImageSlots.init(container)
const ImageSlots = {
  init(root = document) {
    root.querySelectorAll('.img-slot > img').forEach(img => {
      if (img.dataset.slotBound) return;
      img.dataset.slotBound = '1';

      const slot   = img.parentElement;
      const empty  = () => slot.classList.add('is-empty');
      const filled = () => slot.classList.remove('is-empty');

      if (img.complete) {
        img.naturalWidth === 0 ? empty() : filled();
      }
      img.addEventListener('error', empty);
      img.addEventListener('load',  () => { if (img.naturalWidth) filled(); });
    });
  },

  // Bỏ dấu tiếng Việt → tên file an toàn.
  // Dùng cho ảnh món thêm: các món trùng tên ở nhiều combo sẽ
  // dùng CHUNG một file ảnh, nhóm không phải chụp lặp lại.
  slug(str) {
    return str
      .normalize('NFD').replace(/[̀-ͯ]/g, '')  // bỏ dấu
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Tạo nhanh HTML một khung ảnh (dùng khi render bằng JS)
  // size: chuỗi mô tả kích thước đề xuất, vd '800×800'
  html(src, alt, size, icon = '🖼', extraClass = '') {
    return `
      <div class="img-slot ${extraClass}">
        <img src="${src}" alt="${alt}">
        <span class="img-slot__hint">
          <span class="ph-icon">${icon}</span>
          <b>${src}</b>
          <span class="ph-size">${size}</span>
        </span>
      </div>`;
  }
};

// ── GIỎ HÀNG (lưu trong localStorage) ──────────────────────
const Cart = {
  // Lấy danh sách giỏ hàng từ localStorage
  getItems() {
    return JSON.parse(localStorage.getItem('jollibee_cart') || '[]');
  },

  // Lưu giỏ hàng vào localStorage
  save(items) {
    localStorage.setItem('jollibee_cart', JSON.stringify(items));
    Cart.updateBadge();
  },

  // Thêm sản phẩm vào giỏ
  add(product) {
    const items = Cart.getItems();
    const existing = items.find(i => i.id === product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...product, qty: 1 });
    }

    localStorage.setItem('jollibee_cart', JSON.stringify(items));
    Cart.updateBadge(true);          // true = nhấn nhẹ nút giỏ nổi
    Toast.show(`🛒 Đã thêm ${product.name} vào giỏ hàng!`);
  },

  // Xóa sản phẩm
  remove(id) {
    const items = Cart.getItems().filter(i => i.id !== id);
    Cart.save(items);
  },

  // Thay đổi số lượng
  updateQty(id, delta) {
    const items = Cart.getItems();
    const item  = items.find(i => i.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      Cart.remove(id);
    } else {
      Cart.save(items);
    }
  },

  // Tổng số lượng (hiện trên badge)
  totalQty() {
    return Cart.getItems().reduce((sum, i) => sum + i.qty, 0);
  },

  // Tổng tiền
  totalPrice() {
    return Cart.getItems().reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  // Cập nhật số trên icon giỏ hàng trong nav + nút giỏ nổi
  updateBadge(bump = false) {
    const qty = Cart.totalQty();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = qty;
      el.style.display = qty > 0 ? 'flex' : 'none';
    });
    CartFab.update(bump);
  },

  // Xóa toàn bộ giỏ hàng
  clear() {
    localStorage.removeItem('jollibee_cart');
    Cart.updateBadge();
  }
};

// ── NÚT GIỎ HÀNG NỔI (dính góc dưới phải) ────────────────────
// Mẫu lấy từ jollibee.com.vn: luôn thấy số món + tổng tiền,
// không cần rời trang đang xem. Tự ẩn khi giỏ trống và khi
// đang ở chính trang giỏ hàng / thanh toán.
const CartFab = {
  el: null,

  mount() {
    const page = window.location.pathname.split('/').pop();
    if (['giohang.html', 'thanhtoan.html', 'xacnhan.html'].includes(page)) return;

    // Trang trong thư mục pages/ cần lùi một cấp
    const prefix = window.location.pathname.includes('/pages/') ? '../' : '';

    const btn = document.createElement('a');
    btn.className = 'cart-fab';
    btn.href = prefix + 'giohang.html';
    btn.setAttribute('aria-label', 'Xem giỏ hàng');
    btn.innerHTML = `
      <span class="cart-fab__icon" aria-hidden="true">🛒</span>
      <span class="cart-fab__count">0</span>
      <span class="cart-fab__total">0đ</span>`;
    document.body.appendChild(btn);
    CartFab.el = btn;
    CartFab.update();
  },

  update(bump = false) {
    const el = CartFab.el;
    if (!el) return;

    const qty = Cart.totalQty();
    el.classList.toggle('is-visible', qty > 0);
    el.querySelector('.cart-fab__count').textContent = qty;
    el.querySelector('.cart-fab__total').textContent =
      Cart.totalPrice().toLocaleString('vi-VN') + 'đ';

    if (bump && qty > 0) {
      el.classList.remove('bump');
      void el.offsetWidth;            // ép trình duyệt chạy lại animation
      el.classList.add('bump');
    }
  }
};

// ── TOAST NOTIFICATION (Bootstrap Toast component) ───────────
const Toast = {
  show(message, duration = 2500) {
    // Tạo container nếu chưa có (dùng .toast-container của Bootstrap)
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(container);
    }

    // Tạo markup toast theo chuẩn Bootstrap
    const el = document.createElement('div');
    el.className = 'toast toast-jollibee align-items-center border-0';
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'assertive');
    el.setAttribute('aria-atomic', 'true');
    el.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast" aria-label="Đóng"></button>
      </div>`;
    container.appendChild(el);

    // Khởi tạo & hiển thị qua API của Bootstrap
    const toast = new bootstrap.Toast(el, { delay: duration });
    toast.show();

    // Dọn DOM sau khi toast ẩn hoàn toàn
    el.addEventListener('hidden.bs.toast', () => el.remove());
  }
};

// ── UI INTERACTIONS ──────────────────────────────────────────

// Highlight nav link theo trang hiện tại
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });
}

// Smooth scroll khi click anchor
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Trang giỏ hàng: render danh sách sản phẩm
function renderCart() {
  const container = document.getElementById('cart-items');
  const emptyMsg  = document.getElementById('cart-empty');
  const summaryEl = document.getElementById('cart-summary');
  if (!container) return;

  const items = Cart.getItems();

  if (items.length === 0) {
    container.innerHTML = '';
    if (emptyMsg)  emptyMsg.style.display  = 'block';
    if (summaryEl) summaryEl.style.display = 'none';
    return;
  }

  if (emptyMsg)  emptyMsg.style.display  = 'none';
  if (summaryEl) summaryEl.style.display = 'block';

  container.innerHTML = items.map(item => `
    <div class="cart-item" id="cart-item-${item.id}">
      <div class="cart-item-img">${
        item.img
          ? ImageSlots.html(item.img, item.name, '800×800', item.icon || '🖼', 'img-slot--xs')
          : (item.icon || '🍽')
      }</div>
      <div class="flex-grow-1">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price.toLocaleString('vi-VN')}đ</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty('${item.id}', +1)">+</button>
      </div>
      <button class="btn btn-sm btn-outline-danger ms-2"
              onclick="removeItem('${item.id}')">🗑</button>
    </div>
  `).join('');

  ImageSlots.init(container);   // bật khung gợi ý cho ảnh vừa render

  // Cập nhật tổng tiền
  const total   = Cart.totalPrice();
  const shipping = total >= 150000 ? 0 : 15000;
  const grandTotal = total + shipping;

  const priceEl    = document.getElementById('summary-price');
  const shipEl     = document.getElementById('summary-ship');
  const totalEl    = document.getElementById('summary-total');

  if (priceEl)  priceEl.textContent  = total.toLocaleString('vi-VN') + 'đ';
  if (shipEl)   shipEl.textContent   = shipping === 0 ? 'Miễn phí 🎉' : shipping.toLocaleString('vi-VN') + 'đ';
  if (totalEl)  totalEl.textContent  = grandTotal.toLocaleString('vi-VN') + 'đ';
}

// Thay đổi số lượng trong giỏ hàng
function changeQty(id, delta) {
  Cart.updateQty(id, delta);
  renderCart();
}

// Xóa sản phẩm trong giỏ hàng
function removeItem(id) {
  Cart.remove(id);
  renderCart();
  Toast.show('🗑 Đã xóa sản phẩm khỏi giỏ hàng');
}

// ── KHỞI ĐỘNG KHI TRANG TẢI ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  ImageSlots.init();      // bật khung gợi ý cho ảnh chưa có
  CartFab.mount();        // gắn nút giỏ hàng nổi
  Cart.updateBadge();
  setActiveNav();
  initSmoothScroll();
  renderCart();           // chỉ chạy nếu đang ở trang giỏ hàng
});
