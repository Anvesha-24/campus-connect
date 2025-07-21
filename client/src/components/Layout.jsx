import React from 'react'
import Navbar from '../pages/Navbar'
import { Outlet } from 'react-router-dom'

function Layout ()  {

  return (
    <>
    <Navbar/>
    <div className='p-4'>
        <Outlet/>
    </div>
    </>
  )
}

export default Layout
