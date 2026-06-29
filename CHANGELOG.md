# Changelog

All notable changes to the Quill Extension will be documented in this file.

## [v0.1.0] - Initial Release

### Added
- **Core Functionality**: Create, edit, and manage multiple profiles containing specific form field information (e.g., First Name, Last Name, Email, Username).
- **Smart Form Filling**: Automatically detects forms on web pages and maps profile data to input fields using intelligent heuristics (e.g., looking at `name`, `id`, and label elements).
- **Undo Feature**: Quickly undo a form fill if the data was mapped incorrectly or if you picked the wrong profile.
- **Modern UI**: Completely styled with a custom dark theme (Tailwind CSS v3) featuring squircle corners, glassmorphism effects, gradients, and micro-animations.
- **Local Storage**: All profile data is saved securely locally on your device via the Chrome Storage API. No data is sent to the cloud.
- **GitHub Integration**: Automated CI/CD pipeline to package extensions into `.zip` and `.crx` formats for easy releases.
