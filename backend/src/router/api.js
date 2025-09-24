import express from 'express';
import userController from '../controller/user-controller.js';

const apiRouter = express.Router();

apiRouter.post('/register', userController.register)
apiRouter.post('/login', userController.login)

export { apiRouter };