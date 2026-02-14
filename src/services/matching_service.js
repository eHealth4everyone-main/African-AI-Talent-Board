import talentRepository from '../repositories/talent_repository.js';
import jobRepository from '../repositories/job_repository.js';

/**
 * Matching Service - Business Logic Layer
 * Implements the weighted matching algorithm for talent-job pairing
 */
class MatchingService {
    /**
     * Get top matching talents for a specific job
     * @param {number} jobId - The job ID to find matches for
     * @returns {Object} Job details with sorted matched talents
     */
    async getMatchesForJob(jobId) {
        // Fetch the job
        const job = await jobRepository.findById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }

        // Fetch all available talents
        const talents = await talentRepository.findAvailable();
        
        // Handle case where no talents are available
        if (!talents || talents.length === 0) {
            return {
                jobId: job.id,
                jobTitle: job.title,
                requiredSkills: this.safeParseJSON(job.requiredSkills, []),
                budgetMax: parseFloat(job.budgetMax) || 0,
                preferredExperienceLevel: job.preferredExperienceLevel,
                totalMatches: 0,
                matches: [],
                message: 'No available talents found',
            };
        }

        // Calculate match scores for each talent
        const matches = talents.map(talent => {
            try {
                const talentSkills = this.safeParseJSON(talent.skills, []);
                const jobRequiredSkills = this.safeParseJSON(job.requiredSkills, []);

                return {
                    talentId: talent.id,
                    name: talent.name,
                    email: talent.email,
                    skills: talentSkills,
                    hourlyRate: parseFloat(talent.hourlyRate) || 0,
                    experienceLevel: talent.experienceLevel,
                    availability: talent.availability,
                    matchScore: this.calculateMatchScore(
                        { ...talent, skills: talentSkills, hourlyRate: parseFloat(talent.hourlyRate) || 0 },
                        { ...job, requiredSkills: jobRequiredSkills, budgetMax: parseFloat(job.budgetMax) || 0 }
                    ),
                };
            } catch (error) {
                console.error(`Error processing talent ${talent.id}:`, error);
                // Return a default match with 0 score if processing fails
                return {
                    talentId: talent.id,
                    name: talent.name,
                    email: talent.email,
                    skills: [],
                    hourlyRate: 0,
                    experienceLevel: talent.experienceLevel,
                    availability: talent.availability,
                    matchScore: 0,
                };
            }
        });

        // Sort by match score (descending) and filter out 0 scores
        const sortedMatches = matches
            .filter(match => match.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore);

        return {
            jobId: job.id,
            jobTitle: job.title,
            requiredSkills: this.safeParseJSON(job.requiredSkills, []),
            budgetMax: parseFloat(job.budgetMax) || 0,
            preferredExperienceLevel: job.preferredExperienceLevel,
            totalMatches: sortedMatches.length,
            matches: sortedMatches,
        };
    }

    /**
     * Calculate overall match score using weighted algorithm
     * @param {Object} talent - Talent profile
     * @param {Object} job - Job posting
     * @returns {number} Match score (0-100)
     */
    calculateMatchScore(talent, job) {
        try {
            // Validate inputs
            if (!talent || !job) {
                return 0;
            }
            
            // Ensure skills are arrays
            const talentSkills = Array.isArray(talent.skills) ? talent.skills : [];
            const jobSkills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
            
            // 60% Weight: Skill Overlap
            const skillScore = this.calculateSkillOverlap(talentSkills, jobSkills);

            // 20% Weight: Budget Fit
            const talentRate = parseFloat(talent.hourlyRate) || 0;
            const jobBudget = parseFloat(job.budgetMax) || 0;
            const budgetScore = this.calculateBudgetFit(talentRate, jobBudget);

            // 20% Weight: Experience Fit
            const experienceScore = this.calculateExperienceFit(
                talent.experienceLevel,
                job.preferredExperienceLevel
            );

            // Weighted calculation
            const totalScore = (skillScore * 0.6) + (budgetScore * 0.2) + (experienceScore * 0.2);

            // Round to 2 decimal places
            return Math.round(totalScore * 100) / 100;
        } catch (error) {
            console.error('Error calculating match score:', error);
            return 0;
        }
    }

    /**
     * Calculate skill overlap percentage (case-insensitive)
     * @param {Array} talentSkills - Talent's skills
     * @param {Array} requiredSkills - Job's required skills
     * @returns {number} Overlap score (0-100)
     */
    calculateSkillOverlap(talentSkills, requiredSkills) {
        // Validate inputs - ensure they are arrays
        if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
            return 100; // If no skills required, everyone matches
        }
        
        if (!Array.isArray(talentSkills) || talentSkills.length === 0) {
            return 0; // If talent has no skills, no match
        }

        // Normalize all skills to lowercase for case-insensitive comparison
        // Filter out null, undefined, non-strings, and empty strings
        const normalizedTalentSkills = talentSkills
            .filter(skill => skill && typeof skill === 'string' && skill.trim().length > 0)
            .map(skill => skill.toLowerCase().trim());
        
        const normalizedRequiredSkills = requiredSkills
            .filter(skill => skill && typeof skill === 'string' && skill.trim().length > 0)
            .map(skill => skill.toLowerCase().trim());
        
        // If after filtering, required skills is empty, everyone matches
        if (normalizedRequiredSkills.length === 0) {
            return 100;
        }
        
        // If after filtering, talent has no valid skills, no match
        if (normalizedTalentSkills.length === 0) {
            return 0;
        }

        // Count matching skills
        const matchingSkills = normalizedRequiredSkills.filter(requiredSkill =>
            normalizedTalentSkills.includes(requiredSkill)
        );

        // Calculate percentage
        const overlapPercentage = (matchingSkills.length / normalizedRequiredSkills.length) * 100;

        return Math.round(overlapPercentage * 100) / 100;
    }

    /**
     * Calculate budget fit score
     * @param {number} talentRate - Talent's hourly rate
     * @param {number} jobBudget - Job's maximum budget
     * @returns {number} Budget fit score (0 or 100)
     */
    calculateBudgetFit(talentRate, jobBudget) {
        return talentRate <= jobBudget ? 100 : 0;
    }

    /**
     * Calculate experience level fit
     * @param {string} talentLevel - Talent's experience level
     * @param {string} jobLevel - Job's preferred experience level
     * @returns {number} Experience fit score (0, 50, or 100)
     */
    calculateExperienceFit(talentLevel, jobLevel) {
        // Define experience hierarchy
        const levels = {
            JUNIOR: 1,
            MID: 2,
            SENIOR: 3,
        };

        const talentValue = levels[talentLevel];
        const jobValue = levels[jobLevel];
        
        // Handle invalid experience levels
        if (!talentValue || !jobValue) {
            return 0;
        }
        
        const difference = Math.abs(talentValue - jobValue);

        // Exact match: 100 points
        if (difference === 0) {
            return 100;
        }
        // One level difference: 50 points
        else if (difference === 1) {
            return 50;
        }
        // Two levels difference: 0 points
        else {
            return 0;
        }
    }

    /**
     * Safely parse JSON with fallback
     * @param {string} jsonString - JSON string to parse
     * @param {any} fallback - Fallback value if parsing fails
     * @returns {any} Parsed JSON or fallback
     */
    safeParseJSON(jsonString, fallback = []) {
        try {
            if (!jsonString) return fallback;
            const parsed = JSON.parse(jsonString);
            return Array.isArray(parsed) ? parsed : fallback;
        } catch (error) {
            console.error('JSON parse error:', error);
            return fallback;
        }
    }

    /**
     * Get match score for a specific talent-job pair
     * @param {number} talentId - Talent ID
     * @param {number} jobId - Job ID
     * @returns {Object} Detailed match breakdown
     */
    async getDetailedMatch(talentId, jobId) {
        const talent = await talentRepository.findById(talentId);
        if (!talent) {
            throw new Error('Talent not found');
        }

        const job = await jobRepository.findById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }

        const talentSkills = this.safeParseJSON(talent.skills, []);
        const jobRequiredSkills = this.safeParseJSON(job.requiredSkills, []);

        const skillScore = this.calculateSkillOverlap(talentSkills, jobRequiredSkills);
        const budgetScore = this.calculateBudgetFit(
            parseFloat(talent.hourlyRate) || 0,
            parseFloat(job.budgetMax) || 0
        );
        const experienceScore = this.calculateExperienceFit(
            talent.experienceLevel,
            job.preferredExperienceLevel
        );
        const totalScore = this.calculateMatchScore(
            { ...talent, skills: talentSkills },
            { ...job, requiredSkills: jobRequiredSkills }
        );

        return {
            talent: {
                id: talent.id,
                name: talent.name,
                skills: talentSkills,
                hourlyRate: parseFloat(talent.hourlyRate) || 0,
                experienceLevel: talent.experienceLevel,
            },
            job: {
                id: job.id,
                title: job.title,
                requiredSkills: jobRequiredSkills,
                budgetMax: parseFloat(job.budgetMax) || 0,
                preferredExperienceLevel: job.preferredExperienceLevel,
            },
            scoreBreakdown: {
                skillScore: {
                    value: skillScore,
                    weight: 60,
                    contribution: Math.round(skillScore * 0.6 * 100) / 100,
                },
                budgetScore: {
                    value: budgetScore,
                    weight: 20,
                    contribution: Math.round(budgetScore * 0.2 * 100) / 100,
                },
                experienceScore: {
                    value: experienceScore,
                    weight: 20,
                    contribution: Math.round(experienceScore * 0.2 * 100) / 100,
                },
            },
            totalScore,
        };
    }
}

export default new MatchingService();
