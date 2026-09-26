document.querySelector('form').addEventListener('submit',e=>{e.preventDefault();const topic=document.querySelector('#topic').value;const detail=document.querySelector('#detail').value;const result=document.querySelector('#result');result.hidden=false;result.textContent='Your demo enquiry: '+topic+' · '+detail+'. In a finished website, this would go to the team. Nothing has been sent.';result.focus();});document.querySelectorAll('[data-choice]').forEach(a=>a.addEventListener('click',()=>{document.querySelector('#topic').value=a.dataset.choice}));
const film=document.querySelector('.hero-video');
const toggle=document.querySelector('.motion-toggle');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let userPaused=false;
function syncFilm(){const paused=film.paused;toggle.setAttribute('aria-label',paused?'Play background video':'Pause background video');toggle.textContent=paused?'Play film ▷':'Pause film Ⅱ';}
function playFilm(){film.muted=true;film.play().then(syncFilm).catch(syncFilm);}
film.addEventListener('play',syncFilm);film.addEventListener('pause',syncFilm);
if(reducedMotion.matches){film.autoplay=false;film.pause();syncFilm();}else{playFilm();}
toggle.addEventListener('click',()=>{if(film.paused){userPaused=false;playFilm();}else{userPaused=true;film.pause();}});
reducedMotion.addEventListener('change',e=>{if(e.matches){film.pause();}else if(!userPaused){playFilm();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){film.pause();}else if(!userPaused&&!reducedMotion.matches){playFilm();}});
