import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  FinancialState,
  HealthScoreResult,
  HealthScoreInput,
  EMIResult,
  EMIInput,
  DebtResult,
  DebtInput,
  EmergencyResult,
  EmergencyInput,
  FIResult,
  FIInput,
} from "@/types/financial";

const initialState: FinancialState = {
  healthScore: null,
  healthInput: null,
  emiResult: null,
  emiInput: null,
  debtResult: null,
  debtInput: null,
  emergencyResult: null,
  emergencyInput: null,
  fiResult: null,
  fiInput: null,
};

const financialSlice = createSlice({
  name: "financial",
  initialState,
  reducers: {
    setHealthScore(state, action: PayloadAction<{ result: HealthScoreResult; input: HealthScoreInput }>) {
      state.healthScore = action.payload.result;
      state.healthInput = action.payload.input;
    },
    setEMIResult(state, action: PayloadAction<{ result: EMIResult; input: EMIInput }>) {
      state.emiResult = action.payload.result;
      state.emiInput = action.payload.input;
    },
    setDebtResult(state, action: PayloadAction<{ result: DebtResult; input: DebtInput }>) {
      state.debtResult = action.payload.result;
      state.debtInput = action.payload.input;
    },
    setEmergencyResult(state, action: PayloadAction<{ result: EmergencyResult; input: EmergencyInput }>) {
      state.emergencyResult = action.payload.result;
      state.emergencyInput = action.payload.input;
    },
    setFIResult(state, action: PayloadAction<{ result: FIResult; input: FIInput }>) {
      state.fiResult = action.payload.result;
      state.fiInput = action.payload.input;
    },
    resetAll() {
      return initialState;
    },
  },
});

export const { setHealthScore, setEMIResult, setDebtResult, setEmergencyResult, setFIResult, resetAll } =
  financialSlice.actions;
export default financialSlice.reducer;
