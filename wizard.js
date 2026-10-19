(() => {
  const wizard = document.createElement('div');
  wizard.className = 'magic-wizard';
  wizard.setAttribute('aria-hidden', 'true');
  wizard.innerHTML = `<svg viewBox="0 0 90 120" xmlns="http://www.w3.org/2000/svg"><g class="wizard-person"><g class="wizard-feet" stroke="#313745" stroke-width="8" stroke-linecap="round"><path d="M35 96 L32 112 L26 113"/><path d="M50 96 L53 112 L59 113"/></g><path d="M29 49 Q42 42 56 49 L68 99 Q45 109 18 99Z" fill="#313447" stroke="#5c5871"/><path d="M34 52 L42 64 L50 52 L54 96 H31Z" fill="#8e96a7"/><path d="M36 51 L42 55 L48 51 L44 60 L42 75 L39 60Z" fill="#a55054"/><path d="M30 49 Q44 60 56 48" stroke="#a14b50" stroke-width="6" fill="none"/><path d="M30 51 L29 72" stroke="#d4b466" stroke-width="4"/><path d="M26 62 L20 77" stroke="#3e4054" stroke-width="10" stroke-linecap="round"/><g class="wizard-arm"><path d="M55 57 L68 65 L76 48" fill="none" stroke="#46465b" stroke-width="9" stroke-linecap="round"/><circle cx="76" cy="46" r="4" fill="#edc3a6"/><path d="M77 45 L86 20" stroke="#a78a65" stroke-width="2.6" stroke-linecap="round"/><circle class="wand-light" cx="86" cy="20" r="4" fill="#ffe1a1"/></g><path d="M37 39 V49 Q43 54 49 48 V37" fill="#e8bda0"/><ellipse cx="43" cy="28" rx="18" ry="20" fill="#f1ceb0"/><path d="M24 29 Q17 7 35 8 L39 3 L44 9 L52 5 L54 12 Q65 13 61 31 L55 24 L51 19 L42 23 L35 17 L30 28Z" fill="#353039"/><path d="M46 15 L42 20 L46 20 L43 25" stroke="#c1827e" stroke-width="1.1" fill="none"/><g stroke="#383848" stroke-width="1.6" fill="none"><circle cx="34" cy="30" r="7"/><circle cx="51" cy="30" r="7"/><path d="M41 29 H44 M27 28 L24 27 M58 28 L61 27"/></g><g fill="#436050"><circle cx="35" cy="30" r="2"/><circle cx="50" cy="30" r="2"/></g><path d="M39 41 Q43 44 48 40" stroke="#a16d64" stroke-width="1.2" fill="none"/></g></svg><span class="magic-caption">Reparo!</span><div class="wand-sparks">✦<span>✧</span>✦</div>`;
  document.body.append(wizard);
  const pause = ms => new Promise(resolve => setTimeout(resolve,ms));
  window.restoreBugsWithMagic = async bugs => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bugs.style.removeProperty('visibility');
      return;
    }
    const rect = bugs.getBoundingClientRect();
    wizard.style.top = `${Math.max(20,rect.top + window.scrollY-65)}px`;
    const destination = Math.max(10,Math.min(innerWidth-105,rect.right+20)) + window.scrollX;
    const animate = (frames,duration) => wizard.animate(frames,{duration,easing:'ease-in-out',fill:'forwards'}).finished;
    wizard.classList.add('onstage','wizard-walking');
    try {
      await animate([{transform:'translateX(-110px)'},{transform:`translateX(${destination}px)`}],1600);
      wizard.classList.remove('wizard-walking');
      wizard.classList.add('casting');
      await pause(900);
      bugs.style.removeProperty('visibility');
      await bugs.animate([{opacity:0,filter:'blur(6px)',textShadow:'0 0 25px #ffe1a1'},{opacity:1,filter:'blur(0)',textShadow:'0 0 16px #b6a0ff',offset:.65},{opacity:1,textShadow:'none'}],{duration:1200,easing:'ease-out'}).finished;
      await pause(600);
      wizard.classList.remove('casting');
      wizard.classList.add('wizard-walking');
      await animate([{transform:`translateX(${destination}px)`},{transform:`translateX(${innerWidth+110}px)`}],1500);
    } finally {
      bugs.style.removeProperty('visibility');
      wizard.classList.remove('onstage','casting','wizard-walking');
      wizard.getAnimations().forEach(animation=>animation.cancel());
    }
  };
})();
