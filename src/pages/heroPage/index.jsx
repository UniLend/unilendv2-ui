import React from 'react'
import HeroComponent from '../../components/Hero'

export default function HeroPage(props) {
  return (
    <div> <HeroComponent {...props}/> </div>
  )
}
