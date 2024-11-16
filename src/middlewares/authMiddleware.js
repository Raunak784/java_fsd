import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';

// Centralized validation rules
const validationRules = {
    registerUser: [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
        check('contactNumber', 'Contact number must be valid and at least 6 characters long').not().isEmpty().isLength({ min: 6 })
    ],
    loginUser: [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').not().isEmpty()
    ]
};

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const authMiddleware = (req, res, next) => {
    let token = req.header('x-auth-token');
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }
    // If no token is provided, return an error message
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(403).json({ message: 'Token is not valid' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied, insufficient permissions' });
      }
      next();
    };
  };


  
  

  

export {validationRules, handleValidationErrors ,authMiddleware, authorizeRoles};
