# Weather Disruption Index — Global Travel Dashboard

> Interactive El Niño 2026 weather disruption forecasting tool for 14 global tourism regions.

## Overview

The Weather Disruption Score (WDS) combines meteorological severity with tourism vulnerability to forecast travel impacts across major global destinations. Each region receives a composite score derived from:

- **WSI** (Weather Severity Index): 0–100 scale based on storm intensity, duration, and predictability
- **TVI** (Tourism Vulnerability Index): 0–100 scale reflecting infrastructure sensitivity and economic dependency
- **WDS** = (WSI × 0.6) + (TVI × 0.4)

## File Structure

### Core Files
- **`index.html`** — Clean HTML markup with semantic structure and accessibility attributes
- **`styles.css`** — Externalized stylesheet (~11.5 KB) with CSS variables for theming
- **`app.js`** — Application logic (~8.6 KB) with event handling, animations, and UI state management
- **`data.js`** — Complete regional data (~20 KB) with all 14 regions and their WDS profiles

### Key Features

#### 🗺️ Interactive Map
- 14 clickable regions with real-time WDS scoring
- Heat-map color coding (low → medium → critical)
- SVG-based for crisp rendering at any scale
- Keyboard accessible (Tab, Enter, Escape)

#### 📊 Scoring Breakdown
- Animated gauge showing WDS score (0–100)
- Component bars: Weather Severity Index (WSI), Tourism Vulnerability Index (TVI)
- 6-component sub-index grid: Intensity, Duration, Predictability, Infrastructure Sensitivity, Resource Dependency, Peak Seasonality

#### 🌍 14 Regions Tracked
1. **North America** — WDS: 53 (Medium)
2. **Caribbean Basin** — WDS: 81 (Critical)
3. **Central America** — WDS: 76 (High)
4. **South America** — WDS: 70 (High)
5. **Northern Europe** — WDS: 35 (Low)
6. **Mediterranean Basin** — WDS: 81 (Critical)
7. **Middle East & Gulf** — WDS: 61 (Medium)
8. **East Africa** — WDS: 75 (High)
9. **Southern Africa** — WDS: 59 (Medium)
10. **Indian Ocean Islands** — WDS: 52 (Medium)
11. **South Asia** — WDS: 76 (High)
12. **Southeast Asia** — WDS: 71 (High)
13. **East Asia** — WDS: 51 (Medium)
14. **Oceania & Pacific** — WDS: 50 (Medium)

---

## Recent Improvements

### ✅ Code Organization
- **Externalized CSS** (`styles.css`) — 11.5 KB stylesheet with color theme and layout rules
- **Externalized JavaScript** (`app.js`) — Application logic separated from data
- **Data Separation** (`data.js`) — All 14 regions now in a dedicated module for easy updates

### ✅ Accessibility Enhancements
- **ARIA labels** on all interactive regions
- **Keyboard navigation**: Tab through regions, Enter to select, Escape to deselect
- **Focus indicators** for keyboard users
- **Screen reader support**: Regions tagged with `role="button"` and descriptive labels
- **Reduced motion support**: Detects `prefers-reduced-motion` and disables animations
- **Semantic HTML**: `<header role="banner">`, `<aside>` for sidebar

### ✅ Performance & Maintainability
- **Browser caching**: External CSS/JS files cache independently from HTML
- **Debounced hover effects** to reduce repaints
- **Minifiable structure** ready for production builds
- **No truncated data**: All anomaly descriptions and risk profiles complete
- **Responsive design**: Mobile breakpoint at 768px with optimized layout

### ✅ Data Completeness
All 14 regions now include:
- ✓ Full anomaly descriptions (no `[...]` truncation)
- ✓ Detailed flight, accommodation, and experience risk assessments
- ✓ 6-component sub-index breakdowns
- ✓ Trend indicators (↗ Rising, ↘ Declining, → Stable)

---

## Technical Stack

| Layer | Technology |
|-------|-----------|
| **Markup** | HTML5 (semantic, accessible) |
| **Styling** | CSS3 (custom properties, flexbox, grid) |
| **Logic** | Vanilla JavaScript (ES6) |
| **Data** | JSON objects |
| **Fonts** | Google Fonts (Space Grotesk, Inter, Space Mono) |

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Usage

### Local Development
1. Clone or download the repository
2. Open `index.html` in a modern web browser
3. Click any colored region to view its WDS profile

### Updating Regional Data
Edit `data.js` to modify any region's:
- WSI / TVI scores
- Anomaly forecast text
- Flight / accommodation / experience risk levels
- Sub-index component values
- Trend direction

The UI will automatically reflect changes on page reload.

### Customizing Theme
Edit CSS variables in `styles.css`:
```css
:root {
  --bg-page:      #050E1F;        /* Page background */
  --accent:       #1E8BC3;        /* Primary accent color */
  --score-low:    #1A6FA8;        /* Low risk color */
  --score-mid:    #C45E0A;        /* Medium risk color */
  --score-high:   #8B1A1A;        /* High risk color */
  /* ... */
}
```

---

## Future Enhancements

- [ ] **Real-time data integration** via NOAA/WMO APIs
- [ ] **Export functionality** (CSV, PDF reports)
- [ ] **Time-series charting** to show WDS trends over months
- [ ] **Comparison tool** to benchmark regions side-by-side
- [ ] **Mobile app version** with push notifications
- [ ] **Dark/light theme toggle**
- [ ] **Multi-language support**

---

## License

Data and model: Composite estimates for demonstration purposes.
Not a real-time forecast. See footer for data source attribution.

---

## Support

For questions or improvements, please open an issue or contact the repository maintainer.

**Last updated:** June 2026