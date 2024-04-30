import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../lib/config';
import { BlackListToken } from '../db';


const jwt_secret: string = config.JWT_SECRET || '';

const accessValidation = async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers['authorization'];
    const authorization: string = authorizationHeader || '';
 
    try {
        const token = authorization.split(" ")[1].replace(/"/g, '');
        const bannedToken = await BlackListToken.findOne({
            where:{
                token: token,
        }})
        const decodedToken: any = jwt.verify(token, jwt_secret);
        if (decodedToken && !isTokenExpired(decodedToken) && !bannedToken) {
            const userData = decodedToken;
            res.locals.userData = userData;
            next()
        } else {
            res.status(401).send('Acceso restringido');
        }
    } catch (error) {
        res.status(500).send(error)

    }
}

const adminValidation =async (req:Request, res: Response,next:NextFunction) => {
    const authorizationHeader = req.headers['authorization'];
    const authorization: string = authorizationHeader || '';
    
    
    try {
        const token = authorization.split(" ")[1].replace(/"/g, '');
        const bannedToken = await BlackListToken.findOne({
            where:{
                token: token,
        }})
        const decodedToken:any = jwt.verify(token,jwt_secret);
        if(decodedToken && !isTokenExpired(decodedToken) && !bannedToken && decodedToken.access === 'Admin'){
            const userData = decodedToken;
            res.locals.userData = userData;
            next()
        }else{
            res.status(401).send('Acceso no autorizado')
        }        
    } catch (error) {
        res.status(500).json(error)
    }
}

const isTokenExpired = (decodedToken: any) => {
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
};

export default {
    accessValidation,
    adminValidation,
}
