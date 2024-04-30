import axios from "axios";
import Styles from './ResumeDashboard.module.css'
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../Redux/Hooks";
import toast, { Toaster } from "react-hot-toast";
import * as XLSX from 'xlsx';

type Booking = {
    id: number,
    userId: number,
    userName: string,
    createdAt: string;
    details: {
        productId: number;
        color: string;
        stock: number;
        
    }
}

type StockByProd = {
    productId: number | null;
    name: string;
    quantitySold: number | null;
    totalPrice: number
}



export default function ResumeDashBoard() {
    const products = useAppSelector((state) => state.products)
    const token: string | null = sessionStorage.getItem('token');
    const BACK_URL = process.env.REACT_APP_BACK_URL
    const [allBooking, setAllBooking] = useState<Booking[]>();
    const [stockByProduct, setStockByProduct] = useState<StockByProd[]>()
    const [totalSum, setTotal ] = useState<number>()


    useEffect(() => {
        getAllBookings();
    }, [])
    useEffect(() => {
        const {totalsArray, totalPricesSum} = getTotals()
        setStockByProduct(totalsArray)
        setTotal(totalPricesSum)

    }, [allBooking])

    const getAllBookings = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/booking/allbooking`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            setAllBooking(response.data)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const getTotals = () => {
        const totalsMap = new Map();

        if (allBooking && allBooking?.length > 0) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; 

            allBooking?.forEach((booking) => {
                const dataCreated = booking.createdAt;

                
                    const productId = booking.details.productId.toString();
                    const stock = booking.details.stock;
                    

                    const date = new Date(dataCreated);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;

                    if (year === currentYear && month === currentMonth) {
                        if (totalsMap.has(productId)) {
                            const existingTotal = totalsMap.get(productId);

                            const product = products.find((p) => p.id === parseInt(productId, 10));

                            if (product) {
                                existingTotal.totalPrice += stock * parseFloat(product.price);
                            }
                        } else {
                            const product = products.find((p) => p.id === parseInt(productId, 10));

                            if (product) {
                                const totalPrice = stock * parseFloat(product.price);
                                totalsMap.set(productId, {
                                    productId: product.id,
                                    name: product.name,
                                    quantitySold: stock,
                                    totalPrice,
                                });
                            }
                        }
                    }
                
            });
        }

        const totalsArray = Array.from(totalsMap.values());

        const totalPricesSum = totalsArray.reduce((acc, item) => acc + item.totalPrice, 0);

        return { totalsArray, totalPricesSum };
    };

    const downloadAsExcel = () => {
        if (stockByProduct && stockByProduct.length > 0) {
            const ws = XLSX.utils.json_to_sheet(stockByProduct);
            const wb = XLSX.utils.book_new();

            const total = stockByProduct.reduce((sum, item) => sum + item.totalPrice, 0);

            const totalRow = {
                productId: null,
                name: 'Total',
                quantitySold: null,
                totalPrice: total,
            };
            stockByProduct.push(totalRow);

            const updatedWs = XLSX.utils.json_to_sheet(stockByProduct);

            XLSX.utils.book_append_sheet(wb, updatedWs, 'SalesData');
            XLSX.writeFile(wb, 'sales_data.xlsx');
        }
    };



    return (
        <div className={Styles.divMayor}>
            <Toaster />
            <button onClick={downloadAsExcel} className={Styles.buttonExcel}>Descargar Excel</button>
            <div className={Styles.titlesContainer}>
                <label>Producto</label>
                <label>Total vendido</label>
                <label>Precio total</label>
            </div>
            {stockByProduct && (
                stockByProduct?.map((oneShop, index) => (
                    <div key={index} className={Styles.OneDetail}>
                        <label>{oneShop.name}</label>
                        <label>{oneShop.quantitySold}</label>
                        <label>{oneShop.totalPrice}</label>
                    </div>

                ))
            )}
            <div className={Styles.TotalContainer}>
                <label className={Styles.totalLabel}>Total</label>
                <label className={Styles.totalSum}>{totalSum}</label>
            </div>
            
        </div>
    )

}
