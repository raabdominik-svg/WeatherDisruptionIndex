// ════════════════════════════════════════
// WDS APPLICATION LOGIC
// Weather Disruption Score Calculator & UI Manager
// ════════════════════════════════════════

let currentRegion = null;
const regionElements = document.querySelectorAll('.region');
const sidebarContent = document.getElementById('sidebar-content');
const sidebarEmpty = document.getElementById('sidebar-empty');
const mapHint = document.getElementById('map-hint');

// ── INITIALIZATION ──
document.addEventListener('DOMContentLoaded', () => {
  initializeRegionListeners();
  addAccessibilityAttributes();
  debounceHoverEffects();
});

// ── REGION INTERACTION ──
function initializeRegionListeners() {
  regionElements.forEach(element => {
    const regionId = element.getAttribute('data-region');
    
    element.addEventListener('click', () => selectRegion(regionId));
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectRegion(regionId);
      }
    });
  });
}

function selectRegion(regionId) {
  // Remove active state from all regions
  regionElements.forEach(el => el.classList.remove('active'));
  
  // Set new active region
  const activeElement = document.getElementById(`r-${regionId}`);
  if (activeElement) activeElement.classList.add('active');
  
  currentRegion = regionId;
  
  // Update sidebar
  const regionData = REGIONS[regionId];
  if (regionData) {
    displayRegionData(regionData);
    sidebarEmpty.style.display = 'none';
    sidebarContent.classList.add('visible');
    mapHint.classList.add('hidden');
  }
}

function displayRegionData(data) {
  // Header
  document.getElementById('s-cluster').textContent = data.cluster;
  document.getElementById('s-name').textContent = data.name;
  document.getElementById('s-sub').textContent = data.sub;
  
  // Calculate WDS score
  const wds = Math.round((data.wsi * 0.6) + (data.tvi * 0.4));
  
  // Gauge and score display
  updateGauge(wds, data.wsi, data.tvi);
  
  // Anomaly section
  document.getElementById('s-anomaly').textContent = data.anomaly;
  
  // Risk cards
  displayRiskCards(data);
  
  // Subindex grid
  displaySubindexGrid(data.subindex);
  
  // Trend badge
  displayTrendBadge(data.trend);
}

function updateGauge(wds, wsi, tvi) {
  const gaugeArc = document.getElementById('gauge-arc');
  const gaugeScore = document.getElementById('gauge-score');
  const wdsBar = document.getElementById('wds-bar');
  const wsiBar = document.getElementById('wsi-bar');
  const tviBar = document.getElementById('tvi-bar');
  
  const wdsVal = document.getElementById('wds-val');
  const wsiVal = document.getElementById('wsi-val');
  const tviVal = document.getElementById('tvi-val');
  
  // Clamp values to 0-100
  const clampedWDS = Math.min(Math.max(wds, 0), 100);
  const clampedWSI = Math.min(Math.max(wsi, 0), 100);
  const clampedTVI = Math.min(Math.max(tvi, 0), 100);
  
  // Determine color based on WDS score
  let arcColor = '#1A6FA8'; // Low
  if (clampedWDS >= 50 && clampedWDS < 75) arcColor = '#C45E0A'; // Mid
  if (clampedWDS >= 75) arcColor = '#8B1A1A'; // High
  
  // Arc animation (stroke-dashoffset)
  const arcLength = 141.4;
  const arcOffset = arcLength * (1 - clampedWDS / 100);
  gaugeArc.style.strokeDashoffset = arcOffset;
  gaugeArc.style.stroke = arcColor;
  
  // Score display
  gaugeScore.textContent = clampedWDS;
  gaugeScore.style.color = arcColor;
  
  // Bar fills
  wdsBar.style.width = clampedWDS + '%';
  wsiBar.style.width = clampedWSI + '%';
  tviBar.style.width = clampedTVI + '%';
  
  // Values
  wdsVal.textContent = clampedWDS;
  wsiVal.textContent = clampedWSI;
  tviVal.textContent = clampedTVI;
}

function displayRiskCards(data) {
  const risksContainer = document.getElementById('risk-cards');
  risksContainer.innerHTML = '';
  
  const risks = [
    { sector: 'Flights', data: data.flights, icon: '✈️' },
    { sector: 'Accommodation', data: data.accommodation, icon: '🏨' },
    { sector: 'Experiences', data: data.experiences, icon: '🎯' }
  ];
  
  risks.forEach(({ sector, data: riskData, icon }) => {
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

function displaySubindexGrid(subindex) {
  const grid = document.getElementById('subindex-grid');
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

function displayTrendBadge(trend) {
  const container = document.getElementById('trend-badge');
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

// ── ACCESSIBILITY ──
function addAccessibilityAttributes() {
  regionElements.forEach(element => {
    const regionId = element.getAttribute('data-region');
    const regionName = REGIONS[regionId]?.name || regionId;
    
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
    element.setAttribute('aria-label', `Select ${regionName} region`);
  });
  
  // SVG map accessibility
  const worldMap = document.getElementById('world-map');
  worldMap.setAttribute('role', 'img');
  worldMap.setAttribute('aria-label', 'Interactive world map showing weather disruption indices for 14 regions');
}

// ── PERFORMANCE ──
function debounceHoverEffects() {
  let hoverTimeout;
  
  regionElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      element.style.filter = 'brightness(1.35)';
    });
    
    element.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => {
        if (!element.classList.contains('active')) {
          element.style.filter = '';
        }
      }, 100);
    });
  });
}

// ── RESPONSIVE SIDEBAR HINT ──
window.addEventListener('resize', () => {
  if (window.innerWidth <= 768 && sidebarContent.classList.contains('visible')) {
    mapHint.classList.add('hidden');
  } else if (window.innerWidth > 768 && !sidebarContent.classList.contains('visible')) {
    mapHint.classList.remove('hidden');
  }
});

// ── KEYBOARD NAVIGATION ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && currentRegion) {
    currentRegion = null;
    regionElements.forEach(el => el.classList.remove('active'));
    sidebarEmpty.style.display = 'flex';
    sidebarContent.classList.remove('visible');
    mapHint.classList.remove('hidden');
  }
});

// ── ANIMATION PREFERENCES ──
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[style*="transition"]').forEach(el => {
    el.style.transition = 'none';
  });
}