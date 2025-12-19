# 🛍️ Demo-shopping

A **full-stack web application** built with **Next.js (frontend)** and **NestJS (backend)** for demonstrating modern web development with TypeScript.

---

## 🚀 Overview

This project is a demo e-commerce system showcasing how to integrate a modern frontend (Next.js) with a robust backend (NestJS).  
It’s structured as a **monorepo**, keeping both the `api` and `web` apps in a single repository for easier development and deployment.

---

## 🧠 Tech Stack

### **Frontend (Web)**
- ⚛️ [Next.js 16](https://nextjs.org/) – React framework for building fast, scalable, and SEO-friendly apps  
- 🔄 [React Query (TanStack Query)](https://tanstack.com/query/latest) – For API fetching, caching, and real-time state synchronization  
- 💅 [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework  
- 🌍 [Next-i18next](https://github.com/i18next/next-i18next) – Internationalization (i18n) support  
- 🔧 TypeScript – Static typing for reliability and scalability  

### **Backend (API)**
- 🧱 [NestJS 11](https://nestjs.com/) – Progressive Node.js framework for scalable backend apps  
- 🗄️ [TypeORM](https://typeorm.io/) – Object Relational Mapper for database management  
- ⚙️ TypeScript – Strong typing across backend

---

## 🗄️ Database

This project uses **PostgreSQL** as the primary database.  
For local development and demo purposes, PostgreSQL is run via **Docker**, so no local PostgreSQL installation is required.

---

## 🐘 PostgreSQL (Docker)

PostgreSQL is started using the following command:

```bash
docker run --name=docker-db -e POSTGRES_PASSWORD=postgres -e PGPORT=5434 -p 5434:5434 -v docker-db:/var/lib/postgresql/data -d postgres:16
```

This setup runs PostgreSQL in a Docker container and exposes it on port 5434 for local development.

## 🔧 Environment Variables

Create a `.env` file inside the `api` directory by copying from `.env.example`:

```bash
cd api
cp .env.example .env
```

## 🧰 Development Workflow
- 💻 Code Editor: Visual Studio Code
- 🐳 Containerization: Docker (PostgreSQL runs in a container)
- 🗄️ Database Client: DBeaver (for database inspection and management)
- 🔍 AI Pair Programming: ChatGPT
- 🌱 Version Control: Git & GitHub
- ⚙️ CI/CD: Manual build & deploy

---
