import { createSlice, PayloadAction, configureStore } from "@reduxjs/toolkit";
import { Filterslicereducer } from "./Substores/Filterstore";

import { OptionsSliceReducer } from "./Substores/Optionstore";

//to get states from store

// type RootState = ReturnType<typeof store.getState>;

//   const jobval = useSelector((state: RootState) => state.Filter.jobtitle);
//   const SelectedIndustries = useSelector(
//     (state: RootState) => state.Filter.SelectedIndustries
//   );

//to run functions from store
//we use dispatch
//const dispatch=useDispatch();
//dispatch(FilterActions.setExperiencevalue)

//configuring the store so that it states can be accessed
const store = configureStore({
  reducer: { Filter: Filterslicereducer, Options: OptionsSliceReducer },
});

//passing the reducer functions

export default store;
