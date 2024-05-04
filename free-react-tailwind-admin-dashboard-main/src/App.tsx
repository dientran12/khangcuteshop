import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import Product from './pages/Product';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import Category from './pages/Catagory';
import Version from './pages/Version';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import User from './pages/User';
import Order from './pages/Order';


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Admin shop Khang cute" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/all-products"
          element={
            <>
              <PageTitle title="All Products" />
              <Product />
            </>
          }
        />
        <Route
          path="/category-product"
          element={
            <>
              <PageTitle title="Category" />
              <Category />
            </>
          }
        />
        <Route
          path="/product-versions"
          element={
            <>
              <PageTitle title="Version" />
              <Version />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar " />
              <Calendar />
            </>
          }
        />
        <Route
          path="/user"
          element={
            <>
              <PageTitle title="Users " />
              <User />
            </>
          }
        />
        <Route
          path="/order"
          element={
            <>
              <PageTitle title="Orders " />
              <Order />
            </>
          }
        />


        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings" />
              <Settings />
            </>
          }
        />
      </Routes>
      <ToastContainer theme="dark" />
    </>
  );
}

export default App;
