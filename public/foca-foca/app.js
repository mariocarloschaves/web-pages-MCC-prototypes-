const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');

menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('span').textContent = open ? 'Fechar' : 'Menu';
});

menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('span').textContent = 'Menu';
}));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const film = document.querySelector('.hero-video');
const filmToggle = document.querySelector('.film-toggle');
let manuallyPaused = reducedMotion;
function syncFilm(){filmToggle.textContent=film.paused?'Ver filme':'Pausar filme';filmToggle.setAttribute('aria-label',film.paused?'Reproduzir vídeo':'Pausar vídeo');}
film.addEventListener('play',syncFilm);film.addEventListener('pause',syncFilm);
if(reducedMotion){film.pause();}else{film.muted=true;film.play().catch(syncFilm);}
filmToggle.addEventListener('click',()=>{manuallyPaused=!film.paused;if(film.paused){film.style.display='block';film.play().catch(syncFilm);}else{film.pause();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){film.pause();}else if(!manuallyPaused){film.play().catch(syncFilm);}});
if (reducedMotion) {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
