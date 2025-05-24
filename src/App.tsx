import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import FoodItems from "./pages/Food";
import FoodItem from "./pages/FoodItem";
import About from "./pages/About";
import Auth from "./pages/Auth";
import AuthProvider from "./context/authContext";
import PrivateRoute from "./components/PrivateRoute";
import ResponsiveAppBar from "./components/AppBar";
import AddFoodItem from "./pages/AddFoodItem";
import { ToastContainer } from "react-toastify";
import Meals from "./pages/Meals";
import Profile from "./pages/Profile";
import FoodCollection from "./pages/FoodCollection";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<ResponsiveAppBar />} >
            <Route path="/login" element={<Auth />} />
            <Route path="/logout" element={<Auth logout={true} />} />
            <Route element={<PrivateRoute />}>
              <Route path="/about" element={<About />} />
              <Route path="/meals" element={<Meals />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/fooditems" element={<FoodItems />} />
              <Route path="/fooditems/add" element={<AddFoodItem />} />
              <Route path="/fooditems/:fooditem_id" element={<FoodItem />} />
              <Route path="/foodcollections/:foodcollection_id" element={<FoodCollection />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
