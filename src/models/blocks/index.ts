import blocksSlice from "./slice";

const blocksReducer = blocksSlice.reducer;
const BLOCKS = blocksSlice.actions;

export default blocksSlice;
export { blocksReducer, BLOCKS };
