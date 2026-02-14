import express from 'express';
import matchController from '../controllers/match_controller.js';
import { validateJobId, validateTalentId } from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Match:
 *       type: object
 *       properties:
 *         talentId:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *         hourlyRate:
 *           type: number
 *         experienceLevel:
 *           type: string
 *         availability:
 *           type: boolean
 *         matchScore:
 *           type: number
 *           description: Overall match score (0-100)
 */

/**
 * @swagger
 * /api/jobs/{jobId}/matches:
 *   get:
 *     summary: Get ranked talent matches for a job
 *     tags: [Matching]
 *     description: Returns all available talents ranked by their match score for the specified job. Score is calculated using weighted algorithm (60% skills, 20% budget, 20% experience).
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID to find matches for
 *     responses:
 *       200:
 *         description: List of matched talents sorted by score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobId:
 *                       type: integer
 *                       example: 1
 *                     jobTitle:
 *                       type: string
 *                       example: Senior AI/ML Engineer
 *                     requiredSkills:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Python", "TensorFlow", "NLP"]
 *                     budgetMax:
 *                       type: number
 *                       example: 100
 *                     preferredExperienceLevel:
 *                       type: string
 *                       example: SENIOR
 *                     totalMatches:
 *                       type: integer
 *                       example: 5
 *                     matches:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Match'
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
router.get('/jobs/:jobId/matches', validateJobId, matchController.getMatchesForJob.bind(matchController));

/**
 * @swagger
 * /api/matches/{talentId}/{jobId}:
 *   get:
 *     summary: Get detailed match breakdown for a talent-job pair
 *     tags: [Matching]
 *     description: Returns detailed scoring breakdown showing how each component (skills, budget, experience) contributes to the overall match score.
 *     parameters:
 *       - in: path
 *         name: talentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Talent ID
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Detailed match breakdown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     talent:
 *                       type: object
 *                     job:
 *                       type: object
 *                     scoreBreakdown:
 *                       type: object
 *                       properties:
 *                         skillScore:
 *                           type: object
 *                         budgetScore:
 *                           type: object
 *                         experienceScore:
 *                           type: object
 *                     totalScore:
 *                       type: number
 *       404:
 *         description: Talent or job not found
 */
router.get('/matches/:talentId/:jobId', [validateTalentId, validateJobId], matchController.getDetailedMatch.bind(matchController));

export default router;
