import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import  './App.scss'
import HallOfPools from './components/hallOfPools'


function App() {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
   document.body.setAttribute('class', theme);
  }, [theme])

  return (
    <div >
      
      <button onClick={()=> setTheme(theme == 'dark'? 'light': 'dark')} >{theme}</button>
     <HallOfPools/>
    </div>
  )
}

export default App;
