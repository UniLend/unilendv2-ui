import { useEffect } from "react";
import 'antd/dist/antd.css';
import "./App.scss";
import { setTheme } from "./store/Action";
import MainRoutes from "./routes";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const handleTheme = () => {
    dispatch(setTheme(state.theme == "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    // document.body.setAttribute("class", state.theme);
  }, [state.theme]);

  return (
    <div className="app_container">
      <Navbar />
      <div className="app">
        <MainRoutes {...state} />
      </div>
      <Footer/>
    </div>
  );
}

export default App;
