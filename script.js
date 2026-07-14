/* ===========================
   script.js
=========================== */

// ── Navbar: add .scrolled class on scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

// ── Mobile hamburger menu ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Active nav link based on scroll position ──
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}
updateActiveNav();

// ── Typing animation ──
const roles = [
  'iOS Developer',
  'SwiftUI Enthusiast',
  'YouTube Creator',
  'AWS & Python Learner',
  'Lifelong Student',
];
let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
const typedEl  = document.getElementById('typed-text');

function type() {
  if (!typedEl) return;
  const current = roles[roleIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typedEl.textContent = current.substring(0, charIndex);

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting  = false;
    roleIndex   = (roleIndex + 1) % roles.length;
    delay       = 300;
  }

  setTimeout(type, delay);
}
type();

// ── Animate stat counters when in view ──
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const step   = Math.max(1, Math.ceil(target / 30));
    let current  = 0;
    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current < target) requestAnimationFrame(tick);
    };
    tick();
  });
}

// ── Animate skill bars when in view ──
function animateSkillBars() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    bar.style.width = bar.dataset.width + '%';
  });
}

// ── Intersection Observer for scroll animations ──
const observerOptions = { threshold: 0.15 };

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const id = entry.target.getAttribute('id');
    if (id === 'about')  animateCounters();
    if (id === 'skills') animateSkillBars();

    // Fade-in cards inside the section
    entry.target.querySelectorAll(
      '.info-card, .skill-category, .video-card, .timeline-item, .contact-card'
    ).forEach((card, i) => {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity    = '1';
        card.style.transform  = 'translateY(0)';
      }, i * 100);
    });

    sectionObserver.unobserve(entry.target);
  });
}, observerOptions);

document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

// ── Contact form (mailto fallback — no backend needed) ──
const contactForm = document.getElementById('contact-form');
const formStatus  = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = contactForm.name.value.trim();
    const email   = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      formStatus.style.color = '#ff6584';
      formStatus.textContent = 'Please fill in all fields.';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formStatus.style.color = '#ff6584';
      formStatus.textContent = 'Please enter a valid email address.';
      return;
    }

    // Open mailto link with pre-filled data
    const subject = encodeURIComponent(`Message from ${name} via your website`);
    const body    = encodeURIComponent(
      `Hi Rajeswari,\n\nYou have a new message from your website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:p.rajeswari0@gmail.com?subject=${subject}&body=${body}`;

    formStatus.style.color = '#43e97b';
    formStatus.textContent = 'Opening your email client... ✓';
    contactForm.reset();
  });
}

// ── Smooth reveal for hero on load ──
window.addEventListener('load', () => {
  document.querySelector('.hero-content').style.animation = 'fadeInUp 0.8s ease forwards';
});

// Inject fadeInUp keyframe dynamically (keeps CSS clean)
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-content { opacity: 0; }
`;
document.head.appendChild(style);
