const fs = require('fs');
const { createCanvas } = require('canvas');

const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#0f172a';
ctx.fillRect(0, 0, width, height);

// Grid
ctx.strokeStyle = '#1a2236';
ctx.lineWidth = 1;
for (let x = 0; x < width; x += 40) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.stroke();
}
for (let y = 0; y < height; y += 40) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
}

// Background stars
for (let i = 0; i < 200; i++) {
  const x = Math.random() * width;
  const y = Math.random() * height;
  const r = Math.random() * 1.5 + 0.5;
  const brightness = Math.floor(Math.random() * 120 + 100);
  ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${Math.min(255, brightness + 30)})`;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// Draw a large glowing star (central)
const cx = 880;
const cy = 200;
for (let radius = 80; radius > 0; radius -= 2) {
  const brightness = Math.floor(40 + 60 * (1 - radius / 80));
  ctx.fillStyle = `rgb(0, ${Math.floor(brightness * 0.7)}, ${brightness})`;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}

// Bright star core
ctx.fillStyle = 'rgb(120, 222, 255)';
ctx.beginPath();
ctx.arc(cx, cy, 14, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = 'rgb(200, 248, 255)';
ctx.beginPath();
ctx.arc(cx, cy, 8, 0, Math.PI * 2);
ctx.fill();

// Planet 1 (cyan)
const px1 = 780;
const py1 = 220;
ctx.fillStyle = '#0ea5e9';
ctx.beginPath();
ctx.arc(px1, py1, 12, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = '#38bdf8';
ctx.beginPath();
ctx.arc(px1, py1, 8, 0, Math.PI * 2);
ctx.fill();

// Planet 2 (purple)
const px2 = 1020;
const py2 = 175;
ctx.fillStyle = '#8b5cf6';
ctx.beginPath();
ctx.arc(px2, py2, 9, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = '#a78bfa';
ctx.beginPath();
ctx.arc(px2, py2, 6, 0, Math.PI * 2);
ctx.fill();

// Trade route lines (dashed blue)
ctx.strokeStyle = '#6dc8ff';
ctx.setLineDash([6, 6]);
ctx.beginPath();
ctx.moveTo(px1, py1);
ctx.lineTo(px2, py2);
ctx.stroke();
ctx.setLineDash([]); // Reset

// Title text
ctx.fillStyle = 'white';
ctx.font = 'bold 48px sans-serif';
ctx.fillText('Hermes vs Iron Claw', 70, 400);

ctx.fillStyle = '#94a3b8';
ctx.font = '32px sans-serif';
ctx.fillText('Speed and Orchestration', 70, 465);
ctx.fillText('in Automation Agents', 70, 505);

// Author
ctx.fillStyle = '#64748b';
ctx.font = '20px sans-serif';
ctx.fillText('by Ian Lintner', 980, 565);

// Save
const outPath = '/home/node/.openclaw/workspace/portfolio/public/images/hermes-vs-iron-claw-social.png';
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outPath, buffer);
console.log('Image generated at', outPath);
