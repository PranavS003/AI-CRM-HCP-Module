import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    doctor_name: "",
    hospital: "",
    meeting_type: "",
    product: "",
    topics_discussed: "",
    sentiment: "",
    materials_shared: "",
    outcomes: "",
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
      state.formData = {
        ...initialState.formData,
        ...action.payload,
      };
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

      if (action.payload) {
        state.formData = {
          ...initialState.formData,
          ...action.payload,
        };
      }
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