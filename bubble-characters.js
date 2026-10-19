(() => {
  const cast = [
    {name:'Batman',suit:'#424d66',trim:'#d5bb65',mask:'bat',skin:'#e5b99c'},
    {name:'Iron Man',suit:'#b65151',trim:'#edc77c',mask:'iron',skin:'#edc77c'},
    {name:'Flash',suit:'#c75250',trim:'#f3d473',mask:'flash',skin:'#ecc5a7'},
    {name:'Deadpool',suit:'#b84b55',trim:'#303641',mask:'deadpool',skin:'#b84b55'},
    {name:'Hermione',suit:'#53506a',trim:'#c79658',mask:'witch',skin:'#f0c9ac'},
    {name:'Dumbledore',suit:'#8275ab',trim:'#d3c5ec',mask:'wizard',skin:'#efd0b3'},
    {name:'Yoda',suit:'#a99d7d',trim:'#d6c7a0',mask:'yoda',skin:'#9fb985'},
    {name:'Darth Vader',suit:'#303541',trim:'#9299a9',mask:'vader',skin:'#343943'},
    {name:'Princess Leia',suit:'#e6e4e0',trim:'#b3b6c4',mask:'leia',skin:'#f0c8ac'},
    {name:'Luke Skywalker',suit:'#e3d6bd',trim:'#9a7e5a',mask:'luke',skin:'#ecc6a8'},
    {name:'Chewbacca',suit:'#976b49',trim:'#d4b898',mask:'chewie',skin:'#aa7b50'},
    {name:'Ahsoka Tano',suit:'#767f94',trim:'#dee7eb',mask:'ahsoka',skin:'#d3976e'}
  ];
  const portrait = (c,seated) => {
    let details = '';
    if(c.mask==='yoda') details='<path d="M16 21 L0 14 Q2 29 18 31 M45 21 L62 14 Q60 29 44 31" fill="#9fb985" stroke="#718d61"/><path d="M13 19 L5 19 L15 25 M48 19 L57 19 L48 25" fill="#c4bd9d"/><path d="M20 19 Q25 16 28 19 M35 19 Q40 16 44 19 M26 12 Q31 10 36 12" stroke="#718d61" fill="none"/><path d="M20 41 L30 55 L42 40 M23 47 L23 62" stroke="#d6c7a0" stroke-width="4" fill="none"/><path d="M47 55 L54 30" stroke="#a5edab" stroke-width="3" stroke-linecap="round"/>';
    if(c.mask==='vader') details='<path d="M14 20 Q15 4 31 6 Q47 5 49 21 L54 39 L41 36 L31 40 L20 36 L8 39Z" fill="#262d38" stroke="#677080"/><path d="M20 22 L28 24 L26 28 L19 27 M34 24 L42 22 L43 27 L36 28Z" fill="#101a29" stroke="#697488" stroke-width=".7"/><path d="M31 27 L24 36 H38Z" fill="#6f7987"/><path d="M28 31 V35 M31 30 V36 M34 31 V35" stroke="#252d38"/><rect x="23" y="47" width="16" height="12" rx="2" fill="#19222e"/><path d="M25 50 H29 M32 50 H36" stroke="#c26c6c" stroke-width="2"/><path d="M25 54 H35" stroke="#a4bfd0"/><path d="M48 55 L55 25" stroke="#ef8791" stroke-width="3" stroke-linecap="round"/>';
    if(c.mask==='leia') details='<path d="M14 23 Q10 7 30 7 Q50 6 48 24 L43 19 Q31 12 18 22Z" fill="#634b3e"/><g fill="#634b3e" stroke="#9b7960" stroke-width="1"><circle cx="12" cy="27" r="8"/><circle cx="50" cy="27" r="8"/></g><path d="M8 26 Q12 21 17 27 Q13 33 9 28 M46 26 Q50 21 55 27 Q51 33 47 28" stroke="#9b7960" fill="none"/><path d="M23 40 L31 45 L39 40" stroke="#fff8f1" stroke-width="4"/><path d="M20 60 L42 60" stroke="#a9adbb" stroke-width="3"/>';
    if(c.mask==='luke') details='<path d="M14 24 Q9 9 25 7 L30 3 L36 8 Q51 7 49 27 L42 20 L36 17 L24 23 L21 18Z" fill="#c2a16d"/><path d="M22 40 L35 52 L26 63 M40 40 L28 52" stroke="#f8eddb" stroke-width="4" fill="none"/><path d="M48 54 L54 24" stroke="#92d5fc" stroke-width="3" stroke-linecap="round"/>';
    if(c.mask==='chewie') details='<path d="M13 32 L12 19 L17 13 L21 15 L24 6 L29 10 L35 5 L39 12 L44 10 L50 23 L49 36 L43 40 L37 37 L31 43 L25 38 L19 40Z" fill="#aa7b50"/><path d="M18 21 L24 23 M37 23 L44 20" stroke="#704f37" stroke-width="2"/><g fill="#292f33"><circle cx="23" cy="25" r="2"/><circle cx="39" cy="25" r="2"/><ellipse cx="31" cy="31" rx="5" ry="3"/></g><path d="M25 36 Q31 40 38 35" stroke="#f0dfc2" stroke-width="2" fill="none"/><path d="M21 41 L40 64" stroke="#534c46" stroke-width="7"/><path d="M22 44 L26 42 M26 49 L30 47 M30 54 L34 52 M35 59 L39 57" stroke="#d7d0b7" stroke-width="3"/><path d="M20 47 L22 55 M40 43 L42 52" stroke="#c89a68"/>';
    if(c.mask==='ahsoka') details='<path d="M12 33 L14 14 L23 4 L31 12 L40 4 L49 15 L52 40 L46 57 L40 38 L42 18 L31 22 L21 17 L22 37 L17 56Z" fill="#e6e9e5" stroke="#6b8c9b"/><path d="M15 17 L22 19 M13 26 L21 29 M14 37 L21 39 M43 18 L49 16 M43 28 L51 25 M43 38 L50 36 M22 9 L27 14 M36 14 L41 9" stroke="#6b8c9b" stroke-width="3"/><path d="M25 21 L28 25 L25 29 M36 21 L33 25 L36 29 M29 33 H34" stroke="#f6efe3" stroke-width="2" fill="none"/><path d="M48 55 L56 30 M13 56 L5 31" stroke="#d7f1ec" stroke-width="2.5" stroke-linecap="round"/>';
    if(c.mask==='bat') details='<path d="M13 28 L12 4 L24 14 L37 14 L48 4 L48 30 L41 34 L37 27 L24 27 L21 34Z" fill="#364258"/><path d="M18 23 L26 25 L19 27 M34 25 L43 23 L42 27Z" fill="#fff8d9"/><path d="M23 47 L27 49 L30 45 L33 49 L38 47 L36 53 L25 53Z" fill="#dfc875"/>';
    if(c.mask==='iron') details='<path d="M16 15 L23 10 H39 L46 15 L44 33 L38 38 H24 L18 33Z" fill="#e5bc6b" stroke="#a47a43"/><path d="M18 22 L27 24 M35 24 L44 22" stroke="#c3f5ff" stroke-width="3"/><path d="M25 32 H37" stroke="#86694d" stroke-width="1.4"/><circle cx="31" cy="50" r="5" fill="#bbf0fa"/><circle cx="31" cy="50" r="2.5" fill="white"/>';
    if(c.mask==='flash') details='<path d="M14 26 Q12 7 31 8 Q49 7 48 27 L41 28 L38 22 H24 L21 28Z" fill="#c75250"/><path d="M15 19 L7 16 L12 24 L7 27 L17 25 M46 19 L55 16 L49 24 L54 27 L45 25" fill="#f3d473"/><circle cx="31" cy="50" r="7" fill="#fff0d9"/><path d="M32 43 L27 51 H31 L29 57 L36 48 H32Z" fill="#e5b94c"/>';
    if(c.mask==='deadpool') details='<path d="M14 24 Q13 7 31 8 Q49 7 48 24 L46 33 Q31 45 16 33Z" fill="#b84b55"/><ellipse cx="22" cy="25" rx="7" ry="10" fill="#303641"/><ellipse cx="40" cy="25" rx="7" ry="10" fill="#303641"/><path d="M17 24 Q22 22 27 25 L25 28 L19 27 M35 25 Q40 22 45 24 L43 27 L37 28Z" fill="#fff7ee"/><path d="M20 42 L42 60 M42 42 L20 60" stroke="#333844" stroke-width="4"/><circle cx="31" cy="62" r="3" fill="#d3b9ae"/>';
    if(c.mask==='witch') details='<path d="M13 33 Q3 30 10 20 Q7 9 19 8 Q30-1 39 8 Q53 6 53 20 Q59 32 48 38 L44 24 L39 16 Q31 24 17 24 L16 39Z" fill="#77523f"/><path d="M20 11 Q11 20 16 30 M44 12 Q52 22 48 31" fill="none" stroke="#a97b55" stroke-width="2"/><path d="M22 40 Q31 48 40 40" stroke="#af6263" stroke-width="5"/><path d="M22 42 L24 58" stroke="#d7b35d" stroke-width="2"/><path d="M43 49 L55 32" stroke="#9c7857" stroke-width="2"/>';
    if(c.mask==='wizard') details='<path d="M13 18 L22 4 L39 2 L47 18Z" fill="#8275ab" stroke="#cab8df"/><path d="M13 17 Q30 22 48 17" stroke="#d3c5ec" stroke-width="3"/><path d="M14 27 L13 46 L21 44 L23 31 M47 26 L49 46 L41 44 L39 30" fill="#dddde7"/><path d="M19 32 Q31 40 43 32 Q43 52 31 65 Q21 52 19 32Z" fill="#eeedf4"/><g fill="none" stroke="#8e8caa" stroke-width="1"><circle cx="23" cy="26" r="5"/><circle cx="39" cy="26" r="5"/><path d="M28 26 H34"/></g><path d="M23 38 Q30 45 39 37 M28 47 L31 58" stroke="#cfcedc" fill="none"/>';
    return `<svg viewBox="0 0 62 88" xmlns="http://www.w3.org/2000/svg"><g class="bubble-hero-body">${c.mask==='bat'?'<path d="M18 40 L5 67 L18 62 L27 69 L34 63 L48 68 L56 64 L44 40Z" fill="#2e354b"/>':''}<g stroke="${c.suit}" stroke-width="7" stroke-linecap="round" fill="none"><path d="${seated?'M25 62 L19 69 L21 80':'M25 61 L23 79'}"/><path d="${seated?'M37 62 L44 69 L43 80':'M37 61 L39 79'}"/></g><path d="M19 40 Q31 35 43 40 L44 63 Q31 68 18 63Z" fill="${c.suit}"/><path d="M20 44 L13 56 M42 44 L48 54" stroke="${c.suit}" stroke-width="7" stroke-linecap="round"/><g fill="${c.skin}"><circle cx="13" cy="57" r="3.5"/><circle cx="48" cy="55" r="3.5"/><ellipse cx="31" cy="25" rx="17" ry="18"/></g><g fill="#383449"><ellipse cx="24" cy="25" rx="2" ry="2.8"/><ellipse cx="38" cy="25" rx="2" ry="2.8"/></g><path d="M27 33 Q31 36 35 32" stroke="#a57067" stroke-width="1.1" fill="none"/><path d="M19 61 H43" stroke="${c.trim}" stroke-width="2"/>${details}<g fill="#353346"><ellipse cx="22" cy="81" rx="6" ry="3"/><ellipse cx="41" cy="81" rx="6" ry="3"/></g></g></svg>`;
  };
  let next = 0;
  document.querySelectorAll('.joke-orb').forEach((bubble,slot) => {
    function decorate() {
      bubble.querySelector('.bubble-character')?.remove();
      const character = cast[next++ % cast.length];
      const badge = document.createElement('span');
      badge.className = 'bubble-character';
      badge.setAttribute('role','img');
      badge.setAttribute('aria-label',character.name);
      badge.title = character.name;
      badge.innerHTML = portrait(character,slot % 2 === 0);
      bubble.append(badge);
    }
    decorate();
    bubble.addEventListener('animationiteration', event => {
      if(event.target === bubble) decorate();
    });
  });
})();
