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
  // Navbar
  // ============================
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
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
  // Mobile Menu
  // ============================
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      }
    });
  }

  // ============================
  // Scroll Reveal
  // ============================
  const revealElements = document.querySelectorAll('.reveal, .reveal-scale, .stagger-children');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

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

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ============================
  // Gallery Lightbox (YANG SUDAH DIPERBAIKI)
  // ============================
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxgambar = document.getElementById('lightbox-gambar'); 
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');

  // Mengecek apakah elemen lightboxgambar ditemukan di HTML
  if (lightbox && lightboxgambar) { 
    galleryCards.forEach(card => {
      card.addEventListener('click', () => {
        const gambar = card.getAttribute('data-gambar');
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');

        lightboxgambar.src = gambar; 
        lightboxgambar.alt = title;  
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { lightboxgambar.src = ""; }, 400);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  } else if (lightbox && !lightboxgambar) {
      console.error("ERROR: ID 'lightbox-gambar' tidak ditemukan di file HTML kamu!");
  }

  // ============================
  // Gurindam Slider
  // ============================
  const sliders = document.querySelectorAll('.gurindam-slider');
  sliders.forEach(slider => {
    let isDown = false; let startX; let scrollLeft;
    slider.addEventListener('mousedown', (e) => {
      isDown = true; slider.classList.add('dragging');
      startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('dragging'); });
    slider.addEventListener('mouseup', () => { isDown = false; slider.classList.remove('dragging'); });
    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return; e.preventDefault();
      const x = e.pageX - slider.offsetLeft; const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });

    let targetScroll = slider.scrollLeft; let animating = false;
    const smoothScroll = () => {
      const diff = targetScroll - slider.scrollLeft;
      if (Math.abs(diff) < 0.5) { slider.scrollLeft = targetScroll; animating = false; return; }
      slider.scrollLeft += diff * 0.12; requestAnimationFrame(smoothScroll);
    };

    slider.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      targetScroll = Math.max(0, Math.min(slider.scrollWidth - slider.clientWidth, targetScroll + delta * 1.8));
      if (!animating) { animating = true; requestAnimationFrame(smoothScroll); }
    }, { passive: false });

    slider.addEventListener('scroll', () => {
      if (!animating) targetScroll = slider.scrollLeft;
    }, { passive: true });
  });

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