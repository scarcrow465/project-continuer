
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
  { 
    id: 'NQ', 
    name: 'E-mini NASDAQ-100', 
    tickValue: 20.00, 
    tickSize: 0.25, 
    microVersion: 'MNQ', 
    category: 'Indices',
    marginPerContract: 17600,
    dayMarginPerContract: 700
  },
  { 
    id: 'MNQ', 
    name: 'Micro E-mini NASDAQ-100', 
    tickValue: 2.00, 
    tickSize: 0.25, 
    regularVersion: 'NQ', 
    category: 'Indices',
    marginPerContract: 1760,
    dayMarginPerContract: 70
  },
  { 
    id: 'RTY', 
    name: 'E-mini Russell 2000', 
    tickValue: 10.00, 
    tickSize: 0.10, 
    microVersion: 'M2K', 
    category: 'Indices',
    marginPerContract: 8800,
    dayMarginPerContract: 350
  },
  { 
    id: 'M2K', 
    name: 'Micro E-mini Russell 2000', 
    tickValue: 1.00, 
    tickSize: 0.10, 
    regularVersion: 'RTY', 
    category: 'Indices',
    marginPerContract: 880,
    dayMarginPerContract: 35
  },
  { 
    id: 'YM', 
    name: 'E-mini Dow', 
    tickValue: 5.00, 
    tickSize: 1.00, 
    microVersion: 'MYM', 
    category: 'Indices',
    marginPerContract: 11000,
    dayMarginPerContract: 440
  },
  { 
    id: 'MYM', 
    name: 'Micro E-mini Dow', 
    tickValue: 0.50, 
    tickSize: 1.00, 
    regularVersion: 'YM', 
    category: 'Indices',
    marginPerContract: 1100,
    dayMarginPerContract: 44
  },
  { 
    id: 'NKD', 
    name: 'Nikkei 225', 
    tickValue: 25.00, 
    tickSize: 5.00, 
    category: 'Indices',
    marginPerContract: 6600,
    dayMarginPerContract: 264
  },

  // CME NYMEX Energy Futures
  { 
    id: 'CL', 
    name: 'Crude Oil', 
    tickValue: 10.00, 
    tickSize: 0.01, 
    microVersion: 'MCL', 
    category: 'Energy',
    marginPerContract: 4400,
    dayMarginPerContract: 176
  },
  { 
    id: 'MCL', 
    name: 'Micro Crude Oil', 
    tickValue: 1.00, 
    tickSize: 0.01, 
    regularVersion: 'CL', 
    category: 'Energy',
    marginPerContract: 440,
    dayMarginPerContract: 17.6
  },
  { 
    id: 'NG', 
    name: 'Natural Gas', 
    tickValue: 10.00, 
    tickSize: 0.001, 
    microVersion: 'MNG', 
    category: 'Energy',
    marginPerContract: 2750,
    dayMarginPerContract: 110
  },
  { 
    id: 'MNG', 
    name: 'Micro Natural Gas', 
    tickValue: 1.00, 
    tickSize: 0.001, 
    regularVersion: 'NG', 
    category: 'Energy',
    marginPerContract: 275,
    dayMarginPerContract: 11
  },
  { 
    id: 'QM', 
    name: 'E-mini Crude Oil', 
    tickValue: 12.50, 
    tickSize: 0.025, 
    category: 'Energy',
    marginPerContract: 2200,
    dayMarginPerContract: 88
  },
  { 
    id: 'RB', 
    name: 'RBOB Gasoline', 
    tickValue: 42.00, 
    tickSize: 0.0001, 
    category: 'Energy',
    marginPerContract: 4950,
    dayMarginPerContract: 198
  },
  { 
    id: 'HO', 
    name: 'Heating Oil', 
    tickValue: 42.00, 
    tickSize: 0.0001, 
    category: 'Energy',
    marginPerContract: 4950,
    dayMarginPerContract: 198
  },

  // CME Metals
  { 
    id: 'GC', 
    name: 'Gold', 
    tickValue: 10.00, 
    tickSize: 0.10, 
    microVersion: 'MGC', 
    category: 'Metals',
    marginPerContract: 7150,
    dayMarginPerContract: 286
  },
  { 
    id: 'MGC', 
    name: 'Micro Gold', 
    tickValue: 1.00, 
    tickSize: 0.10, 
    regularVersion: 'GC', 
    category: 'Metals',
    marginPerContract: 715,
    dayMarginPerContract: 28.6
  },
  { 
    id: 'SI', 
    name: 'Silver', 
    tickValue: 25.00, 
    tickSize: 0.005, 
    microVersion: 'SIL', 
    category: 'Metals',
    marginPerContract: 9350,
    dayMarginPerContract: 374
  },
  { 
    id: 'SIL', 
    name: 'Micro Silver', 
    tickValue: 2.50, 
    tickSize: 0.005, 
    regularVersion: 'SI', 
    category: 'Metals',
    marginPerContract: 935,
    dayMarginPerContract: 37.4
  },
  { 
    id: 'HG', 
    name: 'Copper', 
    tickValue: 12.50, 
    tickSize: 0.0005, 
    microVersion: 'MHG', 
    category: 'Metals',
    marginPerContract: 6600,
    dayMarginPerContract: 264
  },
  { 
    id: 'MHG', 
    name: 'Micro Copper', 
    tickValue: 1.25, 
    tickSize: 0.0005, 
    regularVersion: 'HG', 
    category: 'Metals',
    marginPerContract: 660,
    dayMarginPerContract: 26.4
  },
  { 
    id: 'PL', 
    name: 'Platinum', 
    tickValue: 25.00, 
    tickSize: 0.10, 
    category: 'Metals',
    marginPerContract: 3300,
    dayMarginPerContract: 132
  },

  // CME FX Futures
  { 
    id: '6E', 
    name: 'Euro FX', 
    tickValue: 12.50, 
    tickSize: 0.0001, 
    microVersion: 'M6E', 
    category: 'Currencies',
    marginPerContract: 2750,
    dayMarginPerContract: 110
  },
  { 
    id: 'M6E', 
    name: 'Micro Euro FX', 
    tickValue: 1.25, 
    tickSize: 0.0001, 
    regularVersion: '6E', 
    category: 'Currencies',
    marginPerContract: 275,
    dayMarginPerContract: 11
  },
  { 
    id: '6B', 
    name: 'British Pound', 
    tickValue: 6.25, 
    tickSize: 0.0001, 
    microVersion: 'M6B', 
    category: 'Currencies',
    marginPerContract: 2200,
    dayMarginPerContract: 88
  },
  { 
    id: 'M6B', 
    name: 'Micro British Pound', 
    tickValue: 0.625, 
    tickSize: 0.0001, 
    regularVersion: '6B', 
    category: 'Currencies',
    marginPerContract: 220,
    dayMarginPerContract: 8.8
  },
  { 
    id: '6J', 
    name: 'Japanese Yen', 
    tickValue: 12.50, 
    tickSize: 0.000001, 
    category: 'Currencies',
    marginPerContract: 2750,
    dayMarginPerContract: 110
  },
  { 
    id: '6A', 
    name: 'Australian Dollar', 
    tickValue: 10.00, 
    tickSize: 0.0001, 
    microVersion: 'M6A', 
    category: 'Currencies',
    marginPerContract: 1650,
    dayMarginPerContract: 66
  },
  { 
    id: 'M6A', 
    name: 'Micro Australian Dollar', 
    tickValue: 1.00, 
    tickSize: 0.0001, 
    regularVersion: '6A', 
    category: 'Currencies',
    marginPerContract: 165,
    dayMarginPerContract: 6.6
  },
  { 
    id: '6C', 
    name: 'Canadian Dollar', 
    tickValue: 10.00, 
    tickSize: 0.0001, 
    category: 'Currencies',
    marginPerContract: 1650,
    dayMarginPerContract: 66
  },
  { 
    id: '6S', 
    name: 'Swiss Franc', 
    tickValue: 12.50, 
    tickSize: 0.0001, 
    category: 'Currencies',
    marginPerContract: 3300,
    dayMarginPerContract: 132
  },
  { 
    id: '6N', 
    name: 'New Zealand Dollar', 
    tickValue: 10.00, 
    tickSize: 0.0001, 
    category: 'Currencies',
    marginPerContract: 1650,
    dayMarginPerContract: 66
  },
  { 
    id: '6M', 
    name: 'Mexican Peso', 
    tickValue: 12.50, 
    tickSize: 0.00001, 
    category: 'Currencies',
    marginPerContract: 2200,
    dayMarginPerContract: 88
  },
  { 
    id: 'E7', 
    name: 'E-mini Euro FX', 
    tickValue: 6.25, 
    tickSize: 0.0001, 
    category: 'Currencies',
    marginPerContract: 1375,
    dayMarginPerContract: 55
  },

  // Interest Rate Products
  { 
    id: 'ZB', 
    name: '30-Year U.S. Treasury Bond', 
    tickValue: 31.25, 
    tickSize: 0.03125, 
    category: 'Interest Rates',
    marginPerContract: 4400,
    dayMarginPerContract: 176
  },
  { 
    id: 'ZN', 
    name: '10-Year U.S. Treasury Note', 
    tickValue: 15.625, 
    tickSize: 0.015625, 
    category: 'Interest Rates',
    marginPerContract: 2750,
    dayMarginPerContract: 110
  },
  { 
    id: 'ZF', 
    name: '5-Year U.S. Treasury Note', 
    tickValue: 7.8125, 
    tickSize: 0.007812, 
    category: 'Interest Rates',
    marginPerContract: 1650,
    dayMarginPerContract: 66
  },
  { 
    id: 'ZT', 
    name: '2-Year U.S. Treasury Note', 
    tickValue: 15.625, 
    tickSize: 0.003906, 
    category: 'Interest Rates',
    marginPerContract: 1100,
    dayMarginPerContract: 44
  },
  { 
    id: 'UB', 
    name: 'Ultra U.S. Treasury Bond', 
    tickValue: 31.25, 
    tickSize: 0.03125, 
    category: 'Interest Rates',
    marginPerContract: 5500,
    dayMarginPerContract: 220
  },
  { 
    id: 'TN', 
    name: 'Ultra 10-Year U.S. Treasury Note', 
    tickValue: 15.625, 
    tickSize: 0.015625, 
    category: 'Interest Rates',
    marginPerContract: 3300,
    dayMarginPerContract: 132
  },
  { 
    id: 'GE', 
    name: 'Eurodollar', 
    tickValue: 12.50, 
    tickSize: 0.0025, 
    category: 'Interest Rates',
    marginPerContract: 1100,
    dayMarginPerContract: 44
  },

  // Agricultural Products
  { 
    id: 'ZC', 
    name: 'Corn', 
    tickValue: 12.50, 
    tickSize: 0.25, 
    category: 'Agriculture',
    marginPerContract: 2475,
    dayMarginPerContract: 99
  },
  { 
    id: 'ZW', 
    name: 'Wheat', 
    tickValue: 12.50, 
    tickSize: 0.25, 
    category: 'Agriculture',
    marginPerContract: 2750,
    dayMarginPerContract: 110
  },
  { 
    id: 'ZS', 
    name: 'Soybeans', 
    tickValue: 12.50, 
    tickSize: 0.25, 
    category: 'Agriculture',
    marginPerContract: 3300,
    dayMarginPerContract: 132
  },
  { 
    id: 'ZM', 
    name: 'Soybean Meal', 
    tickValue: 10.00, 
    tickSize: 0.10, 
    category: 'Agriculture',
    marginPerContract: 2750,
    dayMarginPerContract: 110
  },
  { 
    id: 'ZL', 
    name: 'Soybean Oil', 
    tickValue: 6.00, 
    tickSize: 0.0001, 
    category: 'Agriculture',
    marginPerContract: 2750,
    dayMarginPerContract: 110
  },

  // Livestock
  { 
    id: 'LE', 
    name: 'Live Cattle', 
    tickValue: 10.00, 
    tickSize: 0.025, 
    category: 'Livestock',
    marginPerContract: 2200,
    dayMarginPerContract: 88
  },
  { 
    id: 'HE', 
    name: 'Lean Hogs', 
    tickValue: 10.00, 
    tickSize: 0.025, 
    category: 'Livestock',
    marginPerContract: 2200,
    dayMarginPerContract: 88
  }
];
