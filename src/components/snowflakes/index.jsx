import React from 'react';
import { useEffect } from 'react';

import './styles/index.scss'

export default function SnowFlakes() {

    useEffect(() => {
        
        const createSnowFlake = () => {
            const snowflake = document.createElement("span");
            snowflake.classList.add("material-symbols-outlined");
            // snowflake.textContent = "❄️";
            snowflake.textContent = "ac_unit";
            snowflake.classList.add(`snowflake`);
        
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
        
        const getRandomNumber = (min, max) => {
            return Math.random() * (max - min) + min;
        };
        
        setInterval(createSnowFlake, 100); // Create snowflake every 50ms (lower interval more snowflakes)

        
    }, [])
  return (
  <div className='snowflake_container'>

  </div>
  )
}
