/* script.js
   Interactivity:
   - Mobile menu toggle
   - Simple particle background
   - Scroll reveal via IntersectionObserver
   - Animated counters (replace placeholders with real numbers if provided)
   - Smooth scroll for internal links
*/

/* ====== Mobile nav toggle ====== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  const open = mobileMenu.getAttribute('aria-hidden') === 'false';
  mobileMenu.setAttribute('aria-hidden', String(!open));
  mobileMenu.style.display = open ? 'none' : 'flex';
  hamburger.classList.toggle('open');
});

/* close mobile menu when link clicked */
document.querySelectorAll('.mm-link').forEach(a => a.addEventListener('click', () => {
  mobileMenu.style.display = 'none';
  mobileMenu.setAttribute('aria-hidden', 'true');
}));

/* ====== Smooth scroll for anchor links ====== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href.length > 1) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

/* ====== Simple particle background (canvas) ====== */
(function particleCanvas(){
  const canvas = document.getElementById('particle-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const num = Math.floor((w*h) / 80000) + 20;
  const particles = [];
  function rand(min, max){ return Math.random() * (max-min) + min; }

  for(let i=0;i<num;i++){
    particles.push({
      x: rand(0,w),
      y: rand(0,h),
      r: rand(0.6, 2.5),
      vx: rand(-0.2,0.2),
      vy: rand(-0.1,0.1),
      hue: rand(160,280)
    });
  }

  function resize(){ w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
  addEventListener('resize', resize);

  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x < -10) p.x = w + 10;
      if(p.x > w + 10) p.x = -10;
      if(p.y < -10) p.y = h + 10;
      if(p.y > h + 10) p.y = -10;

      ctx.beginPath();
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 20);
      grad.addColorStop(0, `rgba(122,252,255,${0.16 * (p.r/2)})`);
      grad.addColorStop(1, `rgba(123,97,255,0)`);
      ctx.fillStyle = grad;
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ====== Scroll reveal for .reveal elements ====== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.15});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* also reveal stat cards and other glass panels */
document.querySelectorAll('.glass').forEach(el => observer.observe(el));

/* ====== Animated counters ======
   Note: The original site shows '+' placeholders rather than exact numbers.
   If you have exact numbers, replace the data-target attributes in markup.
*/
function animateCounters() {
  const counters = document.querySelectorAll('.stat-card .count');
  counters.forEach((el) => {
    const parent = el.closest('.stat-card');
    const target = parent ? parseInt(parent.getAttribute('data-target') || 0) : 0;

    // If original site had only '+' placeholders, we'll show the '+' glyph.
    // If target is 0 => show '+' to match existing site style. Otherwise animate digits.
    if (!target || isNaN(target)) {
      el.textContent = '+';
      return;
    }

    // basic counter animation from 0 to target
    let start = 0;
    const duration = 1600;
    const step = (timestamp) => {
      const progress = Math.min(1, (timestamp - startTime) / duration);
      const value = Math.floor(progress * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    let startTime = performance.now();
    requestAnimationFrame(step);
  });
}

/* We start counters when stats section is visible */
const statsSection = document.getElementById('stats');
if (statsSection) {
  const statObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statObserver.disconnect();
    }
  }, {threshold: 0.2});
  statObserver.observe(statsSection);
}

/* ====== simple contact form demo (no backend) ====== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // basic validation
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    if (!name || !email || !message) {
      alert('Please fill all fields before sending.');
      return;
    }
    // In production replace with API call or form provider
    alert('Thanks — your message has been received (demo). Replace this with your backend or Formspree URL.');
    contactForm.reset();
  });
}

/* Optional: small fade in for initial elements */
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal, .glass').forEach(el => el.classList.add('show'));
});
