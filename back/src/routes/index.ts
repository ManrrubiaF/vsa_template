import { Router } from 'express';
import bookingRouter from './bookingRoutes';
import userRouter from './userRoutes'
import dataRouter from './dataRoutes';
import productRouter from './productRoutes';

const routerr = Router()
routerr.use('/booking', bookingRouter);
routerr.use('/user', userRouter);
routerr.use('/data', dataRouter);
routerr.use('/product', productRouter);


export default routerr