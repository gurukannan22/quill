const sharp = require('sharp');

// Create the exact original SVG logo used in ProfileList.tsx
// Original Tailwind classes: bg-gradient-to-br from-quill-purple-500 to-violet-600
// quill-purple-500: #6B63D4
// violet-600: #7C3AED
// The SVG uses fill="none" and stroke="white" with stroke-width="2.2"

const svg = `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6B63D4"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
  </defs>

  <!-- Squircle background (rx=32 matches iOS icon curvature) -->
  <rect width="128" height="128" rx="32" fill="url(#bg)"/>

  <!-- Icon: nested SVG with original 24×24 coordinate space, centered 64x64 in 128×128 (to match original proportions) -->
  <svg x="32" y="32" width="64" height="64" viewBox="0 0 24 24"
       fill="none" stroke="white" stroke-width="2.2"
       stroke-linecap="round" stroke-linejoin="round"
       xmlns="http://www.w3.org/2000/svg">
    <!-- The exact paths from ProfileList.tsx (transparent body, white outline) -->
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <line x1="16" y1="8" x2="2" y2="22" />
    <line x1="17.5" y1="15" x2="9" y2="6.5" />
  </svg>
</svg>`;

async function run() {
  const buf = Buffer.from(svg);
  await sharp(buf).resize(16, 16).png().toFile('public/icons/icon-16.png');
  await sharp(buf).resize(48, 48).png().toFile('public/icons/icon-48.png');
  await sharp(buf).resize(128, 128).png().toFile('public/icons/icon-128.png');
  console.log('Icons generated — exact original SVG.');
}

run().catch(console.error);
