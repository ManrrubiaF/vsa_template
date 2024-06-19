import { Router } from 'express';
import bookingRouter from './bookingRoutes';
import userRouter from './userRoutes'
import dataRouter from './dataRoutes';
import productRouter from './productRoutes';
import portfolioRouter from './portfolioRoutes';

const routerr = Router()
routerr.use('/booking', bookingRouter);
routerr.use('/user', userRouter);
routerr.use('/data', dataRouter);
routerr.use('/product', productRouter);
routerr.use('/portfolio', portfolioRouter)


export default routerr