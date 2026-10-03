(() => {
  'use strict';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const button = document.querySelector('.hamburger');
  const navigation = document.querySelector('#main-navigation');
  function setMenu(open) {
    navigation.classList.toggle('active', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  button.addEventListener('click', () => setMenu(button.getAttribute('aria-expanded') !== 'true'));
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { setMenu(false); button.focus(); }
  });
  const desktop = window.matchMedia('(min-width: 1025px)');
  desktop.addEventListener('change', () => setMenu(false));

  const carousel = document.querySelector('.testimonials-carousel');
  const track = carousel.querySelector('.testimonials-track');
  const slides = [...carousel.querySelectorAll('.testimonial-slide')];
  const dots = [...carousel.querySelectorAll('.carousel-dot')];
  let selected = 0;
  let timer;
  let hovering = false;
  function show(index) {
    selected = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${selected * 100}%)`;
    slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== selected)));
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === selected);
      dot.setAttribute('aria-pressed', String(i === selected));
    });
  }
  function schedule() {
    clearInterval(timer);
    if (!motion.matches && !document.hidden && !hovering && !carousel.contains(document.activeElement)) {
      timer = setInterval(() => show(selected + 1), 7000);
    }
  }
  dots.forEach((dot, index) => dot.addEventListener('click', () => { show(index); schedule(); }));
  carousel.addEventListener('mouseenter', () => { hovering = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { hovering = false; schedule(); });
  carousel.addEventListener('focusin', schedule);
  carousel.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);

  const image = document.querySelector('img.background-media');
  let video;
  function updateBackground() {
    if (motion.matches) {
      if (video) { video.pause(); video.hidden = true; video.style.display = 'none'; }
      image.style.display = '';
    } else {
      if (!video) {
        video = document.createElement('video');
        video.className = 'background-media';
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        video.playsInline = true;
        video.poster = image.getAttribute('src');
        video.setAttribute('aria-hidden', 'true');
        video.src = './static/media/fondo-h264-balanced.6d7c7a4eb97e757ad24f.mp4';
        image.after(video);
        video.addEventListener('playing', () => { if (!motion.matches) image.style.display = 'none'; });
        video.addEventListener('error', () => { video.style.display = 'none'; image.style.display = ''; });
      }
      video.hidden = false;
      video.style.display = '';
      video.play().catch(() => { video.style.display = 'none'; image.style.display = ''; });
    }
  }
  motion.addEventListener('change', () => { schedule(); updateBackground(); });
  show(0);
  schedule();
  window.addEventListener('load', () => setTimeout(updateBackground, 1000), { once: true });
})();
