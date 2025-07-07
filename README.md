# 🇮🇳 IndiaGovAssistant

IndiaGovAssistant is a virtual assistant designed to simplify access to Indian government services. Built with a modern web stack, it offers a user-friendly interface to help citizens navigate various government schemes and services efficiently.

## 🧰 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** Drizzle ORM (TypeScript)
- **Styling:** Tailwind CSS
- **Build Tools:** Vite, TypeScript

## 📁 Project Structure

```
IndiaGovAssistant/
├── client/             # Frontend application
├── server/             # Backend API
├── shared/             # Shared utilities and types
├── .gitignore
├── drizzle.config.ts   # Drizzle ORM configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ShubhamPipaliya2007/IndiaGovAssistant.git
   cd IndiaGovAssistant
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the database:**

   ```bash
   # Configure Drizzle ORM
   npx drizzle-kit generate
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

## 🧪 Testing

To run tests, use:

```bash
npm test
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## 🙌 Acknowledgements

This project is inspired by the need to make government services more accessible to the general public.
