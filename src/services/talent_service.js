import talentRepository from '../repositories/talent_repository.js';

/**
 * Talent Service - Business Logic Layer
 * Handles talent-related business operations and validation
 */
class TalentService {
    /**
     * Create a new talent profile with validation
     */
    async createTalent(talentData) {
        // Validate required fields
        this.validateTalentData(talentData);

        // Check if email already exists
        const existingTalent = await talentRepository.findByEmail(talentData.email);
        if (existingTalent) {
            const error = new Error('Talent with this email already exists');
            error.statusCode = 409;
            throw error;
}

        // Normalize skills to lowercase for consistency
        const normalizedData = {
            ...talentData,
            skills: JSON.stringify(
                talentData.skills
                    .filter(skill => skill && typeof skill === 'string' && skill.trim().length > 0)
                    .map(skill => skill.trim())
            ),
        };

        const createdTalent = await talentRepository.create(normalizedData);
        return { ...createdTalent, skills: JSON.parse(createdTalent.skills) };
    }

    /**
     * Get talent by ID
     */
    async getTalentById(id) {
        const talent = await talentRepository.findById(id);
        if (!talent) {
            throw new Error('Talent not found');
        }
        return { ...talent, skills: JSON.parse(talent.skills) };
    }

    /**
     * Get all talents with optional filters
     */
    async getAllTalents(filters = {}) {
        const talents = await talentRepository.findAll(filters);
        return talents.map(t => ({ ...t, skills: JSON.parse(t.skills) }));
    }

    /**
     * Update talent profile
     */
    async updateTalent(id, talentData) {
        const existingTalent = await talentRepository.findById(id);
        if (!existingTalent) {
            throw new Error('Talent not found');
        }

        // If email is being updated, check for duplicates
        if (talentData.email && talentData.email !== existingTalent.email) {
            const emailExists = await talentRepository.findByEmail(talentData.email);
            if (emailExists) {
                const error = new Error('Email already in use');
                error.statusCode = 409;
                throw error;
            }
        }

        // Normalize skills if provided
        if (talentData.skills) {
            talentData.skills = JSON.stringify(
                talentData.skills
                    .filter(skill => skill && typeof skill === 'string' && skill.trim().length > 0)
                    .map(skill => skill.trim())
            );
        }

        const updatedTalent = await talentRepository.update(id, talentData);
        return { ...updatedTalent, skills: JSON.parse(updatedTalent.skills) };
    }

    /**
     * Delete talent profile
     */
    async deleteTalent(id) {
        const talent = await talentRepository.findById(id);
        if (!talent) {
            throw new Error('Talent not found');
        }
        return await talentRepository.delete(id);
    }

    /**
     * Validate talent data
     */
    validateTalentData(data) {
        const errors = [];

        if (!data.name || data.name.trim().length === 0) {
            errors.push('Name is required');
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Valid email is required');
        }

        if (!data.skills || !Array.isArray(data.skills) || data.skills.length === 0) {
            errors.push('At least one skill is required');
        }

        if (!data.hourlyRate || data.hourlyRate <= 0) {
            errors.push('Valid hourly rate is required');
        }

        if (!data.experienceLevel || !['JUNIOR', 'MID', 'SENIOR'].includes(data.experienceLevel)) {
            errors.push('Experience level must be JUNIOR, MID, or SENIOR');
        }

        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors.join(', ')}`);
        }
    }

    /**
     * Simple email validation
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

export default new TalentService();
