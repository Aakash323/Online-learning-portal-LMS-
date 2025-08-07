import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from "react-router-dom"

const Mainlayout = () => {
  return (
    <>
      <Navbar/>
      <Outlet/>
    </>
  )
}

export default Mainlayout
