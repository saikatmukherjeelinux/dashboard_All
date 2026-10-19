(() => {
  const entries = [
    { type:'A NOTE FROM SAIKAT', text:'“Of course my code works. The bugs are just networking with each other.”', credit:'- Saikat Mukherjee' },
    { type:'BREAKING · FICTIONAL WIZARD NEWS', text:'Ministry hires Hermione to fix one spreadsheet. She replaces the entire government with a pivot table.', credit:'The Daily Debugger · Completely made up' },
    { type:'MARKET WATCH · FICTIONAL COMEDY', text:'COFFEE +404% ↑ · SLEEP −99% ↓ · BUGS +∞ ↑. Portfolio diversified across panic, denial, and one working semicolon.', credit:'Imaginary exchange · Not real market data' },
    { type:'BREAKING · FICTIONAL WIZARD NEWS', text:'Voldemort splits his code into seven microservices. Harry destroys one; the other six lose authentication.', credit:'The Daily Debugger · Completely made up' },
    { type:'MARKET WATCH · FICTIONAL COMEDY', text:'CTRL+Z rallies 200% after “one tiny change.” Investor confidence remains stored in an unsaved file.', credit:'Imaginary exchange · Not real market data' },
    { type:'BREAKING · FICTIONAL WIZARD NEWS', text:'Dumbledore awards Gryffindor 500 points for a passing test. Snape requests the coverage report.', credit:'The Daily Debugger · Completely made up' },
    { type:'MARKET WATCH · FICTIONAL COMEDY', text:'RUBBER DUCK +87% ↑ · DEADLINES +300% ↑ · FREE TIME delisted. Analysts recommend holding your breath.', credit:'Imaginary exchange · Not real market data' },
    { type:'BREAKING · FICTIONAL WIZARD NEWS', text:'Ron tries Accio on a missing dependency. Summons 4,000 packages, three security warnings, and a confused owl.', credit:'The Daily Debugger · Completely made up' },
    { type:'MARKET WATCH · FICTIONAL COMEDY', text:'“Works on my machine” futures hit record highs. Production immediately suspends trading.', credit:'Imaginary exchange · Not real market data' },
    { type:'BREAKING · FICTIONAL WIZARD NEWS', text:'Hogwarts bans Time-Turners after Hermione uses one to attend yesterday’s stand-up. The meeting still runs late.', credit:'The Daily Debugger · Completely made up' },
    { type:'BREAKING · FICTIONAL GOTHAM NEWS', text:'Batman buys every cloud provider to prevent downtime. Alfred gently explains that the router is unplugged.', credit:'Gotham Debug Gazette · Completely made up' },
    { type:'BREAKING · FICTIONAL MARVEL NEWS', text:'Doctor Strange checks 14 million deployments. Only one succeeds. Tony asks if anyone tried staging.', credit:'The Daily Stack · Completely made up' },
    { type:'BREAKING · FICTIONAL GOTHAM NEWS', text:'The Riddler demands Batman solve his most fiendish puzzle: naming a variable that describes what it actually does.', credit:'Gotham Debug Gazette · Completely made up' },
    { type:'BREAKING · FICTIONAL MARVEL NEWS', text:'Thanos deletes half the backlog. Product immediately doubles the remaining estimates to restore balance.', credit:'The Daily Stack · Completely made up' },
    { type:'MARKET WATCH · FICTIONAL COMEDY', text:'WAYNE TECH +80% ↑ · BATTERIES −100% ↓. Batman insists his portfolio is diversified. Every holding starts with “Bat.”', credit:'Imaginary Gotham exchange · Not real market data' },
    { type:'BREAKING · FICTIONAL MARVEL NEWS', text:'Spider-Man builds a website. Reviews praise the web design but question why every dependency is hanging from the ceiling.', credit:'The Daily Stack · Completely made up' },
    { type:'BREAKING · FICTIONAL GOTHAM NEWS', text:'Batman refuses to use light mode. Gotham’s energy bill falls, but Alfred still cannot find the Save button.', credit:'Gotham Debug Gazette · Completely made up' },
    { type:'BREAKING · FICTIONAL MARVEL NEWS', text:'Loki creates six identical branches and denies opening any of them. Git blames Loki. For once, Git is correct.', credit:'The Daily Stack · Completely made up' },
    { type:'MARKET WATCH · FICTIONAL COMEDY', text:'STARK CLOUD +300% ↑ · HULK SUPPORT tickets +900% ↑. “HULK CLEAR CACHE” briefly removes the entire data center.', credit:'Imaginary superhero exchange · Not real market data' }
  ];
  const panel = document.getElementById('humorFeed');
  const label = document.getElementById('humorLabel');
  const text = document.getElementById('humorText');
  const credit = document.getElementById('humorCredit');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  setInterval(() => {
    if (document.hidden || panel.matches(':hover, :focus-within')) return;
    const entry = entries[++index % entries.length];
    label.textContent = entry.type;
    text.textContent = entry.text;
    credit.textContent = entry.credit;
    panel.dataset.kind = entry.type.startsWith('MARKET') ? 'market' : entry.type.startsWith('BREAKING') ? 'news' : 'quote';
    if (!preference.matches) panel.animate([{opacity:.35,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}],{duration:400,easing:'ease-out'});
  }, 11000);
})();
