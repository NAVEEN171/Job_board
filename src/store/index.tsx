import { createSlice, PayloadAction, configureStore } from "@reduxjs/toolkit";
type Locationtype = {
  country: string;
  emoji: string;
  index: number;
};
type initialFiltersStatetype = {
  jobtitle: string[];
  locationtype: string[];
  Selectlocationtypes: string[];
  sliderValue: number[];
  singleSlidervalue: number[];
  Experiencevalue: number[];
  selectedEmptype: string[];
  EmpTypedropdown: string[];
  SelectedIndustries: string[];
  Selectjobcategory: string[];
  dropdowncategory: string[];
  SelectedLocations: Locationtype[];
  Locationdropdown: Locationtype[];
};

const initialFiltersState: initialFiltersStatetype = {
  jobtitle: [], //job title filter
  locationtype: [], //location type filter
  Selectlocationtypes: [],
  sliderValue: [40, 900], // salary filter
  singleSlidervalue: [7], // date posted
  Experiencevalue: [0, 4], //experience values
  selectedEmptype: [], //employment type
  EmpTypedropdown: [],
  SelectedIndustries: [], //Industry filter
  Selectjobcategory: [], //Domain filter
  dropdowncategory: [],
  SelectedLocations: [], //Location filter
  Locationdropdown: [],
};

//creation of slice
const FilterSlice = createSlice({
  name: "Filters",
  initialState: initialFiltersState,
  reducers: {
    setjobtitle(state, action: PayloadAction<string[]>) {
      state.jobtitle = action.payload;
    },
    setlocationtype(state, action: PayloadAction<string[]>) {
      state.locationtype = action.payload;
    },
    setSelectlocationtypes(state, action: PayloadAction<string[]>) {
      state.Selectlocationtypes = action.payload;
    },
    setSliderValue(state, action: PayloadAction<number[]>) {
      state.sliderValue = action.payload;
    },
    setsingleSlidervalue(state, action: PayloadAction<number[]>) {
      state.singleSlidervalue = action.payload;
    },
    setExperiencevalue(state, action: PayloadAction<number[]>) {
      state.Experiencevalue = action.payload;
    },
    setselectedEmptype(state, action: PayloadAction<string[]>) {
      state.selectedEmptype = action.payload;
    },
    setEmpTypedropdown(state, action: PayloadAction<string[]>) {
      state.EmpTypedropdown = action.payload;
    },
    setSelectedIndustries(state, action: PayloadAction<string[]>) {
      console.log("Industries are running");
      state.SelectedIndustries = action.payload;
    },

    setSelectjobcategory(state, action: PayloadAction<string[]>) {
      state.Selectjobcategory = action.payload;
    },

    setdropdowncategory(state, action: PayloadAction<string[]>) {
      state.dropdowncategory = action.payload;
    },
    setSelectedLocations(state, action: PayloadAction<Locationtype[]>) {
      state.SelectedLocations = action.payload;
    },
    setLocationdropdown(state, action: PayloadAction<Locationtype[]>) {
      state.Locationdropdown = action.payload;
    },
  },
});

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
const store = configureStore({ reducer: { Filter: FilterSlice.reducer } });

//passing the reducer functions
export const FilterActions = FilterSlice.actions;

export default store;
