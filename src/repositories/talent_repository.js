import prisma from '../config/database.js';

/**
 * Talent Repository - Data Access Layer
 * Handles all database operations for Talent entity
 */
class TalentRepository {
    /**
     * Create a new talent profile
     */
    async create(talentData) {
        return await prisma.talent.create({
            data: talentData,
        });
    }

    /**
     * Find talent by ID
     */
    async findById(id) {
        return await prisma.talent.findUnique({
            where: { id: parseInt(id) },
        });
    }

    /**
     * Find talent by email
     */
    async findByEmail(email) {
        return await prisma.talent.findUnique({
            where: { email },
        });
    }

    /**
     * Get all talents with optional filters
     */
    async findAll(filters = {}) {
        const where = {};

        if (filters.availability !== undefined) {
            where.availability = filters.availability;
        }

        if (filters.experienceLevel) {
            where.experienceLevel = filters.experienceLevel;
        }

        if (filters.maxRate) {
            where.hourlyRate = {
                lte: filters.maxRate,
            };
        }

        return await prisma.talent.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Update talent profile
     */
    async update(id, talentData) {
        return await prisma.talent.update({
            where: { id: parseInt(id) },
            data: talentData,
        });
    }

    /**
     * Delete talent profile
     */
    async delete(id) {
        return await prisma.talent.delete({
            where: { id: parseInt(id) },
        });
    }

    /**
     * Get available talents (for matching)
     */
    async findAvailable() {
        return await prisma.talent.findMany({
            where: { availability: true },
        });
    }
}

export default new TalentRepository();
