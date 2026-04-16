# 🚀 Quick Note

**Quick Note** is a high-performance, minimalist platform for instant note-taking and temporary text sharing (Drops). Built with a focus on speed, security, and a premium developer aesthetic.

![Platform Preview](https://via.placeholder.com/1200x600/111/fff?text=Quick+Note+Platform+Preview)

## ✨ Features

- **Instant Drops**: Share text or data snippets with a single click.
- **Secure Storage**: Encrypted data handling for sensitive information.
- **Minimalist Dashboard**: A clean, "industrial-chic" interface for managing your content.
- **QR Integration**: Easy mobile access via auto-generated QR codes.
- **Blazing Fast**: Optimized Next.js 15 architecture with heavy prefetching.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org)
- **Database**: [PostgreSQL](https://www.postgresql.org) with [Prisma ORM](https://www.prisma.io)
- **Auth**: [Better Auth](https://better-auth.com)
- **Storage**: [Cloudflare R2](https://www.cloudflare.com/products/r2/) (S3 Compatible)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Tooling**: [Biome](https://biomejs.dev) (Linting & Formatting)

---

## ⚙️ Setup & Installation

### Prerequisites

- **Node.js**: `v20.x` or higher
- **Package Manager**: `pnpm` (recommended)
- **Database**: A running PostgreSQL instance

### 1. Clone the Repository

```bash
git clone https://github.com/Shaikh-Danish/quick-note.git
cd quick-note
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and populate it with the following:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/quick_note"

# Auth
BETTER_AUTH_SECRET="your-very-secure-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Storage (Cloudflare R2 / S3)
R2_ENDPOINT="https://<accountid>.r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="quick-note-drops"

# App
NEXT_PUBLIC_BASE_APP_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
pnpm prisma db push
pnpm prisma generate
```

### 5. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your local instance.

---

## 🤝 Contributing

We welcome contributions! To keep the codebase clean and maintainable, please follow these guidelines:

### Contribution Workflow

1. **Fork** the repository.
2. **Create a topic branch**: `git checkout -b feature/cool-new-thing` or `fix/annoying-bug`.
3. **Commit your changes**: Ensure your commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
4. **Lint & Format**: Run `pnpm lint` and `pnpm format` before committing.
5. **Push to your fork** and submit a **Pull Request**.

### Code Style

This project uses **Biome** for linting and formatting. Ensure your editor is configured to use the `biome.json` rules defined in the root.

```bash
pnpm format  # Auto-format code
pnpm lint    # Check for linting errors
```

---

## 📜 License

Distributed under the GNU General Public License v3. See `LICENSE` for more information.

---

Built with ❤️ by [Shaikh Danish](https://github.com/Shaikh-Danish)
