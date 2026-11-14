# 🎮 Arcade Vault

Colección personal de videojuegos con CRUD, autenticación JWT, roles (user/admin), paginación, búsqueda, filtros y subida de portadas.

**Demo:** https://tu-app.onrender.com _(placeholder — reemplaza con tu URL de Render)_

## ✨ Funcionalidades

- CRUD completo de videojuegos (título, plataforma, género, año, desarrollador, rating, descripción, portada).
- Autenticación con JWT (cookie httpOnly + `Authorization: Bearer`).
- Registro y login con bcrypt (salt 12).
- Roles: `user` (solo sus propios items) y `admin` (todo).
- Paginación con `?page=2&limit=10`.
- Búsqueda por título/desarrollador y filtros por género y plataforma.
- Subida de imágenes con multer (JPG/PNG/WebP/GIF, máx 3MB).
- Mensajes flash con connect-flash.
- Layout EJS con partials (header, footer, flash).
- Manejo global de errores.
- Tests con Jest + supertest + mongodb-memory-server.
- Docker / docker-compose para levantar con Mongo local.

## 🛠 Tecnologías

| Capa | Stack |
|------|-------|
| Runtime | Node.js 24 LTS |
| Framework | Express 4 |
| DB | MongoDB Atlas + Mongoose 8 |
| Vistas | EJS + express-ejs-layouts + Bootstrap 5 (CDN) |
| Auth | JWT + bcryptjs |
| Validación | express-validator |
| Seguridad | helmet, express-rate-limit, CORS, cookie httpOnly |
| Uploads | multer |
| Tests | Jest + supertest + mongodb-memory-server |
| Deploy | Render.com |

## 📦 Instalación local

```bash
git clone <tu-repo> arcade-vault
cd arcade-vault
cp .env.example .env
# Edita .env con tu DATABASE_URL y JWT_SECRET
npm install
npm run dev          # http://localhost:3000
