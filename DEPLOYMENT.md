# Deployment Guide

This project supports three environments: **Development**, **Staging**, and **Production**.

## 🏗️ Environment Overview

| Environment | Branch | Supabase | Deployment | URL |
|-------------|--------|----------|------------|-----|
| **Development** | `main` (local) | Local instance | Manual | `http://localhost:3000` |
| **Staging** | `develop` | Remote (staging) | Auto (GitHub Actions) | `https://staging.yourapp.com` |
| **Production** | `main` | Remote (production) | Auto (GitHub Actions) | `https://yourapp.com` |

## 🚀 Development Setup

### Prerequisites
- Node.js 18+ 
- Docker (for local Supabase)
- Supabase CLI

### Local Development with Supabase
```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Start local Supabase
npm run supabase:start

# 3. Run development server (automatically uses local Supabase)
npm run dev

# 4. Check Supabase status
npm run supabase:status
```

### Local Development with Remote Supabase
```bash
# 1. Copy your remote environment variables to .env.local
cp .env.example .env.local
# Edit .env.local with your remote Supabase credentials

# 2. Run development server with remote
npm run dev:remote
```

## 🔧 Environment Configuration

### Required GitHub Secrets

#### Staging Environment
```
STAGING_SUPABASE_URL=https://your-staging-project.supabase.co
STAGING_SUPABASE_ANON_KEY=your_staging_anon_key
STAGING_SUPABASE_SERVICE_ROLE_KEY=your_staging_service_role_key
STAGING_APP_URL=https://staging.yourapp.com
```

#### Production Environment
```
PROD_SUPABASE_URL=https://your-production-project.supabase.co
PROD_SUPABASE_ANON_KEY=your_production_anon_key
PROD_SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
PROD_APP_URL=https://yourapp.com
```

#### Deployment Platform (Vercel example)
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_STAGING_PROJECT_ID=your_staging_project_id
VERCEL_PROD_PROJECT_ID=your_production_project_id
```

#### Optional Supabase CLI (for migrations)
```
SUPABASE_ACCESS_TOKEN=your_supabase_access_token
```

## 🔄 Deployment Workflow

### Staging Deployment
1. **Push to `develop` branch** or **create PR to `develop`**
2. **GitHub Actions automatically:**
   - Runs tests and linting
   - Builds with staging configuration
   - Deploys to staging environment
3. **Staging URL:** `https://staging.yourapp.com`

### Production Deployment
1. **Merge `develop` → `main`** or **push to `main`**
2. **GitHub Actions automatically:**
   - Runs comprehensive tests
   - Builds with production configuration
   - Deploys to production environment
   - (Optional) Runs database migrations
3. **Production URL:** `https://yourapp.com`

## 🗄️ Database Management

### Local Development
```bash
# Reset local database
npm run supabase:reset

# Generate TypeScript types
npm run supabase:gen-types

# Stop local Supabase
npm run supabase:stop
```

### Staging/Production Migrations
```bash
# Link to staging project
supabase link --project-ref your-staging-ref

# Push migrations to staging
supabase db push

# Link to production project
supabase link --project-ref your-production-ref

# Push migrations to production
supabase db push
```

## 📋 Setup Checklist

### 1. Repository Setup
- [ ] Create `develop` branch: `git checkout -b develop`
- [ ] Set up branch protection rules on GitHub
- [ ] Configure GitHub secrets

### 2. Supabase Projects
- [ ] Create staging Supabase project
- [ ] Create production Supabase project
- [ ] Set up database schemas in both
- [ ] Configure RLS policies

### 3. Deployment Platform
- [ ] Set up staging deployment (Vercel/Netlify/etc.)
- [ ] Set up production deployment
- [ ] Configure custom domains
- [ ] Set up SSL certificates

### 4. Testing
- [ ] Test local development workflow
- [ ] Test staging deployment
- [ ] Test production deployment
- [ ] Verify database connections

## 🔒 Security Best Practices

1. **Never commit real environment variables**
2. **Use GitHub secrets for sensitive data**
3. **Enable branch protection on `main` and `develop`**
4. **Review all PRs before merging**
5. **Test staging before production deployment**
6. **Monitor production deployments**

## 🚨 Troubleshooting

### Local Supabase Issues
```bash
# Check Docker status
docker ps

# Restart Supabase
npm run supabase:stop
npm run supabase:start

# Check logs
supabase logs
```

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

### Deployment Issues
- Check GitHub Actions logs
- Verify all secrets are set
- Check deployment platform logs
- Verify Supabase project is accessible

## 📞 Support

For deployment issues:
1. Check GitHub Actions logs
2. Review this documentation
3. Check Supabase dashboard
4. Contact the development team