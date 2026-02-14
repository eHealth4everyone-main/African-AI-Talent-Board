import talentService from '../services/talent_service.js';

/**
 * Talent Controller - Request Handling Layer
 * Handles HTTP requests related to talent operations
 */
class TalentController {
    /**
     * @desc    Create a new talent
     * @route   POST /api/talents
     * @access  Public
     */
    async createTalent(req, res, next) {
        try {
            const talent = await talentService.createTalent(req.body);
            res.status(201).json({
                success: true,
                data: talent,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Get all talents
     * @route   GET /api/talents
     * @access  Public
     */
    async getAllTalents(req, res, next) {
        try {
            const { availability, experienceLevel, maxRate } = req.query;

            const filters = {};
            if (availability !== undefined) {
                filters.availability = availability === 'true';
            }
            if (experienceLevel) {
                filters.experienceLevel = experienceLevel;
            }
            if (maxRate) {
                filters.maxRate = parseFloat(maxRate);
            }

            const talents = await talentService.getAllTalents(filters);
            res.status(200).json({
                success: true,
                count: talents.length,
                data: talents,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Get single talent by ID
     * @route   GET /api/talents/:id
     * @access  Public
     */
    async getTalentById(req, res, next) {
        try {
            const talent = await talentService.getTalentById(parseInt(req.params.id));
            res.status(200).json({
                success: true,
                data: talent,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Update talent
     * @route   PUT /api/talents/:id
     * @access  Public
     */
    async updateTalent(req, res, next) {
        try {
            const talent = await talentService.updateTalent(parseInt(req.params.id), req.body);
            res.status(200).json({
                success: true,
                data: talent,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Delete talent
     * @route   DELETE /api/talents/:id
     * @access  Public
     */
    async deleteTalent(req, res, next) {
        try {
            await talentService.deleteTalent(parseInt(req.params.id));
            res.status(200).json({
                success: true,
                message: 'Talent deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new TalentController();
