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
        availableInstruments: ['ES', 'MES', 'NQ', 'MNQ', 'RTY', 'M2K', 'YM', 'MYM', 'NKD', 'MBT', 'MET']
      },
      { 
        id: 'topstep_x_no_fees', 
        name: 'TopStepX (No Fees)', 
        fee: 0, 
        type: 'prop',
        availableInstruments: ['ES', 'MES', 'NQ', 'MNQ', 'RTY', 'M2K', 'YM', 'MYM', 'NKD', 'MBT', 'MET']
      },
      { 
        id: 'topstep_tradovate', 
        name: 'TopStep (Tradovate)', 
        fee: null, 
        type: 'prop',
        availableInstruments: ['ES', 'MES', 'NQ', 'MNQ', 'RTY', 'M2K', 'YM', 'MYM']
      },
      { 
        id: 'topstep_rithmic', 
        name: 'TopStep (Rithmic)', 
        fee: null, 
        type: 'prop',
        availableInstruments: ['ES', 'MES', 'NQ', 'MNQ', 'RTY', 'M2K', 'YM', 'MYM']
      },
      { 
        id: 'topstep_t4', 
        name: 'TopStep (T4)', 
        fee: null, 
        type: 'prop',
        availableInstruments: ['ES', 'NQ', 'RTY', 'YM'] // Only regular contracts available
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
    MBT: 2.04, MET: 0.24
  },
  topstep_tradovate: {
    ES: 4.28, MES: 1.34,
    NQ: 4.28, MNQ: 1.34,
    RTY: 4.28, M2K: 1.34,
    YM: 4.28, MYM: 1.34
  },
  topstep_rithmic: {
    ES: 4.36, MES: 1.42,
    NQ: 4.36, MNQ: 1.42,
    RTY: 4.36, M2K: 1.42,
    YM: 4.36, MYM: 1.42
  },
  topstep_t4: {
    ES: 4.80,
    NQ: 4.80,
    RTY: 4.80,
    YM: 4.80
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
