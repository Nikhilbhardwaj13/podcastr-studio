# Podcastr Studio

A free-first AI podcast platform rebuilt with React, TypeScript, Java 21,
Spring Boot, Spring Security, PostgreSQL, Gemini, and Docker.

## Current foundation

- React/Vite TypeScript frontend with a responsive studio landing screen.
- Spring Boot API with Java 21 target, CORS, stateless security configuration,
  and `GET /api/health`.
- JWT registration and login endpoints backed by PostgreSQL users.
- PostgreSQL for application data.
- MinIO for S3-compatible local audio and image storage.
- Provider boundaries for Gemini, text-to-speech, and image generation are
  planned before provider-specific code is added.

## Run locally

1. Copy `.env.example` to `.env` and set `JWT_SECRET` to a random value of at
   least 32 characters. Fill only the provider keys you intend to use.
2. Start local infrastructure:

   ```sh
   docker compose up -d
   ```

3. Start the API with the project-local Maven wrapper (from `backend`):

   ```sh
   .\mvnw.cmd spring-boot:run
   ```

   The wrapper downloads Maven 3.9.11 into `backend/.mvn/wrapper` on its first
   run, so a global Maven installation is not required.

4. Start the web app (from `frontend`):

   ```sh
   npm install
   npm run dev
   ```

Authentication endpoints:

- `POST /api/auth/register` with `email`, `displayName`, and `password`
- `POST /api/auth/login` with `email` and `password`
- `GET /api/auth/me` with `Authorization: Bearer <token>`

The web app is available at <http://localhost:5173>. PostgreSQL is exposed on
host port `5433` to avoid conflicts with an existing local PostgreSQL service.
MinIO's console is
available at <http://localhost:9001> with `podcastr` / `podcastr-secret`.

## AI provider strategy

The default design is hybrid and free-first:

- Gemini API: script outlines, rewriting, metadata, chapter suggestions, and
  prompt enhancement.
- Google Cloud Text-to-Speech Standard/WaveNet: official multi-voice audio
  with a recurring free character quota, subject to Google billing setup and
  current terms.
- Hugging Face Inference Providers or Pollinations: replaceable image provider
  for development and low-volume use.

Provider adapters will make these choices swappable without changing the
React application or podcast domain model. Free quotas and commercial terms
change, so production deployments must verify the provider's current pricing
and usage policy.

## Planned MVP slices

1. JWT registration/login and user profile.
2. Podcast and episode schema with PostgreSQL migrations.
3. Creator flow: script assistant, voice selection, TTS job, thumbnail job,
   preview, and publish.
4. Discover/search/detail pages with persistent audio player.
5. Favorites, listening history, and creator analytics.
