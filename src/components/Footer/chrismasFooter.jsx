import React from 'react';
import ice1 from "../../assets/footerice1.svg";
import ice2 from "../../assets/footerice2.svg";
import snowtree from "../../assets/snowtree.svg";
import './styles/chrismas.scss'

export default function ChrismasFooter() {
  return (
    <div className='chrismas_footer'>
          <div className='snowtree'>
          <div className='white_trees'>
            <img src={snowtree} alt="" />
          </div>
          <div>

          </div>
        </div>
        <div className='footer_ice'>
        <img src={ice2} className="ice2" alt="" />
        <img src={ice1} className="ice1" alt="" />
        </div> 
    
       
    </div>
  )
}
