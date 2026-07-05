# 3D Asset Viewer & Manager

A full-stack, single-page web application designed for uploading, storing, and rendering 3D models (`.glb`) in real-time. Built with React and Three.js, wrapped in a custom monochrome Brutalist UI.

## Features

* **Real-time 3D Rendering:** View complex geometry instantly in the browser with declarative WebGL components.
* **Custom Studio Lighting:** Integrated directional lights and contact shadows for professional asset presentation.
* **Cloud Asset Management:** Direct upload pipeline to edge storage buckets with automated PostgreSQL ledger updates.
* **Fault Tolerance:** Built-in React Error Boundaries to gracefully catch and isolate corrupted or unsupported 3D files without crashing the application.
* **Asynchronous Loading:** Utilizes React Suspense to maintain UI responsiveness while parsing heavy 3D geometry.

## Tech Stack

* **Frontend:** React, Vite
* **3D Engine:** React Three Fiber (`@react-three/fiber`)
* **Styling:** Tailwind CSS (v3)
* **Backend / Database:** Supabase (PostgreSQL & Edge Storage)
* **Hosting:** Vercel

## Local Setup

### 1. Clone the repository
```bash
git clone [https://github.com/Adarshpnair-003/3d-viewer.git](https://github.com/Adarshpnair-003/3d-viewer.git)
cd 3d-viewer
