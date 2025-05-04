import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  book_title: string;
  book_price: number;
  sub_price: number;
  quantity: number;
  book_cover_photo: string;
  author_name: string;
}

interface CartState {
  items: CartItem[];
}

interface updateCartItem {
  book_id: number;
  book_price: number;
  sub_price: number;
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.items.push({ ...action.payload });
      }
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    updateItemPrice: (state, action: PayloadAction<updateCartItem>) => {
      const item = state.items.find((i) => i.id === action.payload.book_id);
      if (item) {
        item.book_price = action.payload.book_price;
        item.sub_price = action.payload.sub_price;
      }
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  updateItemPrice,
} = cartSlice.actions;
export default cartSlice.reducer;
