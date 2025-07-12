Malawi District Graph Visualization

This project visualizes and interactively optimizes the layout of a graph representing Malawi's districts and their connections. It improves graph readability by reducing edge crossings and node overlap using the Fruchterman–Reingold force-directed layout algorithm.


Project Structure


.
├── data/
│   ├── raw_nodes.json
│   ├── raw_edges.json
├── screenshots/
├── index.html               # Main visualization (interactive)
├── layout.js                # Optional: Node.js script for offline optimization/testing
├── optimized_positions.json # Optional: Output from layout.js
├── raw_positions.json       # Optional: Raw coordinates (pretty printed from testinh)
├── README.md


Requirements

- A static server to host `index.html` locally (e.g., `serve`)
- [Node.js](https://nodejs.org/) (only if you want to use `layout.js`)

How to Run

1. Serve the Visualization

Use any static server to host the files. For example:

npx serve


Then open the provided local URL in your browser (usually `http://localhost:3000`).

2. Interact with the Graph

 - By default, `index.html` loads the unoptimized graph using raw node and edge data.
 - Click the "Optimize" button to run the Fruchterman–Reingold algorithm in-browser.
 - Metrics are printed to the browser console (open DevTools to see them).

 3. (Optional) Run Offline Optimization

If you'd like to experiment or benchmark layout quality in Node.js, run:


node layout.js


This will:

 - Load `data/raw_nodes.json` and `data/raw_edges.json`
 - Compute layout using the Fruchterman–Reingold algorithm
 - Print metrics before and after optimization
 - Save results to `optimized_positions.json`




