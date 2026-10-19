(() => {
  const card = document.querySelector('a[href="python-motion-lab/index.html"]');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  card.classList.add('voldemort-perch');
  const visitor = document.createElement('span');
  visitor.className = 'tiny-voldemort';
  visitor.setAttribute('aria-hidden','true');
  visitor.innerHTML = `<span class="apparition-mist"></span><svg class="nagini-drawing" viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="nagini-skin" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a7bd83"/><stop offset=".45" stop-color="#688654"/><stop offset="1" stop-color="#354f3d"/></linearGradient><pattern id="nagini-scales" width="10" height="8" patternUnits="userSpaceOnUse"><path d="M0 0 Q5 8 10 0 M-5 4 Q0 12 5 4 M5 4 Q10 12 15 4" fill="none" stroke="#263e32" stroke-width=".7" opacity=".4"/></pattern></defs><g class="voldy-body nagini-body"><path d="M81 96 Q98 92 90 82 Q83 73 69 80" fill="none" stroke="#57714a" stroke-width="8" stroke-linecap="round"/><ellipse cx="49" cy="94" rx="35" ry="13" fill="url(#nagini-skin)" stroke="#334b36" stroke-width="1"/><path d="M21 91 Q47 103 76 90 M26 85 Q51 94 73 84" fill="none" stroke="#a1b282" stroke-width="4" stroke-linecap="round"/><g class="nagini-neck"><path d="M43 87 Q17 73 41 58 Q65 44 50 29" fill="none" stroke="#344d37" stroke-width="19" stroke-linecap="round"/><path d="M43 87 Q17 73 41 58 Q65 44 50 29" fill="none" stroke="url(#nagini-skin)" stroke-width="17" stroke-linecap="round"/><path d="M42 83 Q24 73 44 61 Q66 45 54 32" fill="none" stroke="#bdc59a" stroke-width="5" stroke-linecap="round"/><path d="M33 19 Q46 7 62 18 Q74 27 68 36 Q54 49 36 35 Q28 30 33 19Z" fill="url(#nagini-skin)" stroke="#405b40" stroke-width="1"/><path d="M34 29 Q49 38 68 29 L66 36 Q49 44 36 34Z" fill="#c0c79e"/><path d="M34 25 Q50 15 67 25" fill="none" stroke="#b0bf8b" stroke-width="1.2"/><ellipse cx="41" cy="25" rx="5.5" ry="6" fill="#e3cd81"/><ellipse cx="60" cy="25" rx="5" ry="5.5" fill="#e3cd81"/><g fill="#28392f"><ellipse cx="42" cy="25" rx="1.5" ry="4.5"/><ellipse cx="60" cy="25" rx="1.4" ry="4"/></g><g fill="#fff9da"><circle cx="43" cy="23" r="1.4"/><circle cx="61" cy="23" r="1.1"/></g><path d="M47 32 Q51 36 57 32" fill="none" stroke="#42583e" stroke-width="1.1" stroke-linecap="round"/><circle cx="48" cy="28" r=".9" fill="#42583e"/><circle cx="54" cy="28" r=".9" fill="#42583e"/><path class="nagini-tongue" d="M52 35 L52 47 M52 47 L48 51 M52 47 L56 51" fill="none" stroke="#c98291" stroke-width="1.5" stroke-linecap="round"/></g><ellipse cx="49" cy="94" rx="34" ry="12" fill="url(#nagini-scales)"/></g></svg><span class="parseltongue"><small>NAGINI · ʃʃʃ…</small>Pythoonnssshh<span class="snake-hiss">〰</span></span>`;
  card.append(visitor);
  let busy = false;
  async function appear() {
    if (busy || document.hidden || preference.matches) return;
    busy = true;
    visitor.classList.add('appearing');
    await new Promise(resolve=>setTimeout(resolve,1400));
    visitor.classList.add('seated');
    await new Promise(resolve=>setTimeout(resolve,900));
    visitor.classList.add('speaking');
    await new Promise(resolve=>setTimeout(resolve,6500));
    visitor.classList.remove('speaking');
    visitor.classList.add('vanishing');
    await new Promise(resolve=>setTimeout(resolve,1300));
    visitor.classList.remove('appearing','seated','vanishing');
    busy = false;
  }
  setTimeout(appear,5000);
  setInterval(appear,30000);
})();
