import jobService from '../services/job_service.js';

/**
 * Job Controller - Request Handling Layer
 * Handles HTTP requests related to job operations
 */
class JobController {
    /**
     * @desc    Create a new job
     * @route   POST /api/jobs
     * @access  Public
     */
    async createJob(req, res, next) {
        try {
            const job = await jobService.createJob(req.body);
            res.status(201).json({
                success: true,
                data: job,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Get all jobs
     * @route   GET /api/jobs
     * @access  Public
     */
    async getAllJobs(req, res, next) {
        try {
            const { experienceLevel, minBudget } = req.query;

            const filters = {};
            if (experienceLevel) {
                filters.experienceLevel = experienceLevel;
            }
            if (minBudget) {
                filters.minBudget = parseFloat(minBudget);
            }

            const jobs = await jobService.getAllJobs(filters);
            res.status(200).json({
                success: true,
                count: jobs.length,
                data: jobs,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Get single job by ID
     * @route   GET /api/jobs/:id
     * @access  Public
     */
    async getJobById(req, res, next) {
        try {
            const job = await jobService.getJobById(parseInt(req.params.id));
            res.status(200).json({
                success: true,
                data: job,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Update job
     * @route   PUT /api/jobs/:id
     * @access  Public
     */
    async updateJob(req, res, next) {
        try {
            const job = await jobService.updateJob(parseInt(req.params.id), req.body);
            res.status(200).json({
                success: true,
                data: job,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Delete job
     * @route   DELETE /api/jobs/:id
     * @access  Public
     */
    async deleteJob(req, res, next) {
        try {
            await jobService.deleteJob(parseInt(req.params.id));
            res.status(200).json({
                success: true,
                message: 'Job deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new JobController();
