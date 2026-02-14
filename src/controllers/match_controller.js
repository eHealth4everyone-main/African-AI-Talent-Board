import matchingService from '../services/matching_service.js';

/**
 * Match Controller - Request Handling Layer
 * Handles HTTP requests related to talent-job matching
 */
class MatchController {
    /**
     * @desc    Get matched talents for a specific job
     * @route   GET /api/jobs/:jobId/matches
     * @access  Public
     */
    async getMatchesForJob(req, res, next) {
        try {
            const jobId = parseInt(req.params.jobId);
            
            // Validate jobId is a valid number
            if (isNaN(jobId) || jobId <= 0) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid job ID. Must be a positive integer.',
                    },
                });
            }
            
            const matches = await matchingService.getMatchesForJob(jobId);

            res.status(200).json({
                success: true,
                data: matches,
            });
        } catch (error) {
            // Log the actual error for debugging
            console.error('Error in getMatchesForJob:', error);
            
            // Handle specific error cases
            if (error.message === 'Job not found') {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: 'Job not found',
                        jobId: req.params.jobId,
                    },
                });
            }
            
            // Pass to global error handler for other errors
            next(error);
        }
    }

    /**
     * @desc    Get detailed match breakdown for a talent-job pair
     * @route   GET /api/matches/:talentId/:jobId
     * @access  Public
     */
    async getDetailedMatch(req, res, next) {
        try {
            const talentId = parseInt(req.params.talentId);
            const jobId = parseInt(req.params.jobId);
            
            // Validate IDs are valid numbers
            if (isNaN(talentId) || talentId <= 0) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid talent ID. Must be a positive integer.',
                    },
                });
            }
            
            if (isNaN(jobId) || jobId <= 0) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid job ID. Must be a positive integer.',
                    },
                });
            }
            
            const matchDetails = await matchingService.getDetailedMatch(talentId, jobId);

            res.status(200).json({
                success: true,
                data: matchDetails,
            });
        } catch (error) {
            // Log the actual error for debugging
            console.error('Error in getDetailedMatch:', error);
            
            // Handle specific error cases
            if (error.message === 'Talent not found') {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: 'Talent not found',
                        talentId: req.params.talentId,
                    },
                });
            }
            
            if (error.message === 'Job not found') {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: 'Job not found',
                        jobId: req.params.jobId,
                    },
                });
            }
            
            // Pass to global error handler for other errors
            next(error);
        }
    }
}

export default new MatchController();
