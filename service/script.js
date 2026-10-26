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
          <button class="modal-close-btn close-modal-btn" aria-label="Close modal">&times;</button>
          <div style="text-align: center; padding: 15px 5px;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #0D3E42, #08282B); border: 2px solid #CCA566; color: #CCA566; display: flex; align-items: center; justify-content: center; font-size: 1.9rem; font-weight: 800; margin: 0 auto 16px; box-shadow: 0 6px 22px rgba(13, 62, 66, 0.35);">✓</div>
            <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.95rem; color: #0A1C1E; margin-bottom: 8px;">Event Booking Recorded!</h3>
            <p style="color: #3A4E50; font-family: 'Montserrat', sans-serif; font-size: 0.92rem; margin-bottom: 20px; line-height: 1.6;">
              Your event booking is registered and immediately visible in the <strong>Studio Booking Dashboard</strong>.
            </p>
            <div style="background: #F7F4EE; border: 1px solid rgba(204, 165, 102, 0.35); border-radius: 14px; padding: 16px 20px; text-align: left; margin-bottom: 24px; font-family: 'Montserrat', sans-serif; font-size: 0.88rem; line-height: 1.8; box-shadow: 0 6px 20px rgba(8, 38, 41, 0.06);">
              <div style="display:flex; justify-content:space-between;"><span style="color:#5C7274;">Booking ID:</span> <strong style="color:#CCA566;">${bookingId}</strong></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#5C7274;">What Event:</span> <strong style="color:#0A1C1E;">${eventType}</strong></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#5C7274;">Which Date:</span> <strong style="color:#0A1C1E;">${date}</strong></div>
              <div style="display:flex; justify-content:space-between;"><span style="color:#5C7274;">Customer:</span> <strong style="color:#0A1C1E;">${name} (${phone})</strong></div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <a href="https://wa.me/${STUDIO_PHONE}?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="background:#25D366; border-color:#25D366; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:8px; font-size: 0.85rem;">
                💬 Send Confirmation to WhatsApp
              </a>
              <a href="../booking.html#dashboard" class="btn btn-outline" style="text-decoration:none; display:flex; align-items:center; justify-content:center; font-size: 0.85rem;">
                📋 Open Booking Dashboard &rarr;
              </a>
            </div>
          </div>
        `;

        modalCard.querySelector('.close-modal-btn')?.addEventListener('click', () => {
          modal?.classList.remove('active');
          document.body.style.overflow = '';
          window.location.reload();
        });
      }
    });
  }

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

