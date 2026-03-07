import { useCallback, useState } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { calculatorApi } from "@/services/api";
import {
  calculateHealthScore,
  calculateEMISafety,
  calculateDebtPlan,
  calculateEmergencyFund,
  calculateFI,
} from "@/services/financialCalculations";
import {
  setHealthScore,
  setEMIResult,
  setDebtResult,
  setEmergencyResult,
  setFIResult,
} from "@/store/slices/financialSlice";
import type {
  HealthScoreInput,
  EMIInput,
  DebtInput,
  EmergencyInput,
  FIInput,
} from "@/types/financial";

type CalcStatus = "idle" | "loading" | "success" | "error";

export function useHealthScore() {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<CalcStatus>("idle");

  const calculate = useCallback(async (input: HealthScoreInput) => {
    setStatus("loading");
    try {
      // Try API first — falls back to local if API unavailable
      let result;
      try {
        result = await calculatorApi.healthScore(input);
      } catch {
        result = calculateHealthScore(input);
      }
      dispatch(setHealthScore({ result, input }));
      setStatus("success");
      return result;
    } catch (e) {
      setStatus("error");
      throw e;
    }
  }, [dispatch]);

  return { calculate, status };
}

export function useEMIChecker() {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<CalcStatus>("idle");

  const calculate = useCallback(async (input: EMIInput) => {
    setStatus("loading");
    try {
      let result;
      try {
        result = await calculatorApi.emiSafety(input);
      } catch {
        result = calculateEMISafety(input);
      }
      dispatch(setEMIResult({ result, input }));
      setStatus("success");
      return result;
    } catch (e) {
      setStatus("error");
      throw e;
    }
  }, [dispatch]);

  return { calculate, status };
}

export function useDebtPlanner() {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<CalcStatus>("idle");

  const calculate = useCallback(async (input: DebtInput) => {
    setStatus("loading");
    try {
      let result;
      try {
        result = await calculatorApi.debtPlan(input);
      } catch {
        result = calculateDebtPlan(input);
      }
      dispatch(setDebtResult({ result, input }));
      setStatus("success");
      return result;
    } catch (e) {
      setStatus("error");
      throw e;
    }
  }, [dispatch]);

  return { calculate, status };
}

export function useEmergencyFund() {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<CalcStatus>("idle");

  const calculate = useCallback(async (input: EmergencyInput) => {
    setStatus("loading");
    try {
      let result;
      try {
        result = await calculatorApi.emergencyFund(input);
      } catch {
        result = calculateEmergencyFund(input);
      }
      dispatch(setEmergencyResult({ result, input }));
      setStatus("success");
      return result;
    } catch (e) {
      setStatus("error");
      throw e;
    }
  }, [dispatch]);

  return { calculate, status };
}

export function useFITracker() {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<CalcStatus>("idle");

  const calculate = useCallback(async (input: FIInput) => {
    setStatus("loading");
    try {
      let result;
      try {
        result = await calculatorApi.fiTracker(input);
      } catch {
        result = calculateFI(input);
      }
      dispatch(setFIResult({ result, input }));
      setStatus("success");
      return result;
    } catch (e) {
      setStatus("error");
      throw e;
    }
  }, [dispatch]);

  return { calculate, status };
}
