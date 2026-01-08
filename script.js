// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  // --- Dark Mode Logic ---
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  const htmlElement = document.documentElement;

  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    htmlElement.classList.add('dark');
    updateIcons(true);
  } else {
    htmlElement.classList.remove('dark');
    updateIcons(false);
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      htmlElement.classList.toggle('dark');
      const isDark = htmlElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateIcons(isDark);
    });
  });

  function updateIcons(isDark) {
    document.querySelectorAll('.sun-icon').forEach(el => el.style.display = isDark ? 'block' : 'none');
    document.querySelectorAll('.moon-icon').forEach(el => el.style.display = isDark ? 'none' : 'block');
  }

  // --- Desktop Home Dropdown Click Toggle ---
  const desktopHomeBtn = document.getElementById('desktop-home-btn');
  const desktopHomeMenu = document.getElementById('desktop-home-menu');

  if (desktopHomeBtn && desktopHomeMenu) {
    desktopHomeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      desktopHomeMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!desktopHomeBtn.contains(e.target) && !desktopHomeMenu.contains(e.target)) {
        desktopHomeMenu.classList.add('hidden');
      }
    });
  }

  // --- Mobile Home Accordion Toggle ---
  const mobileHomeBtn = document.getElementById('mobile-home-btn');
  const mobileHomeSubmenu = document.getElementById('mobile-home-submenu');
  const mobileHomeChevron = document.getElementById('mobile-home-chevron');

  if (mobileHomeBtn && mobileHomeSubmenu) {
    mobileHomeBtn.addEventListener('click', (e) => {
      // Prevent event from bubbling if needed, though usually fine here
      e.preventDefault();
      mobileHomeSubmenu.classList.toggle('hidden');
      if (mobileHomeChevron) {
        mobileHomeChevron.classList.toggle('rotate-180');
      }
    });
  }

  // --- Mobile Menu Logic ---
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.querySelector('.menu-icon');
  const closeIcon = document.querySelector('.close-icon');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        mobileMenu.classList.remove('open');
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
      } else {
        mobileMenu.classList.add('open');
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
      }
    });
  }

  // --- Active Link Highlighting ---
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    let isActive = false;

    if (href === currentPath) isActive = true;
    if (currentPath === '/' && href === 'index.html') isActive = true;
    if (currentPath.endsWith('/') && href === 'index.html') isActive = true;
    if (currentPath.includes(href) && href !== 'index.html') isActive = true;
    if (currentPath.includes('product-detail') && href === 'market.html') isActive = true;

    if (isActive) {
      link.classList.add('text-primary');
      link.classList.add('font-semibold');
      // Only add background if it's a standard link, not a button
      if (link.closest('#mobile-menu') && !link.classList.contains('btn-hover') && !link.parentElement.classList.contains('space-y-3')) {
        link.classList.add('bg-blue-50', 'dark:bg-slate-800');
      }
    }
  });

  // --- Back to Top Button ---
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Contact Form Validation ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const honeypot = document.getElementById('honeypot').checked;

      if (honeypot) return;

      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }
      if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      alert('Thank you for your message! We will get back to you shortly.');
      contactForm.reset();
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // --- Market Filtering Logic ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (filterBtns.length > 0) {
    // Set initial state - "All" button should be active
    const allBtn = document.querySelector('[data-filter="all"]');
    if (allBtn) {
      allBtn.classList.remove('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
      allBtn.classList.add('bg-primary', 'text-white');
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => {
          b.classList.remove('bg-primary', 'text-white');
          b.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
        });

        // Add active class to clicked
        btn.classList.remove('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
        btn.classList.add('bg-primary', 'text-white');

        const filterValue = btn.getAttribute('data-filter');

        productCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || filterValue === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Account Dropdown & Role Switching ---
  // Get stored role or default to 'user'
  let currentRole = localStorage.getItem('userRole') || 'user';
  updateRoleUI();

  // Desktop Account Dropdown Toggle
  const desktopAccountBtn = document.getElementById('desktop-account-btn');
  const desktopAccountMenu = document.getElementById('desktop-account-menu');

  if (desktopAccountBtn && desktopAccountMenu) {
    desktopAccountBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      desktopAccountMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!desktopAccountBtn.contains(e.target) && !desktopAccountMenu.contains(e.target)) {
        desktopAccountMenu.classList.add('hidden');
      }
    });
  }

  // Desktop Switch Role
  const desktopSwitchRole = document.getElementById('desktop-switch-role');
  if (desktopSwitchRole) {
    desktopSwitchRole.addEventListener('click', () => {
      // Switch the role
      currentRole = currentRole === 'user' ? 'admin' : 'user';
      localStorage.setItem('userRole', currentRole);
      updateRoleUI();
      // Navigate to dashboard
      window.location.href = 'dashboard.html';
    });
  }

  // Mobile Switch Role
  const mobileSwitchRole = document.getElementById('mobile-switch-role');
  if (mobileSwitchRole) {
    mobileSwitchRole.addEventListener('click', () => {
      currentRole = currentRole === 'user' ? 'admin' : 'user';
      localStorage.setItem('userRole', currentRole);
      updateRoleUI();
      // Navigate to dashboard after switching
      window.location.href = 'dashboard.html';
    });
  }

  // Portal Links - Navigate to dashboard with current role (don't change role)
  const desktopAdminPortal = document.getElementById('desktop-admin-portal');
  if (desktopAdminPortal) {
    desktopAdminPortal.addEventListener('click', (e) => {
      // Keep current role, just navigate to dashboard
      // Role is already set in localStorage and will be maintained
    });
  }

  const mobileAdminPortal = document.getElementById('mobile-admin-portal');
  if (mobileAdminPortal) {
    mobileAdminPortal.addEventListener('click', (e) => {
      // Keep current role, just navigate to dashboard
      // Role is already set in localStorage and will be maintained
    });
  }

  // Update Role UI function
  function updateRoleUI() {
    // Desktop
    const desktopRoleText = document.getElementById('desktop-role-text');
    const desktopRoleIcon = document.getElementById('desktop-role-icon');
    const desktopSwitchText = document.getElementById('desktop-switch-text');
    const desktopAdminPortal = document.getElementById('desktop-admin-portal');

    // Mobile
    const mobileRoleText = document.getElementById('mobile-role-text');
    const mobileRoleIcon = document.getElementById('mobile-role-icon');
    const mobileAdminPortal = document.getElementById('mobile-admin-portal');

    const isAdmin = currentRole === 'admin';
    const roleText = isAdmin ? 'Admin' : 'User';
    const switchToText = isAdmin ? 'User' : 'Admin';
    const iconName = isAdmin ? 'shield' : 'user';
    const portalText = isAdmin ? 'Admin Portal' : 'User Portal';

    // Update desktop
    if (desktopRoleText) desktopRoleText.textContent = roleText;
    if (desktopSwitchText) desktopSwitchText.textContent = switchToText;
    if (desktopRoleIcon) desktopRoleIcon.setAttribute('data-lucide', iconName);
    
    // Update desktop portal text
    if (desktopAdminPortal) {
      const span = desktopAdminPortal.querySelector('span');
      if (span) {
        span.textContent = portalText;
      } else {
        // Fallback if structure is different
        desktopAdminPortal.textContent = portalText;
      }
    }

    // Update mobile
    if (mobileRoleText) mobileRoleText.textContent = roleText;
    if (mobileRoleIcon) mobileRoleIcon.setAttribute('data-lucide', iconName);

    // Update mobile switch text
    const mobileSwitchText = document.getElementById('mobile-switch-text');
    if (mobileSwitchText) mobileSwitchText.textContent = switchToText;

    // Update mobile portal text
    if (mobileAdminPortal) {
      // The portal text is directly in the anchor tag after the icon
      const icon = mobileAdminPortal.querySelector('i');
      if (icon) {
        // Get all child nodes
        const childNodes = Array.from(mobileAdminPortal.childNodes);
        // Remove all text nodes (which contain "Admin Portal" or "User Portal")
        childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            node.remove();
          }
        });
        // Add the portal text as a new text node after the icon
        const textNode = document.createTextNode(' ' + portalText);
        // Insert after icon (icon should be first child)
        if (icon.nextSibling) {
          mobileAdminPortal.insertBefore(textNode, icon.nextSibling);
        } else {
          mobileAdminPortal.appendChild(textNode);
        }
      } else {
        // Fallback: replace all content
        mobileAdminPortal.textContent = portalText;
      }
    }

    // Re-initialize icons
    lucide.createIcons();
  }

  // Mobile Dashboard Accordion
  const mobileDashboardBtn = document.getElementById('mobile-dashboard-btn');
  const mobileDashboardSubmenu = document.getElementById('mobile-dashboard-submenu');
  const mobileDashboardChevron = document.getElementById('mobile-dashboard-chevron');

  if (mobileDashboardBtn && mobileDashboardSubmenu) {
    mobileDashboardBtn.addEventListener('click', () => {
      const isHidden = mobileDashboardSubmenu.classList.contains('hidden');
      mobileDashboardSubmenu.classList.toggle('hidden');
      if (mobileDashboardChevron) {
        mobileDashboardChevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });
  }

  // Mobile Role Switch
  const mobileRoleSwitch = document.getElementById('mobile-role-switch');
  if (mobileRoleSwitch) {
    mobileRoleSwitch.addEventListener('click', () => {
      currentRole = currentRole === 'user' ? 'admin' : 'user';
      localStorage.setItem('userRole', currentRole);
      // Navigate to dashboard after role switch
      window.location.href = 'dashboard.html';
    });
  }

  // Logout functionality
  const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener('click', () => {
      localStorage.removeItem('isLoggedIn');
      window.location.href = 'index.html';
    });
  }

  // Update mobile theme status
  function updateMobileThemeStatus() {
    const mobileThemeStatus = document.getElementById('mobile-theme-status');
    if (mobileThemeStatus) {
      const isDark = htmlElement.classList.contains('dark');
      mobileThemeStatus.textContent = isDark ? 'Dark' : 'Light';
    }
  }

  // Call initial update
  updateMobileThemeStatus();

  // Update theme status on toggle
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(updateMobileThemeStatus, 100);
    });
  });
});