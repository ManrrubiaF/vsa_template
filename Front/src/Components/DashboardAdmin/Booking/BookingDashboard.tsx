import axios from "axios";
import Styles from "./BookingDashboard.module.css";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../Redux/Hooks";
import { setProducts } from "../../../Redux/Slice/productSlice";

type Bookings = {
  id: number;
  userId: number;
  userName: string;
  details: {
    productId: number;
    color: string;
    stock: number;
    size: string;
  };
}

export default function Booking() {
  const token: string | null = sessionStorage.getItem("token");
  const [bookingData, setBookingData] = useState<Bookings[]>();
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const productData = useAppSelector((state) => state.products);
  const accessStatus = useAppSelector((state)=> state.user.User.access)
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (productData.length < 1) {
      getProducts();
    }
    if(accessStatus === "Admin"){
        getBookingData()
    }
    if(accessStatus === "normal"){
        getBookingByUser()
    }
  }, []);

  const getBookingByUser = async () => {
    try {
        const response = await axios.get(`${BACK_URL}/booking/mybooking`,{
            headers: {
                authorization: `Bearer ${token}`,
              },
        })
        setBookingData(response.data);
    } catch (error) {
        console.error(error)        
    }
  }

  const getBookingData = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/booking/allbooking`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setBookingData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/product/active`);
      dispatch(setProducts(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={Styles.divMayor}>
      <div className={Styles.divTitles}>
        <label> Producto </label>
        <label> Color </label>
        <label> Stock </label>
        <label> Talle </label>
        <label> Usuario </label>
      </div>
      {bookingData ? (
        <div className={Styles.oneBooking}>
            {bookingData.map((oneBooking, index) => {
                const detail = oneBooking.details
                const product = productData.find((oneProduct) => oneProduct.id === detail.productId)
                return(
                    <div className={Styles.detailoneBooking} key={index}>
                        <p> {product?.name}</p>
                        <p>{oneBooking.details.color || "no hay colores"}</p>
                        <p>{oneBooking.details.stock}</p>
                        <p>{oneBooking.details.size || "no hay talle"}</p>
                        <p>{oneBooking.userName}</p>
                    </div>
                )
            })}            
        </div>
      ):(
        <div className={Styles.notBookings}>
            <p>Aun no tienes reservas/compras</p>
        </div>
      )}      
    </div>
  );
}
