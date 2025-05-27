import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Food from "./pages/Food";
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
import Todo from "./pages/Todo";
import FoodCollection from "./pages/FoodCollection";
import AddFoodCollection from "./pages/AddFoodCollection";
import AddMeal from "./pages/AddMeal";
import Meal from "./pages/Meal";
import AddSharedMeal from "./pages/AddSharedMeal";

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
              <Route path="/meals/:mealId" element={<Meal />} />
              <Route path="/meals/add" element={<AddMeal />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/food" element={<Food />} />
              <Route path="/fooditems/add" element={<AddFoodItem />} />
              <Route path="/fooditems/:fooditem_id" element={<FoodItem />} />
              <Route path="/foodcollections/:foodcollection_id" element={<FoodCollection />} />
              <Route path="/foodcollections/add" element={<AddFoodCollection />} />
              <Route path="/addshared" element={<AddSharedMeal />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
