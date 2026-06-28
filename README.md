# ProHRM Enterprise Suite

ProHRM is a modern, responsive Human Resource Management System (HRMS) built to manage employees, roles, permissions, and attendance across an entire organization. It features a sleek "Modern SaaS" aesthetic with a custom Material UI theme, ensuring a premium user experience.

## Features

- **Role & Permission Management**: Detailed matrices to configure access levels for Employees, Managers, HR Admins, and Super Admins.
- **Sleek UI/UX**: Globally themed Material UI components (glassmorphism tables, modern rounded buttons, and crisp typography) powered by the `Outfit` font family.
- **Persistent Sidebar**: A fully responsive sidebar navigation with collapse/expand animations and an embedded user profile.
- **Advanced List Filtering**: GitHub-style filter search bars applied to data grids for quick searching, sorting, and tag-based filtering.

## Tech Stack

- **Framework**: React 19 + Vite
- **Routing**: React Router v7
- **UI Component Library**: Material UI (MUI)
- **Styling**: SCSS + MUI `ThemeProvider` overrides
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod (Validation)
- **State/Data Fetching**: React Query & Axios

## Getting Started

### Prerequisites
Make sure you have Node.js installed.

### Installation

1. Clone the repository and navigate into the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

### Building for Production

To create a production-ready build:
```bash
npm run build
```

You can preview the built production app locally using:
```bash
npm run preview
```

## Project Structure (Highlights)

- `/src/context/index.jsx` - The global application context, providing Theme, Auth, Query, and Toast configurations.
- `/src/components/Sidebar` - The persistent navigation drawer with open/close states.
- `/src/components/application/ListFilterBar.jsx` - Reusable search and filter component used across list pages.
- `/src/modules/` - Feature-specific modules (e.g., Roles, Permissions).
