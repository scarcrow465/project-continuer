
export interface Instrument {
  id: string;
  name: string;
  tickValue: number;
  tickSize: number;
  microVersion?: string;
  regularVersion?: string;
  category: string;
  marginPerContract?: number;
  dayMarginPerContract?: number;
}

export const instruments: Instrument[] = [
  // CME Equity Index Futures
  { 
    id: 'ES', 
    name: 'E-mini S&P 500', 
    tickValue: 12.50, 
    tickSize: 0.25, 
    microVersion: 'MES', 
    category: 'Indices',
    marginPerContract: 12650,
    dayMarginPerContract: 500
  },
  { 
    id: 'MES', 
    name: 'Micro E-mini S&P 500', 
    tickValue: 1.25, 
    tickSize: 0.25, 
    regularVersion: 'ES', 
    category: 'Indices',
    marginPerContract: 1265,
    dayMarginPerContract: 50
  },
  // ... Add all other instruments with margin values
];
