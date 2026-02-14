import express from 'express';
import talentController from '../controllers/talent_controller.js';
import { validateTalent, validateId, validateTalentQuery } from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Talent:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - skills
 *         - hourlyRate
 *         - experienceLevel
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated talent ID
 *         name:
 *           type: string
 *           description: Talent's full name
 *         email:
 *           type: string
 *           format: email
 *           description: Talent's email address
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of skills
 *         hourlyRate:
 *           type: number
 *           format: decimal
 *           description: Hourly rate in USD
 *         experienceLevel:
 *           type: string
 *           enum: [JUNIOR, MID, SENIOR]
 *           description: Experience level
 *         availability:
 *           type: boolean
 *           default: true
 *           description: Availability status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/talents:
 *   post:
 *     summary: Create a new talent profile
 *     tags: [Talents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - skills
 *               - hourlyRate
 *               - experienceLevel
 *             properties:
 *               name:
 *                 type: string
 *                 example: Amara Okafor
 *               email:
 *                 type: string
 *                 example: amara.okafor@example.com
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Python", "TensorFlow", "NLP", "Deep Learning"]
 *               hourlyRate:
 *                 type: number
 *                 example: 85
 *               experienceLevel:
 *                 type: string
 *                 enum: [JUNIOR, MID, SENIOR]
 *                 example: SENIOR
 *               availability:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Talent created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', validateTalent, talentController.createTalent.bind(talentController));

/**
 * @swagger
 * /api/talents:
 *   get:
 *     summary: Get all talents
 *     tags: [Talents]
 *     parameters:
 *       - in: query
 *         name: availability
 *         schema:
 *           type: boolean
 *         description: Filter by availability
 *       - in: query
 *         name: experienceLevel
 *         schema:
 *           type: string
 *           enum: [JUNIOR, MID, SENIOR]
 *         description: Filter by experience level
 *       - in: query
 *         name: maxRate
 *         schema:
 *           type: number
 *         description: Filter by maximum hourly rate
 *     responses:
 *       200:
 *         description: List of talents
 */
router.get('/', validateTalentQuery, talentController.getAllTalents.bind(talentController));

/**
 * @swagger
 * /api/talents/{id}:
 *   get:
 *     summary: Get talent by ID
 *     tags: [Talents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Talent ID
 *     responses:
 *       200:
 *         description: Talent details
 *       404:
 *         description: Talent not found
 */
router.get('/:id', validateId, talentController.getTalentById.bind(talentController));

/**
 * @swagger
 * /api/talents/{id}:
 *   put:
 *     summary: Update talent profile
 *     tags: [Talents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Talent ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               hourlyRate:
 *                 type: number
 *               experienceLevel:
 *                 type: string
 *                 enum: [JUNIOR, MID, SENIOR]
 *               availability:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Talent updated successfully
 *       404:
 *         description: Talent not found
 */
router.put('/:id', validateId, validateTalent, talentController.updateTalent.bind(talentController));

/**
 * @swagger
 * /api/talents/{id}:
 *   delete:
 *     summary: Delete talent profile
 *     tags: [Talents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Talent ID
 *     responses:
 *       200:
 *         description: Talent deleted successfully
 *       404:
 *         description: Talent not found
 */
router.delete('/:id', validateId, talentController.deleteTalent.bind(talentController));

export default router;
