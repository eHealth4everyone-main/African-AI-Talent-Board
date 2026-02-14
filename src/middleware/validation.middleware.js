import { body, param, query, validationResult } from 'express-validator';

/**
 * Validation error handler
 */
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Validation failed',
                errors: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg,
                })),
            },
        });
    }
    next();
};

/**
 * Talent validation rules
 */
export const validateTalent = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
        .escape(),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
    body('skills')
        .isArray({ min: 1 }).withMessage('At least one skill is required')
        .custom((skills) => {
            if (!skills.every(skill => typeof skill === 'string' && skill.trim().length > 0)) {
                throw new Error('All skills must be non-empty strings');
            }
            return true;
        }),
    body('hourlyRate')
        .isFloat({ min: 0.01 }).withMessage('Valid hourly rate is required'),
    body('experienceLevel')
        .isIn(['JUNIOR', 'MID', 'SENIOR']).withMessage('Experience level must be JUNIOR, MID, or SENIOR'),
    body('availability')
        .optional()
        .isBoolean().withMessage('Availability must be a boolean'),
    handleValidationErrors,
];

/**
 * Job validation rules
 */
export const validateJob = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters')
        .escape(),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 20, max: 5000 }).withMessage('Description must be 20-5000 characters'),
    body('requiredSkills')
        .isArray({ min: 1 }).withMessage('At least one required skill is necessary')
        .custom((skills) => {
            if (!skills.every(skill => typeof skill === 'string' && skill.trim().length > 0)) {
                throw new Error('All skills must be non-empty strings');
            }
            return true;
        }),
    body('budgetMax')
        .isFloat({ min: 0.01 }).withMessage('Valid maximum budget is required'),
    body('preferredExperienceLevel')
        .isIn(['JUNIOR', 'MID', 'SENIOR']).withMessage('Preferred experience level must be JUNIOR, MID, or SENIOR'),
    handleValidationErrors,
];

/**
 * ID parameter validation
 */
export const validateId = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID must be a positive integer'),
    handleValidationErrors,
];

export const validateJobId = [
    param('jobId')
        .isInt({ min: 1 }).withMessage('Job ID must be a positive integer'),
    handleValidationErrors,
];

export const validateTalentId = [
    param('talentId')
        .isInt({ min: 1 }).withMessage('Talent ID must be a positive integer'),
    handleValidationErrors,
];

/**
 * Query parameter validation
 */
export const validateTalentQuery = [
    query('availability')
        .optional()
        .isBoolean().withMessage('Availability must be true or false'),
    query('experienceLevel')
        .optional()
        .isIn(['JUNIOR', 'MID', 'SENIOR']).withMessage('Experience level must be JUNIOR, MID, or SENIOR'),
    query('maxRate')
        .optional()
        .isFloat({ min: 0 }).withMessage('Max rate must be a positive number'),
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    handleValidationErrors,
];

export const validateJobQuery = [
    query('experienceLevel')
        .optional()
        .isIn(['JUNIOR', 'MID', 'SENIOR']).withMessage('Experience level must be JUNIOR, MID, or SENIOR'),
    query('minBudget')
        .optional()
        .isFloat({ min: 0 }).withMessage('Min budget must be a positive number'),
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    handleValidationErrors,
];
