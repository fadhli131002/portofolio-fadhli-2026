document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Hero Multi-Tile Video Wall Play / Pause Control ---
  const heroWallVideos = document.querySelectorAll('.hero-tile video');
  const heroToggleBtn = document.getElementById('hero-video-toggle');
  const heroToggleIcon = document.getElementById('hero-toggle-icon');

  if (heroToggleBtn) {
    let isWallPaused = false;
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

  const backToTopBtn = document.getElementById('back-to-top-btn');
  window.addEventListener('scroll', () => {
    if (backToTopBtn) {
      if (window.scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 3. Bidirectional Scroll Reveal Animations ---
  // Animates elements when scrolling down AND when scrolling back up
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
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

    revealElements.forEach(el => scrollObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('in-view'));
  }


  // --- 5. Portfolio Category Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').trim().split(/\s+/);
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => card.classList.add('in-view'), 50);
        } else {
          card.style.display = 'none';
          card.classList.remove('in-view');
        }
      });
    });
  });

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
        return;
      }

      // If dragged significantly: start pendulum swing
      isSwinging = true;
      swingAngle = targetRotateZ;
      swingVelocity = (targetTranslateX / 12);
    });

    // Flip button hints
    const flipHints = document.querySelectorAll('.flip-hint');
    flipHints.forEach(hint => {
      hint.addEventListener('click', (e) => {
        e.stopPropagation();
        isFlipped = !isFlipped;
        card3D.classList.toggle('flipped', isFlipped);
      });
    });

    // Physics Animation Loop
    let lastTime = performance.now();
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

      requestAnimationFrame(animatePhysics);
    }

    requestAnimationFrame(animatePhysics);
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

    // Update all elements with data-i18n
    const transObj = translations[lang] || translations.id;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (transObj[key]) {
        el.innerHTML = transObj[key];
      }
    });

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

