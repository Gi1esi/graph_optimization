import fs from 'fs';

const nodes = JSON.parse(fs.readFileSync('./data/raw_nodes.json', 'utf-8'));
const edges = JSON.parse(fs.readFileSync('./data/raw_edges.json', 'utf-8'));

const ITERATIONS = 300;
const COOLING = 0.95;
const EPS = 1e-6;

const nodeById = new Map(nodes.map(n => [n.id, n]));

// Euclidean distance helper
function dist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy) + EPS;
}

// Calculate metrics: average and total edge length
function calculateMetrics(nodes, edges) {
  let totalLength = 0;
  for (const [sId, tId] of edges) {
    const s = nodes.find(n => n.id === sId);
    const t = nodes.find(n => n.id === tId);
    totalLength += dist(s, t);
  }
  return {
    averageEdgeLength: totalLength / edges.length,
    totalEdgeLength: totalLength
  };
}

console.log('Metrics before optimization:');
const beforeMetrics = calculateMetrics(nodes, edges);
console.log(`- Average edge length: ${beforeMetrics.averageEdgeLength.toFixed(4)}`);
console.log(`- Total edge length: ${beforeMetrics.totalEdgeLength.toFixed(4)}`);

const k = Math.sqrt(1 / nodes.length);
let temperature = 0.1;

function layoutFR() {
  for (let iter = 0; iter < ITERATIONS; iter++) {
    const disp = new Map(nodes.map(n => [n.id, { dx: 0, dy: 0 }]));

    // Repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        const d = dist(n1, n2);
        const force = (k * k) / d;
        const fx = ((n1.x - n2.x) / d) * force;
        const fy = ((n1.y - n2.y) / d) * force;

        disp.get(n1.id).dx += fx;
        disp.get(n1.id).dy += fy;
        disp.get(n2.id).dx -= fx;
        disp.get(n2.id).dy -= fy;
      }
    }

    // Attraction
    for (const [sId, tId] of edges) {
      const s = nodeById.get(sId);
      const t = nodeById.get(tId);
      const d = dist(s, t);
      const force = (d * d) / k;
      const fx = ((s.x - t.x) / d) * force;
      const fy = ((s.y - t.y) / d) * force;

      disp.get(s.id).dx -= fx;
      disp.get(s.id).dy -= fy;
      disp.get(t.id).dx += fx;
      disp.get(t.id).dy += fy;
    }

    // Update positions
    for (const n of nodes) {
      const d = disp.get(n.id);
      let dx = d.dx;
      let dy = d.dy;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len > 0) {
        dx = (dx / len) * Math.min(len, temperature);
        dy = (dy / len) * Math.min(len, temperature);
      }
      n.x = Math.min(1, Math.max(0, n.x + dx));
      n.y = Math.min(1, Math.max(0, n.y + dy));
    }

    temperature *= COOLING;
  }
}

layoutFR();

console.log('\nMetrics after optimization:');
const afterMetrics = calculateMetrics(nodes, edges);
console.log(`- Average edge length: ${afterMetrics.averageEdgeLength.toFixed(4)}`);
console.log(`- Total edge length: ${afterMetrics.totalEdgeLength.toFixed(4)}`);

// Save optimized positions
fs.writeFileSync('./optimized_positions.json', JSON.stringify(nodes, null, 2));
console.log('\nOptimized positions saved to optimized_positions.json');
