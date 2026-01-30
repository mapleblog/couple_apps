# Role: Senior Full-stack Architect & Vibe Coding Specialist

# Task: Initialize "Love Story" - A Couple Web App

We are starting a new project called "Love Story" (情侣故事网页). This is a modern, high-end gallery-style application for couple aniversay memory.

## 1. Core Tech Stack (The Vibe Stack)
Please initialize the project using the following technologies:
- Framework: Next.js (App Router, TypeScript)
- Styling: Tailwind CSS
- UI Components: Shadcn/UI (Modern, minimalist aesthetic)
- Icons: Lucide React
- Database & Auth: Supabase (PostgreSQL + Auth)
- ORM: Prisma
- State Management: React Server Components + Server Actions

## 2. Project Structure & Organization
Please set up a clean, modular directory structure:
- `/app`: App router (pages, layouts)
- `/components`: (UI, business-specific, and shared components)
- `/lib`: (Prisma client, Supabase config, utility functions)
- `/actions`: (Server Actions for backend logic/APIs)
- `/types`: (TypeScript interfaces/definitions)
- `/hooks`: (Custom React hooks)

## 3. Immediate Initialization Tasks
1. Setup a basic Next.js project with Tailwind and TypeScript.
2. Install and initialize Shadcn/UI with a "Zinc" or "Slate" theme.
3. Configure the `layout.tsx` with a responsive <Navbar /> (including Login/Register buttons and a Logo placeholder).
4. Set up the Prisma schema file with a `User` model and a `CollectionItem` model (including: title, description, imageUrl, category, createdAt).
5. Create a `.env.example` file including placeholders for SUPABASE_URL, SUPABASE_ANON_KEY, and DATABASE_URL.
6. Design a professional, dark-mode-first Landing Page hero section to set the "Vibe".
7. Run ```npm install -D prettier prettier-plugin-tailwindcss eslint-plugin-simple-import-sort eslint-config-prettier``` to install development dependencies.
8. Create a `.prettierrc` file with the following content:
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./tailwind.config.ts"
}
```

9. Create a `.eslintrc.json` file with the following content:
```json
{
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["simple-import-sort"],
  "rules": {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.js"],
      "rules": {
        "simple-import-sort/imports": [
          "error",
          {
            "groups": [
              ["^react", "^next", "^@", "^[a-z]"], // 外部库和内置库
              ["^@/components", "^@/lib", "^@/hooks"], // 内部别名路径
              ["^\\.\\.(?!/?$)", "^\\.\\./?$", "^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"], // 相对路径
              ["^.+\\.s?css$"] // 样式文件
            ]
          }
        ]
      }
    }
  ]
}
```

10. Adding code to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

11. Adding code to `tailwind.config.ts`:
```typescript
// tailwind.config.js 扩展建议
theme: {
  extend: {
    fontFamily: {
      serif: ['var(--font-playfair)', 'serif'], // 增加衬线体支持
    },
    animation: {
      'soft-fade': 'fadeIn 1.2s ease-out',
    }
  }
}
```

## 4. UI/UX Vibe Requirements
- Theme: Minimalist, Stone 950 + Rose 500.
- Use subtle animations (Framer Motion if available, or Tailwind transitions).
- Typography: Use Inter or a Playfair Display.
- Grid: Cinematic Hero + Adaptive Masonry.
- Corner: Large Rounded (2xl/3xl) for a modern, "Apple-esque" look.
- Motion: Framer Motion (Spring Physics & Hover Scales)

Please proceed with the file generation and project scaffolding. Let's make it look premium from the first commit!