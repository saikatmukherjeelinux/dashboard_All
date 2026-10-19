(() => {
  const quotes = [
    'I cached my imposter syndrome. Now I only feel inadequate in O(1).',
    'My code has no bugs. Just undocumented plot twists.',
    'I write clean code. Then I add the features.',
    'It worked yesterday. Apparently, my code has weekends.',
    'My algorithm is O(please work).',
    'I would explain my code, but we are both seeing it for the first time.',
    'One quick fix later, I now have three exciting new problems.',
    'I have a backup plan. It is called Ctrl + Z.',
    'My rubber duck has requested a transfer.',
    'I finally understood recursion. The explanation referred me to myself.',
    'My side project has microservices. Each service serves one excuse.',
    'I made my problems immutable. Now I need new problems to change anything.',
    'We removed the single point of failure. Now failure is distributed.',
    'My function is pure. All the side effects are in my personal life.',
    'I added a layer of abstraction. The problem is still there, but now it has an interface.',
    'The race condition disappeared when I logged it. Apparently it values privacy.',
    'I named the variable temporary. It has outlived three product roadmaps.',
    'My garbage collector handles everything except the ideas I refuse to let go.',
    'I used a weak reference for my deadlines. They keep disappearing.',
    'I put my expectations in a try block. Reality went straight to finally.',
    'We achieved eventual consistency. Eventually, everyone agreed it was broken.',
    'My tests and my code agree perfectly. They share the same misunderstanding.',
    'I fixed the off-by-one error. There are now two of them.',
    'I normalized my database. My sleep schedule remains a many-to-many problem.',
    'The deadlock is a team exercise. Everyone is waiting for someone else.',
    'My code is self-documenting. Unfortunately, it writes mystery novels.',
    'I put my life in a container. It still refuses to start on Mondays.',
    'My debugger knows all my breakpoints. My manager keeps adding new ones.',
    'I optimized the meeting. It now wastes everyone’s time in parallel.',
    'My API returns 200 OK. Emotionally, it is a 503.',
    'I finally achieved work-life balance. Both are equally out of memory.',
    'My password is incorrect. The computer keeps reminding me.',
    'I wrote a TODO for my procrastination. Excellent progress.',
    'The code review was constructive. We are rebuilding everything.',
    'My feature flag has more commitment issues than I do.',
    'I solved the memory leak by forgetting the project.',
    'My deployment strategy is blue-green. My face handles the other colors.',
    'I practice defensive programming. Mostly defending my estimates.',
    'My database and I have trust issues. We both insist on transactions.',
    'I renamed the bug to legacy behavior. Suddenly, fixing it requires approval.',
    'My code is loosely coupled. Nobody knows who is responsible.',
    'I automated my chores. Now maintaining the automation is my chore.',
    'The sprint is agile. The deadline is a concrete wall.',
    'I asked AI to explain my regex. It requested a second opinion.',
    'I have excellent exception handling. Every mistake gets a unique excuse.',
    'Hermione uses type hints. Ron considers the error message a spoiler.',
    'Harry’s invisibility cloak is impressive. My CSS disappears without magic.',
    'Snape reviewed my pull request. Ten points from readable code.',
    'Dumbledore keeps secrets in environment variables. Still tells Harry nothing.',
    'Voldemort cannot use facial recognition. The nose field is required.',
    'Hogwarts has moving staircases. Finally, a physical version of changing requirements.',
    'The Sorting Hat placed my code in Slytherin. Too many hidden dependencies.',
    'Dobby is a free elf. My trial subscription has questions.',
    'Accio documentation! A dusty README lands on the wrong branch.',
    'A Horcrux is just a backup with an unacceptable recovery procedure.',
    'Batman has a contingency plan for everyone except the printer.',
    'Alfred handles incident response. Batman only handles dramatic entrances.',
    'Gotham needs fewer vigilantes and one reliable streetlight API.',
    'The Bat-Signal is just a push notification with terrible battery efficiency.',
    'Bruce Wayne calls it a Batcomputer. Finance calls it an unapproved expense.',
    'Batman encrypted his diary. Every entry still starts with “Dear darkness.”',
    'The Riddler wrote our onboarding guide. Nobody has joined successfully.',
    'Batman’s dark mode has a dark mode.',
    'Iron Man built a suit in a cave. I need three monitors to fix a margin.',
    'Thor says his code is event-driven. Every event is thunder.',
    'Captain America has one dependency: a very old shield library.',
    'Hulk does not resolve merge conflicts. He makes both branches disappear.',
    'Doctor Strange uses portals because the VPN takes too long.',
    'Ant-Man reduced our bundle size. Unfortunately, nobody can find the bundle.',
    'Loki passed every identity check. That was the identity check’s mistake.',
    'Deadpool breaks the fourth wall because the other three failed unit tests.',
    'Wanda changed reality. The stakeholder still preferred the previous version.',
    'Spider-Man’s web app has great coverage. Mostly across the furniture.',
    'Yoda reviewed my syntax. Correct, the result is. Maintainable, it is not.',
    'Darth Vader finds my lack of tests disturbing. So does the coverage report.',
    'The Death Star had one exposed endpoint. Security called it a minor issue.',
    'R2-D2 communicates entirely in error codes. Finally, someone honest.',
    'C-3PO supports six million languages. Our build fails in all of them.',
    'The Force is a global variable. Everyone uses it; nobody owns it.',
    'Han Solo deploys directly to production. Never tell him the odds.',
    'Leia sends one hologram. Our team schedules six alignment meetings.',
    'Chewbacca’s code review is unreadable, but the concern is clear.',
    'Luke switched off his targeting computer. DevOps opened an incident.',
    'The Mandalorian follows the Way. Our team follows a wiki last updated in 2019.',
    'A Jedi uses the Force. A senior developer uses the source.'
  ];
  const bubbles = [...document.querySelectorAll('.joke-orb')];
  function updateTravel() {
    const stream = document.getElementById('jokeStream');
    const signature = document.querySelector('.signature-quote');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion) {
      const height = signature.getBoundingClientRect().bottom - stream.getBoundingClientRect().top;
      stream.style.height = `${Math.max(100, height)}px`;
    } else {
      stream.style.removeProperty('height');
    }
    const top = stream.getBoundingClientRect().top + window.scrollY;
    const distance = top + stream.offsetHeight + 160;
    stream.style.setProperty('--joke-travel', `-${distance}px`);
  }
  updateTravel();
  window.addEventListener('resize', updateTravel);
  window.addEventListener('load', updateTravel);
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const spider = document.querySelector('.spider-visitor');
  let spiderBusy = false;
  async function spiderVisit() {
    if (spiderBusy || document.hidden || motionPreference.matches) return;
    const left = document.querySelector('.intro-details').getBoundingClientRect();
    const right = document.querySelector('.joke-sky').getBoundingClientRect();
    const bugs = document.getElementById('spiderBugs');
    const word = bugs.getBoundingClientRect();
    const startX = (left.right + right.left) / 2;
    spider.style.left = `${startX + window.scrollX}px`;
    const depth = Math.max(40, word.top + window.scrollY - 62);
    const reachX = word.left + word.width / 2 - startX;
    const cargo = document.createElement('span');
    cargo.className = 'spider-cargo';
    cargo.textContent = bugs.textContent;
    cargo.hidden = true;
    spider.append(cargo);
    spiderBusy = true;
    spider.classList.add('is-visiting');
    try {
      await spider.animate([
        { transform: 'translate(0,-90px)' },
        { transform: `translate(0,${depth + 7}px)`, offset: .8 },
        { transform: `translate(0,${depth}px)` }
      ], { duration: 2600, easing: 'ease-in-out', fill: 'forwards' }).finished;
      await spider.animate([
        { transform: `translate(0,${depth}px)` },
        { transform: `translate(${reachX}px,${depth}px)` }
      ], { duration: 1000, easing: 'ease-in-out', fill: 'forwards' }).finished;
      bugs.style.visibility = 'hidden';
      cargo.hidden = false;
      await new Promise(resolve => setTimeout(resolve, 700));
      await spider.animate([
        { transform: `translate(${reachX}px,${depth}px)` },
        { transform: `translate(${reachX}px,-110px)` }
      ], { duration: 2700, easing: 'ease-in-out', fill: 'forwards' }).finished;
      if (window.restoreBugsWithMagic) await window.restoreBugsWithMagic(bugs);
      else await new Promise(resolve => setTimeout(resolve, 800));
    } finally {
      bugs.style.removeProperty('visibility');
      cargo.remove();
      spider.classList.remove('is-visiting');
      spider.getAnimations().forEach(animation => animation.cancel());
      spiderBusy = false;
    }
  }
  window.setTimeout(spiderVisit, 3500);
  window.setInterval(spiderVisit, 18000);
  let index = bubbles.length;
  bubbles.forEach((bubble, slot) => {
    bubble.textContent = quotes[slot];
    bubble.addEventListener('animationiteration', event => {
      if (event.target !== bubble) return;
      bubble.textContent = quotes[index++ % quotes.length];
    });
  });
})();
