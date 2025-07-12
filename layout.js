import fs from 'fs';

const nodes = JSON.parse(fs.readFileSync('./data/raw_nodes.json', 'utf-8'));
const edges = JSON.parse(fs.readFileSync('./data/raw_edges.json', 'utf-8'));

const EPS = 1e-6;

// Calculate Euclidean distance
function dist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy) + EPS;
}

// Calculate metrics
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

const metrics = calculateMetrics(nodes, edges);

console.log('Raw graph metrics:');
console.log(`- Average edge length: ${metrics.averageEdgeLength.toFixed(4)}`);
console.log(`- Total edge length: ${metrics.totalEdgeLength.toFixed(4)}`);

// Save raw positions to file
// This is primarily just because its visually better formatted than the nodes.json file, so its easier to read
fs.writeFileSync('./raw_positions.json', JSON.stringify(nodes, null, 2));

console.log('Raw node positions saved to raw_positions.json');