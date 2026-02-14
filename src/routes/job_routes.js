import express from 'express';
import jobController from '../controllers/job_controller.js';
import { validateJob, validateId, validateJobQuery } from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - requiredSkills
 *         - budgetMax
 *         - preferredExperienceLevel
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated job ID
 *         title:
 *           type: string
 *           description: Job title
 *         description:
 *           type: string
 *           description: Job description
 *         requiredSkills:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of required skills
 *         budgetMax:
 *           type: number
 *           format: decimal
 *           description: Maximum budget (hourly rate)
 *         preferredExperienceLevel:
 *           type: string
 *           enum: [JUNIOR, MID, SENIOR]
 *           description: Preferred experience level
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job posting
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - requiredSkills
 *               - budgetMax
 *               - preferredExperienceLevel
 *             properties:
 *               title:
 *                 type: string
 *                 example: Senior AI/ML Engineer
 *               description:
 *                 type: string
 *                 example: We need an experienced ML engineer to build NLP models for our chatbot platform.
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Python", "TensorFlow", "NLP", "PyTorch"]
 *               budgetMax:
 *                 type: number
 *                 example: 100
 *               preferredExperienceLevel:
 *                 type: string
 *                 enum: [JUNIOR, MID, SENIOR]
 *                 example: SENIOR
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', validateJob, jobController.createJob.bind(jobController));

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: experienceLevel
 *         schema:
 *           type: string
 *           enum: [JUNIOR, MID, SENIOR]
 *         description: Filter by experience level
 *       - in: query
 *         name: minBudget
 *         schema:
 *           type: number
 *         description: Filter by minimum budget
 *     responses:
 *       200:
 *         description: List of jobs
 */
router.get('/', validateJobQuery, jobController.getAllJobs.bind(jobController));

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
router.get('/:id', validateId, jobController.getJobById.bind(jobController));

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: Update job posting
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *               budgetMax:
 *                 type: number
 *               preferredExperienceLevel:
 *                 type: string
 *                 enum: [JUNIOR, MID, SENIOR]
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       404:
 *         description: Job not found
 */
router.put('/:id', validateId, validateJob, jobController.updateJob.bind(jobController));

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete job posting
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 */
router.delete('/:id', validateId, jobController.deleteJob.bind(jobController));

export default router;
