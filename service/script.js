/* ==========================================================================
   EL DHRUV VISUALS — SERVICE PAGES JAVASCRIPT
   Interactive Dropdown, Sticky Navbar, Booking Modal & Navigation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const siteHeader = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const expanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', (!expanded).toString());
    });
  }

  // 3. Dropdown mobile toggle
  const dropdownTrigger = document.querySelector('.nav-has-dropdown');
  if (dropdownTrigger) {
    const triggerLink = dropdownTrigger.querySelector('.nav-dropdown-trigger');
    triggerLink?.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdownTrigger.classList.toggle('is-open');
      }
    });
  }

  // 4. Booking Modal
  const modal = document.getElementById('booking-modal');
  const openButtons = document.querySelectorAll('.open-booking-btn');
  const closeButtons = document.querySelectorAll('.close-modal-btn');
  const serviceSelectInput = document.getElementById('modal-service-select');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preselectedService = btn.getAttribute('data-service');
      if (preselectedService && serviceSelectInput) {
        serviceSelectInput.value = preselectedService;
      }
      modal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modal?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // 5. Booking Form Submission
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>RESERVATION RECEIVED ✓</span>';
        submitBtn.style.background = '#2E7D32';
        setTimeout(() => {
          modal?.classList.remove('active');
          document.body.style.overflow = '';
          bookingForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          alert('Thank you! Your private session reservation request has been received. Our concierge will contact you within 24 hours.');
        }, 800);
      }
    });
  }
});
