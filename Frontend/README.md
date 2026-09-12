# Agro Vision – Complete Reports Update

## Report behavior

### Farmer Portal
The Generate Report action in Analysis and Reports prints a complete farmer report containing:
- The logged-in farmer's complete registered details
- The farmer's purchasing/token details
- Payment details
- Payment history graph
- Crop procurement/sales graph
- Rajasthan crop selling advisory graph

### Admin Portal
The Generate Report action in Analysis prints a complete administration report containing:
- All registered farmer details
- All procurement/purchasing token details
- Payment details
- Crop-wise procurement graph
- Crop distribution graph
- Registered vs purchased farmers graph
- Procurement trend graph

Reports follow the selected English/Hindi interface language. Use the browser Print dialog and select **Save as PDF**.

## Privacy
The Farmer report intentionally contains only the currently logged-in farmer's information. An individual farmer should not receive other farmers' private details. The Admin report contains all farmers because it is an administrative report.

## Run
```bash
npm install
npm run dev
```

If Vite/Recharts are not installed, run:
```bash
npm install react react-dom recharts vite
```
