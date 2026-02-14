# 🚀 Quick Setup Guide

## Before You Start

You need **PostgreSQL** installed and running on your machine.

---

## Step 1: Configure Database

Edit the `.env` file and update your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/african_ai_talent_board?schema=public"
```

Replace:
- `YOUR_USERNAME` with your PostgreSQL username (usually `postgres`)
- `YOUR_PASSWORD` with your PostgreSQL password

---

## Step 2: Initialize Database

Run these commands in order:

```bash
# Push schema to database (creates tables)
npm run db:push

# Generate Prisma Client
npm run db:generate

# Seed database with African AI talent data
npm run db:seed
```

**Expected Output**:
```
✅ Created 12 talent profiles
✅ Created 7 job postings
```

---

## Step 3: Start the Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

---

## Step 4: Test the API

### Option 1: Swagger UI (Recommended)

Open in your browser:
```
http://localhost:3000/api-docs
```

Try the matching endpoint:
1. Expand `GET /api/jobs/{jobId}/matches`
2. Click "Try it out"
3. Enter job ID: `1`
4. Click "Execute"

### Option 2: Browser

Navigate to:
```
http://localhost:3000/api/jobs/1/matches
```

You should see ranked talents for Job #1 (Senior NLP Engineer).

---

## 🎯 Testing Scenarios

### Test 1: Perfect Match
```bash
GET http://localhost:3000/api/jobs/1/matches
```
Look for "Youssef Benali" with score = 100

### Test 2: Different Job
```bash
GET http://localhost:3000/api/jobs/2/matches
```
Computer Vision job - see different rankings

### Test 3: Create New Talent
Use Swagger UI to POST new talent and see how they rank.

---

## 📚 Available Commands

```bash
npm run dev          # Start dev server with hot reload
npm run db:seed      # Re-seed database
npm run db:studio    # Open Prisma Studio (visual DB)
npm start            # Production server
```

---

## 🆘 Troubleshooting

### "Connection refused" error
- Make sure PostgreSQL is running
- Check your DATABASE_URL in `.env`

### "Relation does not exist"
Run: `npm run db:push`

### "Prisma Client not generated"
Run: `npm run db:generate`

---

## ✅ You're Ready!

Once you see the server running message:
```
🌍 African AI Talent Board API Server Running 🌍
📚 API Docs: http://localhost:3000/api-docs
```

Your backend is **live and ready** to match African AI talent with jobs! 🚀
