# Deployment Guide

## Netlify Deployment (Recommended)

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   Add these environment variables in Netlify dashboard:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy**
   - Click "Deploy site"
   - Your site will be available at a Netlify URL

## Vercel Deployment

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository

2. **Build Settings**
   - Framework Preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Environment Variables**
   Add the same environment variables as above

## Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder** to your hosting provider

## Important Notes

- Ensure all environment variables are set correctly
- Test the deployment with a staging environment first
- Set up custom domain if needed
- Configure redirects for single-page application routing