/**
 * EL DHRUV VISUALS — EVENT BOOKING & STUDIO MANAGER
 * Comprehensive Customer Booking Form & Studio Owner Dashboard
 * Salem, Tamil Nadu • Phone: +91 7397172114
 */

(function () {
  'use strict';

  // LocalStorage Key
  const STORAGE_KEY = 'elDhruv_event_bookings';
  const STUDIO_PHONE = '917397172114';

  // Seed default sample bookings if store is completely empty
  const defaultBookings = [
    {
      id: 'ELD-2026-8921',
      eventType: 'Marriage & Wedding',
      eventTitle: 'Grand South Indian Wedding & Muhurtham',
      date: '2026-11-14',
      timeSlot: 'Full Day Coverage (Morning to Reception)',
      venue: 'Salem Royal Palace Mahal',
      city: 'Salem, Tamil Nadu',
      guests: '500+ Guests',
      customerName: 'Priya & Karthik Raman',
      customerPhone: '+91 98401 23456',
      customerEmail: 'priya.karthik@gmail.com',
      contactPref: 'WhatsApp',
      notes: 'Traditional Tamil Brahmin wedding ceremony. Need candid moments, drone aerial coverage and cinematic 4K film.',
      status: 'confirmed',
      createdAt: '2026-09-20T10:30:00Z'
    },
    {
      id: 'ELD-2026-7452',
      eventType: 'Model & Fashion Shoot',
      eventTitle: 'Couture Silk & Antique Jewelry Editorial',
      date: '2026-10-24',
      timeSlot: 'Half Day Studio & Outdoor',
      venue: 'Heritage Courtyard Atelier',
      city: 'Coimbatore, Tamil Nadu',
      guests: 'Fashion Crew',
      customerName: 'Ananya Natarajan (Aura Fashion)',
      customerPhone: '+91 97890 87654',
      customerEmail: 'editorial@aurafashion.in',
      contactPref: 'Phone Call',
      notes: 'Portfolio shoot for upcoming festive Kanjivaram collection. Need 30 retouched high-res frames for magazine.',
      status: 'pending',
      createdAt: '2026-09-22T14:15:00Z'
    },
    {
      id: 'ELD-2026-6130',
      eventType: 'Candid Photography',
      eventTitle: 'Golden Jubilee Anniversary Gala',
      date: '2026-10-08',
      timeSlot: 'Evening Reception (6:00 PM - 11:00 PM)',
      venue: 'Green Valley Grand Ballroom',
      city: 'Salem, Tamil Nadu',
      guests: '200 Guests',
      customerName: 'Dr. Rajesh & Meera Sundaram',
      customerPhone: '+91 94432 11223',
      customerEmail: 'rajesh.sundaram@hospital.org',
      contactPref: 'WhatsApp',
      notes: 'Focus on natural family emotions, grandchildren candids, and golden anniversary cake cutting ceremony.',
      status: 'confirmed',
      createdAt: '2026-09-24T09:00:00Z'
    }
  ];

  // Helper: Retrieve all bookings from LocalStorage
  const getBookings = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBookings));
        return defaultBookings;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse bookings from storage', e);
      return defaultBookings;
    }
  };

  // Helper: Save bookings array to LocalStorage
  const saveBookings = (bookings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
      renderDashboard();
      updateBadgeCounts();
    } catch (e) {
      console.error('Failed to save bookings to storage', e);
    }
  };

  // Update badge counter in header / tab
  const updateBadgeCounts = () => {
    const bookings = getBookings();
    const badges = document.querySelectorAll('.booking-count-badge');
    badges.forEach(b => {
      b.textContent = `${bookings.length} Events`;
    });
  };

  // Format Date for display
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return { main: 'Date Not Set', day: '', countdown: '' };
    try {
      const date = new Date(dateStr + 'T00:00:00');
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let countdown = '';
      if (diffDays === 0) countdown = 'Today!';
      else if (diffDays === 1) countdown = 'Tomorrow';
      else if (diffDays > 1) countdown = `In ${diffDays} days`;
      else countdown = `${Math.abs(diffDays)} days ago`;

      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      const main = date.toLocaleDateString('en-GB', options);
      const day = date.toLocaleDateString('en-GB', { weekday: 'long' });

      return { main, day, countdown, diffDays };
    } catch (e) {
      return { main: dateStr, day: '', countdown: '' };
    }
  };

  // Sanitize helper
  const escapeHTML = (str) => {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  };

  /* ==========================================================================
     1. TAB SWITCHER (Customer Booking Form <--> Studio Owner Dashboard)
     ========================================================================== */
  const initTabSwitcher = () => {
    const tabs = document.querySelectorAll('.switcher-tab-btn');
    const panels = document.querySelectorAll('.booking-view-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetView = tab.getAttribute('data-target-view');

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        panels.forEach(p => {
          if (p.id === targetView) {
            p.classList.add('active');
          } else {
            p.classList.remove('active');
          }
        });

        if (targetView === 'dashboard-view') {
          renderDashboard();
        }

        // Smooth scroll to top of workspace
        const ws = document.getElementById('booking-workspace');
        if (ws) {
          const y = ws.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });

    // Check if URL has hash #dashboard to jump directly
    if (window.location.hash === '#dashboard' || window.location.search.includes('view=dashboard')) {
      const dashTab = document.querySelector('[data-target-view="dashboard-view"]');
      if (dashTab) dashTab.click();
    }
  };

  /* ==========================================================================
     2. LIVE FORM SUMMARY SYNC (Customer View)
     ========================================================================== */
  const initFormLiveSync = () => {
    const form = document.getElementById('customer-booking-form');
    if (!form) return;

    const eventRadios = form.querySelectorAll('input[name="event_type"]');
    const dateInput = document.getElementById('booking-event-date');
    const slotSelect = document.getElementById('booking-time-slot');
    const venueInput = document.getElementById('booking-venue');
    const cityInput = document.getElementById('booking-city');
    const nameInput = document.getElementById('customer-full-name');
    const phoneInput = document.getElementById('customer-phone');

    // Sidebar summary targets
    const sumEvent = document.getElementById('summary-event-display');
    const sumDate = document.getElementById('summary-date-display');
    const sumVenue = document.getElementById('summary-venue-display');
    const sumClient = document.getElementById('summary-client-display');

    // Set minimum date to today
    if (dateInput) {
      const todayStr = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', todayStr);
    }

    const updateLiveSummary = () => {
      // Event
      const checkedRadio = form.querySelector('input[name="event_type"]:checked');
      if (sumEvent && checkedRadio) {
        sumEvent.textContent = checkedRadio.value;
      }

      // Date & Slot
      if (sumDate) {
        const rawDate = dateInput ? dateInput.value : '';
        const slot = slotSelect ? slotSelect.value : '';
        if (rawDate) {
          const d = formatDateDisplay(rawDate);
          sumDate.innerHTML = `<strong>${d.main}</strong> (${d.day})<br><small style="color:#D4CDBC;">${slot}</small>`;
        } else {
          sumDate.textContent = 'Please choose date';
        }
      }

      // Venue
      if (sumVenue) {
        const v = venueInput ? venueInput.value.trim() : '';
        const c = cityInput ? cityInput.value : 'Salem';
        sumVenue.textContent = v ? `${v}, ${c}` : `Venue in ${c}`;
      }

      // Client
      if (sumClient) {
        const n = nameInput ? nameInput.value.trim() : '';
        const p = phoneInput ? phoneInput.value.trim() : '';
        if (n || p) {
          sumClient.textContent = `${n || 'Guest'} ${p ? '• ' + p : ''}`;
        } else {
          sumClient.textContent = 'Your Details Here';
        }
      }
    };

    form.addEventListener('input', updateLiveSummary);
    form.addEventListener('change', updateLiveSummary);
    updateLiveSummary();
  };

  /* ==========================================================================
     3. FORM SUBMISSION & WHATSAPP GENERATION
     ========================================================================== */
  const initFormSubmission = () => {
    const form = document.getElementById('customer-booking-form');
    const modal = document.getElementById('booking-success-modal');
    const closeModalBtn = document.getElementById('close-success-modal');
    const viewInDashBtn = document.getElementById('view-in-dashboard-btn');
    const whatsappBtn = document.getElementById('confirm-whatsapp-btn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const checkedEvent = form.querySelector('input[name="event_type"]:checked');
      const eventType = checkedEvent ? checkedEvent.value : 'Photography Session';
      const eventTitle = document.getElementById('booking-event-title')?.value.trim() || eventType;
      const date = document.getElementById('booking-event-date')?.value || '';
      const timeSlot = document.getElementById('booking-time-slot')?.value || 'Full Day Coverage';
      const venue = document.getElementById('booking-venue')?.value.trim() || 'Client Location';
      const city = document.getElementById('booking-city')?.value || 'Salem, Tamil Nadu';
      const guests = document.getElementById('booking-guests')?.value || 'Not specified';
      const customerName = document.getElementById('customer-full-name')?.value.trim() || 'Client';
      const customerPhone = document.getElementById('customer-phone')?.value.trim() || '';
      const customerEmail = document.getElementById('customer-email')?.value.trim() || '';
      const contactPref = document.getElementById('customer-contact-pref')?.value || 'WhatsApp';
      const notes = document.getElementById('customer-notes')?.value.trim() || 'Standard coverage requested.';

      // Generate ID
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const bookingId = `ELD-2026-${randomNum}`;

      const newBooking = {
        id: bookingId,
        eventType,
        eventTitle,
        date,
        timeSlot,
        venue,
        city,
        guests,
        customerName,
        customerPhone,
        customerEmail,
        contactPref,
        notes,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const allBookings = getBookings();
      allBookings.unshift(newBooking);
      saveBookings(allBookings);

      // Populate Success Modal
      document.getElementById('modal-booking-id').textContent = bookingId;
      document.getElementById('modal-event-name').textContent = eventType;
      const d = formatDateDisplay(date);
      document.getElementById('modal-event-date').textContent = `${d.main} (${d.day})`;
      document.getElementById('modal-event-venue').textContent = `${venue}, ${city}`;
      document.getElementById('modal-client-info').textContent = `${customerName} (${customerPhone})`;

      // Prepare WhatsApp message url
      const waText = encodeURIComponent(
        `*NEW EVENT BOOKING — EL DHRUV VISUALS*\n\n` +
        `📌 *Booking ID:* ${bookingId}\n` +
        `🎉 *Event:* ${eventType} (${eventTitle})\n` +
        `📅 *Date:* ${d.main} (${d.day})\n` +
        `⏰ *Slot:* ${timeSlot}\n` +
        `📍 *Venue:* ${venue}, ${city}\n` +
        `👥 *Guests:* ${guests}\n\n` +
        `*CUSTOMER DETAILS:*\n` +
        `👤 *Name:* ${customerName}\n` +
        `📞 *Phone:* ${customerPhone}\n` +
        `✉️ *Email:* ${customerEmail}\n` +
        `💬 *Preferred Contact:* ${contactPref}\n` +
        `📝 *Notes:* ${notes}\n\n` +
        `Please confirm our booking date!`
      );

      if (whatsappBtn) {
        whatsappBtn.href = `https://wa.me/${STUDIO_PHONE}?text=${waText}`;
      }

      // Show modal
      if (modal) modal.classList.add('active');

      // Reset form
      form.reset();
      const defaultRadio = form.querySelector('input[name="event_type"][value="Marriage & Wedding"]');
      if (defaultRadio) defaultRadio.checked = true;
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        if (modal) modal.classList.remove('active');
      });
    }

    if (viewInDashBtn) {
      viewInDashBtn.addEventListener('click', () => {
        if (modal) modal.classList.remove('active');
        const dashTab = document.querySelector('[data-target-view="dashboard-view"]');
        if (dashTab) dashTab.click();
      });
    }
  };

  /* ==========================================================================
     4. STUDIO OWNER DASHBOARD RENDERER & CONTROLS
     ========================================================================== */
  const renderDashboard = () => {
    const container = document.getElementById('dashboard-bookings-list');
    if (!container) return;

    const bookings = getBookings();

    // Elements for filtering & searching
    const searchVal = (document.getElementById('dash-search-input')?.value || '').toLowerCase().trim();
    const eventFilter = document.getElementById('dash-filter-event')?.value || 'all';
    const statusFilter = document.getElementById('dash-filter-status')?.value || 'all';
    const sortBy = document.getElementById('dash-sort-by')?.value || 'date-asc';

    // Filter list
    let filtered = bookings.filter(item => {
      // Event filter
      if (eventFilter !== 'all' && item.eventType !== eventFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (searchVal) {
        const hay = `${item.id} ${item.customerName} ${item.customerPhone} ${item.customerEmail} ${item.eventType} ${item.eventTitle} ${item.venue} ${item.city} ${item.date}`.toLowerCase();
        if (!hay.includes(searchVal)) {
          return false;
        }
      }
      return true;
    });

    // Sort list
    filtered.sort((a, b) => {
      if (sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'date-desc') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      return 0;
    });

    // Update Metrics
    const totalCount = bookings.length;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcomingCount = bookings.filter(b => new Date(b.date + 'T00:00:00') >= now).length;
    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
    const pendingCount = bookings.filter(b => b.status === 'pending').length;

    const elTotal = document.getElementById('metric-total-events');
    const elUpcoming = document.getElementById('metric-upcoming-events');
    const elConfirmed = document.getElementById('metric-confirmed-events');
    const elPending = document.getElementById('metric-pending-events');

    if (elTotal) elTotal.textContent = totalCount;
    if (elUpcoming) elUpcoming.textContent = upcomingCount;
    if (elConfirmed) elConfirmed.textContent = confirmedCount;
    if (elPending) elPending.textContent = pendingCount;

    // Render cards
    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="dash-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h3>No Booking Events Found</h3>
          <p>No customer bookings match your current search or filter criteria.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(item => {
      const d = formatDateDisplay(item.date);
      const cleanPhone = (item.customerPhone || '').replace(/[^0-9+]/g, '');

      // Direct WhatsApp text link to customer
      const clientWaText = encodeURIComponent(
        `Hello ${item.customerName}! This is EL Dhruv Visuals regarding your upcoming ${item.eventType} booking on ${d.main}. We are excited to capture your timeless moments!`
      );

      return `
        <div class="booking-item-card" data-booking-id="${escapeHTML(item.id)}">
          
          <!-- SECTION 1: WHICH DATE -->
          <div class="booking-date-block">
            <span class="date-sub-day">${escapeHTML(d.day || 'EVENT DATE')}</span>
            <div class="date-main-display">${escapeHTML(d.main)}</div>
            <span class="date-time-slot">${escapeHTML(item.timeSlot || 'Full Day Coverage')}</span>
            <span class="date-countdown-tag">${escapeHTML(d.countdown)}</span>
          </div>

          <!-- SECTION 2: WHAT EVENT -->
          <div class="booking-event-block">
            <div class="event-type-badge">
              <span>✦</span> ${escapeHTML(item.eventType)}
            </div>
            <h3 class="event-headline">${escapeHTML(item.eventTitle || item.eventType)}</h3>
            <div class="event-venue-meta">
              <span>📍</span> <strong>${escapeHTML(item.venue)}</strong>, ${escapeHTML(item.city)}
            </div>
            <div class="event-guests-meta">
              <span>👥 Estimated Scale:</span> ${escapeHTML(item.guests || 'Not specified')}
            </div>
          </div>

          <!-- SECTION 3: CUSTOMER DETAILS -->
          <div class="booking-customer-block">
            <div class="customer-name">
              <span>👤 ${escapeHTML(item.customerName)}</span>
              <span class="customer-id-pill">${escapeHTML(item.id)}</span>
            </div>
            
            <div class="customer-contacts-row">
              <a href="tel:${cleanPhone}" class="contact-chip" title="Call Customer">
                <span>📞</span> ${escapeHTML(item.customerPhone)}
              </a>
              <a href="mailto:${escapeHTML(item.customerEmail)}" class="contact-chip" title="Email Customer">
                <span>✉️</span> ${escapeHTML(item.customerEmail)}
              </a>
            </div>

            ${item.notes ? `
              <div class="customer-note-snippet">
                "${escapeHTML(item.notes)}"
              </div>
            ` : ''}
          </div>

          <!-- SECTION 4: ACTIONS & STATUS -->
          <div class="booking-actions-block">
            <select class="status-dropdown status-${item.status}" data-action="change-status" data-id="${escapeHTML(item.id)}" title="Update Booking Status">
              <option value="pending" ${item.status === 'pending' ? 'selected' : ''}>🟡 Pending Inquiry</option>
              <option value="confirmed" ${item.status === 'confirmed' ? 'selected' : ''}>🟢 Confirmed &amp; Locked</option>
              <option value="completed" ${item.status === 'completed' ? 'selected' : ''}>🟣 Completed</option>
              <option value="cancelled" ${item.status === 'cancelled' ? 'selected' : ''}>🔴 Cancelled</option>
            </select>

            <div class="card-action-btns">
              <a href="https://wa.me/${cleanPhone}?text=${clientWaText}" target="_blank" rel="noopener noreferrer" class="action-icon-btn whatsapp" title="WhatsApp Customer">
                💬
              </a>
              <a href="tel:${cleanPhone}" class="action-icon-btn" title="Call Customer">
                📞
              </a>
              <button class="action-icon-btn delete" data-action="delete-booking" data-id="${escapeHTML(item.id)}" title="Delete Booking">
                🗑️
              </button>
            </div>
          </div>

        </div>
      `;
    }).join('');

    // Wire Status change & Delete actions
    container.querySelectorAll('[data-action="change-status"]').forEach(select => {
      select.addEventListener('change', (e) => {
        const id = select.getAttribute('data-id');
        const newStatus = select.value;
        const all = getBookings();
        const found = all.find(b => b.id === id);
        if (found) {
          found.status = newStatus;
          saveBookings(all);
        }
      });
    });

    container.querySelectorAll('[data-action="delete-booking"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm(`Are you sure you want to remove booking ${id}?`)) {
          let all = getBookings();
          all = all.filter(b => b.id !== id);
          saveBookings(all);
        }
      });
    });
  };

  /* ==========================================================================
     5. DASHBOARD CONTROLS (Search, Filter, Export CSV, Add Walk-in)
     ========================================================================== */
  const initDashboardControls = () => {
    const searchInput = document.getElementById('dash-search-input');
    const filterEvent = document.getElementById('dash-filter-event');
    const filterStatus = document.getElementById('dash-filter-status');
    const sortBy = document.getElementById('dash-sort-by');
    const exportCsvBtn = document.getElementById('dash-export-csv-btn');
    const printBtn = document.getElementById('dash-print-btn');
    const addManualBtn = document.getElementById('dash-add-manual-btn');
    const manualModal = document.getElementById('manual-booking-modal');
    const closeManualModalBtn = document.getElementById('close-manual-modal');
    const manualForm = document.getElementById('manual-booking-form');

    if (searchInput) searchInput.addEventListener('input', renderDashboard);
    if (filterEvent) filterEvent.addEventListener('change', renderDashboard);
    if (filterStatus) filterStatus.addEventListener('change', renderDashboard);
    if (sortBy) sortBy.addEventListener('change', renderDashboard);

    // Export to CSV
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        const bookings = getBookings();
        if (!bookings.length) {
          alert('No bookings available to export.');
          return;
        }

        const headers = ['Booking ID', 'Event Type', 'Event Title', 'Event Date', 'Time Slot', 'Venue', 'City', 'Guests', 'Customer Name', 'Customer Phone', 'Customer Email', 'Status', 'Notes'];
        const csvRows = [headers.join(',')];

        bookings.forEach(b => {
          const row = [
            `"${b.id}"`,
            `"${b.eventType}"`,
            `"${b.eventTitle || ''}"`,
            `"${b.date}"`,
            `"${b.timeSlot || ''}"`,
            `"${b.venue || ''}"`,
            `"${b.city || ''}"`,
            `"${b.guests || ''}"`,
            `"${b.customerName}"`,
            `"${b.customerPhone}"`,
            `"${b.customerEmail || ''}"`,
            `"${b.status}"`,
            `"${(b.notes || '').replace(/"/g, '""')}"`
          ];
          csvRows.push(row.join(','));
        });

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `ELDhruv_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }

    // Print
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Add Manual Walk-In Booking
    if (addManualBtn && manualModal) {
      addManualBtn.addEventListener('click', () => {
        manualModal.classList.add('active');
      });
    }

    if (closeManualModalBtn && manualModal) {
      closeManualModalBtn.addEventListener('click', () => {
        manualModal.classList.remove('active');
      });
    }

    if (manualForm) {
      manualForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const eventType = document.getElementById('manual-event-type').value;
        const date = document.getElementById('manual-event-date').value;
        const customerName = document.getElementById('manual-customer-name').value.trim();
        const customerPhone = document.getElementById('manual-customer-phone').value.trim();
        const customerEmail = document.getElementById('manual-customer-email').value.trim();
        const venue = document.getElementById('manual-event-venue').value.trim() || 'Salem';
        const notes = document.getElementById('manual-event-notes').value.trim() || 'Walk-in / Phone inquiry';

        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const newBooking = {
          id: `ELD-2026-${randomNum}`,
          eventType,
          eventTitle: `${eventType} (Studio Entry)`,
          date,
          timeSlot: 'Full Day / Standard',
          venue,
          city: 'Salem, Tamil Nadu',
          guests: 'Standard',
          customerName,
          customerPhone,
          customerEmail,
          contactPref: 'Phone Call',
          notes,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        };

        const all = getBookings();
        all.unshift(newBooking);
        saveBookings(all);

        manualForm.reset();
        if (manualModal) manualModal.classList.remove('active');
      });
    }
  };

  /* ==========================================================================
     INITIALIZATION & CROSS-TAB SYNC
     ========================================================================== */
  const handleHashRoute = () => {
    if (window.location.hash === '#dashboard' || window.location.search.includes('view=dashboard')) {
      const dashTab = document.querySelector('[data-target-view="dashboard-view"]');
      if (dashTab) {
        dashTab.click();
      }
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    updateBadgeCounts();
    initTabSwitcher();
    initFormLiveSync();
    initFormSubmission();
    initDashboardControls();
    renderDashboard();
    handleHashRoute();

    // Auto-update dashboard if a booking is added from any other page or tab
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        renderDashboard();
        updateBadgeCounts();
      }
    });

    window.addEventListener('hashchange', handleHashRoute);
  });

})();
