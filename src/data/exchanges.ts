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
      { id: 'topstep_x', name: 'TopStepX', fee: null, type: 'prop' },
      { id: 'topstep_x_no_fees', name: 'TopStepX (No Fees)', fee: 0, type: 'prop' },
      { id: 'topstep_rithmic', name: 'TopStep (Rithmic)', fee: null, type: 'prop' },
      { id: 'topstep_tradovate', name: 'TopStep (Tradovate)', fee: null, type: 'prop' },
      { id: 'topstep_t4', name: 'TopStep (T4)', fee: null, type: 'prop' },
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
    // CME FX Futures
    A6: 3.24, M6A: 0.52,
    B6: 3.24, M6B: 0.52,
    E6: 3.24, M6E: 0.52,
    J6: 3.24, S6: 3.24,
    N6: 3.24, M6: 3.24,
    D6: 3.24,
    // Interest Rate Futures
    ZT: 1.34, ZF: 1.34,
    ZN: 1.60, ZB: 1.78,
    UB: 1.94, TN: 1.64,
    GE: 1.34,
    // Energy Futures
    CL: 3.04, MCL: 1.04,
    QM: 2.44, NG: 3.20,
    MNG: 1.24, QG: 1.04,
    RB: 3.04, HO: 3.04,
    PL: 3.24,
    // Metals Futures
    GC: 3.24, MGC: 1.04,
    SI: 3.24, SIL: 2.04,
    HG: 3.24, MHG: 1.24,
    // Agricultural Futures
    ZC: 4.24, ZW: 4.24,
    ZS: 4.24, ZM: 4.24,
    ZL: 4.24, HE: 4.24,
    LE: 4.24
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
