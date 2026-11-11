import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './Router'
import { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from './Store/Slices/CartSlice';

export default function App() {
  const token = useSelector((state) => state.auth.token);
const dispatch = useDispatch();
useEffect(() => {
  if (token) dispatch(fetchCart());
}, [token]);
  return (
    <>
      <RouterProvider router={router}/>
      <Toaster/>
    </>
  )
}
