import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Fetch lost documents
export const fetchLostDocuments = createAsyncThunk("reports/fetchLostDocuments", async () => {
  const res = await axios.get(`${API_URL}/lost/`);
  return res.data;
});

// Fetch found documents
export const fetchFoundDocuments = createAsyncThunk("reports/fetchFoundDocuments", async () => {
  const res = await axios.get(`${API_URL}/found/`);
  return res.data;
});

// Fetch document types
export const fetchDocumentTypes = createAsyncThunk("reports/fetchDocumentTypes", async () => {
  const res = await axios.get(`${API_URL}/document-types/`);
  return res.data;
});

// Create lost document
export const createLostDocument = createAsyncThunk("reports/createLostDocument", async (data) => {
  const res = await axios.post(`${API_URL}/lost/`, data);
  return res.data;
});

// Create found document
export const createFoundDocument = createAsyncThunk("reports/createFoundDocument", async (data) => {
  const res = await axios.post(`${API_URL}/found/`, data);
  return res.data;
});

const reportsSlice = createSlice({
  name: "reports",
  initialState: { 
    lostDocuments: [],
    foundDocuments: [],
    documentTypes: [],
    status: "idle", 
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Lost documents
      .addCase(fetchLostDocuments.fulfilled, (state, action) => {
        state.lostDocuments = action.payload;
        state.status = "succeeded";
      })
      // Found documents
      .addCase(fetchFoundDocuments.fulfilled, (state, action) => {
        state.foundDocuments = action.payload;
        state.status = "succeeded";
      })
      // Document types
      .addCase(fetchDocumentTypes.fulfilled, (state, action) => {
        state.documentTypes = action.payload;
        state.status = "succeeded";
      })
      // Handle loading and errors for all
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

export default reportsSlice.reducer;
