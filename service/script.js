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
      const isOpen = navMenu.classList.toggle('is-open');
      navMenu.classList.toggle('open', isOpen);
      hamburgerBtn.classList.toggle('active', isOpen);
      hamburgerBtn.classList.toggle('open', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
      document.body.style.overflow = isOpen ? 'hidden' : '';
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

  // 3.1 Interactive 3D Logo Dynamics & Glare
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

        const rotateX = ((y - centerY) / centerY) * -16;
        const rotateY = ((x - centerX) / centerX) * 16;

        logoCard.style.animation = 'none';
        logoCard.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(16px) scale(1.06)`;

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
        if (glare) glare.style.background = '';
      });
    }
  });

  /* ==========================================================================
     3.2 INTERACTIVE 3D CAMERA LOGO: CLICK A PHOTO ANIMATION & SHUTTER AUDIO
     ========================================================================== */
  function initCameraClickPhotoAnimation() {
    const brandLogos = document.querySelectorAll('.brand-logo, [data-logo-3d]');
    if (!brandLogos.length) return;

    const samplePhotos = [
      'images/services/professional-photography-service.webp',
      'images/services/cinematic-videography-service.webp',
      'images/services/candid-wedding-photography.webp',
      'images/services/professional-model-photoshoot.webp',
      'images/services/luxury-private-event-photography.webp',
      'images/services/indian-wedding-photograph.webp'
    ];
    let photoIndex = 0;
    let clickCount = 0;
    let isClicking = false;

    let audioCtx = null;
    function playCameraShutterSound() {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        if (!audioCtx) audioCtx = new AudioContextClass();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const now = audioCtx.currentTime;

        // 1. Shutter Mirror Up
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

        // 2. Curtain Snap
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

        // 3. Shutter Curtain Close
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

        // 4. Digital Write Chirp
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
      } catch (err) {}
    }

    let lastSnapTime = 0;

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
      playCameraShutterSound();

      logoCard.classList.remove('camera-shutter-snap');
      void logoCard.offsetWidth;
      logoCard.classList.add('camera-shutter-snap');
      setTimeout(() => {
        logoCard.classList.remove('camera-shutter-snap');
      }, 550);

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

      const shockwave = document.createElement('div');
      shockwave.className = 'camera-lens-shockwave';
      shockwave.style.left = `${lensCenterX}px`;
      shockwave.style.top = `${lensCenterY}px`;
      shockwave.style.width = `${Math.max(rect.width * 0.8, 60)}px`;
      shockwave.style.height = `${Math.max(rect.width * 0.8, 60)}px`;
      document.body.appendChild(shockwave);
      setTimeout(() => shockwave.remove(), 700);

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

    brandLogos.forEach(logoElem => {
      if (logoElem.dataset.cameraBound) return;
      logoElem.dataset.cameraBound = 'true';
      logoElem.style.cursor = 'pointer';
      logoElem.setAttribute('title', 'Touch with cursor to snap a photo! 📸');

      logoElem.addEventListener('mouseenter', () => {
        triggerCameraPhotoClick(logoElem);
      });

      logoElem.addEventListener('touchstart', (e) => {
        triggerCameraPhotoClick(logoElem);
      }, { passive: true });

      logoElem.addEventListener('click', (e) => {
        triggerCameraPhotoClick(logoElem);
      });
    });
  }

  initCameraClickPhotoAnimation();

  // 6. Videography sound toggle
  const videoSoundBtn = document.getElementById('video-sound-btn');
  const weddingVideo = document.getElementById('hero-wedding-video');
  const iconMuted = document.getElementById('sound-icon-muted');
  const iconUnmuted = document.getElementById('sound-icon-unmuted');

  if (videoSoundBtn && weddingVideo) {
    videoSoundBtn.addEventListener('click', () => {
      weddingVideo.muted = !weddingVideo.muted;
      if (weddingVideo.muted) {
        if (iconMuted) iconMuted.style.display = 'block';
        if (iconUnmuted) iconUnmuted.style.display = 'none';
        videoSoundBtn.setAttribute('title', 'Unmute Sound');
      } else {
        if (iconMuted) iconMuted.style.display = 'none';
        if (iconUnmuted) iconUnmuted.style.display = 'block';
        videoSoundBtn.setAttribute('title', 'Mute Sound');
      }
    });
  }

  // 7. 10-Second Wedding Video Loop Handler
  const previewVideos = document.querySelectorAll('.catalog-card-video, #hero-wedding-video, .hero-video-frame video');
  previewVideos.forEach(vid => {
    vid.addEventListener('timeupdate', () => {
      if (vid.currentTime >= 10) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    });
  });
});

