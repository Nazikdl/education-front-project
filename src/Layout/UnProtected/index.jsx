import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export default function UnProtected() {
  const {token}=useSelector(state=>state.auth)
  if(token){
    return <Navigate to={'/'}/>
  }
  return (
    <>
     <Outlet/> 
    </>
  )
}
