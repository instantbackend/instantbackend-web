# InstantBackend Web

The official landing page and dashboard for **InstantBackend**, a Backend-as-a-Service (BaaS) designed to help developers ship their apps in minutes.

This project is a [Next.js](https://nextjs.org/) application that serves as the marketing site, documentation hub, and user dashboard for managing InstantBackend projects.

## Features

-   **Modern Landing Page**: High-converting landing page with feature showcase and pricing.
-   **User Authentication**: Integrated login and registration flows.
-   **Dashboard**: Manage backend projects, view usage, and configuration.
-   **Documentation**: Embedded API references and usage guides.
-   **Subscription Management**: Stripe integration for plan upgrades (Personal, Basic, Professional).
-   **Ready-made Components**: Utilizes a custom design system with Tailwind CSS.

## Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Directory)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **State Management**: React Query (TanStack Query) & Context API
-   **UI Components**: `class-variance-authority`, `clsx`

## Getting Started

### Prerequisites

-   Node.js 18+ installed on your machine.
-   npm or yarn or pnpm.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/instantbackend-web.git
    cd instantbackend-web
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Copy the sample environment file to `.env.local`:
    ```bash
    cp env.sample .env.local
    ```
    Update `.env.local` with your specific configuration (API keys, Stripe keys, etc.).

### Running Locally

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `app/`: App Router pages and layouts.
-   `components/`: Reusable UI components.
-   `contexts/`: React Context providers (e.g., `InstantBackendContext`).
-   `lib/`: Utility functions and shared logic.
-   `public/`: Static assets.

## Scripts

-   `npm run dev`: Start development server.
-   `npm run build`: Build the application for production.
-   `npm start`: Start the production server.
-   `npm run lint`: Run ESLint checks.

## Learn More

To learn more about InstantBackend, visit our documentation within the app or check out the generic [Next.js documentation](https://nextjs.org/docs).
