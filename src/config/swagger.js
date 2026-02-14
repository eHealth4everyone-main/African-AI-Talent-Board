import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'African AI Talent Board API',
            version: '1.0.0',
            description: `
# African AI Talent Board API

A sophisticated backend API for connecting African AI talent with job opportunities using an intelligent matching algorithm.

## Features

- **Talent Management**: Create and manage talent profiles with skills, rates, and experience levels
- **Job Management**: Post and manage job listings with required skills and budgets
- **Smart Matching**: Weighted algorithm that ranks talents based on:
  - **60%** Skill overlap
  - **20%** Budget fit
  - **20%** Experience level match

## Matching Algorithm

The matching system uses a sophisticated weighted scoring system:

### Skill Overlap (60% weight)
- Case-insensitive comparison
- Calculates percentage of job skills the talent possesses
- Formula: (matching skills / total required skills) × 100

### Budget Fit (20% weight)
- Binary score: 100 if talent rate ≤ job budget, 0 otherwise
- Ensures financial feasibility

### Experience Fit (20% weight)
- Exact match: 100 points
- One level difference: 50 points
- Two levels difference: 0 points

## Getting Started

1. Create some talent profiles using \`POST /api/talents\`
2. Create job postings using \`POST /api/jobs\`
3. Get ranked matches using \`GET /api/jobs/:jobId/matches\`

Use the interactive API documentation below to test all endpoints!
      `,
            contact: {
                name: 'API Support',
            },
            license: {
                name: 'MIT',
            },
        },
        servers: [
            {
                url: process.env.BASE_URL || 'http://localhost:3000',
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
            },
        ],
        tags: [
            {
                name: 'Talents',
                description: 'Talent profile management endpoints',
            },
            {
                name: 'Jobs',
                description: 'Job posting management endpoints',
            },
            {
                name: 'Matching',
                description: 'Talent-job matching endpoints with intelligent scoring',
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
