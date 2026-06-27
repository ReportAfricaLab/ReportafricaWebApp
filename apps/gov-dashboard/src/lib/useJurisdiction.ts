'use client';
import { useState, useEffect } from 'react';

export function useJurisdiction() {
  const [country, setCountry] = useState('NG');
  const [lockedState, setLockedState] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [dateRange, setDateRange] = useState('30');

  const loadFromWindow = () => {
    const gov = (window as any).__govUser;
    const j = (window as any).__govJurisdiction;
    const dr = (window as any).__govDateRange;
    if (j?.country) setCountry(j.country);
    if (j?.state) setSelectedState(j.state);
    if (gov?.jurisdiction?.state && !j?.state) setLockedState(gov.jurisdiction.state);
    if (gov?.role === 'super_admin' || gov?.role === 'admin') setIsAdmin(true);
    if (dr) setDateRange(dr);
    if (gov) setLoaded(true);
  };

  useEffect(() => {
    loadFromWindow();
    const interval = setInterval(loadFromWindow, 1000);
    if (loaded) clearInterval(interval);

    const handleChange = () => loadFromWindow();
    window.addEventListener('jurisdictionChange', handleChange);
    window.addEventListener('dateRangeChange', handleChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('jurisdictionChange', handleChange);
      window.removeEventListener('dateRangeChange', handleChange);
    };
  }, [loaded]);

  const state = lockedState || selectedState;
  const isStateLocked = !!lockedState;

  // Calculate dateFrom based on dateRange
  const dateFrom = dateRange === 'all' ? '' : new Date(Date.now() - Number(dateRange) * 86400000).toISOString();

  return { country, state, isStateLocked, selectedState, setSelectedState, isAdmin, loaded, dateRange, dateFrom };
}
