import { createSlice } from "@reduxjs/toolkit";
import fetchData from "./../../Utils/FetchData";

const initialState = {
  items: [],
  cartQuantity: 0,
  totalPrice: 0,
  finalPrice: 0,
  finalPriceAfterDiscount: 0,
};

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    // جواب سرور را همان‌طور که هست توی استور می‌گذارد
    setCart: (state, action) => action.payload,
    // موقع خروج از حساب
    resetCart: () => initialState,
  },
});

export const { resetCart } = cartSlice.actions;
const { setCart } = cartSlice.actions;

// درخواست به سرور؛ اگه موفق بود سبد توی استور ذخیره می‌شود.
// جواب سرور ({ success, message }) برگردانده می‌شود تا کامپوننت پیامش را نشان بدهد.
const request = (method, courseId) => async (dispatch, getState) => {
  const res = await fetchData("cart", {
    method,
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${getState().auth.token}`,
    },
    body: courseId ? JSON.stringify({ courseId }) : undefined,
  });
  if (res.success) dispatch(setCart(res.data));
  return res;
};

export const fetchCart = () => request("GET"); // بعد از لاگین
export const addItem = (courseId) => request("POST", courseId);
export const removeItem = (courseId) => request("PATCH", courseId);
export const clearCart = () => request("DELETE");

export const selectToken = (state) => state.auth.token;
export const selectIsInCart = (id) => (state) =>
  state.cart.items.some((item) => item._id === id);

export default cartSlice.reducer;