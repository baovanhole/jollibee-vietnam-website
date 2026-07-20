/* ============================================================
   components.js – Chèn Navbar và Footer vào tất cả trang
   Cách dùng: thêm <div id="navbar"></div> và <div id="footer"></div>
   rồi script này sẽ tự điền nội dung
   ============================================================ */

const NAVBAR_HTML = `
<!-- ── TOP BAR: Hotline ────────────────────────────────── -->
<div class="topbar">
  📞 Tổng đài đặt hàng: <a href="tel:19001533">1900 1533</a>
  &nbsp;|&nbsp;
  🚀 Giao hàng miễn phí đơn từ 150.000đ
  &nbsp;|&nbsp;
  <span style="opacity:.8">Đăng nhập &nbsp; Đăng ký</span>
</div>

<!-- ── NAVBAR CHÍNH ──────────────────────────────────────── -->
<nav class="navbar navbar-expand-lg navbar-jollibee sticky-top">
  <div class="container">

    <!-- Logo -->
    <a class="navbar-brand" href="index.html">🐝 JOLLIBEE</a>

    <!-- Toggle button (mobile) -->
    <button class="navbar-toggler" type="button"
            data-bs-toggle="collapse" data-bs-target="#navMenu"
            aria-controls="navMenu" aria-expanded="false"
            aria-label="Mở / đóng menu">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Menu links -->
    <div class="collapse navbar-collapse" id="navMenu">
      <ul class="navbar-nav mx-auto">
        <li class="nav-item">
          <a class="nav-link" href="index.html">Trang Chủ</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="thucdon.html"
             data-bs-toggle="dropdown">Thực đơn</a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="thucdon.html">🍽 Tất cả món</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="thucdon.html?cat=ga">🍗 Gà Giòn</a></li>
            <li><a class="dropdown-item" href="thucdon.html?cat=burger">🍔 Burger / Cơm</a></li>
            <li><a class="dropdown-item" href="thucdon.html?cat=mi">🍝 Mì Ý</a></li>
            <li><a class="dropdown-item" href="thucdon.html?cat=trangmiem">🍦 Tráng miệng</a></li>
            <li><a class="dropdown-item" href="thucdon.html?cat=uong">🥤 Đồ uống</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="khuyenmai.html">Khuyến mãi</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="pages/ve-chung-toi.html">Về Jollibee</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="pages/lienhe.html">Liên hệ</a>
        </li>
      </ul>

      <!-- Giỏ hàng + Đặt hàng -->
      <div class="d-flex align-items-center gap-2">
        <a href="giohang.html" class="nav-link cart-badge">
          🛒
          <span class="cart-count" style="display:none">0</span>
        </a>
        <a href="thucdon.html" class="btn-nav-order nav-link">Đặt hàng ngay</a>
      </div>
    </div>
  </div>
</nav>
`;

const FOOTER_HTML = `
<!-- ── FOOTER ────────────────────────────────────────────── -->
<footer class="footer">
  <div class="container">
    <div class="row g-4">

      <!-- Cột 1: Logo + Thông tin -->
      <div class="col-lg-4 col-md-6">
        <div class="footer-logo">🐝 JOLLIBEE</div>
        <p style="font-size:13px; line-height:1.7;">
          Jollibee Vietnam – Thương hiệu thức ăn nhanh số 1 Philippines,
          mang đến niềm vui ẩm thực cho mọi gia đình Việt Nam.
        </p>
        <p style="font-size:13px;">
          📍 Tầng 26, CII Tower, 152 Điện Biên Phủ, TP.HCM<br>
          📞 Tổng đài: <strong style="color:#FFC52B">1900-1533</strong><br>
          📧 cskh@jollibee.com.vn
        </p>
      </div>

      <!-- Cột 2: Về Jollibee -->
      <div class="col-lg-2 col-md-3 col-6">
        <h6>Về Jollibee</h6>
        <a href="#">Về chúng tôi</a>
        <a href="#">Tin tức</a>
        <a href="#">Tuyển dụng</a>
        <a href="#">Nhượng quyền</a>
      </div>

      <!-- Cột 3: Chính sách -->
      <div class="col-lg-2 col-md-3 col-6">
        <h6>Hỗ trợ</h6>
        <a href="#">Chính sách bảo mật</a>
        <a href="#">Điều khoản sử dụng</a>
        <a href="#">Hướng dẫn đặt hàng</a>
        <a href="#">Câu hỏi thường gặp</a>
      </div>

      <!-- Cột 4: Kết nối -->
      <div class="col-lg-4 col-md-6">
        <h6>Kết nối với chúng tôi</h6>
        <div class="d-flex gap-2 mb-16" style="margin-bottom:16px">
          <a href="#" style="font-size:24px">📘</a>
          <a href="#" style="font-size:24px">📸</a>
          <a href="#" style="font-size:24px">▶️</a>
          <a href="#" style="font-size:24px">🎵</a>
        </div>
        <h6>Tải ứng dụng</h6>
        <div class="d-flex gap-2">
          <a href="#"
             style="background:#222;color:white;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;">
            🍎 App Store
          </a>
          <a href="#"
             style="background:#222;color:white;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;">
            ▶ Google Play
          </a>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-bottom">
    © 2025 Jollibee Foods Corporation. Bảo lưu mọi quyền. &nbsp;|&nbsp;
    Đồ án môn Thiết Kế Giao Diện – Trường ĐH Văn Lang – Nhóm 7
  </div>
</footer>
`;

// Chèn vào trang khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  const navEl  = document.getElementById('navbar');
  const footEl = document.getElementById('footer');
  if (navEl)  navEl.innerHTML  = NAVBAR_HTML;
  if (footEl) footEl.innerHTML = FOOTER_HTML;
});
