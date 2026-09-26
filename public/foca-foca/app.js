const en = document.body.dataset.lang === 'en';
const words = (pt, english) => en ? english : pt;
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('span').textContent = open ? words('Fechar', 'Close') : 'Menu';
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('span').textContent = 'Menu';
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('open')) { menuButton.click(); menuButton.focus(); }
});
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('[data-film]').forEach(container => {
  const film = container.querySelector('video');
  film.muted = true;
  if (reducedMotion) { film.autoplay = false; film.pause(); }
  else { film.play().catch(() => {}); }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden || reducedMotion) film.pause();
    else film.play().catch(() => {});
  });
});
const filters = document.querySelectorAll('[data-filter]');
const search = document.querySelector('#menu-search');
let category = 'all';
const normalise = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
function filterMenu() {
  const query = normalise(search.value.trim());
  let count = 0;
  document.querySelectorAll('.dish').forEach(dish => {
    const match = (category === 'all' || category === dish.dataset.category) && normalise(dish.innerText).includes(query);
    dish.hidden = !match;
    if (match) count++;
  });
  const label = `${count} ${words('focaccias apresentadas','focaccias shown')}`;
  document.querySelector('#filter-status').textContent = label;
  document.querySelector('#menu-count').textContent = `${count} focaccias`;
  document.querySelector('.menu-empty').hidden = count > 0;
}
filters.forEach(button => button.addEventListener('click', () => {
  category = button.dataset.filter;
  filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  filterMenu();
}));
search.addEventListener('input', filterMenu);
document.querySelector('#reset-menu').addEventListener('click', () => {
  search.value = ''; category = 'all';
  filters.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === 'all')));
  filterMenu(); search.focus();
});
const dishDialog = document.querySelector('#dish-dialog');
document.querySelectorAll('.dish-details').forEach(button => button.addEventListener('click', () => {
  const dish = button.closest('.dish');
  const photo = dish.querySelector('img');
  document.querySelector('#dialog-photo').src = photo.src;
  document.querySelector('#dialog-photo').alt = photo.alt;
  document.querySelector('#dialog-title').textContent = dish.querySelector('h3').textContent;
  document.querySelector('#dialog-price').textContent = dish.querySelector('.dish-title>span').textContent;
  document.querySelector('#dialog-category').textContent = dish.querySelector('.dish-category').textContent;
  document.querySelector('#dialog-ingredients').textContent = dish.querySelector('.dish-copy>p').textContent;
  dishDialog.showModal();
  document.body.classList.add('dialog-open');
}));
dishDialog.querySelector('.dialog-close').addEventListener('click', () => dishDialog.close());
dishDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
dishDialog.addEventListener('click', event => {
  if (event.target !== dishDialog) return;
  const r = dishDialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dishDialog.close();
});
document.querySelector('#dialog-reserve').addEventListener('click', () => {dishDialog.close();document.querySelector('#reservas h2').focus({preventScroll:true});});
document.querySelector('#reservas h2').tabIndex = -1;
const mobileActions = document.querySelector('.mobile-actions');
new IntersectionObserver(entries => {
  mobileActions.classList.toggle('at-booking', entries.some(e => e.isIntersecting));
}, {threshold:0}).observe(document.querySelector('#reservas'));
// Keep the current section when switching languages; no personal form data is persisted.
document.querySelectorAll('.language-switch a').forEach(link => link.addEventListener('click', () => {
  if (location.hash) link.href = link.getAttribute('href').split('#')[0] + location.hash;
}));
const form = document.querySelector('#reservation-form');
const dateField = form.elements.date;
const timeField = form.elements.time;
function lisbonParts() {
  return Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone:'Europe/Lisbon', year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23' }).formatToParts(new Date()).map(x=>[x.type,x.value]));
}
function today() { const p=lisbonParts();return `${p.year}-${p.month}-${p.day}`; }
dateField.min = today();
function validateDate() {
  const p=lisbonParts(); const currentDay=`${p.year}-${p.month}-${p.day}`;
  const past=dateField.value && (dateField.value < currentDay || (dateField.value===currentDay && timeField.value && timeField.value <= `${p.hour}:${p.minute}`));
  timeField.setCustomValidity(past ? words('Escolhe uma data e hora futuras, na hora de Setúbal.','Choose a future date and time in Setúbal local time.') : '');
}
[dateField,timeField].forEach(el=>el.addEventListener('input', validateDate));
form.elements.name.addEventListener('input',()=>form.elements.name.setCustomValidity(''));
form.addEventListener('input',()=>{ document.querySelector('#reservation-result').hidden=true; });
form.addEventListener('submit', event => {
  event.preventDefault(); validateDate();
  form.elements.name.setCustomValidity(form.elements.name.value.trim() ? '' : words('Indica o teu nome.','Please enter your name.'));
  if (!form.reportValidity()) return;
  const d = new FormData(form);
  const name=String(d.get('name')).trim();
  const [y,m,day]=String(d.get('date')).split('-');
  const msg = words(
    `Olá, Foca Foca! Gostaria de pedir uma reserva.\nNome: ${name}\nData: ${day}/${m}/${y}\nHora: ${d.get('time')} (Setúbal)\nPessoas: ${d.get('guests')}`,
    `Hello, Foca Foca! I would like to request a reservation.\nName: ${name}\nDate: ${day}/${m}/${y}\nTime: ${d.get('time')} (Setúbal local time)\nGuests: ${d.get('guests')}`
  ) + (String(d.get('phone')).trim() ? `\n${words('Telefone','Phone')}: ${String(d.get('phone')).trim()}` : '')
    + (String(d.get('notes')).trim() ? `\n${words('Mensagem','Message')}: ${String(d.get('notes')).trim()}` : '')
    + '\n' + words('Podem confirmar a disponibilidade? Obrigado!','Could you please confirm availability? Thank you!');
  document.querySelector('#reservation-message').textContent=msg;
  // iOS uses &body; Android and desktop SMS handlers use ?body.
  const ios=/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  document.querySelector('#sms-link').href='sms:+351913602617'+(ios?'&':'?')+'body='+encodeURIComponent(msg);
  const result=document.querySelector('#reservation-result'); result.hidden=false;
  document.querySelector('#copy-status').textContent='';
  result.querySelector('h3').focus({preventScroll:true});
  result.scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'nearest'});
});
document.querySelector('#copy-request').addEventListener('click', async () => {
  const status=document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText(document.querySelector('#reservation-message').textContent);status.textContent=words('Mensagem copiada. Envia-a à equipa para pedir confirmação.','Message copied. Send it to the team to request confirmation.'); }
  catch { status.textContent=words('Seleciona e copia o texto acima.','Select and copy the message above.'); }
});
const progress = document.querySelector('.reading-progress');
let scrollFrame = false;
function updateProgress() {
  const length = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${length > 0 ? scrollY / length : 0})`;
  scrollFrame = false;
}
window.addEventListener('scroll', () => {
  if (!scrollFrame) { scrollFrame = true; requestAnimationFrame(updateProgress); }
}, {passive:true});
updateProgress();
if (!reducedMotion) {
  const arrivalObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('section-arrival');
      arrivalObserver.unobserve(entry.target);
    }
  }, {threshold:0.12});
  document.querySelectorAll('.story-heading,.menu-heading,.other-menu-title,.assembly-heading,.reservation-copy').forEach(el=>arrivalObserver.observe(el));
}
