import { where } from "sequelize";
import { Portfolio } from "../models/Portfolio";
import { Response, Request } from 'express'

const create_new_pic = async (req: Request, res: Response) => {
    const data = req.body

    try {
        await Portfolio.create(data)
        res.status(201).send('Datos cargados con exito!')
    } catch (error) {
        res.status(500).json(error)
    }
}

const update_pic = async (req: Request, res: Response) => {
    const data = req.body;
    const { id } = req.params;

    try {
        const pic_exist: Portfolio | null = await Portfolio.findOne({
            where:{
                id: id
            }
        })
        if(pic_exist){
            await pic_exist.update(data)
        }else{
            res.status(404).send('Item no encontrado')
        }
        res.status(201).send('Portfolio actualizado')
    } catch (error) {
        res.status(500).send(error)        
    }
}

const delete_pic  = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await Portfolio.destroy({
            where: 
            { 
                id:id
            }
        })
    res.status(200).send('Datos eliminados correctamente')
    } catch (error) {
        res.status(500).send(error)
    }
}

const get_portfolio = async (req: Request, res: Response) => {
    try {
        const portfolio = await Portfolio.findAll()
        if(!portfolio){
            res.status(404).send('Portfolio vacio')
        }else{
            res.status(200).json(portfolio)
        }
    } catch (error) {
        res.status(500).json(error)
        
    }
}

export default{
    create_new_pic,
    update_pic,
    delete_pic,
    get_portfolio
}