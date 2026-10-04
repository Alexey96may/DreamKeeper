# 🌙 DreamKeeper (PWA)

> A modern, offline-first dream journal web application featuring a clean architecture, deep data privacy, and atmospheric visual themes.

**🔗 [Live Demo / Try it online](https://alexey96may.github.io/DreamKeeper/)**

![Vue.js](https://img.shields.io/badge/Vue.js-3.4+-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)

---

## About the Project

**DreamKeeper** is a Progressive Web App (PWA) built for tracking dreams, analyzing daily emotional states, and exploring dream symbolism. With a strict **privacy-first approach**, all data is stored securely and locally on the user's device using **IndexedDB**, ensuring complete confidentiality without relying on external servers.

Designed as a production-ready portfolio project, it emphasizes solid software architecture, strict typing, and high UI/UX standards.

---

## Key Features

- 📔 **Dreams & Daily States:** Record detailed dream logs, morning moods, energy levels, and sleep quality scores.
- 🎨 **Atmospheric Themes:** Over 10 custom visual styles to match different moods (Classic, Astronomy, Cinema, Cthulhu, Noir, Folk, Paganism, Alchemy, Temple, Astrology, Archive, and Clinic).
- 🔍 **Advanced Filtering:** Multi-level search with live active filter tags displayed directly in the view.
- 📅 **Interactive Calendar:** Seamless integration with `v-calendar` for a quick overview of dreams and daily states by date.
- 🔗 **Local Sharing («Share Dream»):** Unique hash-based link sharing and QR code generation without a backend.
- 💾 **Backup & Restore:** Full database export and import with version schema support.
- 📱 **Cross-Platform:** Works natively as a web PWA and builds to Android via **Capacitor**.

---

## Architecture & Design Patterns

The project follows **Clean Architecture** principles to maintain a strict separation of concerns:

- **UI Layer:** Vue 3 (Composition API), Vue Router, Pinia, Tailwind CSS.
- **Domain Layer:** Pure business logic completely decoupled from UI frameworks and database drivers.
- **Data Layer:** Repository pattern with abstract Data Sources (IndexedDB via `idb`) instantiated through factories: `Services -> Factory -> Repository -> Source`.
- **Validation:** Lightweight and type-safe validation powered by **Valibot**.

---

## Tech Stack

- **Frontend:** Vue 3, TypeScript, Vite, Vue Router, Pinia
- **Styling:** Tailwind CSS, PostCSS, CSS Custom Properties (Themes)
- **Storage:** IndexedDB (`idb`), PWA Web Storage
- **Mobile:** Capacitor (Android integration)
- **Validation:** Valibot
- **Testing:** Vitest, Cypress, Vue Test Utils
- **Quality Assurance:** ESLint, Oxlint, Prettier, `vue-tsc`

---

## Getting Started

Make sure you have Node.js (version 18+) installed on your machine.

1. **Clone the repository:**
    ```bash
    git clone [https://github.com/Alexey96may/DreamKeeper.git](https://github.com/Alexey96may/DreamKeeper.git)
    cd dream-keeper
    ```
2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the development server:**

    ```bash
    npm run dev
    ```

4. **Open http://localhost:5173 in your browser.**

## Future Roadmap & Ideas

Here are some features and improvements planned for future releases:

- [ ] **Mobile App & Capacitor Integration:** Packaging the PWA into a native Android application using Capacitor, adding native storage (SQLite) and local push notifications.
- [ ] **AI-Powered Dream Interpreter:** Integration with local or cloud AI models to analyze dream symbols, emotional undertones, and archetypes.
- [ ] **Social & Community Features (Backend API):** A server-side extension allowing users to share dreams anonymously, discuss interpretations, and crowdsource symbol definitions.
- [ ] **Audio Voice Memos:** Ability to record and attach voice descriptions directly to a dream log.
- [ ] **Expanded Symbol Dictionary:** Deep-dive databases for dream aspects, cultural symbols, and multi-source interpretations.
- [ ] **Smart Dream Analytics & Reminders:** Push notifications and insights reminding users of past prophetic dreams, uncompleted drafts, or patterns from a year ago.
- [ ] **Native SQLite & Media Storage:** Full migration of the local storage layer to SQLite for the native Android APK version, supporting offline photos and audio files.
- [ ] **Advanced Swipes & Gestures:** Mobile gesture support (swipe to delete/edit cards, swipe between calendar months).
