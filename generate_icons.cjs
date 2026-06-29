const sharp = require('sharp');

// Clean, centered quill pen SVG at 128×128 native viewBox
const svg = `<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#9B8EE8"/>
      <stop offset="100%" stop-color="#534AB7"/>
    </linearGradient>
  </defs>

  <!-- Squircle background -->
  <rect width="128" height="128" rx="32" fill="url(#bg)"/>

  <!-- Quill pen — hand-placed at center of 128×128 canvas -->
  <!-- The pen tip points bottom-left, body goes top-right -->
  <g transform="translate(16, 16)">
    <!-- Pen nib / filled body -->
    <path d="M72 8 C72 8, 88 4, 90 20 L52 58 L40 56 L38 44 Z" fill="white" fill-opacity="0.95"/>
    <!-- Center diagonal stroke of the feather -->
    <line x1="38" y1="44" x2="90" y2="20" stroke="white" stroke-width="2" stroke-opacity="0.5" stroke-linecap="round"/>
    <!-- Pen split tip stroke -->
    <path d="M38 44 L24 72" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <!-- Underline / ink trail -->
    <line x1="20" y1="78" x2="52" y2="78" stroke="white" stroke-width="3" stroke-linecap="round" stroke-opacity="0.6"/>
  </g>
</svg>`;

async function run() {
  const buf = Buffer.from(svg);
  await sharp(buf).resize(16, 16).png().toFile('public/icons/icon-16.png');
  await sharp(buf).resize(48, 48).png().toFile('public/icons/icon-48.png');
  await sharp(buf).resize(128, 128).png().toFile('public/icons/icon-128.png');
  console.log('Icons generated successfully.');
}

run().catch(console.error);
