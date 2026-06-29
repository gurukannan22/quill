const sharp = require('sharp');

const svg = `
<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9B8EE8" />
      <stop offset="50%" stop-color="#7F77DD" />
      <stop offset="100%" stop-color="#534AB7" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#312a80" flood-opacity="0.5"/>
    </filter>
  </defs>
  <rect width="128" height="128" rx="36" fill="url(#g)" />
  <g transform="translate(28, 28) scale(3)" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" filter="url(#shadow)">
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <line x1="16" y1="8" x2="2" y2="22" />
    <line x1="17.5" y1="15" x2="9" y2="6.5" />
  </g>
</svg>
`;

async function run() {
  const buf = Buffer.from(svg);
  await sharp(buf).resize(16, 16).png().toFile('public/icons/icon-16.png');
  await sharp(buf).resize(48, 48).png().toFile('public/icons/icon-48.png');
  await sharp(buf).resize(128, 128).png().toFile('public/icons/icon-128.png');
  console.log("Icons generated.");
}

run().catch(console.error);
