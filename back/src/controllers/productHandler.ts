import { Product, ProductDetail } from "../db";
import { Response, Request } from "express";
import { Op } from "sequelize";


const createProduct = async (req: Request, res: Response) => {
    const oneProduct = req.body;
    
    try {
        const productExist = await Product.findOne({
            where: {
                name: oneProduct.name
            }
        })
        if (!productExist) {
            const productCreated = await Product.create({
                price: oneProduct.price,
                name: oneProduct.name,
                description: oneProduct.description,
                active: oneProduct.active,
                category: oneProduct.category,
            })
            for (const oneColor of oneProduct.details) {
                await ProductDetail.create({
                    color: oneColor.color,
                    stock: oneColor.stock,
                    image: oneColor.image,
                    productId: productCreated.id,
                    size: oneColor.size,
                })
            }
            res.status(201).send('Producto añadido')
        } else {
            res.status(400).send('Producto existente, revisa el stock')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateProduct = async (req: Request, res: Response) => {
    const data = req.body;
    const { id } = req.params;

    try {
        const productExist: Product | null = await Product.findOne({
            where: {
                id: id
            },
            include: ProductDetail
        })

        if (productExist) {
            const updateData: Record<string, any> = {}
            for (const key in data) {
                if (key === 'details' && Array.isArray(data[key])) {
                    const details = data[key];
                    for (const detail of details) {
                        const existingDetail = await ProductDetail.findOne({
                            where: {
                                productId: productExist.id,
                                color: detail.color
                            }
                        });

                        if (existingDetail) {
                            await existingDetail.update(detail);
                        } else {
                            await ProductDetail.create({
                                ...detail,
                                productId: productExist.id
                            });
                        }
                    }
                } else {
                    updateData[key] = data[key];
                }

            }

            await productExist.update(updateData)
            const updatedProduct = await Product.findByPk(id, {include: ProductDetail})
            res.status(200).json(updatedProduct)
        } else {
            res.status(404).send('Hubo un error al encontrar el producto')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const productExist = await Product.findByPk(id)
        if (productExist) {
            await productExist.destroy()
            res.status(200).send('El producto se eliminará en 7 dias')//setear cronjob
        } else {
            res.status(404).send('Hubo un error al buscar el producto')
        }
    } catch (error) {
        res.status(500).send('server error')

    }
}

const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            include: ProductDetail
        })
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getActiveProducts =async (req:Request, res:Response) => {
    try {
        const activeProducts = await Product.findAll({
            where:{
                active: true
            },
            include: {
                model: ProductDetail,
                where: {
                    stock: {
                        [Op.gt]: 0 
                    }
                }
            }
        })
        res.status(200).json(activeProducts)
    } catch (error) {
        res.status(500).json(error)
    }
    
}

const getProductById =async (req:Request, res:Response) => {
    const { id } = req.params;
    try {
        const product = await Product.findOne({
            where:{
                id: id,
            },
            include: {
                model: ProductDetail,
                where: {
                    stock: {
                        [Op.gt]: 0 
                    }
                }
            }
        })
        if(product){
            res.status(200).json(product)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

export default {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    getActiveProducts

} 