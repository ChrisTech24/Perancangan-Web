document.addEventListener('DOMContentLoaded', () => {

  // ============================
  // Page Loader
  // ============================
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        pageLoader.classList.add('loaded');
      }, 400);
    });
    setTimeout(() => {
      pageLoader.classList.add('loaded');
    }, 2000);
  }

  // ============================
  // Scroll Progress Bar
  // ============================
  const scrollProgress = document.getElementById('scroll-progress');
  const updateProgress = () => {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  };

  // ============================
  // Navbar Scroll
  // ============================
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateProgress();
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ============================
  // Active Nav Link (auto-detect page)
  // ============================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinksAll = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  navLinksAll.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.remove('active');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // ============================
  // Mobile Menu
  // ============================
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ============================
  // Smooth Scroll for Anchors
  // ============================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================
  // Scroll Reveal (IntersectionObserver)
  // ============================
  const revealElements = document.querySelectorAll('.reveal, .reveal-scale, .stagger-children');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ============================
  // Counter Animation
  // ============================
  const counters = document.querySelectorAll('.stat-number[data-count]');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2200;
      const start = performance.now();

      const step = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(eased * target);
        counter.textContent = current.toLocaleString('id-ID') + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) animateCounters();
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  // ============================
  // Hero Particle Animation
  // ============================
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    const resizeCanvas = () => {
      const hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.min(Math.floor(canvas.width * canvas.height / 12000), 80);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.005
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY; p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        const dynamicOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dynamicOpacity})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(drawParticles);
    };

    resizeCanvas(); createParticles(); drawParticles();
    window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });

    const heroSection = document.getElementById('hero');
    if (heroSection) {
      const particleObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!animId) drawParticles();
        } else {
          cancelAnimationFrame(animId); animId = null;
        }
      }, { threshold: 0.1 });
      particleObserver.observe(heroSection);
    }
  }

  // ============================
  // Back to Top Button
  // ============================
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================
  // Gallery Filter
  // ============================
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card[data-category]');

  // Initialize cards
  galleryCards.forEach(card => {
    card.classList.add('show-card');
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const isMatch = filter === 'all' || card.getAttribute('data-category') === filter;

        if (card.dataset.timeoutId) {
          clearTimeout(parseInt(card.dataset.timeoutId));
          card.dataset.timeoutId = '';
        }

        if (isMatch) {
          card.classList.remove('hidden-card');
          void card.offsetWidth; // Force reflow
          card.classList.add('show-card');
        } else {
          card.classList.remove('show-card');
          const tId = setTimeout(() => {
            if (!card.classList.contains('show-card')) {
              card.classList.add('hidden-card');
            }
          }, 300);
          card.dataset.timeoutId = tId;
        }
      });
    });
  });

  // ============================
  // Gallery Lightbox
  // ============================
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxGambar = document.getElementById('lightbox-gambar');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');

  if (lightbox && lightboxGambar) {
    galleryCards.forEach(card => {
      card.addEventListener('click', () => {
        const gambar = card.getAttribute('data-gambar');
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');

        lightboxGambar.src = gambar;
        lightboxGambar.alt = title;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) lightboxDesc.textContent = desc;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { lightboxGambar.src = ""; }, 400);
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ============================
  // Expand / Collapse Detail Panels — Independent per card
  // ============================
  const detailButtons = document.querySelectorAll('.btn-detail[data-target]');
  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const panel = document.getElementById(targetId);
      if (!panel) return;

      const isOpen = panel.classList.contains('open');

      if (isOpen) {
        // Close this panel
        panel.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = 'Lihat Selengkapnya <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
      } else {
        // Open this panel only — other panels stay unchanged
        panel.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        btn.innerHTML = 'Tutup Detail <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
      }
    });
  });

  // ============================
  // Gurindam Carousel Slider (1-by-1 Snapping)
  // ============================
  const slider = document.querySelector('.gurindam-slider');
  if (slider) {
    const cards = slider.querySelectorAll('.gurindam-card');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');
    
    let isDown = false;
    let startX;
    let scrollLeft;
    let activeIndex = 0;

    // Generate indicator dots dynamically
    if (dotsContainer && cards.length > 0) {
      cards.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.classList.add('slider-dot');
        if (idx === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Pasal ${idx + 1}`);
        dot.addEventListener('click', () => {
          scrollToIndex(idx);
        });
        dotsContainer.appendChild(dot);
      });
    }

    const dots = document.querySelectorAll('.slider-dot');

    // Drag-to-scroll support
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('dragging');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('dragging');
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('dragging');
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });

    // Helper to scroll to specific card index
    function scrollToIndex(idx) {
      if (idx < 0 || idx >= cards.length) return;
      const card = cards[idx];
      const targetScroll = card.offsetLeft - (slider.clientWidth - card.clientWidth) / 2;
      slider.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }

    // Button controls
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (activeIndex > 0) {
          scrollToIndex(activeIndex - 1);
        } else {
          scrollToIndex(cards.length - 1); // Loop to last
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (activeIndex < cards.length - 1) {
          scrollToIndex(activeIndex + 1);
        } else {
          scrollToIndex(0); // Loop to first
        }
      });
    }

    // Update active slide class on scroll
    function updateActiveCard() {
      const sliderCenter = slider.scrollLeft + slider.clientWidth / 2;
      let closestIdx = 0;
      let minDiff = Infinity;

      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const diff = Math.abs(sliderCenter - cardCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });

      activeIndex = closestIdx;

      cards.forEach((card, idx) => {
        if (idx === closestIdx) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });

      if (dots.length > 0) {
        dots.forEach((dot, idx) => {
          if (idx === closestIdx) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    }

    slider.addEventListener('scroll', updateActiveCard, { passive: true });
    
    // Initial call
    setTimeout(updateActiveCard, 100);
  }

  // ============================
  // Parallax Effect on Hero Ornaments
  // ============================
  const ornaments = document.querySelectorAll('.hero-ornament');
  if (ornaments.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      ornaments.forEach((orb, i) => {
        const speed = 0.03 + i * 0.015;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

});