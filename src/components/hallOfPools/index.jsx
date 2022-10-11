import React from 'react'
import './styles/index.scss'
export default function HallOfPoolsComponent(props) {

React.useEffect(()=> {
  console.log("Props", props);
},[])
  
  return (
    <div><h1>{props.theme}</h1></div>
  )
}