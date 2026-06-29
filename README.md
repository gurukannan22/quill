<div align="center">
  <br />
  <h1>Quill Extension</h1>
  <p><strong>A beautifully crafted autofill extension for managing personal profiles locally.</strong></p>
  <br />
</div>

## ✨ What is Quill?

**Quill** is a modern Chrome extension built on Manifest V3. It allows users to save personal data across multiple named profiles (e.g. "Personal", "Work", "Freelance") and fill any web form in one click. 

All your data is stored strictly locally on your device — no accounts, no cloud sync, and absolutely no tracking.

## 🚀 Features

- 🎭 **Multiple Profiles:** Seamlessly switch between different personas or datasets.
- ⚡ **One-Click Autofill:** Quill uses smart heuristics to identify form fields (`name`, `id`, labels, placeholders) and injects your data instantly.
- ↩️ **Undo Support:** Filled the wrong form? One click reverts the fields to their previous state.
- 🎨 **Premium UI:** A hyper-modern dark interface featuring glassmorphism, gradient accents, smooth micro-animations, and custom typography.
- 🔒 **100% Local:** Data never leaves your machine. We use `chrome.storage.local` exclusively.

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3
- **Extension Engine**: CRXJS (Hot Module Replacement supported!)
- **CI/CD**: GitHub Actions for automated `.zip` and `.crx` releases.

## 📥 Installation

1. Go to the [Releases](https://github.com/gurukannan22/quill/releases) page.
2. Download the `quill-extension.zip` file.
3. Extract the contents of the ZIP file.
4. In Chrome (or Edge/Brave), navigate to `chrome://extensions`.
5. Enable **Developer mode** in the top right corner.
6. Click **Load unpacked** and select the folder you just extracted.
7. Click the extension icon in your browser toolbar to get started!

*(A `.crx` package is also available in the releases for advanced users).*

## 👨‍💻 Development

Want to hack on Quill?

```bash
# Install dependencies
npm install

# Start the dev server (with HMR)
npm run dev

# Build the extension
npm run build
```

Then load the `dist/` directory into Chrome using the **Load unpacked** method described above.

---

<div align="center">
  Made with &lt;3 by gurukannan22
</div>
