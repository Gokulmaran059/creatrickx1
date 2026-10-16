const revealItems = document.querySelectorAll('.section, .card, .work, .stat, .package, .hero');
revealItems.forEach((item) => {
  item.classList.add('reveal');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => revealObserver.observe(item));

const countUp = () => {
  document.querySelectorAll('[data-count]').forEach((node) => {
    const finalValue = node.dataset.count || '0';
    const numericValue = Number.parseFloat(finalValue.replace(/[^\d.]/g, '')) || 0;
    const suffix = finalValue.replace(/[\d.]/g, '');
    let current = 0;
    const step = Math.max(1, numericValue / 35);

    const timer = setInterval(() => {
      current += step;
      if (current >= numericValue) {
        node.textContent = finalValue;
        clearInterval(timer);
        return;
      }
      node.textContent = `${Math.round(current)}${suffix}`;
    }, 24);
  });
};

const statSection = document.querySelector('#results');
if (statSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        countUp();
        observer.disconnect();
      }
    });
  }, { threshold: 0.35 });

  observer.observe(statSection);
}

const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
    hero.style.setProperty('--mouse-x', `${x}px`);
    hero.style.setProperty('--mouse-y', `${y}px`);
    hero.style.transform = `translate3d(${x * 0.2}px, ${y * 0.2}px, 0)`;
  });

  hero.addEventListener('pointerleave', () => {
    hero.style.transform = 'translate3d(0, 0, 0)';
  });
}

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('nav ul');
if (navToggle && navMenu) {
  const setMenu = (open) => {
    navMenu.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navToggle.innerHTML = open ? '&#10005;' : '&#9776;';
  };

  navToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    setMenu(!navMenu.classList.contains('open'));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('click', (event) => {
    if (navMenu.classList.contains('open') && !event.target.closest('nav')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setMenu(false);
  });
}

document.querySelectorAll('form[data-ajax]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = form.querySelector('.form-status');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!res.ok) throw new Error();
      form.reset();
      status.className = 'form-status ok';
      status.textContent = 'Message sent! We will get back to you within one business day.';
    } catch {
      status.className = 'form-status err';
      status.textContent = 'Something went wrong. Please try again or WhatsApp us.';
    }
  });
});
