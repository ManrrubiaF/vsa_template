import { Router } from 'express';
import portfolioHandler from '../controllers/portfolioHandler';
import accessMiddleware from '../middleware/accessMiddleware';

const portfolioRouter = Router();

portfolioRouter.post('/create', accessMiddleware.adminValidation, portfolioHandler.create_new_pic);
portfolioRouter.get('/', portfolioHandler.get_portfolio);
portfolioRouter.put('/update/:id', accessMiddleware.adminValidation, portfolioHandler.update_pic);
portfolioRouter.delete('/:id', accessMiddleware.adminValidation, portfolioHandler.delete_pic);

export default portfolioRouter;