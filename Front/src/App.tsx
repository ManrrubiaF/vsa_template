import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Footer from "./Components/Footer/Footer";
import NavBar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Admin from "./Components/Admin/Admin";
import Products from "./Components/Products/Products";
import ContactForm from "./Components/Contact/Contact";
import ProductDetail from "./Components/ProductDetail/ProductDetail";
import User from "./Components/User/User";
import FormRegister from "./Components/FormRegister/FormRegister";
import Recovery from "./Components/User/Recovery";
import { resetState } from "./Redux/Slice/FilterSlice";
import { useAppDispatch } from "./Redux/Hooks";
import DashboardProductDetail from "./Components/DashboardAdmin/ProductDetail/ProductDetailsDashboard";
import Styles from "./App.module.css";
import HySLaboral from "./Components/HySegurLaboral/HySLaboral";
import HySAmbiental from "./Components/HySeguridadAmbiental/HySAmbiental";
import HySIndustrial from "./Components/HySegurIndustrial/HySIndustrial";
import ControlPlagas from "./Components/ControlDePlagas/ControlDePlagas";
import SeguridadIncendios from "./Components/SeguridadIncendios/SeguridadIncendios";
import Portfolio from "./Components/Portfolio/Portfolio";
import PortfolioDetail from "./Components/DashboardAdmin/PorfolioDetail/PortfolioDetail";
import PortfolioAdmin from "./Components/DashboardAdmin/PortfolioAdmin/PortfolioAdmin";
import PortfolioCreate from "./Components/DashboardAdmin/PortfolioCreate/PortfolioCreate";

function App() {
  const dispatch = useAppDispatch();
  
  const location = useLocation();
  useEffect(() => {
    document.title = "VSA";
  }, []);
  useEffect(() => {
    const productRoutePattern = /^\/products(\/\d+)?/;
    if (
      location.pathname !== "/product" &&
      !productRoutePattern.test(location.pathname)
    ) {
      dispatch(resetState());
    }
  }, [location]);
  return (
    <div>
      <div className={Styles.divMayor}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} Component={Home} />
          <Route path="/someplace" element={<Admin />} Component={Admin} />
          <Route path="/products" element={<Products />} Component={Products} />
          <Route
            path="/products/:id"
            element={<ProductDetail />}
            Component={ProductDetail}
          />
          <Route path="/User" element={<User />} Component={User} />
          <Route
            path="/register"
            element={<FormRegister />}
            Component={FormRegister}
          />
          <Route
            path="/contact"
            element={<ContactForm />}
            Component={ContactForm}
          />
          <Route
            path="/HySLaboral"
            element={<HySLaboral />}
            Component={HySLaboral}
          />
          <Route 
            path="/HySAmbiental"
            element={<HySAmbiental />}
            Component={HySAmbiental}
          />
          <Route 
            path="/HySIndustrial"
            element={<HySIndustrial />}
            Component={HySIndustrial}
          />
          <Route 
            path="ControlPlagas"
            element={<ControlPlagas />}
            Component={ControlPlagas}
          />
          <Route 
            path="SeguridadIncendios"
            element={<SeguridadIncendios />}
            Component={SeguridadIncendios}
          />
          <Route 
            path="Portfolio"
            element={<Portfolio />}
            Component={Portfolio}
          />
          <Route
            path="someplace/portfolio/detail/:id"
            element={<PortfolioDetail />}
            Component={PortfolioDetail}
          />
          <Route 
            path="someplace/portfolio"
            element={<PortfolioAdmin />}
            Component={PortfolioAdmin}
          />     
          <Route 
            path="someplace/portfolio/create"
            element={<PortfolioCreate />}
            Component={PortfolioCreate}
          />     
          <Route
            path="/someplace/detail/:id"
            element={<DashboardProductDetail />}
            Component={DashboardProductDetail}
          />
          <Route path="/recovery" element={<Recovery />} Component={Recovery} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
