# Deployment Guide for MedAI Lite

## Git Repository Setup

### Option 1: Using GitHub CLI (Recommended)
1. Install GitHub CLI: https://cli.github.com/
2. Authenticate:
   ```bash
   gh auth login
   ```
3. Push the repository:
   ```bash
   git push -u origin master
   ```

### Option 2: Using Personal Access Token
1. Go to GitHub Settings > Developer Settings > Personal Access Tokens
2. Generate a new token with repository permissions
3. Use the token as password when pushing:
   ```bash
   git remote set-url origin https://username:token@github.com/Sujalkarale45/Smackathon-Team_VibeCoder.git
   git push -u origin master
   ```

### Option 3: SSH Key Setup
1. Generate SSH key:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
2. Add SSH key to GitHub: Settings > SSH and GPG keys
3. Change remote URL:
   ```bash
   git remote set-url origin git@github.com:Sujalkarale45/Smackathon-Team_VibeCoder.git
   git push -u origin master
   ```

## Environment Setup for Team Members

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Google Gemini API key

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sujalkarale45/Smackathon-Team_VibeCoder.git
   cd Smackathon-Team_VibeCoder
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env file and add your GEMINI_API_KEY
   python app.py
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000 (or 3001)
   - Backend API: http://localhost:5000

## Production Deployment

### Backend (Flask)
- Deploy to Heroku, Railway, or similar platform
- Set environment variables in platform settings
- Use production WSGI server (gunicorn)

### Frontend (React)
- Build: `npm run build`
- Deploy to Vercel, Netlify, or similar platform
- Update API endpoints to production backend URL

### Database (Optional)
- Currently uses no database
- Can add PostgreSQL or MongoDB for user data/history

## Security Notes
- Never commit .env files
- Rotate API keys regularly
- Use HTTPS in production
- Implement rate limiting for APIs

## Team Collaboration
1. Create feature branches for new development
2. Use pull requests for code review
3. Keep .env.example updated with new variables
4. Update README with new features or setup changes
