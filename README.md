# Aawni - Next.js Enterprise Application

A modern, scalable Next.js application built with TypeScript, featuring a comprehensive booking system, user management, and enterprise-grade architecture.

## 🚀 Features

- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with multiple providers
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: Zustand + React Query
- **UI Components**: Radix UI + Tailwind CSS
- **Testing**: Jest + React Testing Library + Playwright
- **Code Quality**: ESLint, Prettier, Husky, Commitlint
- **Deployment**: Docker + Vercel ready
- **CI/CD**: GitHub Actions workflow

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── marketing/          # Marketing pages
│   ├── booking/            # Booking flow pages
│   ├── profile/            # User profile
│   ├── orders/             # Order management
│   ├── dashboard/          # Admin/Technician dashboards
│   ├── auth/               # Authentication pages
│   └── support/            # Support pages
├── components/             # Reusable components
│   ├── ui/                 # Base UI components
│   ├── booking/            # Booking-specific components
│   ├── dashboard/          # Dashboard components
│   ├── forms/              # Form components
│   ├── marketing/          # Marketing components
│   └── layout/             # Layout components
├── layouts/                # Page layouts
├── hooks/                  # Custom React hooks
├── store/                  # State management (Zustand + React Query)
├── utils/                  # Utility functions
├── services/               # API service layer
├── types/                  # TypeScript type definitions
└── lib/                    # Third-party library configurations
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn
- PostgreSQL database
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aawni
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables in `.env.local`

4. **Database setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed the database (optional)
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Testing
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run test:ci` - Run tests for CI
- `npm run playwright:test` - Run Playwright E2E tests
- `npm run playwright:ui` - Run Playwright with UI

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:reset` - Reset database
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio

### Build Analysis
- `npm run analyze` - Analyze bundle size

### Storybook
- `npm run storybook` - Start Storybook
- `npm run storybook:build` - Build Storybook

## 🐳 Docker Development

1. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Run migrations**
   ```bash
   docker-compose exec app npm run db:migrate
   ```

## 🔧 Configuration

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker Production

1. **Build production image**
   ```bash
   docker build -t aawni .
   ```

2. **Run production container**
   ```bash
   docker run -p 3000:3000 aawni
   ```

## 🧪 Testing Strategy

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API route testing
- **E2E Tests**: Playwright for critical user flows
- **Component Tests**: Storybook for UI components

## 📊 Code Quality

- **ESLint**: Code linting with custom rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **Commitlint**: Conventional commit messages
- **TypeScript**: Strict type checking

## 🔒 Security

- **Authentication**: NextAuth.js with JWT
- **Authorization**: Role-based access control
- **Security Headers**: Configured in Next.js
- **Input Validation**: Zod schemas
- **SQL Injection Protection**: Prisma ORM

## 📈 Performance

- **Bundle Analysis**: @next/bundle-analyzer
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **Caching**: React Query for data fetching
- **Database**: Connection pooling with Prisma

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or modifications
- `chore:` - Build process or auxiliary tool changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please:

1. Check the [documentation](docs/)
2. Search [existing issues](https://github.com/your-repo/issues)
3. Create a [new issue](https://github.com/your-repo/issues/new)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Prisma](https://prisma.io/) - Next-generation ORM
- [Radix UI](https://radix-ui.com/) - Low-level UI primitives
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [React Query](https://tanstack.com/query) - Data fetching library
