import React from 'react';
import { useEffect } from 'react';

import './styles/index.scss'

export default function SnowFlakes() {

    const getRandomNumber = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    const createSnowFlake = () => {
        const snowflake = document.createElement("span");
        snowflake.classList.add("material-symbols-outlined");
        const snowArray = [ "fiber_manual_record","ac_unit"]
        snowflake.textContent = snowArray[Math.floor(getRandomNumber(0, 2))];
        // snowflake.textContent = "ac_unit";
        snowflake.classList.add(`snowflake`);
       
        // document.body.appendChild(snowflake)
        document.getElementsByClassName('snowflake_container')[0].appendChild(snowflake);
    
        const winWidth = window.innerWidth;
    
        let randomLeft = getRandomNumber(0, winWidth);
        let randomOpacity = getRandomNumber(0, 1);
        let randomSize = getRandomNumber(0.6, 2);
    
        snowflake.style.left = randomLeft + "px";
        snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
        snowflake.style.opacity = randomOpacity;
        snowflake.style.fontSize = randomSize + "rem";
    
        setTimeout(() => {
            // remove snowflake after 5s
            snowflake.remove();
        }, 5000);
    };

    useEffect(() => {

       setInterval(createSnowFlake, 300); // Create snowflake every 50ms (lower interval more snowflakes)
        
    }, [])
  return (
  <div className='snowflake_container'>

  </div>
  )
}
