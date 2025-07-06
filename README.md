# 🌐 SautiDesk Frontend

A modern, production-ready frontend for the **SautiDesk** platform, built using **React 19**, **React Router v7**, **TailwindCSS**, and **MobX** for state management.

> 📦 Backend repository: [SautiDesk Backend](https://github.com/AristideI/SautiDesk-bn)

---

## 📝 Project Description

**SautiDesk** is an intelligent customer support solution that leverages voice analytics and ticket classification to streamline communication in sectors like education, telecom, and public services. This backend manages content, user roles, authentication, ticket lifecycle, and more.

---

## Video Demo

### [Link To Video Demo](https://drive.google.com/file/d/1l4o8gIX9XkdZd6TlK9vAEE9G58lowoy8/view?usp=sharing)

---

## Deployed Versions

[Front-end](https://sauti-desk-fn.vercel.app/) => Vercel Platform

[Back-end](https://sautidesk-bn.onrender.com) => Strapi Admin UI

---

## ⚡️ Tech Stack

- **React 19**
- **React Router v7**
- **Tailwind CSS**
- **MobX**
- **TypeScript**
- **HMR (Hot Module Replacement)**
- **Docker support**

---

## 🚀 Features

- Full-stack routing and SSR with React Router
- Modern dev workflow with HMR
- Type-safe with TypeScript
- Custom state management using MobX
- TailwindCSS styling
- Easy deployment with Docker

---

## 📦 Getting Started

### 🔧 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/AristideI/SautiDesk-fn.git
cd SautiDesk-fn
npm install
```

## 🛠 Development

Start the development server:

```bash
npm run dev
```

Visit the app at ` http://localhost:5173`

## 🧱 Build for Production

```bash
npm run build
```

## 🚀 Deployment

### 🧰 Manual Deployment

To deploy manually, serve the production build:

```bash
npm run build
npm start
```

The build outputs the following structure:

```bash
Copy
Edit
├── build/
│   ├── client/   # Static frontend assets
│   └── server/   # Server-rendering output
```

## 🧪 Type Checking

Run type checks and ensure your app is type-safe:

```bash
npm run typecheck
```

## 🚀 Release Management

Automate versioning with standard-version:

```bash
npm run release:major
npm run release:minor
npm run release:patch
```

## 🎨 Styling

Tailwind CSS is preconfigured and ready to use. You can customize the design in tailwind.config.ts and start styling your components right away using utility classes.
