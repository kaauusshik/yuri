# YURI AI — 3D Real-Time AR Virtual Try-On & Fashion Tech Ecosystem

> **Try it. Style it. Wear it. Buy it.**

YURI AI is a real-time 3D Virtual Try-On (VTON) and AI fashion-tech ecosystem. It combines computer vision, 3D cloth simulation, real-time camera AR, and AI Twin generation into a unified mobile and web platform.

---

## ✨ Features

- **Decart 3D V-TON Real-Time AR Studio**:
  - 60 FPS live camera tracking using MediaPipe Pose.
  - Dynamic 3D garment fitting with chest warp, depth mesh, shoulder tracking, and cloth physics.
  - Real-world ambient lighting adaptation, shadow casting, and hand occlusion.
  - Multi-garment instant switcher featuring custom apparel including the **Sentinels Pro 2026 Jersey**.
- **3D Mannequin Studio**:
  - 360-degree interactive 3D mannequin rotation and fit visualization.
  - Customizable body metrics (bust, waist, hips, height).
- **Photo VTON Studio**:
  - High-fidelity AI try-on for uploaded full-body photos.
- **AI Twin Persona & Yuri vs Twin! Matrix**:
  - Generative digital twin tailored to personal sizing, skin tone, and body posture.
- **Digital Wardrobe & Indian D2C Fashion Discovery**:
  - Curated Indian and global D2C fashion catalog with one-click live try-on.
  - Smart categorization, closet organization, and AI stylist recommendations.
- **Cyber-Luxury UI**:
  - Bold, high-contrast obsidian glassmorphic interface styled with Syne, Space Grotesk, and Plus Jakarta Sans.
  - iPhone 16 Pro Titanium frame simulation with responsive Cinema Studio mode.

---

## 📁 Repository Structure

```
yuri/
├── app/               # Expo / React Native mobile application
│   ├── (auth)/        # Authentication screens
│   ├── (tabs)/        # Core bottom tabs (Home, Studio, Wardrobe, Shop, Profile)
│   ├── product/       # Product details & AR trigger
│   ├── stylist/       # AI Stylist chat & outfit suggestions
│   └── tryon/         # Mobile AR try-on views
├── components/        # Reusable UI & Try-On components
├── constants/         # Colors, typography, layout specs
├── services/          # API services, Decart V-TON engine, Supabase client
├── stores/            # State management (Zustand / Auth store)
├── supabase/          # Database migrations & schemas
├── types/             # TypeScript definitions
├── utils/             # Helpers & geometry math
└── web/               # Standalone 3D Real-Time AR Web Studio
    ├── index.html     # Real-time AR VTON studio with MediaPipe & Decart physics
    ├── sen-jersey.webp# Sentinels Pro 2026 Jersey asset
    └── server.ps1     # Local development server script
```

---

## 🚀 Getting Started

### Web Studio (Live 3D AR Try-On)

To run the real-time AR studio locally:

```powershell
cd web
powershell -ExecutionPolicy Bypass -File server.ps1
```

Or run any local static file server on port 8080:
```bash
npx serve web -p 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser with camera permissions enabled.

### Mobile App (React Native / Expo)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Expo development server:
   ```bash
   npx expo start
   ```

---

## 🛡️ License

MIT License. Designed & developed for the next generation of AI-driven fashion commerce.
