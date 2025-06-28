# Git Setup Instructions

Since Git is not available in the WebContainer environment, follow these steps to set up Git for your ITeachEd project:

## 1. Initialize Git Repository

Once you have access to a Git environment (local machine, GitHub Codespaces, etc.), run:

```bash
git init
git add .
git commit -m "Initial commit: ITeachEd AI-powered learning platform"
```

## 2. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `iteached-platform` or similar
3. Don't initialize with README, .gitignore, or license (we already have these)

## 3. Connect to Remote Repository

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/iteached-platform.git
git branch -M main
git push -u origin main
```

## 4. Environment Variables Setup

Before pushing, make sure to:

1. Copy `.env.example` to `.env`
2. Add your actual Supabase credentials to `.env`
3. Never commit the `.env` file (it's already in .gitignore)

## 5. Future Commits

For future changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

## 6. Recommended Git Workflow

- Create feature branches for new features: `git checkout -b feature/new-feature`
- Make commits with descriptive messages
- Push feature branches and create pull requests
- Merge to main after review

## Project Structure

```
iteached-platform/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/         # React contexts (Auth, etc.)
│   ├── lib/             # Utilities and configurations
│   ├── pages/           # Page components
│   └── types/           # TypeScript type definitions
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
└── package.json        # Dependencies and scripts
```

## Important Notes

- The `.env` file contains sensitive information and should never be committed
- All Supabase credentials should be kept secure
- Consider setting up branch protection rules on your main branch
- Use conventional commit messages for better project history