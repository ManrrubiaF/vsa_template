import { Booking, User, Product, ProductDetail } from "../db";
import { Request, Response } from "express";
import { Op } from "sequelize";
import nodemailer from 'nodemailer';
import config from "../lib/config";

const companyEmail: string = config.COMPANY_EMAIL || '';
const companyPass: string = config.COMPANY_PASS || '';
const host_email: string = config.HOST_MAIL || '';

interface oneBooking {
    id: number;
    userId: number;
    details: {
        productId: number;
        stock: number,
        color: string | null,
        size: string | null,
    };
}
interface dataProduct {

    productId: number;
    stock: number,
    color: string | null,
    size: string | null,

}

const transporter = nodemailer.createTransport({
    host: `${host_email}`,
    port: 465,
    secure: true,
    auth: {
        user: companyEmail,
        pass: companyPass,
    },
})

const discountStock = async (dataProducts: dataProduct) => {
    try {

        const product: ProductDetail | null = await ProductDetail.findOne({
            where: {
                productId: dataProducts.productId,
                color: dataProducts.color
            }
        })
        if (product) {
            product.stock -= dataProducts.stock;
            await product.save();
        }


        return ('updated');
    } catch (error) {
        return error;
    }
}

const increaseProduct = async (bookingExist: oneBooking) => {
    try {
        const product: ProductDetail | null = await ProductDetail.findOne({
            where: {
                productId: bookingExist.details.productId,
                color: bookingExist.details.color
            }
        })
        if (product) {
            product.stock += bookingExist.details.stock;
            await product.save();
        }


        return ('updated');
    } catch (error) {

    }
}

const getProductNamesFromDatabase = async (productId: number) => {
    try {
        const product = await Product.findByPk(productId);
        let productname;
        if (product) {
            productname = product.name;
            return productname
        }

    } catch (error) {
        return error

    }
}

const createBooking = async (req: Request, res: Response) => {
    const dataProducts: dataProduct = req.body
    const { id } = res.locals.userData;

    try {
        let enoughStock = true;
        const user = await User.findByPk(id);

        const productExist: Product | null = await Product.findOne({
            where: {
                id: dataProducts.productId
            },
            include: ProductDetail
        });
        const detailsProduct = productExist?.details.find((detail) => detail.color === dataProducts.color);
        if (detailsProduct && detailsProduct.stock < dataProducts.stock) {
            enoughStock = false;
        }

        if (enoughStock) {
            await Booking.create({
                userId: id,
                userName: user!.name,
                details: dataProducts,
            })
            
            await discountStock(dataProducts);
            

            const emailBody = `
                <html>
                <body>
                    <p>El usuario ${user?.email}, ${user?.name}, ${user?.lastName} ha realizado la siguiente carga:</p>
                    <ul>
                        <li>${productExist?.name} Stock: ${dataProducts.stock}, Color: ${dataProducts?.color}</li>
                    </ul>
                 </body>
                </html>`;



            await transporter.sendMail({
                from: `${companyEmail}`,
                to: `${companyEmail}`,
                subject: 'Venta cargada',
                html: emailBody
            })
            res.status(201).send('Venta cargada')
        } else {
            res.status(400).send('Lo sentimos,no hay suficiente stock')
        }
    } catch (error: any) {
        res.status(500).json(error.message)
    }
}

const deleteBooking = async (req: Request, res: Response) => {
    const newData = req.params
    const { id } = res.locals.userData;
    try {
        const bookingExist = await Booking.findOne({
            where: {
                id: newData.id,
                userId: id
            }
        });
        if (!bookingExist) {
            res.status(404).send('Venta no encontrada')
        } else {
            await increaseProduct(bookingExist)
            await bookingExist?.destroy()
            res.status(200).send('Venta eliminada')
        }
    } catch (error) {
        res.status(500).send('Server error')
    }
}

const getByUser = async (req: Request, res: Response) => {
    const { id } = res.locals.userData;


    try {
        const bookingByUser = await Booking.findAll({
            where: {
                userId: id,
                status: {
                    [Op.ne]: 'deleted'
                }
            }
        })
        if (bookingByUser.length > 0) {
            return res.status(200).json(bookingByUser);
        } else {
            return res.status(400).send('No se cargaron ventas aún')
        }
    } catch (error) {
        return res.status(500).json(error)
    }

}

const getAllBookig = async (req: Request, res: Response) => {
    try {
        const allBooking = await Booking.findAll()
        if (allBooking) {
            res.status(200).json(allBooking)
        } else {
            res.status(404).send('No se han cargado ventas aún')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateStatus = async (req: Request, res: Response) => {
    const newData = req.body


    try {
        const bookingExist = await Booking.findOne({
            where: {
                id: newData.id
            }
        })
        if (bookingExist) {
            await bookingExist.update({ status: newData.status });
            return res.status(200).send('Booking updated')
        } else {
            return res.status(404).send("Booking doesn't exist")
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

export default {
    createBooking,
    deleteBooking,
    getByUser,
    getAllBookig,
    updateStatus
}