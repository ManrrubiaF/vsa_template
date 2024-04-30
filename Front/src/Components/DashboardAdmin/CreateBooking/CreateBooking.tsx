import { useAppSelector, useAppDispatch } from "../../../Redux/Hooks";
import { useState, useEffect, ChangeEvent } from "react";
import { setProducts } from "../../../Redux/Slice/productSlice";
import {
  setCategory,
  setOrder,
  resetState,
} from "../../../Redux/Slice/FilterSlice";
import { setCart, resetCart } from "../../../Redux/Slice/CartSlice";
import Styles from "./CreateBooking.module.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  active: boolean;
  category: string;
  details: Detail[];
}
interface Detail {
  color: string | null;
  stock: number;
  size: string[];
  image: string[];
}

export default function CreateBooking() {
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const token = sessionStorage.getItem("token");
  const dispatch = useAppDispatch();
  const carrito = useAppSelector((state) => state.cart.Cart);
  const productData = useAppSelector((state) => state.products);
  const [allProduct, setAllProduct] = useState<Product[]>([]);
  const filter = useAppSelector((state) => state.filter);
  const categories = [
    ...new Set(allProduct.map((product) => product.category)),
  ];
  const [productSelected, setProductSelected] = useState<Product>();
  const [detailSelected, setDetailSelected] = useState<Detail>();
  const [buttonState, setButtonState] = useState(true);


  useEffect(() => {
    if (carrito.productId !== 0 && carrito.stock > 0) {
      setButtonState(false);
    } else {
      setButtonState(true);
    }
  }, [carrito.stock, carrito.productId]);

  const getProducts = async () => {
    try {
      const response = await axios.get(`${BACK_URL}/product/`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      dispatch(setProducts(response.data));
      setAllProduct(response.data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getProducts();
    dispatch(resetCart());
  }, []);
  useEffect(() => {
    handleFilters();
  }, [filter.category, filter.order]);

  const handleFilters = () => {
    let products: Product[] = productData.slice();

    if (filter.category !== "") {
      products = allProduct.filter(
        (oneProduct) => oneProduct.category === filter.category
      );
    }

    if (filter.order === "Ascending") {
      products = sortByAscendingLetter(products);
    } else if (filter.order === "Descending") {
      products = sortByDescendingLetter(products);
    }
    dispatch(setProducts(products));
  };

  const sortByAscendingLetter = (products: Product[]) => {
    return products.slice().sort((a, b) => a.name.localeCompare(b.name));
  };

  const sortByDescendingLetter = (products: Product[]) => {
    return products.slice().sort((a, b) => b.name.localeCompare(a.name));
  };

  const handleClear = () => {
    dispatch(resetState());
    if (allProduct?.length > 0) {
      dispatch(setProducts(allProduct));
    }
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    dispatch(setCategory(value));
  };
  const handleOrderChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    dispatch(setOrder(value));
  };

  const handleProductChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const product = allProduct.filter(
      (oneProduct) => oneProduct.id === parseInt(value)
    );
    setProductSelected(product[0]);
    setDetailSelected(product[0].details[0]);
    dispatch(resetCart());
    if (product[0].details[0].color) {
      dispatch(
        setCart({
          productId: product[0].id,
          color: product[0].details[0].color,
        })
      );
    }
  };

  const handleColorSelected = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const detail = productSelected?.details.find(
      (detail) => detail.color === value
    );
    setDetailSelected(detail);
    if (detail?.color) {
      dispatch(setCart({ color: detail.color }));
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.post(`${BACK_URL}/booking/create`, carrito, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      dispatch(resetCart());
      toast.success(response.data);
    } catch (error: any) {
      console.log(error.response);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const newStock = parseInt(value);
    const maxStock = detailSelected?.stock || 0;
    const clampedStock = Math.min(newStock, maxStock) || 0;

    dispatch(setCart({ stock: clampedStock }));
  };

  return (
    <div className={Styles.divMayor}>
      <Toaster />
      <h1> Carga de ventas</h1>
      <div className={Styles.filterDiv}>
        <select name="order" onChange={handleOrderChange} value={filter.order}>
          <option value="" disabled>
            Ordenar alfabeticamente
          </option>
          <option value="Ascending">Ascendente (A - Z) </option>
          <option value="Descending">Descendente (Z - A)</option>
        </select>
        <select
          name="Category"
          onChange={handleCategoryChange}
          value={filter.category}
        >
          <option value="" disabled>
            {" "}
            Filtrar por categoria{" "}
          </option>
          {categories &&
            categories.map((oneCategory, index) => (
              <option key={index} value={oneCategory}>
                {oneCategory}
              </option>
            ))}
        </select>
        <button onClick={handleClear}> Borrar filtros</button>
      </div>
      <div className={Styles.productsShop}>
        <div className={Styles.productsList}>
          <select
            className={Styles.selectProduct}
            multiple
            onChange={handleProductChange}
          >
            {productData.map((product, index) => (
              <option key={index} value={product.id}>
                {" "}
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div className={Styles.shopDiv}>
          {productSelected ? (
            <div className={Styles.productSelect}>
              <h3>{productSelected?.name}</h3>
              <select
                name="color"
                onChange={handleColorSelected}
                value={detailSelected?.color || ""}
              >
                {productSelected.details.map((oneColor, index) => (
                  <option
                    key={index}
                    value={oneColor.color ? oneColor.color : "No hay colores"}
                  >
                    {oneColor.color ? oneColor.color : "No hay colores"}
                  </option>
                ))}
              </select>
              {detailSelected?.size && detailSelected.size.length > 0 ? (
                <select>
                  {detailSelected?.size.map((size, index) => (
                    <option key={index} value={size[index]}>
                      {size[index]}
                    </option>
                  ))}
                </select>
              ) : (
                <select>
                  <option> No hay tamaños disponibles</option>
                </select>
              )}
              <label>Stock máximo: {detailSelected?.stock}</label>
              <input
                type="text"
                name="stock"
                min="1"
                max={detailSelected?.stock || ""}
                value={carrito.stock || 0}
                onChange={handleChange}
              />
              <button onClick={handleConfirm} disabled={buttonState}>
                Cargar
              </button>
            </div>
          ) : (
            <h3>Seleccione un producto</h3>
          )}
        </div>
      </div>
    </div>
  );
}
