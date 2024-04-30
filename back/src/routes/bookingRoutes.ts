import { Router } from "express";
import bookingHandler from "../controllers/bookingHandler";
import accessMiddleware from "../middleware/accessMiddleware";

const bookingRouter = Router();

bookingRouter.post('/create', accessMiddleware.accessValidation, bookingHandler.createBooking);
bookingRouter.delete('/delete/:id', accessMiddleware.accessValidation, bookingHandler.deleteBooking);
bookingRouter.get('/mybooking', accessMiddleware.accessValidation, bookingHandler.getByUser);
bookingRouter.get('/allbooking', accessMiddleware.adminValidation, bookingHandler.getAllBookig);
bookingRouter.put('/update', accessMiddleware.accessValidation, bookingHandler.updateStatus);

export default bookingRouter;