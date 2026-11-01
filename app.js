/**
 * LUNARA TREE HOUSE RESORT • WEERAWILA, SRI LANKA
 * Interactive Logic, Live Currency Conversion, Lightbox & Booking Engine
 * Inspired by the refined editorial interactions of Casa Momo
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Currency Conversion System
  // ------------------------------------------------------------------------
  const EXCHANGE_RATES = {
    LKR: { rate: 1, symbol: 'LKR ', format: (val) => `LKR ${val.toLocaleString()}` },
    USD: { rate: 1 / 310, symbol: '$', format: (val) => `$${Math.round(val / 310).toLocaleString()}` },
    EUR: { rate: 1 / 335, symbol: '€', format: (val) => `€${Math.round(val / 335).toLocaleString()}` },
    GBP: { rate: 1 / 390, symbol: '£', format: (val) => `£${Math.round(val / 390).toLocaleString()}` }
  };

  let currentCurrency = 'LKR';

  function updateAllPrices(currencyKey) {
    currentCurrency = currencyKey;
    const rateObj = EXCHANGE_RATES[currencyKey];
    if (!rateObj) return;

    // Update active class on toolbar pills
    document.querySelectorAll('.curr-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.curr === currencyKey);
    });

    // Update header currency display button if present
    const headerCurrBtn = document.getElementById('headerCurrencyDisplay');
    if (headerCurrBtn) {
      headerCurrBtn.textContent = currencyKey;
    }

    // Update all elements with data-price-lkr
    document.querySelectorAll('[data-price-lkr]').forEach(elem => {
      const lkrVal = parseFloat(elem.dataset.priceLkr);
      if (isNaN(lkrVal)) return;

      const isPerPerson = elem.dataset.perPerson === 'true';
      const formatted = rateObj.format(lkrVal);
      elem.textContent = isPerPerson ? `From ${formatted} pp` : formatted;
    });

    // Re-calculate modal if currently open
    calculateBookingEstimate();
  }

  // Setup toolbar currency pills
  document.querySelectorAll('.curr-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const curr = pill.dataset.curr;
      updateAllPrices(curr);
    });
  });

  // Cycle currency on header button click
  const headerCurrBtn = document.getElementById('headerCurrencyDisplay');
  if (headerCurrBtn) {
    const currencies = ['LKR', 'USD', 'EUR', 'GBP'];
    headerCurrBtn.parentElement.addEventListener('click', () => {
      const nextIdx = (currencies.indexOf(currentCurrency) + 1) % currencies.length;
      updateAllPrices(currencies[nextIdx]);
    });
  }

  // ------------------------------------------------------------------------
  // 2. Package Filter System
  // ------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const packageCards = document.querySelectorAll('.package-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;

      packageCards.forEach(card => {
        const categories = (card.dataset.category || '').split(' ');
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease';
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 3. Header Scroll Effects & Dark Section Detection
  // ------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  const darkSections = document.querySelectorAll('.section-dark');

  function handleHeaderScroll() {
    const scrollY = window.scrollY;

    // Background blur on scroll
    if (scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Check if header is over a dark section
    let isOverDark = false;
    const headerRect = siteHeader.getBoundingClientRect();
    const headerMidY = headerRect.top + headerRect.height / 2;

    darkSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (headerMidY >= rect.top && headerMidY <= rect.bottom) {
        isOverDark = true;
      }
    });

    if (isOverDark && scrollY > 40) {
      siteHeader.classList.add('header-dark-mode');
    } else {
      siteHeader.classList.remove('header-dark-mode');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // ------------------------------------------------------------------------
  // 4. Mobile Menu Navigation Drawer
  // ------------------------------------------------------------------------
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNavDrawer.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ------------------------------------------------------------------------
  // 5. Suite Tab Switcher
  // ------------------------------------------------------------------------
  const suiteData = {
    lakeside: {
      badge: 'Signature Pavilion • Elevated 8m',
      title: 'Lake Vista Treehouse Suite',
      lead: 'Perched high in the indigenous teak and kumbuk canopy, overlooking the tranquil sunset horizons of Weerawila lake.',
      sqm: '68 m²',
      elevation: '8.5 m',
      guests: '2 Guests',
      priceLkr: 65000,
      image: 'assets/images/treehouse_balcony_sunset.jpg',
      highlights: [
        'Panoramic wrap-around wooden deck with handwoven rattan loungers',
        'Direct lake sunset alignment and morning bird sanctuary vistas',
        'Private open-air dining setup for starlit breakfasts',
        'Crafted local teak woodwork and organic linen furnishings'
      ]
    },
    canopy: {
      badge: 'Master Suite • Jungle & Sky',
      title: 'Canopy King Pavilion with Marble Ensuite',
      lead: 'An exquisite fusion of raw tropical timber and honed Italian marble, immersed directly within whispering treetop branches.',
      sqm: '75 m²',
      elevation: '9.2 m',
      guests: '2 - 3 Guests',
      priceLkr: 82000,
      image: 'assets/images/luxury_ensuite_bathroom.jpg',
      highlights: [
        'Floor-to-ceiling glass rainfall shower looking out into jungle canopy',
        'Double stone hand-carved washbasins with Ayurvedic botanicals',
        'King-size canopy bed with custom organic cotton netting',
        'Complimentary telescope for evening stargazing and moon observation'
      ]
    },
    family: {
      badge: 'Extended Sanctuary • 2 Bedrooms',
      title: 'Family Nature Canopy Lodge',
      lead: 'Designed for families and intimate parties seeking deep nature immersion with absolute privacy, comfort, and safety.',
      sqm: '115 m²',
      elevation: '7.0 m',
      guests: '4 - 5 Guests',
      priceLkr: 120000,
      image: 'assets/images/treehouse_canopy_evening.jpg',
      highlights: [
        'Dual connected treehouse pavilions with private suspended sky-bridge',
        'Dedicated children’s nature observation corner & board games',
        'Expansive deck with private fire pit setup for twilight stories',
        'Close access to gentle lake kayak launch point'
      ]
    }
  };

  const suiteTabBtns = document.querySelectorAll('.suite-tab-btn');
  const mainSuiteCard = document.querySelector('.suite-card-main');

  if (mainSuiteCard) {
    suiteTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        suiteTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const key = btn.dataset.suite;
        const data = suiteData[key];
        if (!data) return;

        // Animate swap
        mainSuiteCard.style.opacity = '0.4';
        setTimeout(() => {
          const imgElem = mainSuiteCard.querySelector('.suite-main-img');
          const badgeElem = mainSuiteCard.querySelector('.suite-badge');
          const titleElem = mainSuiteCard.querySelector('.suite-title');
          const descElem = mainSuiteCard.querySelector('.suite-description');
          const sqmElem = mainSuiteCard.querySelector('#suiteSqm');
          const elevElem = mainSuiteCard.querySelector('#suiteElevation');
          const guestsElem = mainSuiteCard.querySelector('#suiteGuests');
          const priceElem = mainSuiteCard.querySelector('#suitePrice');
          const highlightsList = mainSuiteCard.querySelector('.suite-highlights-list');

          if (imgElem) imgElem.src = data.image;
          if (badgeElem) badgeElem.textContent = data.badge;
          if (titleElem) titleElem.textContent = data.title;
          if (descElem) descElem.textContent = data.lead;
          if (sqmElem) sqmElem.textContent = data.sqm;
          if (elevElem) elevElem.textContent = data.elevation;
          if (guestsElem) guestsElem.textContent = data.guests;

          if (priceElem) {
            priceElem.dataset.priceLkr = data.priceLkr;
            const rateObj = EXCHANGE_RATES[currentCurrency];
            priceElem.textContent = `${rateObj.format(data.priceLkr)} / night`;
          }

          if (highlightsList) {
            highlightsList.innerHTML = data.highlights.map(h => `
              <li class="suite-highlight-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>${h}</span>
              </li>
            `).join('');
          }

          mainSuiteCard.style.opacity = '1';
        }, 150);
      });
    });
  }

  // ------------------------------------------------------------------------
  // 6. Interactive Lightbox Gallery
  // ------------------------------------------------------------------------
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;
  const galleryData = Array.from(galleryItems).map(item => ({
    src: item.dataset.fullSrc || item.querySelector('img').src,
    caption: item.dataset.caption || item.querySelector('.gallery-item-title')?.textContent || 'Lunara Tree House Resort'
  }));

  function openLightbox(index) {
    if (!lightboxModal || index < 0 || index >= galleryData.length) return;
    currentGalleryIndex = index;
    lightboxImg.src = galleryData[index].src;
    lightboxCaption.textContent = galleryData[index].caption;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextGallery() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    lightboxImg.src = galleryData[currentGalleryIndex].src;
    lightboxCaption.textContent = galleryData[currentGalleryIndex].caption;
  }

  function showPrevGallery() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    lightboxImg.src = galleryData[currentGalleryIndex].src;
    lightboxCaption.textContent = galleryData[currentGalleryIndex].caption;
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextGallery);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevGallery);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextGallery();
    if (e.key === 'ArrowLeft') showPrevGallery();
  });

  // ------------------------------------------------------------------------
  // 7. Interactive Reservation & Booking Modal
  // ------------------------------------------------------------------------
  const bookingModal = document.getElementById('bookingModal');
  const bookingForm = document.getElementById('bookingForm');
  const bookingCloseBtns = document.querySelectorAll('.close-booking-modal');
  const packageSelect = document.getElementById('packageSelect');
  const peakSeasonToggle = document.getElementById('peakSeasonToggle');
  const guestsInput = document.getElementById('bookingGuests');

  // Packages pricing database (exact from user card)
  const PACKAGES_PRICING = {
    honeymoon: { name: 'Honeymoon Escape (3 Nights)', baseLkr: 175000, nights: 3 },
    anniversary: { name: 'Romantic Anniversary (2 Nights)', baseLkr: 105000, nights: 2 },
    safari: { name: 'Wildlife Safari Adventure (3 Nights)', baseLkr: 155000, nights: 3 },
    wellness: { name: 'Wellness & Renewal (3 Nights)', baseLkr: 170000, nights: 3 },
    family: { name: 'Family Nature Escape (3 Nights)', baseLkr: 180000, nights: 3 },
    launch: { name: 'Launch Special: First Nights (2 Nights)', baseLkr: 52000, nights: 2 },
    corporate: { name: 'Group & Corporate Retreat', baseLkr: 12000, isPerPerson: true },
    custom: { name: 'Bespoke Treehouse Stay (Tailored)', baseLkr: 65000, nights: 1 }
  };

  function openBookingModal(preselectedPkg = 'honeymoon') {
    if (!bookingModal) return;
    if (packageSelect && PACKAGES_PRICING[preselectedPkg]) {
      packageSelect.value = preselectedPkg;
    }
    calculateBookingEstimate();
    bookingModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Trigger buttons
  document.querySelectorAll('[data-open-booking]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pkg = btn.dataset.packageKey || 'honeymoon';
      openBookingModal(pkg);
    });
  });

  bookingCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeBookingModal);
  });

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeBookingModal();
    });
  }

  // Calculation function
  function calculateBookingEstimate() {
    if (!packageSelect) return;
    const pkgKey = packageSelect.value || 'honeymoon';
    const pkg = PACKAGES_PRICING[pkgKey] || PACKAGES_PRICING.honeymoon;

    const isPeak = peakSeasonToggle ? peakSeasonToggle.checked : false;
    const numGuests = guestsInput ? parseInt(guestsInput.value) || 2 : 2;

    let baseRate = pkg.baseLkr;
    if (pkg.isPerPerson) {
      baseRate = baseRate * Math.max(numGuests, 10);
    }

    // Peak season: add 15% to package prices (from user packages card)
    const peakSurcharge = isPeak ? baseRate * 0.15 : 0;
    const subtotal = baseRate + peakSurcharge;

    // Taxes & Service Charge: 10% service charge + taxes (from user card)
    const serviceCharge = subtotal * 0.10;
    const estimatedTotal = subtotal + serviceCharge;

    const rateObj = EXCHANGE_RATES[currentCurrency] || EXCHANGE_RATES.LKR;

    const baseElem = document.getElementById('calcBasePrice');
    const peakElem = document.getElementById('calcPeakCharge');
    const peakRow = document.getElementById('peakChargeRow');
    const taxElem = document.getElementById('calcServiceCharge');
    const totalElem = document.getElementById('calcGrandTotal');

    if (baseElem) baseElem.textContent = rateObj.format(baseRate);
    if (peakRow) peakRow.style.display = isPeak ? 'flex' : 'none';
    if (peakElem) peakElem.textContent = rateObj.format(peakSurcharge);
    if (taxElem) taxElem.textContent = rateObj.format(serviceCharge);
    if (totalElem) totalElem.textContent = rateObj.format(estimatedTotal);
  }

  if (packageSelect) packageSelect.addEventListener('change', calculateBookingEstimate);
  if (peakSeasonToggle) peakSeasonToggle.addEventListener('change', calculateBookingEstimate);
  if (guestsInput) guestsInput.addEventListener('input', calculateBookingEstimate);

  // Booking Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const name = document.getElementById('bookingName')?.value || 'Guest';
      const email = document.getElementById('bookingEmail')?.value || '';
      const pkgName = packageSelect ? packageSelect.options[packageSelect.selectedIndex].text : '';

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-dasharray="30" stroke-dashoffset="10"></circle>
        </svg>
        Confirming Reservation Request...
      `;

      setTimeout(() => {
        bookingForm.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: #FAF2E8; color: #BC6F45; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 class="font-serif" style="font-size: 2rem; margin-bottom: 0.75rem; color: #12160F;">Ayubowan, ${name}</h3>
            <p style="color: #6B685F; max-width: 460px; margin: 0 auto 1.5rem; line-height: 1.6;">
              Your reservation request for <strong>${pkgName}</strong> has been received by our private concierge. We will contact you at <strong>${email}</strong> within 4 hours with your bespoke itinerary.
            </p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
              <a href="https://wa.me/94778533322?text=Hello%20Lunara%20Tree%20House%20Resort,%20I%20would%20like%20to%20inquire%20about%20my%20reservation%20for%20${encodeURIComponent(pkgName)}" target="_blank" class="btn btn-terracotta">
                Direct WhatsApp Concierge (+94 778533322)
              </a>
              <button class="btn btn-outline-dark close-booking-modal" onclick="document.getElementById('bookingModal').classList.remove('open');">
                Return to Sanctuary
              </button>
            </div>
          </div>
        `;
      }, 1000);
    });
  }

  // ------------------------------------------------------------------------
  // 8. Newsletter Subscription Feedback
  // ------------------------------------------------------------------------
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      const submitBtn = newsletterForm.querySelector('.newsletter-submit-btn');
      if (input && input.value) {
        submitBtn.textContent = 'Subscribed';
        submitBtn.style.backgroundColor = '#55B35A';
        submitBtn.style.color = '#FFF';
        input.value = '';
        setTimeout(() => {
          submitBtn.textContent = 'Join';
          submitBtn.style.backgroundColor = '';
          submitBtn.style.color = '';
        }, 3000);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 9. Intersection Observer for Smooth Reveal Animations
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // ------------------------------------------------------------------------
  // 10. Interactive Hero Scene Switcher
  // ------------------------------------------------------------------------
  const heroMainImg = document.getElementById('heroMainImg');
  const heroSceneBtns = document.querySelectorAll('.hero-scene-btn');
  if (heroMainImg && heroSceneBtns.length) {
    heroSceneBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        heroSceneBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const imgSrc = btn.dataset.heroImg;
        if (!imgSrc) return;
        heroMainImg.style.transition = 'opacity 0.4s ease';
        heroMainImg.style.opacity = '0.35';
        setTimeout(() => {
          heroMainImg.src = imgSrc;
          heroMainImg.onload = () => {
            heroMainImg.style.opacity = '1';
          };
        }, 120);
      });
    });
  }

  // ------------------------------------------------------------------------
  // 11. Live Interactive Google Map Controller
  // ------------------------------------------------------------------------
  const mapIframe = document.getElementById('interactiveMapIframe');
  const mapToggleBtns = document.querySelectorAll('.map-toggle-btn');
  const mapDestBtns = document.querySelectorAll('.map-dest-btn');

  let currentMapQuery = 'Weerawila+Lake,+Hambantota,+Sri+Lanka';
  let currentMapMode = 'm'; // m = terrain/standard, k = satellite
  let currentMapZoom = '13';

  function updateInteractiveMap() {
    if (!mapIframe) return;
    const newSrc = `https://maps.google.com/maps?q=${currentMapQuery}&t=${currentMapMode}&z=${currentMapZoom}&ie=UTF8&iwloc=&output=embed`;
    mapIframe.src = newSrc;
  }

  // Map Mode Toggle (Terrain vs Satellite)
  mapToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mapToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMapMode = btn.dataset.mapMode || 'm';
      updateInteractiveMap();
    });
  });

  // Destination Buttons
  mapDestBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mapDestBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMapQuery = btn.dataset.destQuery || 'Weerawila+Lake,+Hambantota,+Sri+Lanka';
      currentMapZoom = btn.dataset.zoom || '13';
      updateInteractiveMap();
    });
  });

});

