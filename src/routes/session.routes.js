import { Router } from 'express';
import { passportCall } from '../utils/sessionUtils.js';
import SessionController from '../controllers/session.controller.js'

const router = Router();

router.post('/login', SessionController.login);

router.post('/register', SessionController.register)

router.post('/sendMail', SessionController.passwordRecoveryRequest);

router.post('/newUserPassword', SessionController.validateNewPassword);

router.get('/logout', passportCall('current'), SessionController.handleLogout);

export default router;