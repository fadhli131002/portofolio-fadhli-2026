document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Hero Multi-Tile Video Wall Play / Pause Control ---
  const heroWallVideos = document.querySelectorAll('.hero-tile video');
  const heroToggleBtn = document.getElementById('hero-video-toggle');
  const heroToggleIcon = document.getElementById('hero-toggle-icon');

  let isWallPaused = false;
  if (heroToggleBtn) {
    heroToggleBtn.addEventListener('click', () => {
      isWallPaused = !isWallPaused;
      heroWallVideos.forEach(vid => {
        if (isWallPaused) {
          vid.pause();
        } else {
          vid.play().catch(() => {});
        }
      });
      if (heroToggleIcon) {
        heroToggleIcon.textContent = isWallPaused ? 'play_arrow' : 'pause';
      }
    });
  }

  // Optimize: Pause hero videos whenever user scrolls down past Hero section
  const heroSection = document.getElementById('hero');
  if (heroSection && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!isWallPaused) {
          if (entry.isIntersecting) {
            heroWallVideos.forEach(vid => vid.play().catch(() => {}));
          } else {
            heroWallVideos.forEach(vid => vid.pause());
          }
        }
      });
    }, { threshold: 0.05 });
    heroObserver.observe(heroSection);
  }

  // --- 2. Scroll Indicator & Back to Top ---
  const scrollIndicator = document.getElementById('scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --- 2B. Floating Glassmorphism Back to Top Controller ---
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
          if (currentScroll > 300) {
            backToTopBtn.classList.add('visible');
          } else {
            backToTopBtn.classList.remove('visible');
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 3. Bidirectional Scroll Reveal Animations ---
  // Animates elements when scrolling down AND when scrolling back up
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.05
    };

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          if (entry.target.id === 'software-mastery-hud' || entry.target.classList.contains('software-mastery-panel')) {
            if (typeof playSoftwareMasteryAnimation === 'function') {
              playSoftwareMasteryAnimation(true);
            }
          }
        } else {
          entry.target.classList.remove('in-view');
          if (entry.target.id === 'software-mastery-hud' || entry.target.classList.contains('software-mastery-panel')) {
            if (typeof resetSoftwareMasteryAnimation === 'function') {
              resetSoftwareMasteryAnimation();
            }
          }
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      scrollObserver.observe(el);
      // Immediately reveal if already in or near viewport
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 150) {
        el.classList.add('in-view');
      }
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('in-view'));
  }


  // --- 5. Portfolio Category Filtering & Load More Controller ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const loadMoreContainer = document.querySelector('.portfolio-load-more-container');

  let currentPortfolioFilter = 'all';
  let visibleAllCount = 4; // Requirement: Default shows ONLY 4 cards on "Semua Proyek"

  function updatePortfolioDisplay() {
    if (currentPortfolioFilter === 'all') {
      const allCards = Array.from(projectCards);
      allCards.forEach((card, index) => {
        if (index < visibleAllCount) {
          card.style.display = 'flex';
          setTimeout(() => card.classList.add('in-view'), 30);
        } else {
          card.style.display = 'none';
          card.classList.remove('in-view');
          const vid = card.querySelector('video.project-video');
          if (vid) {
            vid.pause();
            vid.currentTime = 0;
          }
        }
      });

      // Show/hide Load More button
      if (loadMoreContainer) {
        if (visibleAllCount >= allCards.length) {
          loadMoreContainer.style.display = 'none';
        } else {
          loadMoreContainer.style.display = 'flex';
        }
      }
    } else {
      // Category filter active: Show ALL matching category cards
      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').trim().split(/\s+/);
        if (categories.includes(currentPortfolioFilter)) {
          card.style.display = 'flex';
          setTimeout(() => card.classList.add('in-view'), 30);
        } else {
          card.style.display = 'none';
          card.classList.remove('in-view');
          const vid = card.querySelector('video.project-video');
          if (vid) {
            vid.pause();
            vid.currentTime = 0;
          }
        }
      });

      // Requirement: Sembunyikan tombol "Load More" saat filter kategori lain aktif
      if (loadMoreContainer) {
        loadMoreContainer.style.display = 'none';
      }
    }
  }

  // Load More button click handler: reveal next 4 items
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleAllCount += 4;
      updatePortfolioDisplay();
    });
  }

  // Filter button click handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentPortfolioFilter = filter;
      if (currentPortfolioFilter === 'all') {
        visibleAllCount = 4; // Reset to 4 items when returning to "Semua Proyek"
      }
      updatePortfolioDisplay();
    });
  });

  // Initial call on page load
  updatePortfolioDisplay();
  });

  // --- 5B. High-Performance On-Demand Video Preview Controller ---
  // Completely eliminates lag: plays video only on user hover (Desktop) or center viewport (Mobile)
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const videoCards = Array.from(projectCards).filter(c => c.querySelector('video.project-video'));

  // 1. Desktop: Silk-smooth Hover-to-Play with graceful pause/reset
  videoCards.forEach(card => {
    const video = card.querySelector('video.project-video');
    if (!video) return;

    let playPromise = null;

    card.addEventListener('mouseenter', () => {
      if (card.offsetParent !== null) {
        playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    });

    card.addEventListener('mouseleave', () => {
      if (playPromise !== undefined) {
        playPromise.then(() => {
          video.pause();
          video.currentTime = 0;
        }).catch(() => {
          video.pause();
        });
      } else {
        video.pause();
      }
    });
  });

  // 2. Mobile / Touch Devices: Observe viewport and only play the 1 active reel centered on screen
  if (isTouchDevice && 'IntersectionObserver' in window) {
    let currentlyPlayingVideo = null;
    const mobileVideoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target.querySelector('video.project-video');
        if (!video) return;

        if (entry.isIntersecting && entry.target.offsetParent !== null) {
          if (currentlyPlayingVideo && currentlyPlayingVideo !== video) {
            currentlyPlayingVideo.pause();
          }
          currentlyPlayingVideo = video;
          video.play().catch(() => {});
        } else {
          if (currentlyPlayingVideo === video) {
            video.pause();
            currentlyPlayingVideo = null;
          }
        }
      });
    }, {
      root: null,
      rootMargin: '-25% 0px -25% 0px',
      threshold: 0.5
    });

    videoCards.forEach(card => mobileVideoObserver.observe(card));
  }

  // --- 6. What I'm Doing (Services) Google Flow Focus Blur ---
  const servicesGrid = document.getElementById('services-grid') || document.querySelector('.services-grid');
  const serviceCards = document.querySelectorAll('.services-grid .service-card');

  if (servicesGrid && serviceCards.length > 0) {
    serviceCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCurrentActive = card.classList.contains('active');

        if (isCurrentActive) {
          // Toggle off if clicked again
          card.classList.remove('active');
          card.setAttribute('aria-pressed', 'false');
          servicesGrid.classList.remove('has-active');
        } else {
          // Activate clicked card, deselect others
          serviceCards.forEach(c => {
            c.classList.remove('active');
            c.setAttribute('aria-pressed', 'false');
          });
          card.classList.add('active');
          card.setAttribute('aria-pressed', 'true');
          servicesGrid.classList.add('has-active');
        }
      });

      // Keyboard support (Enter / Space)
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Click outside services grid to reset all cards to default sharp view
    document.addEventListener('click', (e) => {
      if (!servicesGrid.contains(e.target)) {
        serviceCards.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-pressed', 'false');
        });
        servicesGrid.classList.remove('has-active');
      }
    });
  }

  // --- 7. FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });

        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
  });

  // --- 8. Mobile Navigation Drawer Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.position = 'absolute';
        navLinks.style.top = '4.5rem';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.flexDirection = 'column';
        navLinks.style.background = 'rgba(0,0,0,0.95)';
        navLinks.style.padding = '2rem';
        navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.15)';
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          navLinks.style.display = 'none';
        }
      });
    });
  }

  // =========================================================
  // --- 8. Interactive 3D Lanyard ID Card Engine ---
  // =========================================================
  const cardWrapper = document.getElementById('id-card-wrapper');
  const card3D = document.getElementById('id-card-3d');
  const lanyardScene = document.getElementById('lanyard-scene');

  if (cardWrapper && card3D && lanyardScene) {
    let currentRotateX = 0;
    let targetRotateX = 0;
    let currentRotateY = 0;
    let targetRotateY = 0;
    let currentRotateZ = 0;
    let targetRotateZ = 0;
    let currentTranslateX = 0;
    let targetTranslateX = 0;
    let currentTranslateY = 0;
    let targetTranslateY = 0;

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragDist = 0;
    let isFlipped = false;

    // Physics pendulum oscillation
    let swingVelocity = 0;
    let swingAngle = 0;
    let isSwinging = false;

    // Center coordinates
    function getCardCenter() {
      const rect = cardWrapper.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top
      };
    }

    // Dynamic light sheen update
    function updateLight(clientX, clientY, cardBounds) {
      const px = Math.max(0, Math.min(100, ((clientX - cardBounds.left) / cardBounds.width) * 100));
      const py = Math.max(0, Math.min(100, ((clientY - cardBounds.top) / cardBounds.height) * 100));
      cardWrapper.style.setProperty('--light-x', px + '%');
      cardWrapper.style.setProperty('--light-y', py + '%');
    }

    const hoverArea = document.querySelector('.about-card') || lanyardScene;

    hoverArea.addEventListener('pointerleave', () => {
      if (!isDragging && !isSwinging) {
        targetRotateX = 0;
        targetRotateY = 0;
        targetRotateZ = 0;
        targetTranslateX = 0;
        targetTranslateY = 0;
        cardWrapper.style.setProperty('--light-x', '50%');
        cardWrapper.style.setProperty('--light-y', '50%');
        requestPhysicsTick();
      }
    });

    hoverArea.addEventListener('pointermove', (e) => {
      const bounds = getCardCenter();
      updateLight(e.clientX, e.clientY, bounds);

      if (!isDragging && !isSwinging) {
        const deltaX = (e.clientX - bounds.x) / (bounds.width / 2);
        const deltaY = (e.clientY - bounds.y) / (bounds.height / 2);

        targetRotateY = Math.max(-24, Math.min(24, deltaX * 20));
        targetRotateX = Math.max(-22, Math.min(22, -deltaY * 18));
        targetRotateZ = Math.max(-6, Math.min(6, deltaX * 5));
        requestPhysicsTick();
      }
    });

    // Pointer down: initiate drag
    cardWrapper.addEventListener('pointerdown', (e) => {
      isDragging = true;
      isSwinging = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragDist = 0;
      cardWrapper.style.transition = 'none';
      e.preventDefault();
      requestPhysicsTick();
    });

    // Window pointer move when dragging
    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      dragDist = Math.hypot(dx, dy);

      targetTranslateX = dx * 0.65;
      targetTranslateY = Math.max(-20, dy * 0.55);

      targetRotateZ = Math.max(-30, Math.min(30, dx * 0.15));
      targetRotateX = Math.max(-20, Math.min(25, dy * 0.1));
      targetRotateY = Math.max(-25, Math.min(25, dx * 0.1));

      const bounds = getCardCenter();
      updateLight(e.clientX, e.clientY, bounds);
      requestPhysicsTick();
    });

    // Pointer up: release with swing or flip
    window.addEventListener('pointerup', () => {
      if (!isDragging) return;
      isDragging = false;

      // If clicked with minimal movement: FLIP
      if (dragDist < 7) {
        isFlipped = !isFlipped;
        card3D.classList.toggle('flipped', isFlipped);
        targetTranslateX = 0;
        targetTranslateY = 0;
        targetRotateZ = 0;
        requestPhysicsTick();
        return;
      }

      // If dragged significantly: start pendulum swing
      isSwinging = true;
      swingAngle = targetRotateZ;
      swingVelocity = (targetTranslateX / 12);
      requestPhysicsTick();
    });

    // Flip button hints
    const flipHints = document.querySelectorAll('.flip-hint');
    flipHints.forEach(hint => {
      hint.addEventListener('click', (e) => {
        e.stopPropagation();
        isFlipped = !isFlipped;
        card3D.classList.toggle('flipped', isFlipped);
        requestPhysicsTick();
      });
    });

    // Physics Animation Loop - on demand to conserve CPU and GPU cycles
    let lastTime = performance.now();
    let physicsFrameId = null;

    function requestPhysicsTick() {
      if (!physicsFrameId) {
        lastTime = performance.now();
        physicsFrameId = requestAnimationFrame(animatePhysics);
      }
    }

    function animatePhysics(time) {
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      if (isSwinging) {
        const springK = 35;
        const damping = 3.5;
        const accel = -springK * swingAngle - damping * swingVelocity;

        swingVelocity += accel * dt;
        swingAngle += swingVelocity * dt;

        targetRotateZ = swingAngle;
        targetTranslateX = swingAngle * 3.5;
        targetTranslateY = Math.abs(swingAngle) * 0.8;
        targetRotateX = Math.abs(swingAngle) * 0.3;

        if (Math.abs(swingAngle) < 0.2 && Math.abs(swingVelocity) < 0.2) {
          isSwinging = false;
          targetRotateZ = 0;
          targetTranslateX = 0;
          targetTranslateY = 0;
          targetRotateX = 0;
        }
      }

      const lerpSpeed = isDragging ? 0.35 : 0.12;
      currentRotateX += (targetRotateX - currentRotateX) * lerpSpeed;
      currentRotateY += (targetRotateY - currentRotateY) * lerpSpeed;
      currentRotateZ += (targetRotateZ - currentRotateZ) * lerpSpeed;
      currentTranslateX += (targetTranslateX - currentTranslateX) * lerpSpeed;
      currentTranslateY += (targetTranslateY - currentTranslateY) * lerpSpeed;

      cardWrapper.style.transform = 
        'translate3d(' + currentTranslateX.toFixed(2) + 'px, ' + currentTranslateY.toFixed(2) + 'px, 0) ' +
        'rotateX(' + currentRotateX.toFixed(2) + 'deg) ' +
        'rotateY(' + currentRotateY.toFixed(2) + 'deg) ' +
        'rotateZ(' + currentRotateZ.toFixed(2) + 'deg)';

      const isMoving = isDragging || isSwinging ||
        Math.abs(targetRotateX - currentRotateX) > 0.05 ||
        Math.abs(targetRotateY - currentRotateY) > 0.05 ||
        Math.abs(targetRotateZ - currentRotateZ) > 0.05 ||
        Math.abs(targetTranslateX - currentTranslateX) > 0.05 ||
        Math.abs(targetTranslateY - currentTranslateY) > 0.05;

      if (isMoving) {
        physicsFrameId = requestAnimationFrame(animatePhysics);
      } else {
        physicsFrameId = null;
      }
    }

    // Initial settle
    requestPhysicsTick();
  }

  // --- 8. Software Mastery HUD & Dynamic Progress Bar Animation ---
  const hudPanel = document.getElementById('software-mastery-hud');
  const hudCollapseBtn = document.getElementById('hud-collapse-btn');
  const projectsModal = document.getElementById('projects-modal');
  const modalContainer = projectsModal ? projectsModal.querySelector('.projects-modal-container') : null;
  const modalBackdrop = document.getElementById('projects-modal-backdrop');
  const modalCloseX = document.getElementById('modal-close-x');
  const openModalBtns = document.querySelectorAll('#hero-open-projects-btn, #hud-open-modal-btn, [data-open-modal="projects"]');

  function playSoftwareMasteryAnimation() {
    const panel = document.getElementById('software-mastery-hud');
    if (!panel) return;
    const skillItems = panel.querySelectorAll('.hud-skill-item');

    // 1. Kill any existing running animations and reset to 0%
    skillItems.forEach(item => {
      const valEl = item.querySelector('.hud-skill-val');
      const fillEl = item.querySelector('.hud-bar-fill');
      if (fillEl && window.gsap) gsap.killTweensOf(fillEl);
      if (fillEl) fillEl.style.width = '0%';
      if (valEl) valEl.textContent = '0%';
    });

    // 2. Animate with slower, smoother, more deliberate pacing (~2.5s duration)
    const animDuration = 2.5;

    skillItems.forEach((item, index) => {
      const valEl = item.querySelector('.hud-skill-val');
      const fillEl = item.querySelector('.hud-bar-fill');
      if (!valEl || !fillEl) return;

      const target = parseInt(item.getAttribute('data-target') || valEl.getAttribute('data-target') || '80', 10);
      const delay = index * 0.1;

      if (window.gsap) {
        // Animate fill bar width from 0% to target%
        gsap.to(fillEl, {
          width: target + '%',
          duration: animDuration,
          ease: 'power2.out',
          delay: delay
        });

        // Animate counter text smoothly from 0% to target%
        const counter = { val: 0 };
        gsap.to(counter, {
          val: target,
          duration: animDuration,
          ease: 'power2.out',
          delay: delay,
          onUpdate: () => {
            valEl.textContent = Math.round(counter.val) + '%';
          }
        });
      } else {
        // Fallback animation
        const startTime = performance.now() + (delay * 1000);
        const durationMs = animDuration * 1000;

        function animateCount(now) {
          if (now < startTime) {
            requestAnimationFrame(animateCount);
            return;
          }
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / durationMs, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.round(easeOut * target);

          fillEl.style.width = (easeOut * target) + '%';
          valEl.textContent = currentVal + '%';

          if (progress < 1) {
            requestAnimationFrame(animateCount);
          } else {
            fillEl.style.width = target + '%';
            valEl.textContent = target + '%';
          }
        }
        requestAnimationFrame(animateCount);
      }
    });
  }

  function resetSoftwareMasteryAnimation() {
    const panel = document.getElementById('software-mastery-hud');
    if (!panel) return;
    const skillItems = panel.querySelectorAll('.hud-skill-item');
    skillItems.forEach(item => {
      const valEl = item.querySelector('.hud-skill-val');
      const fillEl = item.querySelector('.hud-bar-fill');
      if (fillEl) {
        if (window.gsap) gsap.killTweensOf(fillEl);
        fillEl.style.width = '0%';
      }
      if (valEl) {
        valEl.textContent = '0%';
      }
    });
  }

  // Trigger on load if already in viewport
  setTimeout(() => {
    const hud = document.getElementById('software-mastery-hud');
    if (hud) {
      const rect = hud.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        hud.classList.add('in-view');
        playSoftwareMasteryAnimation();
      }
    }
  }, 250);

  // Trigger whenever user navigates or clicks navigation link leading to About / Software Mastery
  const aboutNavLinks = document.querySelectorAll('a[href="#about"], a[href="#software-mastery-hud"]');
  aboutNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => {
        playSoftwareMasteryAnimation();
      }, 400);
    });
  });

  // Trigger on URL hashchange
  window.addEventListener('hashchange', () => {
    if (location.hash === '#about' || location.hash === '#software-mastery-hud') {
      setTimeout(() => {
        playSoftwareMasteryAnimation();
      }, 300);
    }
  });

  // Click on header to replay
  const hudHeader = document.querySelector('.hud-header');
  if (hudHeader) {
    hudHeader.addEventListener('click', () => {
      playSoftwareMasteryAnimation();
    });
  }

  // HUD Collapse / Expand
  if (hudPanel && hudCollapseBtn) {
    hudCollapseBtn.addEventListener('click', () => {
      hudPanel.classList.toggle('minimized');
    });
  }

  // Open Projects Modal with GSAP animation
  function openProjectsModal() {
    if (!projectsModal) return;
    projectsModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Auto-play modal videos if any
    const modalVideos = projectsModal.querySelectorAll('video');
    modalVideos.forEach(v => {
      v.play().catch(() => {});
    });

    if (window.gsap) {
      gsap.killTweensOf([projectsModal, modalContainer]);
      gsap.fromTo(projectsModal, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      if (modalContainer) {
        gsap.fromTo(modalContainer,
          { scale: 0.9, y: 25, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.5)' }
        );
      }
      const cards = projectsModal.querySelectorAll('.gallery-card');
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.15 }
        );
      }
    } else {
      projectsModal.classList.add('active');
    }
  }

  // Close Projects Modal with GSAP fade out
  function closeProjectsModal() {
    if (!projectsModal || projectsModal.style.display === 'none') return;

    const modalVideos = projectsModal.querySelectorAll('video');
    modalVideos.forEach(v => {
      v.pause();
      v.currentTime = 0;
    });

    if (window.gsap) {
      if (modalContainer) {
        gsap.to(modalContainer, {
          scale: 0.92,
          y: 15,
          opacity: 0,
          duration: 0.22,
          ease: 'power2.in'
        });
      }
      gsap.to(projectsModal, {
        opacity: 0,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => {
          projectsModal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    } else {
      projectsModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  // Attach open triggers
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openProjectsModal();
    });
  });

  // Attach close triggers
  if (modalCloseX) {
    modalCloseX.addEventListener('click', closeProjectsModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeProjectsModal);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectsModal && projectsModal.style.display === 'flex') {
      closeProjectsModal();
    }
  });

  // =========================================================
  // --- 10. Portfolio Lightbox & Multi-Slide Carousel Engine ---
  // =========================================================
  const lightboxModal = document.getElementById('portfolio-lightbox-modal');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');
  const lightboxActiveImg = document.getElementById('lightbox-active-img');
  const lightboxActiveVideo = document.getElementById('lightbox-active-video');
  const lightboxCarouselBar = document.getElementById('lightbox-carousel-bar');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxDots = document.getElementById('lightbox-dots');
  const lightboxCategoryBadge = document.getElementById('lightbox-category-badge');
  const lightboxClientName = document.getElementById('lightbox-client-name');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');

  let currentSlides = [];
  let currentSlideIdx = 0;

  function updateLightboxSlide(index) {
    if (!currentSlides.length) return;
    currentSlideIdx = (index + currentSlides.length) % currentSlides.length;
    const mediaSrc = currentSlides[currentSlideIdx];

    const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(mediaSrc);
    if (isVideo) {
      if (lightboxActiveImg) lightboxActiveImg.style.display = 'none';
      if (lightboxActiveVideo) {
        lightboxActiveVideo.style.display = 'block';
        lightboxActiveVideo.src = mediaSrc;
        lightboxActiveVideo.currentTime = 0;
        lightboxActiveVideo.play().catch(() => {});
      }
    } else {
      if (lightboxActiveVideo) {
        lightboxActiveVideo.style.display = 'none';
        lightboxActiveVideo.pause();
        lightboxActiveVideo.removeAttribute('src');
        lightboxActiveVideo.load();
      }
      if (lightboxActiveImg) {
        lightboxActiveImg.style.display = 'block';

        if (window.gsap) {
          gsap.to(lightboxActiveImg, {
            opacity: 0,
            scale: 0.97,
            duration: 0.15,
            onComplete: () => {
              lightboxActiveImg.src = mediaSrc;
              gsap.to(lightboxActiveImg, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' });
            }
          });
        } else {
          lightboxActiveImg.src = mediaSrc;
        }
      }
    }

    // Update counter
    if (lightboxCounter) {
      lightboxCounter.textContent = `Slide ${currentSlideIdx + 1} / ${currentSlides.length}`;
    }

    // Update dots
    if (lightboxDots) {
      const dots = lightboxDots.querySelectorAll('.lightbox-dot');
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === currentSlideIdx);
      });
    }
  }

  function openLightbox(card) {
    if (!lightboxModal) return;

    // Read attributes
    const title = card.getAttribute('data-title') || card.querySelector('.project-title')?.textContent || '';
    const client = card.getAttribute('data-client') || card.querySelector('.project-client')?.textContent || '';
    const desc = card.getAttribute('data-desc') || card.querySelector('.project-desc')?.textContent || '';
    const badge = card.querySelector('.project-category-badge')?.textContent || 'PORTFOLIO';

    const slidesAttr = card.getAttribute('data-slides');
    if (slidesAttr) {
      try {
        currentSlides = JSON.parse(slidesAttr);
      } catch (e) {
        const img = card.querySelector('.project-img');
        const vid = card.querySelector('.project-video');
        currentSlides = img ? [img.src] : (vid ? [vid.currentSrc || vid.querySelector('source')?.src || vid.getAttribute('src')] : []);
      }
    } else {
      const img = card.querySelector('.project-img');
      const vid = card.querySelector('.project-video');
      currentSlides = img ? [img.src] : (vid ? [vid.currentSrc || vid.querySelector('source')?.src || vid.getAttribute('src')] : []);
    }

    if (!currentSlides.length) return;

    // Set text info
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxClientName) lightboxClientName.textContent = client;
    if (lightboxDesc) lightboxDesc.textContent = desc;
    if (lightboxCategoryBadge) lightboxCategoryBadge.textContent = badge;

    // Handle carousel controls visibility
    const isMultiSlide = currentSlides.length > 1;
    if (lightboxPrevBtn) lightboxPrevBtn.style.display = isMultiSlide ? 'flex' : 'none';
    if (lightboxNextBtn) lightboxNextBtn.style.display = isMultiSlide ? 'flex' : 'none';
    if (lightboxCarouselBar) lightboxCarouselBar.style.display = isMultiSlide ? 'flex' : 'none';

    // Build dots
    if (lightboxDots && isMultiSlide) {
      lightboxDots.innerHTML = '';
      currentSlides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = `lightbox-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => updateLightboxSlide(i));
        lightboxDots.appendChild(dot);
      });
    }

    currentSlideIdx = 0;
    updateLightboxSlide(0);

    lightboxModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    lightboxModal.classList.add('active');

    if (window.gsap) {
      gsap.killTweensOf(lightboxModal);
      gsap.fromTo(lightboxModal, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'power2.out' });
      const wrap = lightboxModal.querySelector('.lightbox-content');
      if (wrap) {
        gsap.fromTo(wrap, { scale: 0.92, y: 20 }, { scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.4)' });
      }
    }
  }

  function closeLightbox() {
    if (!lightboxModal || lightboxModal.style.display === 'none') return;

    lightboxModal.classList.remove('active');

    if (window.gsap) {
      const wrap = lightboxModal.querySelector('.lightbox-content');
      if (wrap) {
        gsap.to(wrap, { scale: 0.92, y: 15, duration: 0.2, ease: 'power2.in' });
      }
      gsap.to(lightboxModal, {
        opacity: 0,
        duration: 0.24,
        ease: 'power2.in',
        onComplete: () => {
          lightboxModal.style.display = 'none';
          document.body.style.overflow = '';
          if (lightboxActiveVideo) {
            lightboxActiveVideo.pause();
            lightboxActiveVideo.removeAttribute('src');
            lightboxActiveVideo.load();
          }
        }
      });
    } else {
      lightboxModal.style.display = 'none';
      document.body.style.overflow = '';
      if (lightboxActiveVideo) {
        lightboxActiveVideo.pause();
        lightboxActiveVideo.removeAttribute('src');
        lightboxActiveVideo.load();
      }
    }
  }

  // Attach card click handlers
  const allCards = document.querySelectorAll('.project-card');
  allCards.forEach(card => {
    card.addEventListener('click', () => openLightbox(card));
  });

  // Prev / Next buttons
  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxSlide(currentSlideIdx - 1);
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxSlide(currentSlideIdx + 1);
    });
  }

  // Close triggers
  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || lightboxModal.style.display === 'none') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightboxSlide(currentSlideIdx - 1);
    if (e.key === 'ArrowRight') updateLightboxSlide(currentSlideIdx + 1);
  });

  // Touch Swipe for mobile carousel
  let touchStartX = 0;
  let touchEndX = 0;
  const stage = document.querySelector('.lightbox-media-stage');
  if (stage) {
    stage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        updateLightboxSlide(currentSlideIdx + 1); // Swipe left
      } else if (touchEndX - touchStartX > 50) {
        updateLightboxSlide(currentSlideIdx - 1); // Swipe right
      }
    }, { passive: true });
  }

  // --- 8. Bilingual Language Switcher (Indonesian & English) ---
  const translations = {
    id: {
      nav_about: "About",
      nav_services: "Layanan",
      nav_portfolio: "Portofolio",
      nav_experience: "Pengalaman",
      nav_testimonials: "Testimoni",
      nav_contact: "Kontak",
      hero_badge: "CREATIVE WORKER • TANGERANG, INDONESIA",
      hero_tagline: "Saya senang mengubah masalah-masalah kompleks menjadi desain yang sederhana, indah, dan intuitif. Berpengalaman 5+ tahun mengerjakan proyek kreatif untuk brand &amp; perusahaan ternama.",
      hero_btn_portfolio: "Lihat Portofolio",
      hero_btn_wa: "Hubungi via WhatsApp",
      about_badge: "Profil Kreatif",
      about_title: "Tentang Saya",
      about_subtitle: "Desainer ahli yang siap menyelesaikan berbagai kebutuhan kreatif Anda dengan standar profesional tertinggi.",
      card_flip_hint_1: "Klik kartu untuk membalik",
      card_terms: "Lencana verifikasi resmi portofolio Muhammad Fadhli untuk layanan Graphic Design, Video Editing, Motion &amp; 3D Spatial.",
      card_flip_hint_2: "Klik untuk kembali",
      about_quote: '"Orang mencari desainer ahli untuk menyelesaikan pekerjaan mereka, dan saya hadir untuk memberikan solusi visual terbaik."',
      about_body: 'Saya adalah pekerja kreatif berbasis di Cisauk, Tangerang, Indonesia. Dengan pengalaman lebih dari 5 tahun, saya telah merancang kartu bisnis berkualitas tinggi, identitas logo, visual media sosial, motion graphics, video komersial, hingga 3D booth &amp; stage design untuk berbagai korporasi besar seperti <strong>PT. MAP Tbk</strong>, <strong>Citiasia.inc</strong>, <strong>PT. Tribrata Surya Mandiri Land</strong>, dan <strong>PT. Merpati Mahardika</strong>.',
      metric_exp: "Tahun Pengalaman",
      metric_projects: "Proyek Selesai",
      metric_clients: "Klien Korporat",
      metric_quality: "Dedikasi Kualitas",
      hud_badge: "Tingkat Kemahiran Alat &amp; Perangkat Kreatif",
      services_badge: "Layanan Utama",
      services_title: "Layanan Keahlian",
      services_subtitle: "Menghadirkan solusi kreatif holistik dari desain identitas, video komersial, motion dinamis, hingga pemodelan 3D spasial.",
      services_hint: "Klik salah satu kartu untuk mode fokus visual (seperti Google Flow)",
      services_focus: "Fokus",
      service_1_desc: "Membuat desain modern dan berkualitas tinggi dengan standar estetika profesional: logo, kartu bisnis, poster, flyer, dan identitas brand.",
      service_2_desc: "Menghasilkan konten video berkualitas tinggi dengan pacing dinamis, color grading sinematik, dan audio mixing untuk YouTube &amp; korporasi.",
      service_3_desc: "Mendesain animasi motion graphics yang atraktif serta pemodelan 3D interior, panggung (*stage*), dan *booth exhibition* fotorealistik.",
      service_4_desc: "Membuat desain website modern, simpel, dan elegan yang berpusat pada kenyamanan pengguna (*user-friendly*) dan konversi visual.",
      portfolio_badge: "Koleksi Karya",
      portfolio_title: "Portofolio Terpilih",
      portfolio_subtitle: "Proyek-proyek kurasi mencakup desain 3D, identitas brand, visual media sosial, motion graphics, dan materi promosi korporat.",
      filter_all: "Semua Proyek",
      filter_3d: "3D & Spatial",
      filter_logo: "Branding & Logo",
      filter_social: "Social Media",
      filter_motion: "Motion & Video",
      filter_print: "Flyer & Poster",
      load_more_btn: "Lihat Lebih Banyak",
      pricing_badge: "Kolaborasi",
      pricing_title: "Collaboration Plans",
      pricing_subtitle: "Pilih model kerja sama yang paling sesuai dengan skala dan kebutuhan kreatif proyek Anda.",
      pricing_plan1_badge: "Satuan / Proyek",
      plan1_f1: "Desain Logo &amp; Brand Identity",
      plan1_f2: "Video Editing komersial / YouTube",
      plan1_f3: "Flyer, Brosur, &amp; Poster Promosi",
      plan1_f4: "Desain 3D Booth / Stage Exhibition",
      plan1_f5: "Maksimal 3x revisi minor",
      plan1_f6: "File master format lengkap (AI/PSD/MP4)",
      pricing_plan1_btn: "Diskusikan Proyek",
      pricing_plan2_badge: "Terpopuler",
      plan2_f1: "Kebutuhan desain &amp; video bulanan rutin",
      plan2_f2: "15-30 konten visual sosial media",
      plan2_f3: "Video Reels / Shorts berkala",
      plan2_f4: "Dedicated turnaround time cepat",
      plan2_f5: "Prioritas revisi &amp; konsultasi langsung",
      plan2_f6: "Laporan progres berkala",
      pricing_plan2_btn: "Pilih Retainer",
      pricing_plan3_badge: "Dedicated / Tim",
      plan3_f1: "Dedikasi penuh untuk perusahaan/agensi",
      plan3_f2: "End-to-end creative production",
      plan3_f3: "Kolaborasi aktif dengan marketing team",
      plan3_f4: "Remote maupun on-site Tangerang/Jakarta",
      plan3_f5: "Manajemen brand kit komprehensif",
      plan3_f6: "Kontrak kerja sama fleksibel",
      pricing_plan3_btn: "Hubungi untuk Kontrak",
      faq_badge: "Tanya Jawab",
      faq_title: "Frequently Asked Questions",
      faq_subtitle: "Pertanyaan seputar proses kerja, software, serta teknis kolaborasi bersama saya.",
      faq_q1: "Software dan tools apa saja yang Anda gunakan?",
      faq_a1: "Saya menggunakan software standar industri: <strong>Adobe Photoshop</strong> &amp; <strong>Illustrator</strong> untuk desain grafis/vektor, <strong>Premiere Pro</strong> untuk video editing, <strong>After Effects</strong> untuk motion graphics, <strong>Figma</strong> untuk web/UI design, serta <strong>Blender / 3ds Max</strong> untuk pemodelan 3D dan rendering spasial.",
      faq_q2: "Berapa lama estimasi pengerjaan suatu proyek?",
      faq_a2: "Waktu pengerjaan bergantung pada kompleksitas dan ruang lingkup proyek. Untuk logo atau flyer biasanya membutuhkan 2–4 hari kerja. Video editing dan motion graphics berkisar 3–7 hari kerja, sedangkan proyek 3D booth/interior komprehensif berkisar 5–10 hari kerja.",
      faq_q3: "Apakah Anda menerima kerja sama secara remote?",
      faq_a3: "Ya, sebagian besar proyek saya dikerjakan secara remote dengan koordinasi yang intens melalui WhatsApp, Google Meet, Zoom, atau email. Untuk wilayah Jabodetabek (khususnya Tangerang &amp; Jakarta), pertemuan tatap muka (*on-site meeting*) juga sangat memungkinkan.",
      faq_q4: "Bagaimana ketentuan revisi dan penyerahan file akhir?",
      faq_a4: "Setiap proyek menyertakan revisi untuk memastikan hasil sesuai harapan Anda. Setelah disetujui, semua file master final (vektor AI/EPS/SVG, PSD, cetak PDF CMYK, MP4 resolusi tinggi, atau link cloud drive) akan diserahkan secara lengkap.",
      contact_badge: "Mari Terhubung",
      contact_title: "Get In Touch",
      contact_subtitle: "Tertarik mewujudkan proyek visual berikutnya? Hubungi saya langsung melalui kontak di bawah ini.",
      contact_email_lbl: "Email",
      contact_wa_lbl: "WhatsApp / Telp",
      contact_loc_lbl: "Lokasi",
      contact_loc_val: "Cisauk, Tangerang, Indonesia",
      footer_rights: "© 2026 Muhammad Fadhli. Seluruh hak cipta dilindungi."
    },
    en: {
      nav_about: "About",
      nav_services: "Services",
      nav_portfolio: "Portfolio",
      nav_experience: "Experience",
      nav_testimonials: "Testimonials",
      nav_contact: "Contact",
      hero_badge: "CREATIVE WORKER • TANGERANG, INDONESIA",
      hero_tagline: "I enjoy turning complex problems into simple, beautiful, and intuitive designs. With 5+ years of experience delivering high-impact creative solutions for leading brands &amp; corporate clients.",
      hero_btn_portfolio: "View Portfolio",
      hero_btn_wa: "Contact via WhatsApp",
      about_badge: "Creative Profile",
      about_title: "About Me",
      about_subtitle: "Expert designer dedicated to solving your creative challenges with the highest industry standards.",
      card_flip_hint_1: "Click card to flip",
      card_terms: "Official verified portfolio credential of Muhammad Fadhli for Graphic Design, Video Editing, Motion &amp; 3D Spatial services.",
      card_flip_hint_2: "Click to flip back",
      about_quote: '"People seek an expert designer to solve their challenges, and I deliver the finest visual solutions."',
      about_body: 'I am a creative professional based in Cisauk, Tangerang, Indonesia. With over 5 years of experience, I have crafted high-end business branding, logo identities, social media campaigns, motion graphics, commercial videos, and 3D booth/stage designs for reputable enterprises such as <strong>PT. MAP Tbk</strong>, <strong>Citiasia.inc</strong>, <strong>PT. Tribrata Surya Mandiri Land</strong>, and <strong>PT. Merpati Mahardika</strong>.',
      metric_exp: "Years Experience",
      metric_projects: "Projects Completed",
      metric_clients: "Corporate Clients",
      metric_quality: "Quality Dedication",
      hud_badge: "Creative Tool &amp; Software Proficiency",
      services_badge: "Core Services",
      services_title: "Services &amp; Capabilities",
      services_subtitle: "Delivering holistic creative solutions spanning brand identity, commercial video, dynamic motion, and spatial 3D architectural modeling.",
      services_hint: "Click any card for visual focus mode (Google Flow style)",
      services_focus: "Focus",
      service_1_desc: "Crafting modern, high-tier designs with professional aesthetics: logos, business cards, posters, flyers, and unified brand identities.",
      service_2_desc: "Producing top-tier video productions with rhythmic pacing, cinematic color grading, and crisp audio mixing for YouTube &amp; commercial enterprises.",
      service_3_desc: "Designing engaging motion graphics animations and photorealistic 3D interior, stage, and exhibition booth spatial architectural renderings.",
      service_4_desc: "Building modern, sleek, and intuitive web interfaces focused on seamless user experience, clean aesthetics, and visual conversion.",
      portfolio_badge: "Portfolio Showcase",
      portfolio_title: "Selected Works",
      portfolio_subtitle: "Curated showcase of 3D spatial renders, brand identities, social media assets, motion reels, and corporate promotional kits.",
      filter_all: "All Projects",
      filter_3d: "3D & Spatial",
      filter_logo: "Branding & Logo",
      filter_social: "Social Media",
      filter_motion: "Motion & Video",
      filter_print: "Flyer & Poster",
      load_more_btn: "Load More Projects",
      pricing_badge: "Collaboration",
      pricing_title: "Collaboration Plans",
      pricing_subtitle: "Choose the cooperation model best suited for your project scope and creative requirements.",
      pricing_plan1_badge: "Per Project",
      plan1_f1: "Logo &amp; Brand Identity Design",
      plan1_f2: "Commercial &amp; YouTube Video Editing",
      plan1_f3: "Flyers, Brochures, &amp; Promo Posters",
      plan1_f4: "3D Booth &amp; Stage Exhibition Design",
      plan1_f5: "Up to 3x minor revisions included",
      plan1_f6: "Complete master source files (AI/PSD/MP4)",
      pricing_plan1_btn: "Discuss Project",
      pricing_plan2_badge: "Most Popular",
      plan2_f1: "Ongoing monthly design &amp; video production",
      plan2_f2: "15–30 visual social media assets",
      plan2_f3: "Regular Reels / Shorts content",
      plan2_f4: "Dedicated quick turnaround time",
      plan2_f5: "Priority revisions &amp; direct consultation",
      plan2_f6: "Routine milestone &amp; progress reporting",
      pricing_plan2_btn: "Select Retainer",
      pricing_plan3_badge: "Dedicated / Team",
      plan3_f1: "Full-time dedication for agency/enterprise",
      plan3_f2: "End-to-end creative visual production",
      plan3_f3: "Active sync with internal marketing teams",
      plan3_f4: "Remote or on-site Tangerang / Greater Jakarta",
      plan3_f5: "Comprehensive brand kit governance",
      plan3_f6: "Flexible contractual arrangement",
      pricing_plan3_btn: "Inquire for Contract",
      faq_badge: "FAQ",
      faq_title: "Frequently Asked Questions",
      faq_subtitle: "Answers to common inquiries regarding creative process, tools, and collaboration details.",
      faq_q1: "Which software and tools do you use?",
      faq_a1: "I utilize industry-standard creative suites: <strong>Adobe Photoshop</strong> &amp; <strong>Illustrator</strong> for graphic/vector design, <strong>Premiere Pro</strong> for video editing, <strong>After Effects</strong> for motion graphics, <strong>Figma</strong> for UI/web interaction, and <strong>Blender / 3ds Max</strong> for 3D modeling and spatial rendering.",
      faq_q2: "What is the typical project turnaround time?",
      faq_a2: "Turnaround depends on project scope and complexity. Logo and promotional flyers usually take 2–4 business days. Video editing and motion graphics range from 3–7 days, while comprehensive 3D booth and interior visualizations take 5–10 business days.",
      faq_q3: "Do you accept remote collaboration?",
      faq_a3: "Yes, the majority of my projects are conducted remotely with close coordination via WhatsApp, Google Meet, Zoom, or email. For clients in the Greater Jakarta &amp; Tangerang area, on-site meetings can also be scheduled.",
      faq_q4: "How do revisions and final asset delivery work?",
      faq_a4: "Every project includes revisions to guarantee total satisfaction. Upon final approval, all source master files (vector AI/EPS/SVG, PSD, print-ready CMYK PDF, high-res MP4, or cloud drive delivery) are handed over completely.",
      contact_badge: "Get Connected",
      contact_title: "Get In Touch",
      contact_subtitle: "Ready to realize your next visual vision? Reach out directly via the contact points below.",
      contact_email_lbl: "Email",
      contact_wa_lbl: "WhatsApp / Phone",
      contact_loc_lbl: "Location",
      contact_loc_val: "Cisauk, Tangerang, Indonesia",
      footer_rights: "© 2026 Muhammad Fadhli. All rights reserved."
    }
  };

  // --- Portfolio Project Descriptions & Modals Bilingual Dictionary ---
  const projectTranslations = {
    "Redesign Meeting Room Orchid": {
      id: "Perancangan visual 3D interior ruang rapat modern dengan pencahayaan arsitektural dan layout spasial fungsional.",
      en: "Modern 3D interior visual design of corporate meeting rooms with architectural ambient lighting and functional spatial layout."
    },
    "Exhibition Booth 3D": {
      id: "Desain panggung pameran dan booth interaktif bertema korporat dengan tata letak display produk maksimal.",
      en: "Interactive 3D corporate exhibition booth and stage design featuring optimized product display circulation."
    },
    "Paguyuban Cisauk Stage Design": {
      id: "Konsep 3D backdrop panggung acara kebudayaan dan panggung hiburan outdoor berskala besar.",
      en: "Large-scale 3D stage backdrop concept for outdoor cultural events and community celebrations."
    },
    "TSM Land Serpong Brand Identity": {
      id: "Pengembangan logo dan identitas merek visual untuk pengembang properti kawasan residensial Serpong.",
      en: "Comprehensive logo design and visual brand identity for a premium Serpong residential developer."
    },
    "MAP Flash Brand Kit": {
      id: "Identitas grafis internal platform pembelajaran dan komunikasi karyawan ritel grup MAP Tbk.",
      en: "Internal visual brand kit and graphics for retail employee e-learning platform at MAP Group Tbk."
    },
    "Awtomotive YouTube Branding": {
      id: "Desain logo, banner channel, dan motion bumper intro untuk media otomotif digital.",
      en: "Logo identity, channel art banner, and animated bumper intro for digital automotive media."
    },
    "Property Showcase Feeds": {
      id: "Rangkaian postingan Instagram feed bertema elegan untuk promosi hunian klaster modern.",
      en: "Curated Instagram feed suite showcasing modern residential clusters with clean, elegant aesthetics."
    },
    "Citiasia Smart Society Series": {
      id: "Animasi motion graphics 2D informatif untuk kampanye transformasi digital dan smart city.",
      en: "Informative 2D motion graphics series for digital transformation and smart city initiative campaigns."
    },
    "Corporate Learning Animation": {
      id: "Serial motion graphics interaktif untuk modul pelatihan karyawan multi-brand ritel.",
      en: "Interactive motion graphics series tailored for multi-brand retail employee training modules."
    },
    "Residential Marketing Brochure": {
      id: "Flyer dan brosur penjualan cetak format lipat tiga dengan spesifikasi denah & fasilitas lengkap.",
      en: "Tri-fold print marketing brochures and sales flyers complete with floor plans & amenity specs."
    },
    "Swab.clinic Visual Identity": {
      id: "Identitas merek layanan kesehatan modern, higienis, dan terpercaya dengan sistem logo minimalis.",
      en: "Modern, hygienic visual brand identity system and logo design for healthcare services."
    },
    "Lapak Gemoy Campaign": {
      id: "Materi promosi sosial media visual warna-warni yang menggugah selera untuk UMKM kuliner.",
      en: "Vibrant, appetizing social media promotional campaign for culinary small-to-medium enterprise."
    },
    "Performante Ceramic Coating & Edu-Feeds": {
      id: "Desain visual feeds & carousel edukatif kampanye nano ceramic coating, PPF, dan diferensiasi Clear Vision untuk luxury automotive.",
      en: "Educational social feeds & carousels highlighting nano-ceramic coating, PPF, and Clear Vision technology for luxury automotive."
    },
    "Vansgard PPF Protection Campaign": {
      id: "Visual kampanye komprehensif pelindung cat kendaraan (PPF) seri Matte & Supersafe dengan tipografi tegas dan estetika modern.",
      en: "Comprehensive automotive paint protection film (PPF) campaign showcasing Matte & Supersafe series with sleek modern typography."
    },
    "Rantiz Detailing Social Feeds": {
      id: "Materi feeds Instagram promosi salon mobil profesional dengan kombinasi tipografi tegas, penawaran musiman, dan edukasi cat kendaraan.",
      en: "Instagram feed assets for professional auto detailing studio combining bold typography, seasonal promos, and paint care education."
    },
    "Deluxe Auto Care Promo Campaign": {
      id: "Desain visual promosi berkala & paket detailing kendaraan beresolusi tinggi dengan tata letak minimalis dan copywriting terstruktur.",
      en: "High-resolution promotional visuals & auto detailing packages crafted with minimalist layout and compelling copywriting."
    },
    "Blackstone Heat Rejection Series": {
      id: "Konten edukasi media sosial mengenai keunggulan teknologi tolak panas kaca film premium untuk kenyamanan berkendara di iklim tropis.",
      en: "Educational social series on premium solar window film heat-rejection technology for tropical driving comfort."
    },
    "Car Care & PPF Educational Carousel": {
      id: "Format carousel multi-slide edukatif informatif: panduan perawatan PPF, tips kilap mobil tanpa salon, dan edukasi pencegahan baret cat.",
      en: "Informative multi-slide carousel guides: PPF maintenance rules, DIY car gloss tips, and swirl-scratch prevention."
    },
    "Adem Sepanjang Jalan Series": {
      id: "Serial kampanye visual media sosial dengan fokus kenyamanan kabin adem berkendara di bawah terik matahari menggunakan kaca film premium.",
      en: "Social media visual campaign emphasizing serene, cool cabin temperatures under intense sun with premium tint."
    },
    "Architectural Solar Film Commercial Reel": {
      id: "Video komersial arsitektural resolusi tinggi yang menampilkan aplikasi kaca film tolak panas premium pada fasad hunian mewah dan modern villa.",
      en: "High-definition architectural film commercial highlighting premium heat-rejecting window films on luxury modern villa facades."
    },
    "Residential UV Protection Video Showcase": {
      id: "Produksi video vertikal komersial (Reels) mengenai efisiensi penolakan radiasi UV dan kenyamanan suhu ruangan pada hunian residensial modern.",
      en: "Vertical video production (Reels) demonstrating UV radiation rejection efficiency and indoor thermal comfort for modern residences."
    },
    "TSM Land Serpong Lifestyle & Promo Reel": {
      id: "Konten video reels Instagram promosi properti dengan dynamic pacing, subtitle motion, dan penawaran New Year Deal hunian eksklusif Serpong.",
      en: "Instagram real estate promo reel featuring dynamic pacing, animated kinetic subtitles, and Serpong New Year Deal offers."
    },
    "3D Spatial & Architecture Cinematic Walkthrough": {
      id: "Animasi video rendering 3D sinematik menjelajahi rancangan ruang interior dan fasad arsitektur dengan pencahayaan fotorealistik dan material presisi.",
      en: "Cinematic 3D architectural walkthrough animation exploring spatial interior layouts and facades with photorealistic lighting."
    },
    "Cluster Pinus Modern Townhouse Exterior 3D": {
      id: "Visualisasi 3D eksterior fotorealistik perumahan 2 lantai Cluster Pinus dengan kanopi modern, pencahayaan alami Enscape, dan penataan lanskap hijau.",
      en: "Photorealistic 3D exterior render of Cluster Pinus 2-story townhouses with modern canopies, natural Enscape lighting, and lush landscaping."
    },
    "Mediterranean Arch Commercial Shophouse 3D": {
      id: "Visualisasi 3D ruko komersial 2 lantai dengan fasad lengkung arsitektur Mediterania, kisi kayu vertikal, dan area parkir terintegrasi.",
      en: "3D architectural rendering of 2-story commercial shophouses featuring Mediterranean arches, vertical timber slats, and integrated parking."
    },
    "SOL Retail Store & Modern Apparel Display 3D": {
      id: "Perancangan 3D interior toko pakaian modern industrial dengan struktur display kayu, lighting spotlight terarah, dan kasir ergonomis.",
      en: "Modern industrial retail apparel store interior design featuring timber display shelving, directional spotlighting, and checkout counter."
    },
    "Gallardo Modern Canopy & Carport Architectural 3D": {
      id: "Visualisasi 3D eksterior struktur kanopi carport modern dengan rangka baja presisi, pencahayaan indirect LED, kisi-kisi kayu, dan integrasi lanskap hunian mewah.",
      en: "Architectural 3D render of modern luxury carport canopy featuring precision steel framing, indirect LED lighting, and landscape integration."
    },
    "Grand Villa Tropical Modern Exterior & Interior 3D": {
      id: "Rangkaian 9 render visual Enscape 3D fotorealistik menyeluruh: eksplorasi fasad geometris modern tropis, roof terrace, dan tata ruang open-plan interior ruang keluarga.",
      en: "Complete 9-slide photorealistic 3D visualization suite: modern tropical geometric villa facade, rooftop terrace, and open-plan living interior."
    },
    "Cinematic 3D Architectural Walkthrough Video": {
      id: "Animasi walkthrough 3D sinematik dinamis memperlihatkan transisi pencahayaan natural waktu nyata, detail tekstur material arsitektur, dan pergerakan kamera halus menyusuri setiap sudut ruang.",
      en: "Dynamic 3D cinematic architectural walkthrough showing real-time lighting transitions, material textures, and fluid camera sweeps."
    },
    "4-Story Contemporary Residence Comprehensive 3D Architecture": {
      id: "Visualisasi 3D komprehensif 12 slide bangunan residensial modern 4 lantai: fasad depan ultra-modern, master bedroom elegan, courtyard taman dalam, tangga melayang, dan detail material pencahayaan fotorealistik.",
      en: "12-slide comprehensive 3D architecture for a 4-story contemporary luxury residence: ultra-modern facade, master suite, internal courtyard, and floating stairs."
    },
    "H.O.G. Official Event Flag & Chapter Identity": {
      id: "Perancangan visual bendera resmi Harley Owners Group (H.O.G.) Indomobil Jakarta Chapter Indonesia dengan motif racing checkered flag dan elang legendaris.",
      en: "Official flag and emblem design for Harley Owners Group (H.O.G.) Indomobil Jakarta Chapter Indonesia featuring iconic eagle & racing checks."
    },
    "Pesta Rakyat Cisauk Girang Event Campaign": {
      id: "Rangkaian poster dan flyer acara peringatan HUT RI ke-81: turnamen esports Mobile Legends & PES, lomba tari budaya, jalan santai, dan malam puncak seni.",
      en: "Event branding posters and flyers for national celebration: esports tournaments, traditional dance, fun walk, and gala night."
    },
    "TSM Land Serpong Street Light Pole T-Banner": {
      id: "Desain promosi vertikal outdoor tiang jalan boulevard utama untuk kampanye penjualan hunian residensial, promo cicilan, dan extra hadiah.",
      en: "Outdoor boulevard streetlight vertical T-banner campaign promoting Serpong residential developments, financing deals, and rewards."
    },
    "Mandiri Steel Building Materials Edu-Carousel": {
      id: "Serial carousel Instagram informatif mengenai tips pemilihan baja ringan, besi beton, dan spesifikasi material konstruksi untuk proyek bangunan.",
      en: "Educational Instagram carousel series on light steel framing, rebar specifications, and construction material standards."
    },
    "Resort 60 H Ciputat Living Campaign": {
      id: "Visual promosi hunian bertema resort modern tropis di pusat kota Ciputat dengan penawaran cicilan dan skema booking fee kompetitif.",
      en: "Promotional campaign for tropical resort-style residential estate in central Ciputat featuring flexible booking fee schemes."
    },
    "Raysah Fashion E-Commerce Banner & Feeds": {
      id: "Materi visual etalase digital Shopee dan kampanye promo musiman (Big Sale Ramadan, 11.11, 12.12) untuk brand busana muslimah elegan.",
      en: "Digital storefront banners and seasonal campaign visuals (Ramadan Big Sale, 11.11, 12.12) for elegant modest fashion brand."
    },
    "TSM Land 'Kreasikan Rumah Impianmu' Series": {
      id: "Rangkaian postingan carousel interaktif 6 slide mengenai fleksibilitas denah rumah 2 lantai, 3 kamar tidur, dan fitur smart home security.",
      en: "6-slide interactive social carousel on 2-story home layout flexibility, 3-bedroom configurations, and smart security integrations."
    },
    "Villa Architectural Film Commercial": {
      id: "Produksi video promosi sinematik kaca film arsitektural villa mewah dengan ritme dinamis, footage premium, dan visual storytelling yang tajam.",
      en: "Cinematic architectural film commercial highlighting luxury modern villa glass tints with dynamic pacing, premium footage, and sharp visual storytelling."
    },
    "Pinus Modern Townhouse 3D Exterior": {
      id: "Visualisasi arsitektur 3D fasad perumahan modern tropis dengan pencahayaan natural ambient Enscape, material bata ekspos, dan lanskap asri.",
      en: "Photorealistic 3D architectural rendering of tropical modern townhouse facades with Enscape ambient lighting, exposed brickwork, and lush landscaping."
    },
    "Clear Vision & Coating Feeds": {
      id: "Sistem aset promosi visual menyeluruh untuk Instagram studio otomotif mewah, menonjolkan fitur pelindung cat & diferensiasi Clear Vision.",
      en: "Comprehensive visual promotion suite for luxury auto detailing Instagram, highlighting paint protection features and Clear Vision differentiation."
    },
    "Interactive Web UI": {
      id: "Antarmuka website modern bertema dark mode dengan perpaduan glassmorphism, micro-interactions responsif, dan struktur navigasi intuitif.",
      en: "Modern dark-mode website interface crafted with refined glassmorphism, responsive micro-interactions, and intuitive navigation structure."
    },
    "Sinar Mega Abadi Architectural Window Film Master Film": {
      id: "Produksi video komersial arsitektural sinematik instalasi kaca film tolak panas premium untuk villa mewah dan fasad residensial modern.",
      en: "Cinematic architectural commercial video highlighting premium solar film installation for luxury villas and modern residential facades."
    },
    "Sinar Mega Abadi Residential Heat-Shield Showcase": {
      id: "Video komersial uji efisiensi kaca film terhadap penolakan radiasi ultraviolet dan penjagaan kenyamanan suhu ruangan hunian.",
      en: "Commercial video demonstrating window film efficiency in rejecting ultraviolet radiation and maintaining comfortable indoor temperatures."
    },
    "Sinar Mega Abadi Commercial Window Tint Reel": {
      id: "Produksi video promosi vertikal media sosial menampilkan ketelitian proses instalasi kaca film kaca arsitektural.",
      en: "Vertical social media promotional video highlighting the precision craftsmanship of architectural window film installation."
    },
    "TSM Land Serpong — Vibe & Me-Time Living Reel": {
      id: "Video reels storytelling sinematik: 'Rumah bukan cuma bangunan, tapi soal vibe dan me-time yang gak bisa ditawar'.",
      en: "Cinematic storytelling reel: 'A home is more than just a building—it is about an uncompromising vibe and quality me-time'."
    },
    "TSM Land Serpong — Modal 1 Juta Rumah 2 Lantai": {
      id: "Video promosi kreatif program kemudahan kepemilikan hunian 2 lantai eksklusif dengan booking fee 1 juta rupiah.",
      en: "Creative promotional video for exclusive 2-story home ownership with an accessible 1 million IDR booking fee program."
    },
    "TSM Land Serpong — Cluster Living Experience Reel": {
      id: "Reels eksplorasi keunggulan kawasan klaster hunian Serpong dengan penataan lanskap hijau dan infrastruktur modern.",
      en: "Exploratory reel showcasing the advantages of Serpong cluster living with lush green landscaping and modern infrastructure."
    },
    "TSM Land Serpong — Smart Home & Security Features": {
      id: "Video reel interaktif menonjolkan sistem keamanan pintar dan kenyamanan teknologi smart home untuk keluarga modern.",
      en: "Interactive reel spotlighting intelligent security systems and smart home convenience tailored for modern family living."
    },
    "TSM Land Serpong — Family Space & Room Layout Tour": {
      id: "Video tur ruang keluarga dan kamar tidur utama dengan pencahayaan hangat dan sirkulasi udara optimal.",
      en: "Video walkthrough of family living spaces and the master bedroom featuring warm ambient lighting and optimal airflow."
    },
    "TSM Land Serpong — Modern Serpong Lifestyle Reel": {
      id: "Sorotan gaya hidup dinamis hunian strategis di Serpong dekat akses tol dan pusat perbelanjaan ternama.",
      en: "Highlights of dynamic suburban lifestyle in a prime Serpong location with immediate highway access and major shopping hubs."
    },
    "TSM Land Serpong — Architectural Detail & Interior Tour": {
      id: "Detail finishing arsitektural hunian 2 lantai: pemilihan material premium, lantai granit, dan void plafon tinggi.",
      en: "Architectural finishing details of the 2-story home: premium curated materials, polished granite flooring, and airy high ceilings."
    },
    "Lucere Modest Wear Shopee Storefront & E-Commerce Branding": {
      id: "Desain banner etalase toko online Shopee, promosi diskon musiman, dan identitas visual brand busana muslimah kontemporer.",
      en: "Shopee online storefront banner design, seasonal sale campaigns, and visual brand identity for contemporary modest fashion."
    },
    "Lucere Weekly Social Media Campaign Suite": {
      id: "Sistem konten Instagram mingguan bertema editorial fesyen dengan palet warna earthy, layout minimalis, dan lookbook katalog produk.",
      en: "Weekly editorial fashion social campaign system featuring earthy palettes, minimalist layouts, and lookbook product catalogs."
    },
    "TSM Land Serpong — Weekend Special Promo Reel": {
      id: "Video promosi reels event akhir pekan hunian Serpong dengan penawaran subsidi DP, free biaya akad, dan hadiah langsung.",
      en: "Weekend event promotional reel for Serpong homes featuring down payment subsidies, waived notary fees, and exclusive gifts."
    },
    "TSM Land Serpong — Open House Event Reel": {
      id: "Reels liputan acara open house dan kunjungan langsung calon pembeli ke unit contoh perumahan 2 lantai TSM Land.",
      en: "Event coverage reel of the community open house with prospective buyers touring TSM Land's 2-story model units."
    },
    "TSM Land Serpong — Exclusive Property Investment Reel": {
      id: "Video komersial edukasi nilai investasi properti dan capital gain kawasan Serpong yang berkembang pesat.",
      en: "Educational commercial video highlighting real estate investment values and rapid capital appreciation in Serpong."
    },
    "TSM Land Serpong — Prime Location & Accessibility Reel": {
      id: "Visual video keunggulan aksesibilitas: 5 menit gerbang tol, stasiun KRL terdekat, dan pusat fasilitas publik terlengkap.",
      en: "Visual showcase of prime accessibility: 5 minutes to toll gates, nearby commuter rail stations, and comprehensive civic amenities."
    },
    "TSM Land Serpong — Dream Family Residence Reel": {
      id: "Reels visualisasi konsep hunian impian keluarga muda dengan tata ruang fungsional, pencahayaan alami, dan sirkulasi udara sejuk.",
      en: "Visual concept reel of dream homes for young families featuring functional layouts, natural light, and refreshing airflow."
    },
    "TSM Land Serpong — Contemporary Lifestyle Feature Reel": {
      id: "Video cinematic lifestyle merepresentasikan kehidupan modern yang tenang dan harmonis di lingkungan perumahan asri.",
      en: "Cinematic lifestyle reel portraying serene, contemporary living in a lush, family-friendly residential neighborhood."
    },
    "TSM Land Serpong — Structural & Facade Precision Reel": {
      id: "Reels detail konstruksi berkualitas tinggi: pondasi kokoh, fasad bata ekspos modern, dan spesifikasi material bangunan pilihan.",
      en: "Detailed reel on high-grade construction: solid foundations, modern exposed brick facades, and premium building materials."
    },
    "TSM Land Serpong — Comprehensive Digital E-Brochure": {
      id: "Katalog e-brochure digital 9 halaman menyeluruh mencakup site plan, denah tipe unit, spesifikasi teknis bangunan, dan skema pembiayaan KPR.",
      en: "Comprehensive 9-page digital e-brochure catalog covering master site plans, unit floor plans, technical specs, and mortgage options."
    },
    "TSM Land Serpong — Master Sales Brochure & Billboard Campaign": {
      id: "Materi cetak brosur promosi lipat dan baliho billboard outdoor boulevard beresolusi tinggi untuk penjualan properti prima Serpong.",
      en: "High-resolution foldable marketing brochures and outdoor boulevard billboard campaign for prime Serpong real estate sales."
    },
    "TSM Land Serpong — Performance Ads Creative Suite": {
      id: "Rangkaian visual banner iklan berbayar (Meta & Google Ads) dengan copywriting berdaya konversi tinggi dan penawaran cicilan ringan.",
      en: "Suite of high-converting visual ad creatives (Meta & Google Ads) with compelling copywriting and flexible installment offers."
    },
    "Lucere Modest Wear — Signature Collection Lookbook": {
      id: "Lookbook katalog koleksi busana muslimah kontemporer: perpaduan estetika minimalis, detail kain premium, dan visual storytelling anggun.",
      en: "Contemporary modest wear lookbook catalog featuring minimalist aesthetics, premium fabric details, and elegant storytelling."
    }
  };

  const langSwitchBtn = document.getElementById('lang-switch-btn');
  const langOptId = document.getElementById('lang-opt-id');
  const langOptEn = document.getElementById('lang-opt-en');
  let currentLang = localStorage.getItem('portfolio_lang') || 'id';

  function applyLanguage(lang) {
    currentLang = lang;
    try {
      localStorage.setItem('portfolio_lang', lang);
    } catch (e) {}

    // Update switcher pill active state
    if (langOptId && langOptEn) {
      if (lang === 'en') {
        langOptEn.classList.add('active');
        langOptId.classList.remove('active');
      } else {
        langOptId.classList.add('active');
        langOptEn.classList.remove('active');
      }
    }

    // 1. Update all elements with data-i18n
    const transObj = translations[lang] || translations.id;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (transObj[key]) {
        el.innerHTML = transObj[key];
      }
    });

    // 2. Update all Portfolio Grid Cards
    document.querySelectorAll('.project-card').forEach(card => {
      const titleEl = card.querySelector('.project-title');
      const descEl = card.querySelector('.project-desc');
      const hoverBtn = card.querySelector('.project-hover-btn');
      const badgeEl = card.querySelector('.project-category-badge');

      if (titleEl && descEl) {
        const titleText = titleEl.textContent.replace(/&amp;/g, '&').trim();
        const pTrans = projectTranslations[titleText];
        if (pTrans && pTrans[lang]) {
          descEl.textContent = pTrans[lang];
          card.setAttribute('data-desc', pTrans[lang]);
        }
      }

      // Update hover button text
      if (hoverBtn) {
        if (hoverBtn.textContent.includes('Video') || hoverBtn.textContent.includes('Putar') || hoverBtn.textContent.includes('Play')) {
          if (hoverBtn.textContent.includes('3D')) {
            hoverBtn.innerHTML = lang === 'en' 
              ? '<i class="material-icons">play_arrow</i> Play 3D Video' 
              : '<i class="material-icons">play_arrow</i> Putar Video 3D';
          } else {
            hoverBtn.innerHTML = lang === 'en' 
              ? '<i class="material-icons">play_arrow</i> Play Video' 
              : '<i class="material-icons">play_arrow</i> Putar Video';
          }
        } else {
          hoverBtn.innerHTML = lang === 'en' 
            ? '<i class="material-icons">visibility</i> View Work' 
            : '<i class="material-icons">visibility</i> Lihat Karya';
        }
      }

      // Category badge translation
      if (badgeEl) {
        const cat = card.getAttribute('data-category');
        if (lang === 'en') {
          if (cat === '3d') badgeEl.textContent = '3D Design';
          else if (cat === 'motion') badgeEl.textContent = 'Motion & Video';
          else if (cat === 'logo') badgeEl.textContent = 'Branding';
          else if (cat === 'social') badgeEl.textContent = 'Social Media';
          else if (cat === 'print') badgeEl.textContent = 'Print Media';
        } else {
          if (cat === '3d') badgeEl.textContent = '3D Design';
          else if (cat === 'motion') badgeEl.textContent = 'Motion Graphic';
          else if (cat === 'logo') badgeEl.textContent = 'Branding';
          else if (cat === 'social') badgeEl.textContent = 'Social Media';
          else if (cat === 'print') badgeEl.textContent = 'Print Media';
        }
      }
    });

    // 3. Update Gallery Cards in #projects-modal
    document.querySelectorAll('.gallery-card').forEach(card => {
      const titleEl = card.querySelector('.gallery-card-title');
      const descEl = card.querySelector('.gallery-card-desc');
      if (titleEl && descEl) {
        const titleText = titleEl.textContent.replace(/&amp;/g, '&').trim();
        const pTrans = projectTranslations[titleText];
        if (pTrans && pTrans[lang]) {
          descEl.textContent = pTrans[lang];
        }
      }
    });

    // 4. Update Lightbox info if currently open
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      const currentTitle = lightboxTitle ? lightboxTitle.textContent.replace(/&amp;/g, '&').trim() : '';
      if (projectTranslations[currentTitle] && projectTranslations[currentTitle][lang]) {
        if (lightboxDesc) lightboxDesc.textContent = projectTranslations[currentTitle][lang];
      }
    }

    document.documentElement.lang = lang;
  }

  if (langSwitchBtn) {
    langSwitchBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'id' ? 'en' : 'id';
      applyLanguage(nextLang);
    });
  }

  // Initialize language on page load
  applyLanguage(currentLang);
});

