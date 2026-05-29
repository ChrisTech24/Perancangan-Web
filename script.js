

document.addEventListener('DOMContentLoaded', () => {

  // navbar
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Menu 
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
  }

  // Scroll Reveal 
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-scale, .stagger-children'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // Counter Animation 
  const counters = document.querySelectorAll('.stat-number[data-count]');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000;
      const start = performance.now();

      const step = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        counter.textContent = current.toLocaleString('id-ID') + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    });
  };

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  }
});
