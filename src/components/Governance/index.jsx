import React from 'react'
import "./styles/index.scss";
export default function Governance() {
  return (
    <div className='governance'>
        <div className='create'>
         <h2>Proposals</h2>
         <button>Create proposal</button>
        </div>

        <div className='proposals_list'>
            {
                new Array(10).fill(0).map(()=> {
                    return(
                        <a className=''>
                            <span>1.11</span>
                            <span>proposal title</span>
                            <span>execute</span>
                        </a>
                    )
                })
            }
        </div>
    </div>
  )
}
