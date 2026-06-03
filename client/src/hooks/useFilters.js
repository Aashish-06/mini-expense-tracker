import { useState, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const PERIODS = {
  ALL: 'all',
  THIS_MONTH: 'this-month',
  LAST_MONTH: 'last-month',
  CUSTOM: 'custom',
};

const defaultFilters = {
  category: '',
  period: PERIODS.ALL,
  startDate: '',
  endDate: '',
};

/**
 * Custom hook that manages filter state and translates UI selections
 * into query params consumed by useExpenses.
 */
export function useFilters() {
  const [filters, setFilters] = useState(defaultFilters);

  /** Build query params to pass to the API */
  const apiFilters = (() => {
    const params = {};
    if (filters.category) params.category = filters.category;

    if (filters.period === PERIODS.THIS_MONTH) {
      params.period = 'this-month';
    } else if (filters.period === PERIODS.LAST_MONTH) {
      params.period = 'last-month';
    } else if (filters.period === PERIODS.CUSTOM) {
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
    }

    return params;
  })();

  const setCategory = useCallback((category) => {
    setFilters(f => ({ ...f, category }));
  }, []);

  const setPeriod = useCallback((period) => {
    setFilters(f => ({ ...f, period, startDate: '', endDate: '' }));
  }, []);

  const setCustomRange = useCallback((startDate, endDate) => {
    setFilters(f => ({ ...f, period: PERIODS.CUSTOM, startDate, endDate }));
  }, []);

  const reset = useCallback(() => setFilters(defaultFilters), []);

  const hasActiveFilters =
    filters.category !== '' ||
    filters.period !== PERIODS.ALL ||
    filters.startDate !== '' ||
    filters.endDate !== '';

  return {
    filters,
    apiFilters,
    setCategory,
    setPeriod,
    setCustomRange,
    reset,
    hasActiveFilters,
    PERIODS,
  };
}
