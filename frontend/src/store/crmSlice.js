import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    doctor_name: "",
    hospital: "",
    meeting_type: "",
    product: "",
    sentiment: "",
    materials_shared: "",
    follow_up: "",
  },
  interactions: [],
  selectedInteraction: null,
};

const crmSlice = createSlice({
  name: "crm",
  initialState,
  reducers: {
    setFormData(state, action) {
      state.formData = action.payload;
    },

    updateFormField(state, action) {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },

    setInteractions(state, action) {
      state.interactions = action.payload;
    },

    setSelectedInteraction(state, action) {
      state.selectedInteraction = action.payload;
    },

    clearForm(state) {
      state.formData = initialState.formData;
      state.selectedInteraction = null;
    },
  },
});

export const {
  setFormData,
  updateFormField,
  setInteractions,
  setSelectedInteraction,
  clearForm,
} = crmSlice.actions;

export default crmSlice.reducer;