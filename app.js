// ════════════════════════════════════════
// WDS APPLICATION LOGIC
// Weather Disruption Score Calculator & UI Manager
// ════════════════════════════════════════

let currentRegion = null;
const canvas = document.getElementById('bubble-canvas');
const sidebarContent = document.getElementById('sidebar-content');
const sidebarEmpty = document.getElementById('sidebar-empty');
const mapHint = document.getElementById('map-hint');

// ── INITIALIZATION ──
function initApp() {
  renderMap();
  addAccessibilityAttributes();
}

// Safely boot the app regardless of when the script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// ── MAP RENDERING (DYNAMIC BUBBLE CHART) ──
function renderMap() {
  if (!canvas) return;

  // Check if data.js loaded successfully. If not, print error directly to map.
  if (typeof REGIONS === 'undefined') {
    console.error("REGIONS data is undefined. data.js may not have loaded.");
    const errorMsg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    errorMsg.setAttribute("x", "500");
    errorMsg.setAttribute("y", "250");
    errorMsg.setAttribute("fill", "#e11d48");
    errorMsg.setAttribute("text-anchor", "middle");
    errorMsg.textContent = "Error: Data failed to load. Check file paths and console.";
    canvas.appendChild(errorMsg);
    return;
  }
  
  // Clear any existing generated bubbles, but LEAVE the HTML equator line intact
  canvas.querySelectorAll('.bubble').forEach(el => el.remove());

  // Loop through all regions loaded from data.js
  Object.keys(REGIONS).forEach(id => {
    const data = REGIONS[id];
    
    // Calculate the overall WDS score
    const wds = Math.round((data.wsi * 0.6) + (data.tvi * 0.4));
    
    // Scale bubble radius dynamically based on the WDS score
    const radius = 15 + (wds * 0.4);
    
    // Match score to the corresponding safety color
    let colorStr = '#f59e0b'; // Moderate (Amber)
    if (wds < 36) {
      colorStr = '#10b981'; // Low (Green)
    } else if (wds >= 61 && wds < 81) {
      colorStr = '#ea580c'; // High (Orange)
    } else if (wds >= 81) {
      colorStr = '#e11d48'; // Severe (Red)
    }

    // Default to center if coordinates are missing
    const x = data.x || 500;
    const y = data.y || 250;

    // Create SVG Group Container for each region
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "bubble");
    g.setAttribute("id", `grp-${id}`);
    g.setAttribute("data-region", id);
    
    // FIX: Override CSS transform-origin with explicit coordinates to prevent Safari bug
    g.style.transformOrigin = `${x}px ${y}px`;
    
    // Add pulsing warning animation to severe threat areas
    if (wds >= 81) {
      g.classList.add("pulse-severe");
    }
    
    // Click & Keyboard Enter event triggers
    g.addEventListener('click', () => selectRegion(id));
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectRegion(id);
      }
    });

    // Create the visual Circle
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", radius);
    
    // FIX: Use separate fill and fill-opacity to guarantee cross-browser compatibility
    circle.setAttribute("fill", colorStr);
    circle.setAttribute("fill-opacity", "0.25");
    circle.setAttribute("stroke", colorStr);
    circle.setAttribute("stroke-width", "2");
    circle.setAttribute("id", `circ-${id}`);
    circle.style.transition = "all 0.3s ease";

    // Create the Map Text Label
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y + radius + 15);
    text.setAttribute("fill", "#94a3b8");
    text.setAttribute("font-size", "11");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("class", "pointer-events-none font-semibold tracking-wide");
    text.textContent = data.name || id;

    // Compile SVG Nodes
    g.appendChild(circle);
    g.appendChild(text);
    canvas.appendChild(g);
  });
}

// ── REGION SELECTION MANAGEMENT ──
function selectRegion(regionId) {
  // Reset all active stroke highlights
  document.querySelectorAll('circle[id^="circ-"]').forEach(circ => {
    circ.classList.remove('active-bubble');
    circ.setAttribute('stroke-width', '2');
  });
  
  // Highlight the chosen bubble
  const activeCirc = document.getElementById(`circ-${regionId}`);
  if (activeCirc) {
    activeCirc.classList.add('active-bubble');
    activeCirc.setAttribute('stroke-width', '4');
  }
  
  currentRegion = regionId;
  
  // Retrieve corresponding datasets and push to sidebar UI
  const regionData = REGIONS[regionId];
  if (regionData) {
    displayRegionData(regionData);
    if (sidebarEmpty) sidebarEmpty.style.display = 'none';
    if (sidebarContent) sidebarContent.classList.add('visible');
    if (mapHint) mapHint.classList.add('hidden');
  }
}

// ── SIDEBAR RENDERING ──
function displayRegionData(data) {
  const clusterEl = document.getElementById('s-cluster');
  const nameEl = document.getElementById('s-name');
  const subEl = document.getElementById('s-sub');
  const anomalyEl = document.getElementById('s-anomaly');

  if (clusterEl) clusterEl.textContent = data.cluster || '';
  if (nameEl) nameEl.textContent = data.name || '';
  if (subEl) subEl.textContent = data.sub || '';
  if (anomalyEl) anomalyEl.textContent = data.anomaly || '';
  
  const wds = Math.round((data.wsi * 0.6) + (data.tvi * 0.4));
  
  updateGauge(wds, data.wsi, data.tvi);
  
  if (data.flights && data.accommodation && data.experiences) {
    displayRiskCards(data);
  }
  if (data.subindex) {
    displaySubindexGrid(data.subindex);
  }
  if (data.trend) {
    displayTrendBadge(data.trend);
  }
}

// ── GAUGE DIAL & PROGRESS BARS ANIMATION ──
function updateGauge(wds, wsi, tvi) {
  const gaugeArc = document.getElementById('gauge-arc');
  const gaugeScore = document.getElementById('gauge-score');
  const wdsBar = document.getElementById('wds-bar');
  const wsiBar = document.getElementById('wsi-bar');
  const tviBar = document.getElementById('tvi-bar');
  
  const wdsVal = document.getElementById('wds-val');
  const wsiVal = document.getElementById('wsi-val');
  const tviVal = document.getElementById('tvi-val');
  
  const clampedWDS = Math.min(Math.max(wds, 0), 100);
  const clampedWSI = Math.min(Math.max(wsi, 0), 100);
  const clampedTVI = Math.min(Math.max(tvi, 0), 100);
  
  let arcColor = '#10b981';
  if (clampedWDS >= 36 && clampedWDS < 61) arcColor = '#f59e0b';
  if (clampedWDS >= 61 && clampedWDS < 81) arcColor = '#ea580c';
  if (clampedWDS >= 81) arcColor = '#e11d48';
  
  if (gaugeArc) {
    const arcLength = 141.4;
    const arcOffset = arcLength * (1 - clampedWDS / 100);
    gaugeArc.style.strokeDashoffset = arcOffset;
    gaugeArc.style.stroke = arcColor;
  }
  
  if (gaugeScore) {
    gaugeScore.textContent = clampedWDS;
    gaugeScore.style.color = arcColor;
  }
  
  if (wdsBar) wdsBar.style.width = clampedWDS + '%';
  if (wsiBar) wsiBar.style.width = clampedWSI + '%';
  if (tviBar) tviBar.style.width = clampedTVI + '%';
  
  if (wdsVal) wdsVal.textContent = clampedWDS;
  if (wsiVal) wsiVal.textContent = clampedWSI;
  if (tviVal) tviVal.textContent = clampedTVI;
}

// ── SECTOR ANALYSIS (FLIGHTS, HOTELS, TOURS) ──
function displayRiskCards(data) {
  const risksContainer = document.getElementById('risk-cards');
  if (!risksContainer) return;
  risksContainer.innerHTML = '';
  
  const risks = [
    { sector: 'Flights', data: data.flights, icon: '✈️' },
    { sector: 'Accommodation', data: data.accommodation, icon: '🏨' },
    { sector: 'Experiences', data: data.experiences, icon: '🎯' }
  ];
  
  risks.forEach(({ sector, data: riskData, icon }) => {
    if (!riskData) return;
    const card = document.createElement('div');
    card.className = 'risk-card';
    
    const iconEl = document.createElement('div');
    iconEl.className = `risk-icon ${riskData.level}`;
    iconEl.textContent = icon;
    
    const body = document.createElement('div');
    body.className = 'risk-body';
    
    const title = document.createElement('div');
    title.className = 'risk-title';
    title.innerHTML = `<span>${sector}</span><span class="risk-pill ${riskData.level}">${riskData.level}</span>`;
    
    const desc = document.createElement('div');
    desc.className = 'risk-desc';
    desc.textContent = riskData.desc;
    
    body.appendChild(title);
    body.appendChild(desc);
    card.appendChild(iconEl);
    card.appendChild(body);
    risksContainer.appendChild(card);
  });
}

// ── DETAILED CLIMATE & TOURISM METRICS GRID ──
function displaySubindexGrid(subindex) {
  const grid = document.getElementById('subindex-grid');
  if (!grid) return;
  grid.innerHTML = '';
  
  const labels = {
    intensityDelta: 'Intensity',
    duration: 'Duration',
    predictability: 'Predict.',
    infraSensitivity: 'Infra',
    resourceDependency: 'Resrc.',
    peakSeasonality: 'Season.'
  };
  
  Object.entries(subindex).forEach(([key, value]) => {
    const cell = document.createElement('div');
    cell.className = 'subindex-cell';
    
    const keyEl = document.createElement('div');
    keyEl.className = 'subindex-key';
    keyEl.textContent = labels[key] || key;
    
    const valEl = document.createElement('div');
    valEl.className = 'subindex-val';
    valEl.textContent = value;
    
    cell.appendChild(keyEl);
    cell.appendChild(valEl);
    grid.appendChild(cell);
  });
}

// ── TREND COMPONENT BADGE ──
function displayTrendBadge(trend) {
  const container = document.getElementById('trend-badge');
  if (!container) return;
  container.innerHTML = '';
  
  const trendMap = {
    up: { icon: '↗', label: 'Rising', class: 'trend-up' },
    down: { icon: '↘', label: 'Declining', class: 'trend-down' },
    flat: { icon: '→', label: 'Stable', class: 'trend-flat' }
  };
  
  const trendData = trendMap[trend] || trendMap.flat;
  
  const badge = document.createElement('div');
  badge.className = `trend-badge ${trendData.class}`;
  badge.innerHTML = `<span>${trendData.icon}</span><span>${trendData.label}</span>`;
  
  container.appendChild(badge);
}

// ── ACCESSIBILITY CONTROL ──
function addAccessibilityAttributes() {
  document.querySelectorAll('.bubble').forEach(element => {
    const regionId = element.getAttribute('data-region');
    const regionName = REGIONS[regionId]?.name || regionId;
    
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
    element.setAttribute('aria-label', `Select ${regionName} region`);
  });
  
  if (canvas) {
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Interactive bubble map showing weather disruption indices for global regions');
  }
}

// ── RESPONSIVE ADAPTABILITY ──
window.addEventListener('resize', () => {
  if (window.innerWidth <= 768 && sidebarContent && sidebarContent.classList.contains('visible')) {
    if (mapHint) mapHint.classList.add('hidden');
  } else if (window.innerWidth > 768 && sidebarContent && !sidebarContent.classList.contains('visible')) {
    if (mapHint) mapHint.classList.remove('hidden');
  }
});

// ── KEYBOARD CONTROLS (ESCAPE KEY DESELECT) ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && currentRegion) {
    currentRegion = null;
    document.querySelectorAll('circle[id^="circ-"]').forEach(circ => {
      circ.classList.remove('active-bubble');
      circ.setAttribute('stroke-width', '2');
    });
    if (sidebarEmpty) sidebarEmpty.style.display = 'flex';
    if (sidebarContent) sidebarContent.classList.remove('visible');
    if (mapHint) mapHint.classList.remove('hidden');
  }
});

// ── REDUCED MOTION SAFEGUARDS ──
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[style*="transition"]').forEach(el => {
    el.style.transition = 'none';
  });
}
