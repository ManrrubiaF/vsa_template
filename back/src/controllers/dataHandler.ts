import { Data } from "../db";
import { Response, Request } from "express";
import nodemailer from 'nodemailer';
import config from "../lib/config";

const host_mail: string = config.HOST_MAIL || '';
const companyEmail: string = config.COMPANY_EMAIL || '';
const companyPass: string = config.COMPANY_PASS || '';


const transporter = nodemailer.createTransport({
    host: host_mail,
    port: 465,
    secure: true,
    auth: {
        user: companyEmail,
        pass: companyPass,
    },
})

const createData =async (req:Request, res:Response) => {
    const oneData = req.body
    
    try {
        await Data.create(oneData)
        res.status(201).send('Datos empresariales cargados');
    } catch (error) {
        res.status(500).json(error)
        
    }
}

const updateData = async (req:Request, res:Response) => {
    const { id } = req.params;
    try {
        const dataExist = await Data.findOne({where:{id:id}})
        console.log(dataExist)
        if(dataExist){
            await dataExist.update(req.body)
            res.status(200).send('Datos actualizados')
        }else{
            res.status(404).send('Ha habido un error, por favor intenta de nuevo')
        }
    } catch (error) {
        res.status(500).json(error)
        
    }
}

const deleteData = async (req:Request,res:Response) => {
    const { id } = req.params;
    try {
        const dataExist = await Data.findByPk(id)
        if(dataExist){
            await dataExist.destroy()
            res.status(200).send('Los datos de la empresa han sido borrados')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const getAllData =async (req:Request, res:Response) => {
    try {
        const data = await Data.findOne()
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error)
    }    
}

const sendMail =async (req:Request, res:Response) => {
    const data = req.body;
    try {

        await transporter.sendMail({
            from: data.email,
            to: companyEmail,
            subject: `Contact from ${data.name}, ${data.email}`,
            html: `${data.text}`
        })

        return res.status(200).send('Mail sent')

    } catch (error) {
        return res.status(500).json(error)
        
    }    
}

export default {
    getAllData,
    createData,
    updateData,
    deleteData,
    sendMail
}