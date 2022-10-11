import { useEffect } from 'react'
import  './App.scss'
import { setTheme } from './store/Action'
import MainRoutes from './routes';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar';


function App() {
  const dispatch = useDispatch();
  const themes = useSelector((state)=> state.theme)

  const handleTheme = () => {
    dispatch(setTheme(themes == 'dark'? 'light': 'dark'))
  }
  
  useEffect(() => {
   document.body.setAttribute('class', themes);
  }, [themes])

  return (
    <div className='app_container'>
      <Navbar/>
      <div className='app'>
      <MainRoutes/>
      </div>
    </div>
  )
}

export default App;
