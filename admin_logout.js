// ============================================
//   admin_logout.js — Alone Monster Coding Hub
//
//   What this does (only when an admin session is active):
//     1. Auto-injects an "Admin Logout" button into the topbar
//        (.tb-btns), or a floating pill if no topbar exists.
//     2. HIDES the normal "Profile" avatar button (.profile-btn /
//        #profileBtn) on every page — admin ke paas profile nahi hota.
//     3. Adds an "Admin Panel" button in the topbar (where the profile
//        avatar used to be) that opens admin.html — admin-only features.
//     4. Intercepts ANY click / redirect to profile.html and silently
//        sends it to admin.html instead. Saath hi inline JS jaise
//        window.location.href='...profile.html' ko bhi pakad leta hai.
//
//   For normal Firebase members (no admin session) — kuch nahi badalta,
//   pehle jaisa hi profile button dikhega.
//
//   Usage (already wired on protected pages):
//     <script src="auth.js"></script>
//     <script src="admin_logout.js"></script>
// ============================================

(function () {
  // ---------- Helpers ----------
  function isAdminSession() {
    try { return localStorage.getItem('am_admin_session') === '1'; }
    catch (_) { return false; }
  }

  function isProfileUrl(url) {
    if (!url) return false;
    try {
      // Match /profile.html or full URL ending in /profile.html
      return /(^|\/)profile\.html(\?|#|$)/i.test(String(url));
    } catch (_) { return false; }
  }

  function adminPanelUrl() {
    // admin.html same folder mein rahega (root). Agar zarurat ho to
    // yahan absolute path daal sakte hain.
    return 'admin.html';
  }

  function logoutAdmin() {
    if (!confirm('Admin session se logout karna hai?')) return;
    try {
      localStorage.removeItem('am_admin_session');
      localStorage.removeItem('am_admin_since');
      sessionStorage.removeItem('__am_admin_redirect');
    } catch (_) {}
    // Firebase signOut bhi fire kardo (agar koi session ho)
    try {
      if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().signOut().catch(function () {});
      }
    } catch (_) {}
    window.location.href = 'login.html';
  }
  // Globally expose
  window.adminLogout = logoutAdmin;

  // ---------- Styles ----------
  function injectStyles() {
    if (document.getElementById('am-admin-logout-style')) return;
    var s = document.createElement('style');
    s.id = 'am-admin-logout-style';
    s.textContent = [
      /* Hide normal profile avatar in admin mode */
      'body.am-admin-mode .profile-btn,',
      'body.am-admin-mode #profileBtn{display:none !important;}',

      /* Admin Logout button (existing) */
      '.am-admin-logout{',
      '  font-family:Rajdhani,Syne,sans-serif;font-weight:700;font-size:.84rem;',
      '  letter-spacing:.8px;border:none;cursor:pointer;border-radius:6px;',
      '  height:40px;padding:0 16px;display:inline-flex;align-items:center;',
      '  gap:7px;white-space:nowrap;color:#fff;text-decoration:none;',
      '  background:linear-gradient(135deg,#f72585,#7209b7);',
      '  box-shadow:0 4px 16px rgba(247,37,133,.35);',
      '  transition:transform .15s ease, box-shadow .15s ease, opacity .15s;',
      '  position:relative;overflow:hidden;',
      '}',
      '.am-admin-logout:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(247,37,133,.5);}',
      '.am-admin-logout:active{transform:translateY(0);opacity:.9;}',
      '.am-admin-logout .am-dot{',
      '  width:8px;height:8px;border-radius:50%;background:#fff;',
      '  box-shadow:0 0 8px #fff;animation:amPulse 1.4s ease-in-out infinite;',
      '}',
      '@keyframes amPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(.7);}}',
      '@media(max-width:600px){',
      '  .am-admin-logout span.am-lbl{display:none;}',
      '  .am-admin-logout{padding:0 12px;}',
      '  .am-admin-panel-btn span.am-lbl{display:none;}',
      '  .am-admin-panel-btn{padding:0 12px;}',
      '}',

      /* Admin Panel button (replaces profile avatar) */
      '.am-admin-panel-btn{',
      '  font-family:Rajdhani,Syne,sans-serif;font-weight:700;font-size:.84rem;',
      '  letter-spacing:.8px;border:none;cursor:pointer;border-radius:6px;',
      '  height:40px;padding:0 16px;display:inline-flex;align-items:center;',
      '  gap:8px;white-space:nowrap;color:#fff;text-decoration:none;',
      '  background:linear-gradient(135deg,#3a0ca3,#4361ee);',
      '  box-shadow:0 4px 16px rgba(67,97,238,.35);',
      '  transition:transform .15s ease, box-shadow .15s ease, opacity .15s;',
      '  position:relative;overflow:hidden;',
      '}',
      '.am-admin-panel-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(67,97,238,.55);}',
      '.am-admin-panel-btn:active{transform:translateY(0);opacity:.9;}',
      '.am-admin-panel-btn i{font-size:.95rem;}',

      /* Floating pill fallback */
      '.am-admin-pill{',
      '  position:fixed;bottom:18px;right:18px;z-index:9999;',
      '  font-family:Syne,sans-serif;font-weight:700;font-size:.78rem;',
      '  padding:11px 18px;border-radius:50px;color:#fff;cursor:pointer;',
      '  background:linear-gradient(135deg,#f72585,#7209b7);border:none;',
      '  box-shadow:0 6px 24px rgba(247,37,133,.45);',
      '  display:inline-flex;align-items:center;gap:8px;',
      '}',
      '.am-admin-pill:hover{transform:translateY(-2px);}',
      '.am-admin-panel-pill{',
      '  position:fixed;bottom:18px;right:170px;z-index:9999;',
      '  font-family:Syne,sans-serif;font-weight:700;font-size:.78rem;',
      '  padding:11px 18px;border-radius:50px;color:#fff;cursor:pointer;',
      '  background:linear-gradient(135deg,#3a0ca3,#4361ee);border:none;',
      '  box-shadow:0 6px 24px rgba(67,97,238,.45);',
      '  display:inline-flex;align-items:center;gap:8px;text-decoration:none;',
      '}',
      '.am-admin-panel-pill:hover{transform:translateY(-2px);}'
    ].join('');
    document.head.appendChild(s);
  }

  // ---------- Buttons ----------
  function buildLogoutButton() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'am-admin-logout';
    btn.id = 'amAdminLogoutBtn';
    btn.title = 'Logout from Admin Mode';
    btn.innerHTML =
      '<span class="am-dot"></span>' +
      '<i class="fas fa-user-shield"></i> ' +
      '<span class="am-lbl">Admin Logout</span>';
    btn.addEventListener('click', logoutAdmin);
    return btn;
  }

  function buildPanelButton() {
    var a = document.createElement('a');
    a.href = adminPanelUrl();
    a.className = 'am-admin-panel-btn';
    a.id = 'amAdminPanelBtn';
    a.title = 'Open Admin Panel';
    a.innerHTML =
      '<i class="fas fa-shield-halved"></i>' +
      '<span class="am-lbl">Admin Panel</span>';
    return a;
  }

  function buildFloatingLogoutPill() {
    var p = document.createElement('button');
    p.type = 'button';
    p.className = 'am-admin-pill';
    p.id = 'amAdminLogoutPill';
    p.title = 'Logout from Admin Mode';
    p.innerHTML = '<span class="am-dot"></span> 🔐 Admin Logout';
    p.addEventListener('click', logoutAdmin);
    return p;
  }

  function buildFloatingPanelPill() {
    var a = document.createElement('a');
    a.href = adminPanelUrl();
    a.className = 'am-admin-panel-pill';
    a.id = 'amAdminPanelPill';
    a.title = 'Open Admin Panel';
    a.innerHTML = '<i class="fas fa-shield-halved"></i> Admin Panel';
    return a;
  }

  // ---------- Profile-link interception ----------
  function interceptProfileLinks() {
    // 1. Rewrite all anchors that point to profile.html
    var anchors = document.querySelectorAll('a[href]');
    for (var i = 0; i < anchors.length; i++) {
      var a = anchors[i];
      if (isProfileUrl(a.getAttribute('href'))) {
        a.setAttribute('href', adminPanelUrl());
        a.setAttribute('data-am-rewritten', '1');
      }
    }

    // 2. Capture-phase click handler: catches dynamically added links
    //    and inline onclick handlers that read e.currentTarget.href.
    if (!window.__amProfileClickHooked) {
      window.__amProfileClickHooked = true;
      document.addEventListener('click', function (e) {
        if (!isAdminSession()) return;
        var t = e.target;
        while (t && t !== document) {
          if (t.tagName === 'A' && isProfileUrl(t.getAttribute('href'))) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = adminPanelUrl();
            return;
          }
          t = t.parentNode;
        }
      }, true);
    }
  }

  // 3. Override window.location assignments that target profile.html
  //    (covers inline JS like: window.location.href='profile.html')
  function patchLocationAssign() {
    if (window.__amLocationPatched) return;
    window.__amLocationPatched = true;
    try {
      var origAssign = window.location.assign.bind(window.location);
      var origReplace = window.location.replace.bind(window.location);

      window.location.assign = function (url) {
        if (isAdminSession() && isProfileUrl(url)) {
          return origAssign(adminPanelUrl());
        }
        return origAssign(url);
      };
      window.location.replace = function (url) {
        if (isAdminSession() && isProfileUrl(url)) {
          return origReplace(adminPanelUrl());
        }
        return origReplace(url);
      };
    } catch (_) {
      // Some browsers don't allow patching window.location methods —
      // the click + href rewrite path still covers the common cases.
    }
  }

  // ---------- Main inject ----------
  function inject() {
    if (!isAdminSession()) return;

    document.body.classList.add('am-admin-mode');
    injectStyles();
    interceptProfileLinks();
    patchLocationAssign();

    var host = document.querySelector('.tb-btns');

    // Admin Panel button (replaces profile avatar location)
    if (!document.getElementById('amAdminPanelBtn') &&
        !document.getElementById('amAdminPanelPill')) {
      if (host) {
        // Insert BEFORE the existing logout/profile area so order is:
        //   ... [Admin Panel] [Admin Logout]
        host.appendChild(buildPanelButton());
      } else {
        document.body.appendChild(buildFloatingPanelPill());
      }
    }

    // Admin Logout button
    if (!document.getElementById('amAdminLogoutBtn') &&
        !document.getElementById('amAdminLogoutPill')) {
      if (host) {
        host.appendChild(buildLogoutButton());
      } else {
        document.body.appendChild(buildFloatingLogoutPill());
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
  // Re-check after a beat in case the topbar / profile button is rendered late
  setTimeout(inject, 600);
  setTimeout(inject, 1500);
})();
