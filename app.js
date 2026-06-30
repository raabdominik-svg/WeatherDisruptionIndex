// ════════════════════════════════════════
// WDS APPLICATION LOGIC - UI STABILITY VERSION
// ════════════════════════════════════════

let currentRegion = null;
const canvas = document.getElementById('bubble-canvas');
const sidebarContent = document.getElementById('sidebar-content');
const sidebarEmpty = document.getElementById('sidebar-empty');
const mapHint = document.getElementById('map-hint');

// ── INITIALIZATION ──
window.addEventListener('load', () => {
    if (typeof REGIONS !== 'undefined') renderMap();
});

function renderMap() {
    if (!canvas) return;
    Object.keys(REGIONS).forEach(id => {
        const data = REGIONS[id];
        const wds = Math.round((data.wsi * 0.6) + (data.tvi * 0.4));
        const radius = 15 + (wds * 0.4);
        const color = wds < 36 ? '#10b981' : (wds >= 81 ? '#e11d48' : (wds >= 61 ? '#ea580c' : '#f59e0b'));

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.classList.add('bubble');
        g.onclick = () => selectRegion(id);

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", data.x || 500);
        circle.setAttribute("cy", data.y || 250);
        circle.setAttribute("r", radius);
        circle.setAttribute("fill", color);
        circle.setAttribute("fill-opacity", "0.25");
        circle.setAttribute("stroke", color);
        circle.setAttribute("stroke-width", "2");
        circle.setAttribute("id", `circ-${id}`);

        g.appendChild(circle);
        canvas.appendChild(g);
    });
}

function selectRegion(id) {
    const data = REGIONS[id];
    if (!data) return;

    // 1. Force the layout states explicitly
    if (sidebarEmpty) sidebarEmpty.style.display = 'none';
    if (sidebarContent) sidebarContent.classList.add('visible');
    if (mapHint) mapHint.classList.add('hidden');

    // 2. Map data to existing DOM elements
    document.getElementById('s-cluster').textContent = data.cluster;
    document.getElementById('s-name').textContent = data.name;
    document.getElementById('s-sub').textContent = data.sub;
    document.getElementById('s-anomaly').textContent = data.anomaly;

    // 3. Gauge & Breakdown
    const wds = Math.round((data.wsi * 0.6) + (data.tvi * 0.4));
    const scoreEl = document.getElementById('gauge-score');
    scoreEl.textContent = wds;
    
    // Set bar widths
    document.getElementById('wds-bar').style.width = wds + '%';
    document.getElementById('wsi-bar').style.width = data.wsi + '%';
    document.getElementById('tvi-bar').style.width = data.tvi + '%';
    
    // Set text labels
    document.getElementById('wds-val').textContent = wds;
    document.getElementById('wsi-val').textContent = data.wsi;
    document.getElementById('tvi-val').textContent = data.tvi;

    // 4. Update Gauge Arc
    const arc = document.getElementById('gauge-arc');
    arc.style.strokeDashoffset = 141.4 * (1 - Math.min(wds, 100) / 100);

    // 5. Cleanup active states
    document.querySelectorAll('.active-bubble').forEach(b => b.classList.remove('active-bubble'));
    document.getElementById(`circ-${id}`).classList.add('active-bubble');
}
