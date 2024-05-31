import { BlackListToken, User } from '../db';
import bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import * as jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
import config from '../lib/config';


const jwt_secret: string = config.JWT_SECRET || '';
const companyEmail: string = config.COMPANY_EMAIL || '';
const companyPass: string = config.COMPANY_PASS || '';
const back_url: string = config.BACK_URL || '';
const frontUrl: string = config.FRONT_URL || '';
const host_mail: string = config.HOST_MAIL || '';

const transporter = nodemailer.createTransport({
    host: host_mail,
    port: 465,
    secure: true,
    auth: {
        user: companyEmail,
        pass: companyPass,
    },
})
const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const createUser = async (req: Request, res: Response): Promise<void> => {
    const { email, pass, name, lastName, access } = req.body;

    try {
        const exist: User | null = await User.findOne({
            where: {
                email: email,
            },
            raw: true
        })
        if (exist) {
            res.status(400).send('Email already registered')
            return;
        }
        const hashed = await bcrypt.hash(pass, 5)
        const newUser = await User.create({
            email,
            pass: hashed,
            name,
            lastName,
            access,
        })

        const payload = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            lastName: newUser.lastName,
            access: newUser.access
        };
        const token = jwt.sign(payload, jwt_secret, { expiresIn: "24h" })


        res.status(200).json({ payload, token })

        return;

    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
        return;
    }

}

const createAdmin = async (req: Request, res: Response) => {
    const { email, name, lastName } = req.body;

    try {
        const userExist = await User.findOne({
            where: {
                email: email
            }
        })
        if (userExist) {
            return res.status(409).send('Email ya registrado,intente otro')
        }
        const newUser = await User.create({

            email,
            name,
            lastName,

        })
        console.log(back_url)
        if (newUser) {
            const token = jwt.sign({ id: newUser.id, email: newUser.email }, jwt_secret, { expiresIn: '1h' })
            
            await transporter.sendMail({
                from: `"Empresa"  <${companyEmail}>`,
                to: newUser.email,
                subject: "CONFIRME SU CUENTA",
                html: `Siga el siguiente link para establecer su contraseña  ${back_url}/user/confirmEmail/${token}`
            })
        }
        return res.status(201).send('Usuario creado')
    } catch (error) {
        return res.status(500).send('server error')

    }
}

const recoverypass = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const userExist = await User.findOne({
            where: {
                email: email
            }
        })
        
        if (userExist) {
            const token = jwt.sign({ id: userExist.id, email: userExist.email }, jwt_secret, { expiresIn: '1h' })
            const recoveryUrl = `${back_url}/user/${token}`

            await transporter.sendMail({
                from: `"Empresa"  <${companyEmail}>`,
                to: userExist.email,
                subject: "CONFIRME SU CUENTA",
                html: `Siga el siguiente link para restablecer su contraseña  ${recoveryUrl}`
            })

            return res.status(200).send('Link de recuperación enviado, revisa tu casilla de correo')

        } else {
            return res.status(400).send('No hay usuarios con ese email')
        }
    } catch (error) {
        return res.status(400).send('server error')

    }
}

const mailValidation = async (req: Request, res: Response) => {
    const token = req.params.token;
    try {
        const decodedToken = jwt.verify(token, jwt_secret) as jwt.JwtPayload;
        let user: User | null = null
        if (decodedToken) {
            user = await User.findOne({
                where: {
                    email: decodedToken.email
                }
            })
        }
        if (user) {
            const newToken = jwt.sign({ id: user.id, email: user.email }, jwt_secret, { expiresIn: '24h' })
            const recoveryPage = `${frontUrl}/recovery`
            res.cookie('token', newToken, {
                expires: expirationDate
            }).redirect(`${recoveryPage}`)

        } else {
            res.status(400).send('Link vencido')
        }
    } catch (error) {
        res.status(500).send('server error')
    }

}

const changePass = async (req: Request, res: Response) => {
    const { pass } = req.body;
    const { id } = res.locals.userData
    console.log('id:' , id)

    try {
        const user = await User.findByPk(id)
        if (user) {
            const newPass = await bcrypt.hash(pass, 5)
            await user.update({
                pass: newPass
            })

            res.status(200).send('Contraseña cambiada');
        } else {
            res.status(400).send('Email no encontrado')
        }
    } catch (error) {
        res.status(500).json(error)
    }

}

const loginUser = async (req: Request, res: Response) => {
    const userData = req.body;
    try {
        const userExist: User | null = await User.findOne({
            where: {
                email: {
                    [Op.iLike]: userData.email
                }
            }
        })

        let access;
        if (userExist) {
            access = await bcrypt.compare(userData.pass, userExist.pass)
        }
        if (!userExist) {
            return res.status(404).send('Email no registrado');
        } else if (userExist && !access) {
            return res.status(400).send('Contraseña incorrecta');
        } else {
            const payload = {
                id: userExist?.id,
                email: userExist?.email,
                name: userExist?.name,
                lastName: userExist?.lastName,
                access: userExist?.access

            }
            const token = jwt.sign(payload, jwt_secret, { expiresIn: '24h' })
            return res.status(200).json({ payload, token })

        }
    } catch (error) {
        return res.status(500).json(error)
    }
}



const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const userExist = await User.findByPk(id)
        if (userExist) {
            await User.destroy({
                where: {
                    id: userExist.id
                },
                force:true
            })
            res.status(200).send('Cuenta eliminada con exito')
        }
    } catch (error) {
        res.status(500).json(error)

    }

}

const updateUser = async (req: Request, res: Response) => {
    const { id } = res.locals.userData;
    const data = req.body
    try {
        const userData = await User.findByPk(id)
        await userData?.update(data);
        const newData = await User.findByPk(id)
        let updatedData;
        if (newData) {
            updatedData = {
                id: newData.id,
                name: newData.name,
                lastName: newData.lastName,
                email: newData.email,
                access: newData.access
            }
        }
        res.status(200).json(updatedData)
    } catch (error) {
        res.status(500).json(error)
    }
}

const logout = async (req: Request, res: Response) => {
    const { token } = req.body
    try {
        await BlackListToken.create({ token: token })
        res.status(200).send('Good Bye')
    } catch (error) {
        res.status(500).json(error)
    }
}

const getAllUsers = async (req:Request, res:Response) => {

    const { id } = res.locals.userData
    try {
        const allArray = await User.findAll({
            where: 
            {
                id: {
                    [Op.ne]: id
                }
            }
            
        });
        return res.status(200).json(allArray)
    } catch (error) {
        return res.status(500).send('Server error')        
    }

}

export default {
    getAllUsers,
    recoverypass,
    mailValidation,
    createAdmin,
    changePass,
    deleteUser,
    loginUser,
    updateUser,
    createUser,
    logout
}