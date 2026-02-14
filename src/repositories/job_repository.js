import prisma from '../config/database.js';

/**
 * Job Repository - Data Access Layer
 * Handles all database operations for Job entity
 */
class JobRepository {
    /**
     * Create a new job posting
     */
    async create(jobData) {
        return await prisma.job.create({
            data: jobData,
        });
    }

    /**
     * Find job by ID
     */
    async findById(id) {
        return await prisma.job.findUnique({
            where: { id: parseInt(id) },
        });
    }

    /**
     * Get all jobs with optional filters
     */
    async findAll(filters = {}) {
        const where = {};

        if (filters.experienceLevel) {
            where.preferredExperienceLevel = filters.experienceLevel;
        }

        if (filters.minBudget) {
            where.budgetMax = {
                gte: filters.minBudget,
            };
        }

        return await prisma.job.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Update job posting
     */
    async update(id, jobData) {
        return await prisma.job.update({
            where: { id: parseInt(id) },
            data: jobData,
        });
    }

    /**
     * Delete job posting
     */
    async delete(id) {
        return await prisma.job.delete({
            where: { id: parseInt(id) },
        });
    }

    /**
     * Search jobs by skills
     */
    async searchBySkills(skills) {
        return await prisma.job.findMany({
            where: {
                requiredSkills: {
                    hasSome: skills,
                },
            },
        });
    }
}

export default new JobRepository();
