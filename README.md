#  African AI Talent Board

A sophisticated Node.js backend API for connecting African AI talent with job opportunities using an intelligent weighted matching algorithm.

### Features

- **Clean Layered Architecture**: Organized into Controllers → Services → Repositories
- **Smart Matching Algorithm**: Ranks talents using weighted scoring:
  - 60% Skill Overlap (case-insensitive)
  - 20% Budget Fit
  - 20% Experience Level Match
- **Sqlite + Prisma**: Type-safe database access with migrations
- **Interactive API Docs**: Swagger/OpenAPI UI for testing
- **African AI Talent**: Pre-seeded with realistic African AI professional profiles

##  Tech Stack

- **Runtime**: Node.js with ES6 Modules
- **Framework**: Express.js
- **Database**: Sqlite
- **ORM**: Prisma
- **Documentation**: Swagger UI / OpenAPI
- **Architecture**: Clean Layered (Controllers, Services, Repositories)

##  Project Structure

```
African AI Talent Board/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.js                # Seed data with African AI talent
│   └── migrations/            # Database migrations
├── src/
│   ├── config/
│   │   ├── database.js        # Prisma client configuration
│   │   └── swagger.js         # Swagger/OpenAPI configuration
│   ├── controllers/           # Request handling layer
│   │   ├── talent.controller.js
│   │   ├── job.controller.js
│   │   └── match.controller.js
│   ├── services/              # Business logic layer
│   │   ├── talent.service.js
│   │   ├── job.service.js
│   │   └── matching.service.js
│   ├── repositories/          # Data access layer
│   │   ├── talent.repository.js
│   │   └── job.repository.js
│   ├── routes/                # API routes
│   │   ├── talent.routes.js
│   │   ├── job.routes.js
│   │   └── match.routes.js
│   ├── middleware/
│   │   └── error.middleware.js
│   └── server.js              # Application entry point
├── .env.example               # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

##  Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd "Job Board"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   copy .env.example .env
   ```
   
   Edit `.env` and configure your PostgreSQL connection:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/african_ai_talent_board?schema=public"
   PORT=3000
   NODE_ENV=development
   ```

4. **Run database migrations**:
   ```bash
   npm run db:push
   ```

5. **Generate Prisma Client**:
   ```bash
   npm run db:generate
   ```

6. **Seed the database with African AI talent**:
   ```bash
   npm run db:seed
   ```

7. **Start the development server**:
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:3000`

##  API Documentation

Once the server is running, access the interactive Swagger UI:

**http://localhost:3000/api-docs**

##  API Endpoints

### Talent Management
- `POST /api/talents` - Create a new talent profile
- `GET /api/talents` - List all talents (with optional filters)
- `GET /api/talents/:id` - Get specific talent
- `PUT /api/talents/:id` - Update talent profile
- `DELETE /api/talents/:id` - Delete talent profile

### Job Management
- `POST /api/jobs` - Create a new job posting
- `GET /api/jobs` - List all jobs (with optional filters)
- `GET /api/jobs/:id` - Get specific job
- `PUT /api/jobs/:id` - Update job posting
- `DELETE /api/jobs/:id` - Delete job posting

### Matching (The Core Feature!)
- `GET /api/jobs/:jobId/matches` - Get ranked talent matches for a job
- `GET /api/matches/:talentId/:jobId` - Get detailed match breakdown

##  Matching Algorithm

The matching service calculates a **Match Score (0-100)** using weighted components:

### Formula
```
Total Score = (Skill Score × 0.6) + (Budget Score × 0.2) + (Experience Score × 0.2)
```

### Components

**1. Skill Overlap (60% weight)**
- Calculates percentage of required job skills that the talent possesses
- Case-insensitive comparison
- Formula: `(matching skills / total required skills) × 100`

**2. Budget Fit (20% weight)**
- Binary score: `100` if talent's hourly rate ≤ job budget, `0` otherwise
- Ensures financial feasibility

**3. Experience Fit (20% weight)**
- Exact match (e.g., SENIOR-SENIOR): `100 points`
- One level difference (e.g., MID-SENIOR): `50 points`
- Two levels difference (e.g., JUNIOR-SENIOR): `0 points`

##  Testing the System

### Example: Find matches for a job

```bash
GET http://localhost:3000/api/jobs/1/matches
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": 1,
    "jobTitle": "Senior NLP Engineer for Chatbot Development",
    "requiredSkills": ["Python", "NLP", "Transformers", "PyTorch"],
    "budgetMax": 95,
    "preferredExperienceLevel": "SENIOR",
    "totalMatches": 5,
    "matches": [
      {
        "talentId": 6,
        "name": "Youssef Benali",
        "email": "youssef.benali@nlptech.com",
        "skills": ["Python", "NLP", "Transformers", "BERT", "PyTorch", "Hugging Face"],
        "hourlyRate": 90,
        "experienceLevel": "SENIOR",
        "availability": true,
        "matchScore": 100
      },
      // ... more matches sorted by score
    ]
  }
}
```

### Create a new talent via Swagger

1. Go to `http://localhost:3000/api-docs`
2. Expand `POST /api/talents`
3. Click "Try it out"
4. Use this sample data:

```json
{
  "name": "Zainab Kamara",
  "email": "zainab.kamara@aiexpert.com",
  "skills": ["Python", "TensorFlow", "Computer Vision", "Deep Learning"],
  "hourlyRate": 80,
  "experienceLevel": "SENIOR",
  "availability": true
}
```

##  Database Schema

### Talent
```
- id: Integer (Primary Key)
- name: String
- email: String (Unique)
- skills: String[]
- hourlyRate: Decimal
- experienceLevel: Enum (JUNIOR, MID, SENIOR)
- availability: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

### Job
```
- id: Integer (Primary Key)
- title: String
- description: Text
- requiredSkills: String[]
- budgetMax: Decimal
- preferredExperienceLevel: Enum (JUNIOR, MID, SENIOR)
- createdAt: DateTime
- updatedAt: DateTime
```

##  Seed Data

The database comes pre-seeded with:
- **12 African AI Talent Profiles** from Nigeria, Kenya, South Africa, Ghana, Egypt, Morocco, Tanzania, Ethiopia, Uganda, Senegal, Rwanda, and Zimbabwe
- **7 Job Postings** covering NLP, Computer Vision, MLOps, Data Science, and more

All profiles feature realistic African names and relevant AI/ML skills.

##  Available Scripts

```bash
npm run dev          # Start development server with auto-reload
npm start            # Start production server
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema to database (faster for dev)
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:generate  # Generate Prisma Client
```

##  Error Handling

The API implements comprehensive error handling:
- **400**: Validation errors (bad request)
- **404**: Resource not found
- **500**: Internal server errors

All errors return a consistent JSON format:
```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

##  Development Tools

- **Prisma Studio**: Visual database browser (`npm run db:studio`)
- **Swagger UI**: Interactive API testing (`/api-docs`)
- **Auto-reload**: Development server watches for file changes

##  Troubleshooting

### Database connection issues
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env` file
- Ensure database exists

### Prisma client errors
Run: `npm run db:generate`

### Port already in use
Change PORT in `.env` file

---



