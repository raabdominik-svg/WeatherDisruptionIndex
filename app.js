// ════════════════════════════════════════
// WDS APPLICATION LOGIC - FULLY INTEGRATED
// ════════════════════════════════════════

let currentRegion = null;
const canvas = document.getElementById('bubble-canvas');
const sidebarContent = document.getElementById('sidebar-content');
const sidebarEmpty = document.getElementById('sidebar-empty');
const mapHint = document.getElementById('map-hint');

function initApp() {
  if (typeof REGIONS === 'undefined') return;
  renderMap();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function renderMap() {
  if (!canvas) return;
  canvas.querySelectorAll('.bubble').forEach(el => el.remove());

  Object.keys(REGIONS).forEach(id => {
    const data = REGIONS[id];
    const wds = Math.round((data.wsi * 0.6) + (data.tvi * 0.4));
    const radius = 15 + (wds * 0.4);
    
    let colorStr = wds < 36 ? '#10b981' : (wds >= 81 ? '#e11d48' : (wds >= 61 ? '#ea580c' : '#f59e0b'));

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "bubble");
    g.setAttribute("data-region", id);
    g.addEventListener('click', () => selectRegion(id));

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", data.x || 500);
    circle.setAttribute("cy", data.y || 250);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", colorStr);
    circle.setAttribute("fill-opacity", "0.25");
    circle.setAttribute("stroke", colorStr);
    circle.setAttribute("stroke-width", "2");
    circle.setAttribute("id", `circ-${id}`);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", data.x || 500);
    text.setAttribute("y", (data.y || 250) + radius + 15);
    text.setAttribute("fill", "#94a3b8");
    text.setAttribute("font-size", "11");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("class", "pointer-events-none");
    text.textContent = data.name;

    g.appendChild(circle);
    g.appendChild(text);
    canvas.appendChild(g);
  });
}

function selectRegion(regionId) {
  currentRegion = regionId;
  const data = REGIONS[regionId];
  if (!data) return;

  if (sidebarEmpty) sidebarEmpty.style.display = 'none';
  if (sidebarContent) sidebarContent.classList.add('visible');
  if (mapHint) mapHint.classList.add('hidden');

  document.getElementById('s-cluster').textContent = data.cluster;
  document.getElementById('s-name').textContent = data.name;
  document.getElementById('s-sub').textContent = data.sub;
  document.getElementById('s-anomaly').textContent = data.anomaly;

  updateGauge(Math.round((data.wsi * 0.6) + (data.tvi * 0.4)), data.wsi, data.tvi);
  
  if (data.riskCards) renderRiskCards(data.riskCards);
  if (data.subindex) renderSubindex(data.subindex);
  if (data.trend) renderTrend(data.trend);
}

function updateGauge(wds, wsi, tvi) {
  const scoreEl = document.getElementById('gauge-score');
  if (scoreEl) {
    scoreEl.textContent = wds;
    scoreEl.style.color = wds >= 81 ? '#e11d48' : (wds >= 61 ? '#ea580c' : (wds >= 36 ? '#f59e0b' : '#10b981'));
  }
  
  const updates = [
    { bar: 'wsi-bar', val: 'wsi-val', num: wsi },
    { bar: 'tvi-bar', val: 'tvi-val', num: tvi },
    { bar: 'wds-bar', val: 'wds-val', num: wds }
  ];

  updates.forEach(u => {
    const b = document.getElementById(u.bar);
    const v = document.getElementById(u.val);
    if (b) b.style.width = u.num + '%';
    if (v) v.textContent = u.num;
  });

  const arc = document.getElementById('gauge-arc');
  if (arc) arc.style.strokeDashoffset = 141.4 * (1 - Math.min(wds, 100) / 100);
}

function renderRiskCards(risks) {
  const container = document.getElementById('risk-cards');
  if (!container) return;
  container.innerHTML = risks.map(r => `
    <div class="risk-card">
      <div class="risk-icon ${r.level.toLowerCase()}">${r.icon}</div>
      <div class="risk-body">
        <div class="risk-title">${r.title}<span class="risk-pill ${r.level.toLowerCase()}">${r.level}</span></div>
        <div class="risk-desc">${r.desc}</div>
      </div>
    </div>`).join('');
}

function renderSubindex(si) {
  const container = document.getElementById('subindex-grid');
  if (!container) return;
  container.innerHTML = Object.entries(si).map(([k, v]) => `
    <div class="subindex-cell">
      <div class="subindex-key">${k}</div>
      <div class="subindex-val">${v}</div>
    </div>`).join('');
}

function renderTrend(trend) {
  const container = document.getElementById('trend-badge');
  if (!container) return;
  container.innerHTML = `<div class="trend-badge trend-${trend}">Trend: ${trend.toUpperCase()}</div>`;
}
