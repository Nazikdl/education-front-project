import { createSlice } from "@reduxjs/toolkit";
const initialState={
    items:[],
    totalPrice:0,
    totalPriceAfterDiscount:0
}
const cartSlice=createSlice({
    initialState,
    name:'cartSlice',
    reducers:{
        addItem:(state,action)=>{

        },
        removeItem:(state,action)=>{},
        clearCart:(state)=>{}
    }
})
export const {addItem,removeItem,clearCart}=cartSlice.actions
export default cartSlice.reducer