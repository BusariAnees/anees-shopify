import { ASCII_PORTRAIT } from './ascii-art.js';

const el = document.getElementById('asciiArt');
const TARGET = ASCII_PORTRAIT.replace(/^\n/, '').replace(/\n$/, '');
const RAMP = " .:-=+*#%@";

// reserve layout space so the page doesn't jump when it fills in
el.textContent = TARGET.replace(/[^\n]/g, ' ');

const chars = TARGET.split('');
const settle = chars.map(c => (c === '\n' || c === ' ') ? 0 : Math.random());

let start = null;
const DURATION = 1800; // ms

function randChar() {
  return RAMP[1 + Math.floor(Math.random() * (RAMP.length - 1))];
}

function frame(ts) {
  if (!start) start = ts;
  const t = Math.min((ts - start) / DURATION, 1);

  let out = '';
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (c === '\n') { out += '\n'; continue; }

    if (settle[i] < t) {
      out += c;                 // settled -> real character
    } else if (t > 0.02 && Math.random() < 0.4) {
      out += randChar();        // still scrambling
    } else {
      out += ' ';
    }
  }
  el.textContent = out;

  if (t < 1) requestAnimationFrame(frame);
  else el.textContent = TARGET; // lock final state
}

// only run once it scrolls into view
new IntersectionObserver((entries, obs) => {
  if (entries[0].isIntersecting) {
    requestAnimationFrame(frame);
    obs.disconnect();
  }
}, { threshold: 0.2 }).observe(el);