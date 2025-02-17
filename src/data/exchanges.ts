
export interface Exchange {
  id: string;
  name: string;
  fee: number | null;
  type: 'direct' | 'prop';
  availableInstruments?: string[];
}

export interface ExchangeGroup {
  name: string;
  type: 'direct' | 'prop';
  exchanges: Exchange[];
}

export const exchangeGroups: ExchangeGroup[] = [
  {
    name: "Direct Brokers",
    type: "direct",
    exchanges: [
      { id: 'none', name: 'Custom Fee', fee: null, type: 'direct' },
      { id: 'amp', name: 'AMP', fee: 4.08, type: 'direct' },
      { id: 'ninjatrader', name: 'NinjaTrader', fee: 3.58, type: 'direct' },
      { id: 'tradovate', name: 'Tradovate', fee: 4.50, type: 'direct' },
      { id: 'optimus', name: 'Optimus', fee: 3.44, type: 'direct' }
    ]
  },
  {
    name: "Prop Firms",
    type: "prop",
    exchanges: [
      { 
        id: 'topstep_x', 
        name: 'TopStepX', 
        fee: null, 
        type: 'prop',
        availableInstruments: ['ES', 'MES', 'NQ', 'MNQ', 'RTY', 'M2K', 'YM', 'MYM', 'NKD', 'MBT', 'MET', 'CL', 'MCL', 'QM', 'PL', 'QG', 'RB', 'HO', 'NG', 'MNG', 'YM', 'MYM', '6A', 'M6A', '6B', '6C', '6E', 'M6E', '6J', '6S', 'E7', '6M', '6N', 'M6B', 'ZT', 'ZF', 'ZN', 'ZB', 'UB', 'TN', 'GC', 'MGC', 'SI', 'SIL', 'HG', 'MHG', 'HE', 'LE', 'ZC', 'ZW', 'ZS', 'ZM', 'ZL']
      },
      { 
        id: 'topstep_x_no_fees', 
        name: 'TopStepX (No Fees)', 
        fee: 0, 
        type: 'prop',
        availableInstruments: ['ES', 'MES', 'NQ', 'MNQ', 'RTY', 'M2K', 'YM', 'MYM', 'NKD', 'MBT', 'MET', 'CL', 'MCL', 'QM', 'PL', 'QG', 'RB', 'HO', 'NG', 'MNG', 'YM', 'MYM', '6A', 'M6A', '6B', '6C', '6E', 'M6E', '6J', '6S', 'E7', '6M', '6N', 'M6B', 'ZT', 'ZF', 'ZN', 'ZB', 'UB', 'TN', 'GC', 'MGC', 'SI', 'SIL', 'HG', 'MHG', 'HE', 'LE', 'ZC', 'ZW', 'ZS', 'ZM', 'ZL']
      },
      { 
        id: 'topstep_tradovate', 
        name: 'TopStep (Tradovate)', 
        fee: null, 
        type: 'prop',
        availableInstruments: ['ES', 'MES', 'NQ', 'MNQ', 'RTY', 'M2K', 'YM', 'MYM', '6A', 'M6A', '6B', '6C', '6E', 'M6E', '6J', '6S', 'E7', '6M', '6N', 'M6B', 'ZT', 'ZF', 'ZN', 'ZB', 'UB', 'TN', 'CL', 'MCL', 'QM', 'PL', 'QG', 'RB', 'HO', 'NG', 'MNG', 'GC', 'MGC', 'SI', 'SIL', 'HG', 'MHG', 'LE', 'HE', 'ZC', 'ZW', 'ZS', 'ZM', 'ZL']
      },
      { 
        id: 'topstep_rithmic', 
        name: 'TopStep (Rithmic)', 
        fee: null, 
        type: 'prop',
        availableInstruments: ['ES', 'MES', 'NQ', 'MNQ', 'RTY', 'M2K', 'YM', 'MYM', '6A', 'M6A', '6B', '6C', '6E', 'M6E', '6J', '6S', 'E7', '6M', '6N', 'M6B', 'ZT', 'ZF', 'ZN', 'ZB', 'UB', 'TN', 'CL', 'MCL', 'QM', 'PL', 'QG', 'RB', 'HO', 'NG', 'MNG', 'GC', 'MGC', 'SI', 'SIL', 'HG', 'MHG', 'LE', 'HE', 'ZC', 'ZW', 'ZS', 'ZM', 'ZL']
      },
      { 
        id: 'topstep_t4', 
        name: 'TopStep (T4)', 
        fee: null, 
        type: 'prop',
        availableInstruments: ['ES', 'NQ', 'RTY', 'YM', 'NKD', '6A', '6B', '6C', '6E', '6J', '6S', 'E7', '6M', '6N', 'GE', 'CL', 'QM', 'NG', 'QG', 'PL', 'RB', 'ZC', 'ZW', 'ZS', 'ZM', 'ZL', 'YM', 'ZT', 'ZF', 'ZN', 'ZB', 'UB', 'TN', 'GC', 'SI', 'HG', 'LE', 'HE']
      },
      { id: 'my_funded_futures', name: 'My Funded Futures', fee: null, type: 'prop' },
      { id: 'alpha_capital', name: 'Alpha Capital Group', fee: null, type: 'prop' },
      { id: 'trade_day', name: 'Trade Day', fee: null, type: 'prop' }
    ]
  }
];

export const exchangeFeeMap = {
  topstep_x: {
    // CME Equity Futures
    ES: 2.80, MES: 0.74,
    NQ: 2.80, MNQ: 0.74,
    RTY: 2.80, M2K: 0.74,
    YM: 2.80, MYM: 0.74,
    NKD: 4.34,
    MBT: 2.04, MET: 0.24,
    // CME NYMEX Futures
    CL: 3.04, MCL: 1.04,
    QM: 2.44, PL: 3.24,
    QG: 1.04, RB: 3.04,
    HO: 3.04, NG: 3.20,
    MNG: 1.24,
    // CME Foreign Exchange Futures
    '6A': 3.24, 'M6A': 0.52,
    '6B': 3.24, '6C': 3.24,
    '6E': 3.24, 'M6E': 0.52,
    '6J': 3.24, '6S': 3.24,
    'E7': 1.74, '6M': 3.24,
    '6N': 3.24, 'M6B': 0.52,
    // CME Interest Rate Futures
    ZT: 1.34, ZF: 1.34,
    ZN: 1.60, ZB: 1.78,
    UB: 1.94, TN: 1.64,
    // CME COMEX Futures
    GC: 3.24, MGC: 1.04,
    SI: 3.24, SIL: 2.04,
    HG: 3.24, MHG: 1.24,
    // CME Agricultural Futures
    HE: 4.24, LE: 4.24,
    // CME CBOT Commodity Futures
    ZC: 4.24, ZW: 4.24,
    ZS: 4.24, ZM: 4.24,
    ZL: 4.24
  },
  topstep_tradovate: {
    // CME Equity Futures
    ES: 4.28, MES: 1.34,
    NQ: 4.28, MNQ: 1.34,
    RTY: 4.28, M2K: 1.34,
    YM: 4.28, MYM: 1.34,
    // ... add all other Tradovate fees from the image
  },
  topstep_rithmic: {
    // CME Equity Futures
    ES: 4.36, MES: 1.42,
    NQ: 4.36, MNQ: 1.42,
    RTY: 4.36, M2K: 1.42,
    YM: 4.36, MYM: 1.42,
    // ... add all other Rithmic fees from the image
  },
  topstep_t4: {
    // CME Equity Futures
    ES: 4.80, NQ: 4.80,
    RTY: 4.80, YM: 4.80,
    NKD: 5.34,
    // CME Foreign Exchange
    '6A': 5.24, '6B': 5.24,
    '6C': 5.24, '6E': 5.24,
    '6J': 5.24, '6S': 5.24,
    'E7': 3.74, '6M': 5.24,
    '6N': 5.24,
    // Interest Rates
    GE: 4.54,
    // Energy
    CL: 5.04, QM: 4.44,
    NG: 5.24, QG: 3.04,
    PL: 5.24, RB: 5.04,
    // Agricultural
    ZC: 6.24, ZW: 6.24,
    ZS: 6.24, ZM: 6.24,
    ZL: 6.24,
    // Financial
    ZT: 3.34, ZF: 3.34,
    ZN: 1.60, ZB: 3.78,
    UB: 3.94, TN: 3.82,
    // Metals
    GC: 5.24, SI: 5.24,
    HG: 5.24,
    // Livestock
    LE: 6.24, HE: 6.24
  }
};

export const getInstrumentFee = (exchangeId: string, instrumentId: string): number | null => {
  if (exchangeId === 'topstep_x_no_fees') return 0;
  if (exchangeId.startsWith('topstep_')) {
    return exchangeFeeMap[exchangeId as keyof typeof exchangeFeeMap]?.[instrumentId as keyof typeof exchangeFeeMap['topstep_x']] ?? null;
  }
  const exchange = exchangeGroups.flatMap(g => g.exchanges).find(ex => ex.id === exchangeId);
  return exchange?.fee ?? null;
};
