const items = [
  "I love ur eyes",
  "I love ur voice",
  "I love ur words",
  "I love ur laugh",
  "I love ur smile",
  "I love ur sense of humor",
  "I love ur heart",
  "I love ur imagination",
  "I love ur smell",
  "I love ur face"
];

// id = ID artis di Spotify. img kosong = pakai inisial. Isi "img/nama.jpg" kalau foto udah ada.
const artists = [
  { name: "Dongker",      id: "20zafXaLhm5IcXnSU93rNn", img: "" },
  { name: "Alkateri",     id: "6sf1OnuDZM48bgFQvPkbYm", img: "" },
  { name: "Nadin Amizah", id: "0Y6dVaC9DZtPNH4591M42W", img: "" },
  { name: "TV Girl",      id: "2FBPSDAcymnyELCoVKgTcf", img: "" }
];

const $ = id => document.getElementById(id);

// ---------- SUARA ----------
let audioCtx = null;
function getCtx() {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function tone(freq, start, dur, type = "sine", vol = 0.25, endFreq = null) {
  const c = getCtx();
  const t = c.currentTime + start;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur);
}

const clickSound = new Audio("click.wav");
function playClick() {
  clickSound.currentTime = 0;
  clickSound.play().catch(() => tone(880, 0, 0.15, "sine", 0.3, 1320));
}
function playBloop() {
  tone(400, 0, 0.25, "sine", 0.3, 1200);
  tone(1500, 0.05, 0.12, "triangle", 0.15, 2200);
}
function playLove() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3, "triangle", 0.25));
}

// ---------- CIPRATAN ----------
function splash(x, y) {
  const ring = document.createElement("div");
  ring.className = "ring";
  ring.style.left = x + "px";
  ring.style.top = y + "px";
  document.body.appendChild(ring);

  for (let i = 0; i < 18; i++) {
    const d = document.createElement("div");
    d.className = "drop";
    const angle = (Math.PI * 2 * i) / 18;
    const dist = 60 + Math.random() * 70;
    d.style.left = x + "px";
    d.style.top = y + "px";
    d.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    d.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 900);
  }
  setTimeout(() => ring.remove(), 700);
}

// ---------- SCREEN ----------
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id === id));
  document.body.classList.toggle("desk-mode", id !== "screen1");
  if (id === "screen2") animateList();
  if (id !== "screen3") closeEmbed();
}

function animateList() {
  document.querySelectorAll("#list li").forEach((li, i) => {
    li.classList.remove("show");
    setTimeout(() => li.classList.add("show"), 200 * i);
  });
}

items.forEach((text, i) => {
  const li = document.createElement("li");
  li.innerHTML = `<span>${i + 1}.</span>${text}`;
  $("list").appendChild(li);
});

// ---------- ARTIS + EMBED SPOTIFY ----------
function openEmbed(a) {
  $("embedTitle").textContent = a.name + " - Spotify";
  $("embedFrame").src = `https://open.spotify.com/embed/artist/${a.id}?utm_source=generator`;
  $("embedOpen").href = `https://open.spotify.com/artist/${a.id}`;
  $("embedWin").hidden = false;
}
function closeEmbed() {
  $("embedWin").hidden = true;
  $("embedFrame").src = "about:blank";
}

artists.forEach(a => {
  const card = document.createElement("div");
  card.className = "artist";
  const inner = a.img
    ? `<img src="${a.img}" alt="${a.name}">`
    : a.name.split(" ").map(w => w[0]).join("").slice(0, 2);
  card.innerHTML = `
    <div class="avatar"><div class="avatar-inner">${inner}</div></div>
    <div class="artist-name">${a.name}</div>`;
  card.addEventListener("click", () => {
    playClick();
    openEmbed(a);
  });
  $("artists").appendChild(card);
});

$("embedClose").addEventListener("click", () => { playClick(); closeEmbed(); });
$("embedBack").addEventListener("click", () => { playClick(); closeEmbed(); });

// ---------- NAVIGASI ----------
document.querySelectorAll("[data-go]").forEach(el => {
  el.addEventListener("click", () => {
    playClick();
    show(el.dataset.go);
  });
});

// ---------- IKAN ----------
document.querySelectorAll("[data-fish]").forEach(fish => {
  fish.addEventListener("click", e => {
    playBloop();
    splash(e.clientX, e.clientY);
    setTimeout(() => {
      playLove();
      $("popup").classList.add("show");
    }, 150);
  });
});

function closePopup() {
  playClick();
  $("popup").classList.remove("show");
}
$("popupOk").addEventListener("click", closePopup);
$("popup").addEventListener("click", e => {
  if (e.target.id === "popup") closePopup();
});

// ---------- JAM TASKBAR & WMP ----------
function tick() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  $("clock").textContent = `${hh}:${mm}`;
}
tick();
setInterval(tick, 10000);

let seconds = 3 * 3600 + 30 * 60 + 30;
setInterval(() => {
  seconds++;
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  $("playerTime").textContent = `${h}:${m}:${s}`;
}, 1000);
