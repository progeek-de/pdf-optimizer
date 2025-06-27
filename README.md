# PROGEEK PDF Optimizer

> **Lossless PDF compression & manipulation — 100 % client‑side, open source, privacy‑first.**

Demo: https://pdf.progeek.de

OpenCode Mirror: https://gitlab.opencode.de/progeek/pdf-optimizer

---

## ✨ Overview

PROGEEK PDF Optimizer is a lightweight Progressive Web App that reduces PDF size **directly in your browser** using a WebAssembly build of Ghostscript. No file ever leaves your device; there is no server, no telemetry and no hidden costs. Typical office scans shrink by **60–80 %** without visible quality loss, saving bandwidth, storage and CO₂.

## 🔍 Why client‑side?

* **Data never leaves the device** – perfect for GDPR, Geheimschutz & air‑gapped networks.
* **Works everywhere** – Chrome, Firefox, Edge, Safari and modern mobile browsers.
* **Offline‑ready** – install it once, use it without any network via Service Worker caching.
* **Zero infrastructure** – no backend to deploy, patch or audit.

## 🚀 Features

| Category    | Details                                                                             |
| ----------- | ----------------------------------------------------------------------------------- |
| Compression | Ghostscript compressions presets |
| Preview     | Live before/after filesize and percentage saved                                     |
| PWA         | Installable on desktop & mobile, offline operation                                  |
| Web Worker  | Heavy PDF work runs off the UI thread for smooth interaction                        |
| Open Source | Licensed under **AGPL v3** – fork, extend, embed without lock‑in                    |

## 🛠️ Getting Started

```bash
# 1. clone repo
$ git clone https://github.com/progeek-de/pdf-optimizer.git
$ cd pdf-optimizer

# 2. install deps
$ npm install

# 3. start dev server (Vite)
$ npm run dev

# 4. production build
$ npm run build
```

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0**. See the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgements

* [ghostscript-pdf-compress.wasm](https://github.com/laurentmmeyer/ghostscript-pdf-compress.wasm)
* [ps-wasm](https://github.com/ochachacha/ps-wasm)
* [Emscripten](https://github.com/emscripten-core/emscripten)
* [Ghostscript](https://www.ghostscript.com/)
