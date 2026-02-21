# Gossip Server

Backend for the office culture gossip/news mobile app. Built with **Express.js** and **MySQL**.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Database**
   - Create MySQL database and tables:
     ```bash
     mysql -u root -p < sql/schema.sql
     ```
   - Copy `.env.example` to `.env` and set your DB credentials and `JWT_SECRET`.

3. **Create an admin** (so you can log in and create posts):
   ```bash
   node scripts/seedAdmin.js admin@example.com your_password
   ```

4. **Run the server**
   ```bash
   npm start
   ```
   Or with auto-reload: `npm run dev`

## API

### Public (mobile app)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | List posts (query: `page`, `limit`) |
| GET | `/api/posts/:id` | Get one post |
| POST | `/api/posts/:id/react` | React to post. Body: `{ "reaction": "thumbs_up" \| "thumbs_down" \| "heart", "user_identifier": "optional" }` or header `X-User-Identifier` |

### Admin (protected with Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Body: `{ "email", "password" }` → returns `token` |
| GET | `/api/admin/posts` | List current admin's posts |
| POST | `/api/admin/posts` | Create post. Form: `title`, `body` (max 60 words), `media` (file, optional) |
| PUT | `/api/admin/posts/:id` | Update post (same fields, all optional) |
| DELETE | `/api/admin/posts/:id` | Delete post |

Use header: `Authorization: Bearer <token>` for admin routes.

### Media

- Upload: send `media` as multipart file in create/update post. Allowed: images (JPEG, PNG, GIF, WebP), videos (MP4, WebM). Max 50 MB.
- URLs: stored as `/uploads/<filename>`; served by the server at `GET /uploads/<filename>`.

## Environment

See `.env.example`. Required: `DB_*`, `JWT_SECRET`. Optional: `PORT`, `UPLOAD_DIR`.
