(() => {
  const sidebar = document.getElementById('lessonSidebar');
  const toggle = document.getElementById('sidebarToggle');
  const label = document.getElementById('sidebarToggleLabel');
  const storageKey = 'dsa-sidebar-collapsed';

  function setCollapsed(collapsed) {
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    sidebar.inert = collapsed;
    sidebar.setAttribute('aria-hidden', String(collapsed));
    toggle.setAttribute('aria-expanded', String(!collapsed));
    const action = collapsed ? 'Show' : 'Hide';
    label.textContent = `${action} index`;
    toggle.setAttribute('aria-label', `${action} lesson index`);
    toggle.title = `${action} lesson index`;
    toggle.firstElementChild.textContent = collapsed ? '›' : '‹';
  }

  let collapsed = false;
  try { collapsed = localStorage.getItem(storageKey) === 'true'; } catch {}
  setCollapsed(collapsed);
  toggle.addEventListener('click', () => {
    collapsed = !collapsed;
    setCollapsed(collapsed);
    try { localStorage.setItem(storageKey, String(collapsed)); } catch {}
  });
})();
