import axios from "axios"
import Styles from './Booking.module.css'
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../Redux/Hooks";
import toast, { Toaster } from "react-hot-toast";
import { faX, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setProducts } from "../../Redux/Slice/productSlice";

interface Bookings {
    id: number;
    userId: number;
    details: {
        productId: number,
        color: string,
        stock: number,
    }[],
    status: string;
}

export default function Booking() {
    const token: string | null = sessionStorage.getItem('token');
    const [bookingData, setBookingData] = useState<Bookings[]>()
    const BACK_URL = process.env.REACT_APP_BACK_URL;
    const productData = useAppSelector((state) => state.products)
    const [dataUpdated, setDataUpdated] = useState(false)
    const dispatch = useAppDispatch()
    const [newData, setNewData] = useState({
        id: 0,
        status: ''
    })

    useEffect(()=>{
        updateBookingData();
    },[newData])

    useEffect(() => {
        if (productData.length < 1) {
            getProducts()
        }
        getBookingData();
    }, [])
    useEffect(() => {
        getBookingData()
    }, [dataUpdated])

    const getBookingData = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/booking/mybooking`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            setBookingData(response.data);

        } catch (error) {
            console.error(error)
        }
    }


    const updateBookingData = async () => {
        console.log(newData)
        try {
            const response = await axios.put(`${BACK_URL}/booking/update`, newData, {
                headers: {
                    authorization: `Bearer ${token}`
                },

            });
            toast.success(response.data)
            setDataUpdated(!dataUpdated)            
        } catch (error: any) {
            console.error(error.message)
        }
    }

    const handleCancel = (booking: Bookings) => {
        const shouldCancel = window.confirm("¿Estás seguro que quieres eliminar esta reserva/compra?");
        if (shouldCancel) {
            setNewData({ id: booking.id, status: 'cancel' });
        }

    }

    const handleDelete = (booking: Bookings) => {
        const shouldCancel = window.confirm("Do you really want delete this product?");
        if (shouldCancel) {
            setNewData({ id: booking.id, status: 'deleted' })
        }
    }

    const getProducts = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/product/active`)
            dispatch(setProducts(response.data));
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={Styles.divMayor}>
            <Toaster />
            <div className={Styles.divTitles}>
                <label> Productos </label>
                <label> Colores </label>
                <label> Stock </label>
                <label> Estado </label>
                <label> Cancelar / Eliminar </label>
            </div>
            {bookingData ? (
                bookingData?.map((booking) => (
                    <div key={booking.id} className={Styles.oneBooking}>
                        {booking.details.map((detail, index) => {
                            const product = productData.find((product) => product.id === detail.productId);
                            let productPhoto;
                            if (product) {
                                const productDetail = product.details.find((colorDetail) => colorDetail.color === detail.color)
                                productPhoto = productDetail?.image[0]
                            }
    
                            return (
                                    <div key={index} className={Styles.detailoneBooking}>{productPhoto && (
                                        <img src={productPhoto} alt={`Product ${detail.productId}`} />
                                    )}
                                        <p>{detail.color}</p>
                                        <p>{detail.stock}</p>
                                        <p>{booking.status}</p>
                                    </div>                          
                            )
                        }
                        )}
                        {booking.status !== 'cancel' && (
                            <FontAwesomeIcon icon={faX} style={{ color: "#e74b08" }} onClick={() => handleCancel(booking)} className={Styles.iconX} />
                        )}
                        {booking.status === 'cancel' && (
                            <FontAwesomeIcon icon={faTrash} style={{ color: "#496204" }} onClick={() => handleDelete(booking)} className={Styles.iconTrash} />
                        )}
                    </div>
                ))
            ):(
                <div className={Styles.notBookings}>
                    <p>Aun no tienes reservas</p>
                </div>
            )}
        </div>
    )
}