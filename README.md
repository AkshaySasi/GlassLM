# GlassLM - Privacy-Safe AI Chat

A privacy-focused AI chat application that automatically masks sensitive data before sending to AI providers.

## Project Overview

GlassLM is a web application built with React, TypeScript, and Vite that ensures your sensitive information (names, emails, personal data) never reaches AI providers by automatically masking them before processing.

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first CSS framework

## Getting Started

### Prerequisites

- Node.js (v16 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm (comes with Node.js)

### Installation & Running Locally

```sh
# Step 1: Navigate to the project directory
cd glass-box-ai-main

# Step 2: Install dependencies
npm install

# Step 3: Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Development

### Project Structure

```
glass-box-ai-main/
├── src/              # Source code
├── public/           # Static assets
├── index.html        # Entry HTML file
├── package.json      # Dependencies and scripts
├── vite.config.ts    # Vite configuration
└── tailwind.config.ts # Tailwind CSS configuration
```

### Making Changes

1. Edit files in the `src/` directory
2. Changes will hot-reload automatically in the browser
3. Use TypeScript for type safety
4. Follow the existing code style and conventions

## Building for Production

```sh
npm run build
```

The production-ready files will be in the `dist/` directory.

## License

This project is private and not licensed for public use.
