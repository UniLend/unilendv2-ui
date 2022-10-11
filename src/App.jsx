import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import  './App.scss'
import HallOfPools from './components/hallOfPools'
import { setTheme } from './store/Action'
import MainRoutes from './routes';
import { useDispatch, useSelector } from 'react-redux';


function App() {
  // const [theme, setTheme] = useState('light');
  const dispatch = useDispatch();
 const themes = useSelector((state)=> state.theme)
  const handleTheme = () => {
    dispatch(setTheme(themes == 'dark'? 'light': 'dark'))
  }
  
  useEffect(() => {
   document.body.setAttribute('class', themes);
   
  }, [themes])

  return (
    <div>
      <MainRoutes/>
      <button onClick={handleTheme} >{themes}</button>
     {/* <HallOfPools/> */}
    </div>
  )
}

export default App;
