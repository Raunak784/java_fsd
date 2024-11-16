import express from 'express';
import {userlist, loginUser, registerUser, userProfile, userUpdate, userDelete} from '../controllers/userController.js'
import {authMiddleware, authorizeRoles, handleValidationErrors, validationRules} from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/register',validationRules.registerUser,handleValidationErrors, registerUser);
router.post('/login',validationRules.loginUser,handleValidationErrors, loginUser);
router.get('/profile', authMiddleware,authMiddleware, userProfile);
router.get('/userlist',authMiddleware,authorizeRoles('admin'), userlist);
router.put('/profile_update', authMiddleware, userUpdate);
router.delete('/userDelete', authMiddleware, userDelete);

export default router;