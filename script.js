/**
 * EL DHRUV PHOTOGRAPHY — JAVASCRIPT ENGINE
 * Luxury Editorial 3D Portfolio Landing Page
 * Brand: EL Dhruv Photography | Frames For A Lifetime
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. SELECTORS & CACHED ELEMENTS
     ========================================================================== */
  const header = document.getElementById('site-header');
  const navMenu = document.getElementById('nav-menu');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Portfolio elements
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  // Lightbox elements
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  // Booking Popup Modal elements
  const bookingModal = document.getElementById('booking-modal');
  const bookingBackdrop = document.getElementById('booking-backdrop');
  const bookingCloseBtn = document.getElementById('booking-close-btn');
  const openBookingBtns = document.querySelectorAll('.open-booking-btn');
  const bookingForm = document.getElementById('booking-form');
  const bookingSuccess = document.getElementById('booking-success');
  const bookingSuccessClose = document.getElementById('booking-success-close');
  const serviceSelect = document.getElementById('service-select');

  // 3D Tilt targets
  const tiltElements = document.querySelectorAll('[data-tilt], .card-3d-tilt');

  // Reveal targets
  const revealElements = document.querySelectorAll('[data-reveal]');

  // State management
  let currentLightboxIndex = 0;
  let activePortfolioList = [];

  /* ==========================================================================
     2. NAVBAR SCROLL EFFECT
     ========================================================================== */
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ==========================================================================
     3. MOBILE NAVIGATION MENU
     ========================================================================== */
  const toggleMobileMenu = () => {
    const isOpen = navMenu.classList.toggle('is-open');
    hamburgerBtn.classList.toggle('active');
    hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    if (navMenu.classList.contains('is-open')) {
      navMenu.classList.remove('is-open');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }

  navLinks.forEach(link => {
    if (link.classList.contains('nav-dropdown-trigger')) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          const parent = link.closest('.nav-has-dropdown');
          if (parent) {
            parent.classList.toggle('is-open');
          }
        }
      });
    } else {
      link.addEventListener('click', closeMobileMenu);
    }
  });

  /* ==========================================================================
     4. SMOOTH SCROLL & ACTIVE LINK SCROLLSPY
     ========================================================================== */
  const sections = document.querySelectorAll('section[id], footer[id]');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        const headerHeight = header.offsetHeight || 80;
        const targetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==========================================================================
     5. 3D MOUSE PARALLAX TILT EFFECT
     ========================================================================== */
  const heroSection = document.getElementById('home');
  const heroFrame = document.getElementById('hero-full-frame');
  const heroImg = document.getElementById('hero-full-visible-img');
  const heroHeading = document.querySelector('.hero-heading-3d');

  if (heroSection && heroFrame && window.matchMedia('(pointer: fine)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroFrame.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const rotX = (-y * 5).toFixed(2);
      const rotY = (x * 5).toFixed(2);
      heroFrame.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;

      if (heroImg) {
        heroImg.style.transform = `scale(1.015) translate(${(-x * 8).toFixed(1)}px, ${(-y * 8).toFixed(1)}px)`;
      }

      if (heroHeading) {
        heroHeading.style.transform = `perspective(1000px) rotateY(${(x * 7).toFixed(1)}deg) rotateX(${(-y * 7).toFixed(1)}deg) translateZ(30px)`;
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      heroFrame.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)';
      if (heroImg) {
        heroImg.style.transform = 'scale(1) translate(0px, 0px)';
      }
      if (heroHeading) {
        heroHeading.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
      }
    });
  }

  tiltElements.forEach(card => {
    // Only apply tilt on pointer-fine devices (desktops/laptops)
    if (window.matchMedia('(pointer: fine)').matches) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg
        const rotateY = ((x - centerX) / centerX) * 9;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    }
  });

  /* ==========================================================================
     5.1 INTERACTIVE 3D LOGO DYNAMICS & SPECULAR GLARE
     ========================================================================== */
  const logo3dCards = document.querySelectorAll('[data-logo-3d]');

  logo3dCards.forEach(logoCard => {
    if (window.matchMedia('(pointer: fine)').matches) {
      const stage = logoCard.closest('.logo-3d-stage') || logoCard;
      const glare = logoCard.querySelector('.logo-3d-glare');

      stage.addEventListener('mousemove', (e) => {
        if (logoCard.classList.contains('camera-shutter-snap')) return;
        const rect = logoCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -18;
        const rotateY = ((x - centerX) / centerX) * 18;

        logoCard.style.animation = 'none';
        logoCard.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(16px) scale(1.05)`;

        if (glare) {
          const glareX = ((x / rect.width) * 100).toFixed(0);
          const glareY = ((y / rect.height) * 100).toFixed(0);
          glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.45) 0%, transparent 65%)`;
        }
      });

      stage.addEventListener('mouseleave', () => {
        if (logoCard.classList.contains('camera-shutter-snap')) return;
        logoCard.style.animation = 'logo3dFloating 5s ease-in-out infinite';
        logoCard.style.transform = '';
        if (glare) {
          glare.style.background = '';
        }
      });
    }
  });

  /* ==========================================================================
     5.2 INTERACTIVE 3D CAMERA LOGO: CLICK A PHOTO ANIMATION & SHUTTER AUDIO
     ========================================================================== */
  function initCameraClickPhotoAnimation() {
    const brandLogos = document.querySelectorAll('.brand-logo, .footer-logo, [data-logo-3d]');
    if (!brandLogos.length) return;

    // Curated showcase photos to eject from the camera when snapped
    const samplePhotos = [
      'images/portfolio/royal-indian-wedding-ceremony.jpg',
      'images/portfolio/outdoor-bridal-fashion.webp',
      'images/portfolio/candid-wedding-reception-laughter.jpg',
      'images/portfolio/studio-model-editorial.webp',
      'images/portfolio/np-wedding-couple-portrait.webp',
      'images/portfolio/vip-awards-reception.jpg'
    ];
    let photoIndex = 0;
    let clickCount = 0;
    let isClicking = false;

    // Synthesize authentic two-stage mechanical DSLR camera shutter sound via Web Audio API
    let audioCtx = null;
    function playCameraShutterSound() {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        if (!audioCtx) {
          audioCtx = new AudioContextClass();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        const now = audioCtx.currentTime;

        // 1. Shutter Mirror Up Mechanical Click
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(1400, now);
        osc1.frequency.exponentialRampToValueAtTime(180, now + 0.035);
        gain1.gain.setValueAtTime(0.45, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.045);

        // 2. High-speed Mechanical Noise Transient (Curtain Snap)
        const bufferSize = Math.floor(audioCtx.sampleRate * 0.05);
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.015));
        }
        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2800;
        filter.Q.value = 3;
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.65, now + 0.01);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        whiteNoise.start(now + 0.01);

        // 3. Shutter Curtain Close & Latch (Second Crisp Click)
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(850, now + 0.05);
        osc2.frequency.exponentialRampToValueAtTime(120, now + 0.09);
        gain2.gain.setValueAtTime(0.35, now + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(now + 0.05);
        osc2.stop(now + 0.11);

        // 4. Subtle Motorized Digital Write / Film Advance Whir
        const osc3 = audioCtx.createOscillator();
        const gain3 = audioCtx.createGain();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(420, now + 0.08);
        osc3.frequency.linearRampToValueAtTime(680, now + 0.18);
        osc3.frequency.exponentialRampToValueAtTime(200, now + 0.24);
        gain3.gain.setValueAtTime(0.08, now + 0.08);
        gain3.gain.linearRampToValueAtTime(0.14, now + 0.15);
        gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc3.connect(gain3);
        gain3.connect(audioCtx.destination);
        osc3.start(now + 0.08);
        osc3.stop(now + 0.26);
      } catch (err) {
        // Audio synthesis fallback silently if permission/policy restricted
      }
    }

    let lastSnapTime = 0;

    // Trigger photo snap animation on the logo element
    function triggerCameraPhotoClick(logoContainer) {
      const now = Date.now();
      // Smooth debounce: 650ms cooldown between photo snaps
      if (now - lastSnapTime < 650) return;
      lastSnapTime = now;

      const logoCard = logoContainer.querySelector('[data-logo-3d]') || logoContainer.querySelector('.logo-3d-card') || logoContainer;
      const rect = logoCard.getBoundingClientRect();
      const lensCenterX = rect.left + rect.width / 2;
      const lensCenterY = rect.top + rect.height * 0.42;

      clickCount++;

      // 1. Play realistic mechanical camera shutter sound
      playCameraShutterSound();

      // 2. Trigger 3D Shutter Snap Recoil on Logo Card
      logoCard.classList.remove('camera-shutter-snap');
      void logoCard.offsetWidth; // Force reflow
      logoCard.classList.add('camera-shutter-snap');
      setTimeout(() => {
        logoCard.classList.remove('camera-shutter-snap');
      }, 550);

      // 3. Strobe / Flash Burst from the Camera Lens
      let flashOverlay = document.getElementById('camera-flash-strobe');
      if (!flashOverlay) {
        flashOverlay = document.createElement('div');
        flashOverlay.id = 'camera-flash-strobe';
        flashOverlay.className = 'camera-flash-strobe';
        document.body.appendChild(flashOverlay);
      }
      flashOverlay.style.setProperty('--flash-x', `${lensCenterX}px`);
      flashOverlay.style.setProperty('--flash-y', `${lensCenterY}px`);
      flashOverlay.classList.remove('flash-active');
      void flashOverlay.offsetWidth;
      flashOverlay.classList.add('flash-active');

      // 4. Concentric Shockwave Optical Flare
      const shockwave = document.createElement('div');
      shockwave.className = 'camera-lens-shockwave';
      shockwave.style.left = `${lensCenterX}px`;
      shockwave.style.top = `${lensCenterY}px`;
      shockwave.style.width = `${Math.max(rect.width * 0.8, 60)}px`;
      shockwave.style.height = `${Math.max(rect.width * 0.8, 60)}px`;
      document.body.appendChild(shockwave);
      setTimeout(() => shockwave.remove(), 700);

      // 5. Instant Photo Ejection in 3D
      const photoCard = document.createElement('div');
      photoCard.className = 'camera-instant-photo';
      photoCard.style.left = `${lensCenterX}px`;
      photoCard.style.top = `${lensCenterY}px`;
      
      const randomRot = (Math.random() * 16 - 8).toFixed(1);
      const isMobile = window.innerWidth <= 767;
      const driftY = isMobile ? 85 : 125;
      photoCard.style.setProperty('--photo-rot', `${randomRot}deg`);
      photoCard.style.setProperty('--photo-drift-y', `${driftY}px`);

      const photoSrc = samplePhotos[photoIndex % samplePhotos.length];
      photoIndex++;

      photoCard.innerHTML = `
        <img src="${photoSrc}" alt="Captured Photo" class="camera-instant-photo-img">
        <div class="camera-instant-photo-badge">
          <span>PHOTO #${clickCount}</span>
        </div>
      `;
      document.body.appendChild(photoCard);
      setTimeout(() => photoCard.remove(), 1600);
    }

    // Attach to brand logo links & stages
    brandLogos.forEach(logoElem => {
      if (logoElem.dataset.cameraBound) return;
      logoElem.dataset.cameraBound = 'true';
      logoElem.style.cursor = 'pointer';
      logoElem.setAttribute('title', 'Touch with cursor to snap a photo! 📸');

      // 1. TOUCH WITH CURSOR (hover / mouseenter / pointerenter) -> SNAP PHOTO!
      logoElem.addEventListener('mouseenter', () => {
        triggerCameraPhotoClick(logoElem);
      });

      // 2. TOUCH ON MOBILE / TABLET (touchstart / pointerdown) -> SNAP PHOTO!
      logoElem.addEventListener('touchstart', (e) => {
        triggerCameraPhotoClick(logoElem);
      }, { passive: true });

      // 3. CLICK ON LOGO -> SNAP PHOTO (with smooth scroll if home anchor)
      logoElem.addEventListener('click', (e) => {
        const anchor = logoElem.closest('a');
        if (anchor) {
          const href = anchor.getAttribute('href');
          if (href && (href.startsWith('#') || href === 'index.html#home' || href.endsWith('index.html'))) {
            e.preventDefault();
            triggerCameraPhotoClick(logoElem);
            if (href === '#home' || href === 'index.html#home') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
          }
        }
        triggerCameraPhotoClick(logoElem);
      });
    });
  }

  initCameraClickPhotoAnimation();

  /* ==========================================================================
     5B. INTERACTIVE SERVICE BAR & 3D POP-UP MENU ENGINE
     Services: Photography, Videography, Candid, Model, Private Events
     Features:
     - Touching Service Bar opens 3D Pop-Up Menu with items animating one-by-one
     - Selecting Photography shows ONLY Photography on the service page
     - Selecting Videography shows ONLY Videography on the service page
     - Selecting Candid, Model, or Private Events shows ONLY that respective service
     - Next & Previous step controller enables easy one-by-one cycling
     - All Services resets to the 3-column overview grid
     ========================================================================== */
  const serviceCategories = ['photography', 'videography', 'candid', 'model', 'private-events', 'marriage'];
  const serviceMeta = {
    'photography': { title: 'Photography', num: '01 / 06' },
    'videography': { title: 'Videography', num: '02 / 06' },
    'candid': { title: 'Candid Photography', num: '03 / 06' },
    'model': { title: 'Model Photography', num: '04 / 06' },
    'private-events': { title: 'Private Events', num: '05 / 06' },
    'marriage': { title: 'Marriage Events', num: '06 / 06' }
  };

  const servicesGrid = document.getElementById('services-grid');
  const serviceCards = document.querySelectorAll('.service-card');
  const serviceBarTriggerBtn = document.getElementById('service-bar-trigger-btn');
  const serviceBarPopupModal = document.getElementById('service-bar-popup-modal');
  const servicePopupCloseBtn = document.getElementById('service-popup-close-btn');
  const servicePopupBackdrop = document.getElementById('service-popup-backdrop');
  const serviceBarStatusText = document.getElementById('service-bar-status-text');
  const serviceTouchBadge = document.getElementById('service-touch-badge');
  const serviceSingleNavBar = document.getElementById('service-single-nav-bar');
  const serviceStepPrev = document.getElementById('service-step-prev');
  const serviceStepNext = document.getElementById('service-step-next');
  const servicePrevLabel = document.getElementById('service-prev-label');
  const serviceNextLabel = document.getElementById('service-next-label');
  const serviceStepNum = document.getElementById('service-step-num');
  const serviceStepName = document.getElementById('service-step-name');
  const serviceStepShowAll = document.getElementById('service-step-show-all');

  const serviceTabBtns = document.querySelectorAll('.service-tab-btn');
  const servicePopupBtns = document.querySelectorAll('.service-popup-menu-btn');
  const serviceResetAllBtns = document.querySelectorAll('.service-reset-all-btn');
  const navDropdownItems = document.querySelectorAll('.nav-dropdown-item');

  let currentActiveCategory = 'all';

  // Open & Close Service Bar Pop-Up Menu
  const openServiceBarPopup = () => {
    if (!serviceBarPopupModal) return;
    serviceBarPopupModal.classList.add('is-open');
    serviceBarPopupModal.setAttribute('aria-hidden', 'false');
    if (serviceBarTriggerBtn) serviceBarTriggerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeServiceBarPopup = () => {
    if (!serviceBarPopupModal) return;
    serviceBarPopupModal.classList.remove('is-open');
    serviceBarPopupModal.setAttribute('aria-hidden', 'true');
    if (serviceBarTriggerBtn) serviceBarTriggerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (serviceBarTriggerBtn) {
    serviceBarTriggerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openServiceBarPopup();
    });
  }

  if (servicePopupCloseBtn) {
    servicePopupCloseBtn.addEventListener('click', closeServiceBarPopup);
  }

  if (servicePopupBackdrop) {
    servicePopupBackdrop.addEventListener('click', closeServiceBarPopup);
  }

  // Apply service filter: 'all' or one of the 5 categories
  const applyServiceFilter = (category, shouldScroll = false) => {
    currentActiveCategory = category;

    // 1. Update Tab buttons active state
    serviceTabBtns.forEach(tab => {
      const tabCat = tab.getAttribute('data-service-category');
      const isActive = tabCat === category;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (category === 'all') {
      // Show all cards in grid mode
      if (servicesGrid) {
        servicesGrid.classList.remove('single-mode');
      }
      serviceCards.forEach(card => {
        card.style.display = 'flex';
        card.classList.remove('single-spotlight');
      });

      if (serviceSingleNavBar) {
        serviceSingleNavBar.style.display = 'none';
      }

      if (serviceBarStatusText) {
        serviceBarStatusText.textContent = 'Displaying All Services (Grid Mode)';
      }
      if (serviceTouchBadge) {
        serviceTouchBadge.textContent = '6 SERVICES';
      }
    } else {
      // Single service spotlight view mode
      if (servicesGrid) {
        servicesGrid.classList.add('single-mode');
      }

      let primaryCardFound = false;

      serviceCards.forEach(card => {
        const cardCat = card.getAttribute('data-service-category');
        // Match specific category
        if (cardCat === category && !primaryCardFound) {
          primaryCardFound = true;
          card.style.display = 'grid';
          card.classList.add('single-spotlight');
        } else {
          card.style.display = 'none';
          card.classList.remove('single-spotlight');
        }
      });

      // Update Pager bar
      const catIndex = serviceCategories.indexOf(category);
      if (catIndex !== -1) {
        const prevIndex = (catIndex - 1 + serviceCategories.length) % serviceCategories.length;
        const nextIndex = (catIndex + 1) % serviceCategories.length;

        const prevCat = serviceCategories[prevIndex];
        const nextCat = serviceCategories[nextIndex];

        if (servicePrevLabel) servicePrevLabel.textContent = serviceMeta[prevCat].title;
        if (serviceNextLabel) serviceNextLabel.textContent = serviceMeta[nextCat].title;
        if (serviceStepNum) serviceStepNum.textContent = serviceMeta[category].num;
        if (serviceStepName) serviceStepName.textContent = serviceMeta[category].title;

        if (serviceStepPrev) serviceStepPrev.setAttribute('data-target-category', prevCat);
        if (serviceStepNext) serviceStepNext.setAttribute('data-target-category', nextCat);
      }

      if (serviceSingleNavBar) {
        serviceSingleNavBar.style.display = 'flex';
      }

      const meta = serviceMeta[category] || { title: category, num: '' };
      if (serviceBarStatusText) {
        serviceBarStatusText.innerHTML = `Spotlight View: <strong>${meta.title}</strong> (${meta.num})`;
      }
      if (serviceTouchBadge) {
        serviceTouchBadge.textContent = meta.title;
      }
    }

    if (shouldScroll) {
      const targetAnchor = document.getElementById('service-bar-wrapper') || document.getElementById('services');
      if (targetAnchor) {
        const headerOffset = 90;
        const elementPosition = targetAnchor.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // Wire Tab Buttons
  serviceTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-service-category');
      applyServiceFilter(cat, false);
    });
  });

  // Wire Pop-Up Menu Buttons
  servicePopupBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-service-category');
      closeServiceBarPopup();
      applyServiceFilter(cat, true);
    });
  });

  // Wire Header Nav Dropdown Items
  navDropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const cat = item.getAttribute('data-service-select');
      const href = item.getAttribute('href');
      if (href && href.startsWith('service/')) {
        closeMobileMenu();
        return; // Allow native navigation to separate service page!
      }
      if (cat) {
        e.preventDefault();
        closeMobileMenu();
        applyServiceFilter(cat, true);
      }
    });
  });

  // Wire Next / Previous Pager
  if (serviceStepPrev) {
    serviceStepPrev.addEventListener('click', () => {
      const targetCat = serviceStepPrev.getAttribute('data-target-category');
      if (targetCat) applyServiceFilter(targetCat, true);
    });
  }

  if (serviceStepNext) {
    serviceStepNext.addEventListener('click', () => {
      const targetCat = serviceStepNext.getAttribute('data-target-category');
      if (targetCat) applyServiceFilter(targetCat, true);
    });
  }

  // Wire Show All / Reset Buttons
  serviceResetAllBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyServiceFilter('all', false);
    });
  });

  if (serviceStepShowAll) {
    serviceStepShowAll.addEventListener('click', () => {
      applyServiceFilter('all', true);
    });
  }

  /* ==========================================================================
     6. TRENDY 3D BOOKING POPUP MODAL & SERVICE PREVIEWS
     ========================================================================== */
  const serviceDataMap = {
    'Photography': {
      img: 'images/services/professional-photography-service.webp',
      title: 'Photography',
      tag: 'STUDIO & OUTDOOR',
      desc: 'Professional photography crafted with creativity, precision and attention to detail.'
    },
    'Videography': {
      img: 'images/services/cinematic-videography-service.webp',
      title: 'Cinematic Videography',
      tag: '4K/8K CINEMATIC FILMS',
      desc: 'Cinematic films that preserve your most meaningful moments.'
    },
    'Candid Photography': {
      img: 'images/services/candid-wedding-photography.webp',
      title: 'Candid Photography',
      tag: 'GENUINE EMOTIONS',
      desc: 'Natural emotions captured beautifully and authentically.'
    },
    'Model Photoshoots': {
      img: 'images/services/professional-model-photoshoot.webp',
      title: 'Model Photoshoots',
      tag: 'EDITORIAL & FASHION',
      desc: 'Editorial portraits designed to highlight personality and style.'
    },
    'Model Photography': {
      img: 'images/services/professional-model-photoshoot.webp',
      title: 'Model Photography',
      tag: 'EDITORIAL & FASHION',
      desc: 'Editorial portraits designed to highlight personality and style.'
    },
    'Marriage Events': {
      img: 'images/services/indian-wedding-photograph.webp',
      title: 'Marriage Events',
      tag: 'GRAND WEDDING STORIES',
      desc: 'Elegant wedding memories captured with emotion and detail.'
    },
    'Private Events': {
      img: 'images/services/luxury-private-event-photography.webp',
      title: 'Private Events',
      tag: 'CELEBRATIONS & GALAS',
      desc: 'Beautiful moments from celebrations and special occasions.'
    }
  };

  const popupServiceImg = document.getElementById('popup-service-img');
  const popupServiceName = document.getElementById('popup-service-name');
  const popupServiceTag = document.getElementById('popup-service-tag');
  const popupServiceDesc = document.getElementById('popup-service-desc');

  const updatePopupServiceVisual = (serviceKey) => {
    const data = serviceDataMap[serviceKey] || serviceDataMap['Photography'];
    if (popupServiceImg) {
      popupServiceImg.src = data.img;
      popupServiceImg.alt = data.title;
    }
    if (popupServiceName) popupServiceName.textContent = data.title;
    if (popupServiceTag) popupServiceTag.textContent = data.tag;
    if (popupServiceDesc) popupServiceDesc.textContent = data.desc;
  };

  const openBookingModal = (serviceName = null) => {
    const targetService = serviceName || (serviceSelect ? serviceSelect.value : 'Photography');
    
    if (serviceSelect) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value.toLowerCase() === targetService.toLowerCase()) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
    updatePopupServiceVisual(serviceSelect ? serviceSelect.value : targetService);

    bookingModal.classList.add('active');
    bookingModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  if (serviceSelect) {
    serviceSelect.addEventListener('change', (e) => {
      updatePopupServiceVisual(e.target.value);
    });
  }

  const closeBookingModal = () => {
    bookingModal.classList.remove('active');
    bookingModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
      const service = btn.getAttribute('data-service');
      openBookingModal(service);
    });
  });

  // Make service cards clickable to open popup with centered image
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicked element wasn't already a button
      if (!e.target.closest('button')) {
        const service = card.getAttribute('data-service');
        openBookingModal(service);
      }
    });
  });

  if (bookingCloseBtn) bookingCloseBtn.addEventListener('click', closeBookingModal);
  if (bookingBackdrop) bookingBackdrop.addEventListener('click', closeBookingModal);

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('client-name')?.value.trim() || 'Client';
      const phone = document.getElementById('client-phone')?.value.trim() || '+91 73971 72114';
      const email = document.getElementById('client-email')?.value.trim() || '';
      const service = document.getElementById('service-select')?.value || 'Photography';
      const date = document.getElementById('booking-date')?.value || new Date().toISOString().split('T')[0];
      const notes = document.getElementById('booking-notes')?.value.trim() || 'Booked via website popup inquiry';

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const bookingId = `ELD-2026-${randomNum}`;

      const newBooking = {
        id: bookingId,
        eventType: service,
        eventTitle: `${service} Session`,
        date: date,
        timeSlot: 'Full Day / Standard',
        venue: 'Client Venue / Studio',
        city: 'Salem, Tamil Nadu',
        guests: 'Standard',
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        contactPref: 'WhatsApp',
        notes: notes,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      try {
        const STORAGE_KEY = 'elDhruv_event_bookings';
        const stored = localStorage.getItem(STORAGE_KEY);
        const bookings = stored ? JSON.parse(stored) : [];
        bookings.unshift(newBooking);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }

      bookingForm.style.display = 'none';
      if (bookingSuccess) {
        bookingSuccess.style.display = 'block';
        const existingDashLink = document.getElementById('home-dash-link');
        if (!existingDashLink) {
          const dashLink = document.createElement('a');
          dashLink.id = 'home-dash-link';
          dashLink.href = 'booking.html#dashboard';
          dashLink.className = 'btn btn-outline';
          dashLink.style.display = 'inline-block';
          dashLink.style.marginTop = '14px';
          dashLink.textContent = '📋 View in Booking Dashboard →';
          bookingSuccess.appendChild(dashLink);
        }
      }
    });
  }

  if (bookingSuccessClose) {
    bookingSuccessClose.addEventListener('click', () => {
      closeBookingModal();
      setTimeout(() => {
        if (bookingSuccess) bookingSuccess.style.display = 'none';
        if (bookingForm) {
          bookingForm.reset();
          bookingForm.style.display = 'flex';
        }
      }, 400);
    });
  }

  /* ==========================================================================
     7. PORTFOLIO FILTER SYSTEM
     ========================================================================== */
  const buildActivePortfolioList = () => {
    activePortfolioList = Array.from(portfolioItems)
      .filter(item => !item.classList.contains('is-hidden'))
      .map(item => {
        const img = item.querySelector('.portfolio-img');
        const title = item.querySelector('.portfolio-title')?.textContent.trim() || 'EL Dhruv Photography';
        const category = item.querySelector('.portfolio-category')?.textContent.trim() || 'PORTFOLIO';
        const src = img ? (img.currentSrc || img.getAttribute('src')) : '';
        return { src, title, category, element: item };
      });
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      const portfolioGridEl = document.getElementById('portfolio-grid');
      if (portfolioGridEl) {
        if (filterValue === 'all') {
          portfolioGridEl.classList.remove('filtered');
        } else {
          portfolioGridEl.classList.add('filtered');
        }
      }

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('is-hidden');
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        } else {
          item.classList.add('is-hidden');
        }
      });

      buildActivePortfolioList();
    });
  });

  buildActivePortfolioList();

  /* ==========================================================================
     8. 3D LIGHTBOX MODAL & GALLERY CONTROLLER
     ========================================================================== */
  const updateLightboxContent = (index) => {
    if (activePortfolioList.length === 0) return;
    
    if (index < 0) index = activePortfolioList.length - 1;
    if (index >= activePortfolioList.length) index = 0;
    currentLightboxIndex = index;

    const data = activePortfolioList[currentLightboxIndex];
    lightboxImg.src = data.src;
    lightboxImg.alt = data.title;
    lightboxTitle.textContent = data.title;
    lightboxCategory.textContent = data.category;
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${activePortfolioList.length}`;
  };

  const openLightbox = (index) => {
    buildActivePortfolioList();
    updateLightboxContent(index);
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showNextImage = () => updateLightboxContent(currentLightboxIndex + 1);
  const showPrevImage = () => updateLightboxContent(currentLightboxIndex - 1);

  portfolioCards.forEach(card => {
    const handleCardOpen = () => {
      const parentItem = card.closest('.portfolio-item');
      buildActivePortfolioList();
      const itemIndex = activePortfolioList.findIndex(item => item.element === parentItem);
      if (itemIndex !== -1) {
        openLightbox(itemIndex);
      }
    };

    card.addEventListener('click', handleCardOpen);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardOpen();
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (serviceBarPopupModal && serviceBarPopupModal.classList.contains('is-open')) {
        closeServiceBarPopup();
      } else if (bookingModal && bookingModal.classList.contains('active')) {
        closeBookingModal();
      } else if (lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
      } else if (navMenu && navMenu.classList.contains('is-open')) {
        closeMobileMenu();
      }
    } else if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
    }
  });

  // Touch swipe for Lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const threshold = 45;
    if (touchEndX < touchStartX - threshold) {
      showNextImage();
    } else if (touchEndX > touchStartX + threshold) {
      showPrevImage();
    }
  }, { passive: true });

  /* ==========================================================================
     9. SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================= */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, 60);
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }


  /* --- Guaranteed Letter Reveal Trigger for Hero Heading --- */
  const heroHeadingWrap = document.querySelector('.hero-heading-wrap');
  if (heroHeadingWrap) {
    setTimeout(() => {
      heroHeadingWrap.classList.add('revealed');
    }, 120);
  }

});
