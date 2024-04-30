import axios from "axios";
import { Product,Data, ProductDetail, Booking, User } from "../db";

async function firstload() {
    const response = await axios.get('http://localhost:5000/products');
    const products = response.data;
    const dataResponse = await axios.get('http://localhost:5000/data');
    const data = dataResponse.data;
    /*const userResponse = await axios.get('http://localhost:5000/users');
    const usersData = userResponse.data
    const bookingResponse = await axios.get('http://localhost:5000/booking');
    const allbookings = bookingResponse.data;*/

    try {
        for (const product of products) {

            const {
                price,
                name,
                description,
                active,
                category,
                details
            } = product
            const productCreated = await Product.create({
                price,
                name,
                description,
                active,
                category
            })
            for (const oneDetail of details) {
                await ProductDetail.create({
                    color: oneDetail.color,
                    stock: oneDetail.stock,
                    image: oneDetail.image,
                    productId: productCreated.id
                })
            }
        }
        for(const oneData of data){
            await Data.create(oneData)
        }
        /*for(const oneUser of usersData){
            await User.create({
                email: oneUser.email,
                pass: oneUser.something,
                name: oneUser.name,
                lastName: oneUser.lastName,
                phone: oneUser.phone,
            })
        }
        for(const oneBooking of allbookings){
            await Booking.create(oneBooking);
        }*/

        console.log( "Data embedded successfully")
    } catch (error) {
        console.error('failed to load api', error)

    }

}

export default firstload;