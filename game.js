const area = document.querySelector('#gameArea');
const rocket = document.querySelector('#rocket');
const scoreEl = document.querySelector('#score');
const mission = document.querySelector('#mission');
const questionLayer = document.querySelector('#questionLayer');
const scrollLayer = document.querySelector('#scrollLayer');
const noButton = document.querySelector('#noButton');
let score = 0, rocketX = 50, playing = true, elapsed = 0;

function steer(x) { rocketX = Math.max(8, Math.min(92, x)); rocket.style.left = `calc(${rocketX}% - 24px)`; }
document.addEventListener('keydown', e => { if (!playing) return; if (e.key === 'ArrowLeft') steer(rocketX - 6); if (e.key === 'ArrowRight') steer(rocketX + 6); });
area.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse' || !playing) return; steer((e.clientX - area.getBoundingClientRect().left) / area.clientWidth * 100); });
area.addEventListener('pointerdown', e => { if (playing) steer((e.clientX - area.getBoundingClientRect().left) / area.clientWidth * 100); });

function spawn(type) {
  const item = document.createElement('div');
  item.className = type;
  item.style.left = `${8 + Math.random() * 84}%`;
  item.style.setProperty('--speed', `${type === 'coin' ? 4.2 + Math.random() * 1.6 : 4.5 + Math.random()}s`);
  if (type === 'asteroid') item.style.setProperty('--size', `${36 + Math.random() * 30}px`);
  area.append(item);
  const watch = setInterval(() => {
    if (!playing || !item.isConnected) return clearInterval(watch);
    const a = item.getBoundingClientRect(), r = rocket.getBoundingClientRect();
    const hit = a.left < r.right && a.right > r.left && a.bottom > r.top + 15 && a.top < r.bottom - 8;
    if (hit && type === 'coin') { score++; scoreEl.textContent = String(score).padStart(2, '0'); item.remove(); clearInterval(watch); }
  }, 50);
  item.addEventListener('animationend', () => { item.remove(); clearInterval(watch); });
}
const loop = setInterval(() => { if (!playing) return; elapsed++; if (elapsed < 21) { spawn(elapsed % 2 ? 'coin' : 'asteroid'); } else { clearInterval(loop); finale(); } }, 850);
function finale() {
  playing = false; mission.innerHTML = '<span class="pulse"></span>Incoming signal...';
  const doom = document.createElement('div'); doom.className = 'asteroid'; doom.style.cssText = '--size:130px;--speed:2.4s;left:calc(50% - 65px);top:-150px'; area.append(doom);
  setTimeout(() => { rocket.style.filter = 'drop-shadow(0 0 24px #ffb14e) brightness(2)'; rocket.style.transform = 'rotate(34deg) scale(.7)'; }, 1650);
  setTimeout(() => { questionLayer.classList.add('show'); questionLayer.setAttribute('aria-hidden','false'); }, 2450);
}
function moveNo() { const row = noButton.parentElement, maxX = row.clientWidth - noButton.offsetWidth, maxY = 95; noButton.style.position = 'absolute'; noButton.style.left = `${Math.random() * maxX}px`; noButton.style.top = `${(Math.random()-.3) * maxY}px`; }
noButton.addEventListener('pointerenter', moveNo); noButton.addEventListener('pointerdown', e => { e.preventDefault(); moveNo(); });
document.querySelector('#yesButton').addEventListener('click', () => { questionLayer.classList.remove('show'); scrollLayer.classList.add('show'); scrollLayer.setAttribute('aria-hidden','false'); });
document.querySelector('#closeScroll').addEventListener('click', () => { scrollLayer.classList.remove('show'); });
