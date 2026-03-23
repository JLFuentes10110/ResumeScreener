import { useState, useCallback } from "react";
import { analyzeResume } from "../lib/api";

export function useAnalysis() {
  const [state, setState] = useState({
    loading: false,
    result: null,
    error: null,
  });

  const analyze = useCallback(async (resumeFile, jobDescription) => {
    setState({ loading: true, result: null, error: null });
    try {
      const data = await analyzeResume(resumeFile, jobDescription);
      setState({ loading: false, result: data, error: null });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Something went wrong. Please try again.";
      setState({ loading: false, result: null, error: message });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, result: null, error: null });
  }, []);

  return { ...state, analyze, reset };
}
