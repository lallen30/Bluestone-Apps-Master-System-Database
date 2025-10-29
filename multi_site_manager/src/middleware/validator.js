const { body, param, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('role_id')
    .isInt({ min: 1, max: 3 })
    .withMessage('Valid role ID is required (1-3)'),
  handleValidationErrors
];

const validateUserUpdate = [
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('first_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty'),
  body('last_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty'),
  body('role_id')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('Valid role ID is required (1-3)'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean'),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// App validation rules
const validateAppCreation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('App name is required'),
  body('domain')
    .trim()
    .notEmpty()
    .withMessage('Domain is required')
    .matches(/^[a-zA-Z0-9][a-zA-Z0-9-_.]+[a-zA-Z0-9]$/)
    .withMessage('Invalid domain format'),
  body('description')
    .optional()
    .trim(),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean'),
  handleValidationErrors
];

const validateAppUpdate = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('App name cannot be empty'),
  body('domain')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Domain cannot be empty')
    .matches(/^[a-zA-Z0-9][a-zA-Z0-9-_.]+[a-zA-Z0-9]$/)
    .withMessage('Invalid domain format'),
  body('description')
    .optional()
    .trim(),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean'),
  handleValidationErrors
];

// Permission validation rules
const validatePermissionAssignment = [
  body('user_id')
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),
  body('app_id')
    .isInt({ min: 1 })
    .withMessage('Valid app ID is required'),
  body('can_view')
    .optional()
    .isBoolean()
    .withMessage('can_view must be a boolean'),
  body('can_edit')
    .optional()
    .isBoolean()
    .withMessage('can_edit must be a boolean'),
  body('can_delete')
    .optional()
    .isBoolean()
    .withMessage('can_delete must be a boolean'),
  body('can_publish')
    .optional()
    .isBoolean()
    .withMessage('can_publish must be a boolean'),
  body('can_manage_users')
    .optional()
    .isBoolean()
    .withMessage('can_manage_users must be a boolean'),
  body('can_manage_settings')
    .optional()
    .isBoolean()
    .withMessage('can_manage_settings must be a boolean'),
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid ID is required'),
  handleValidationErrors
];

const validateAppId = [
  param('appId')
    .isInt({ min: 1 })
    .withMessage('Valid app ID is required'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserUpdate,
  validateLogin,
  validateAppCreation,
  validateAppUpdate,
  validatePermissionAssignment,
  validateId,
  validateAppId,
  handleValidationErrors
};
