# AnimeSteam 🎬

Welcome to **AnimeSteam**! A modern, gorgeous, and high-performance anime streaming interface built with Next.js, React, Tailwind CSS, and the AniList GraphQL API.

AnimeSteam provides a beautifully designed frontend application for browsing, discovering, and watching anime. It integrates seamlessly with a custom video delivery backend to serve high-quality streams natively in the browser.

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [How It Works](#how-it-works)
5. [Project Structure](#project-structure)
6. [Design System](#design-system)
7. [Contributing](#contributing)
8. [Contact / Support](#contact--support)

## Features ✨
- **Dynamic Homepage:** Trending, popular, and currently airing anime with a gorgeous hero carousel.
- **Advanced Search & Filtering:** Infinite scroll grids with real-time search, sorting, and genre filtering.
- **Detailed Anime Pages:** Beautiful immersive banners, countdown timers for upcoming episodes, and smart synopsis handling.
- **Premium Video Player:** Sleek, custom-styled video player interface with episode selection, integrating securely with a custom video delivery service.
- **Smart Preferences:** LocalStorage sync for Auto-Next, Auto-Skip, Sub/Dub preferences, and "Continue Watching" history.
- **SEO Optimized:** Dynamic metadata generation for every anime page to ensure high search engine visibility.
- **Fully Responsive:** Carefully crafted layouts that look stunning on mobile, tablet, and desktop screens.

## Tech Stack 🛠️
- **Framework:** Next.js (App Router)
- **Library:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS with a custom Glassmorphism/Cyberpunk Design System
- **APIs:** AniList GraphQL API (Metadata)

## Getting Started 🚀

1. Clone the repository:
   ```bash
   git clone https://github.com/MDAwaiz438/animesteam.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the `frontend` directory and add your variables (e.g., `NEXT_PUBLIC_PLAYER_URL` to point to your custom video delivery service).

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works ⚙️

AnimeSteam leverages the Next.js App Router to deliver a fast and seamless user experience. Here is a breakdown of how the application functions under the hood:

### 1. Data Fetching (GraphQL API)
The application primarily communicates with the **AniList GraphQL API** via `fetch` requests. GraphQL allows the app to fetch exactly the data it needs for rendering pages (like posters, titles, synopses, and genres) in a single request, minimizing payload size.
- **Caching & Revalidation:** Next.js fetch caching is utilized to cache responses and revalidate them periodically to ensure data is fresh without overloading the API.

### 2. Routing and Pages
The app uses Next.js App Router for server-side rendering and static generation where appropriate.
- **`/` (Home):** Fetches multiple datasets simultaneously (Trending, Popular, Airing) to populate the hero section and carousels.
- **`/watch/[id]/[ep]` (Player):** Connects to the custom streaming backend to load the requested video securely.
- **`/catalog` & `/search`:** Implements client-side state and URL query parameters to allow users to filter and search through the Anime library.

### 3. Client and Server Components
The architecture is carefully divided between Server Components and Client Components to maximize performance:
- **Server Components:** Used for fetching data and rendering static content (e.g., Layouts, Main Page content).
- **Client Components:** Used for interactive elements like the Carousel (`use client`), Video Player, and Search Bars.

## Project Structure 📁
- `frontend/src/app`: Next.js App Router pages (`/`, `/watch`, `/catalog`, `/search`).
- `frontend/src/components`: Reusable UI components (`AnimeCard`, `HeroCarousel`, `WatchClientWrapper`, etc.).
- `frontend/src/lib`: Centralized API fetching and data mapping logic.

## Design System 🎨
The UI relies on a clean, simple, and sober light-theme aesthetic with crisp typography, high-contrast B&W elements, Cobalt Blue primary accents, subtle elevation, and silky smooth micro-animations. It uses Tailwind CSS utility classes to achieve a responsive, professional e-commerce experience.

## Contributing 🤝
Contributions are highly appreciated! Whether you want to add new features, fix bugs, or improve the documentation, feel free to open a Pull Request.
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact / Support 📬
For any inquiries, support requests, or custom development work, please reach out via email:
**awaizlabs@gmail.com**
