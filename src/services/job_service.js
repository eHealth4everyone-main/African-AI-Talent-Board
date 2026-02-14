import jobRepository from '../repositories/job_repository.js';

/**
 * Job Service - Business Logic Layer
 * Handles job-related business operations and validation
 */
class JobService {
    /**
     * Create a new job posting with validation
     */
    async createJob(jobData) {
        // Validate required fields
        this.validateJobData(jobData);

        // Normalize skills for consistency
        const normalizedData = {
            ...jobData,
            requiredSkills: JSON.stringify(
                jobData.requiredSkills
                    .filter(skill => skill && typeof skill === 'string' && skill.trim().length > 0)
                    .map(skill => skill.trim())
            ),
        };

        const createdJob = await jobRepository.create(normalizedData);
        return { ...createdJob, requiredSkills: JSON.parse(createdJob.requiredSkills) };
    }

    /**
     * Get job by ID
     */
    async getJobById(id) {
        const job = await jobRepository.findById(id);
        if (!job) {
            throw new Error('Job not found');
        }
        return { ...job, requiredSkills: JSON.parse(job.requiredSkills) };
    }

    /**
     * Get all jobs with optional filters
     */
    async getAllJobs(filters = {}) {
        const jobs = await jobRepository.findAll(filters);
        return jobs.map(j => ({ ...j, requiredSkills: JSON.parse(j.requiredSkills) }));
    }

    /**
     * Update job posting
     */
    async updateJob(id, jobData) {
        const existingJob = await jobRepository.findById(id);
        if (!existingJob) {
            throw new Error('Job not found');
        }

        // Normalize skills if provided
        if (jobData.requiredSkills) {
            jobData.requiredSkills = JSON.stringify(
                jobData.requiredSkills
                    .filter(skill => skill && typeof skill === 'string' && skill.trim().length > 0)
                    .map(skill => skill.trim())
            );
        }

        const updatedJob = await jobRepository.update(id, jobData);
        return { ...updatedJob, requiredSkills: JSON.parse(updatedJob.requiredSkills) };
    }

    /**
     * Delete job posting
     */
    async deleteJob(id) {
        const job = await jobRepository.findById(id);
        if (!job) {
            throw new Error('Job not found');
        }
        return await jobRepository.delete(id);
    }

    /**
     * Validate job data
     */
    validateJobData(data) {
        const errors = [];

        if (!data.title || data.title.trim().length === 0) {
            errors.push('Title is required');
        }

        if (!data.description || data.description.trim().length === 0) {
            errors.push('Description is required');
        }

        if (!data.requiredSkills || !Array.isArray(data.requiredSkills) || data.requiredSkills.length === 0) {
            errors.push('At least one required skill is necessary');
        }

        if (!data.budgetMax || data.budgetMax <= 0) {
            errors.push('Valid maximum budget is required');
        }

        if (!data.preferredExperienceLevel || !['JUNIOR', 'MID', 'SENIOR'].includes(data.preferredExperienceLevel)) {
            errors.push('Preferred experience level must be JUNIOR, MID, or SENIOR');
        }

        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors.join(', ')}`);
        }
    }
}

export default new JobService();
