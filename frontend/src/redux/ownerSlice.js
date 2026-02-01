import { createSlice } from "@reduxjs/toolkit";

const ownerSlice=createSlice({
    name:"owner",
    initialState:{
        myShopData:null
    },
    reducers:{
        setMyShopData:(state,action)=>{
        state.myShopData=action.payload
        },
        updateItemStock: (state, action) => {
    const { itemId, isAvailable } = action.payload;
    if (state.myShopData && state.myShopData.items) {
        state.myShopData.items = state.myShopData.items.map(item => 
            item._id === itemId ? { ...item, isAvailable } : item
        );
    }
}
    }
})

export const {setMyShopData, updateItemStock} = ownerSlice.actions
export default ownerSlice.reducer