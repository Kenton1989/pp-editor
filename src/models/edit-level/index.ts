import levelSlice from "./slice";

const levelReducer = levelSlice.reducer;
const LEVEL = levelSlice.actions;

export default levelSlice;
export { levelReducer, LEVEL };
