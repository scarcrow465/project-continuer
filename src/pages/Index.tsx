import React, { useState } from 'react';
import { Calculator, Plus, X, AlertCircle } from 'lucide-react';

// CME Futures data with tick values
const instruments = [
  // CME Equity Futures
  { id: 'ES', name: 'E-mini S&P 500', tickValue: 12.50, tickSize: 0.25, microVersion: 'MES' },
  { id: 'MES', name: 'Micro E-mini S&P 500', tickValue: 1.25, tickSize: 0.25, regularVersion: 'ES' },
  { id: 'NQ', name: 'E-mini NASDAQ 100', tickValue: 5.00, tickSize: 0.25, microVersion: 'MNQ' },
  { id: 'MNQ', name: 'Micro E-mini NASDAQ 100', tickValue: 0.50, tickSize: 0.25, regularVersion: 'NQ' },
  { id: 'RTY', name: 'E-mini Russell 2000', tickValue: 5.00, tickSize: 0.10, microVersion: 'M2K' },
  { id: 'M2K', name: 'Micro E-mini Russell 2000', tickValue: 0.50, tickSize: 0.10, regularVersion: 'RTY' },
  { id: 'YM', name: 'E-mini Dow', tickValue: 5.00, tickSize: 1.00, microVersion: 'MYM' },
  { id: 'MYM', name: 'Micro E-mini Dow', tickValue: 0.50, tickSize: 1.00, regularVersion: 'YM' },
  { id: 'NKD', name: 'Nikkei', tickValue: 5.00, tickSize: 5.00 },
  { id: 'MBT', name: 'Micro E-mini Bitcoin', tickValue: 0.50, tickSize: 5.00 },
  { id: 'MET', name: 'Micro E-mini Ether', tickValue: 0.50, tickSize: 0.50 },

  // CME FX Futures
  { id: 'A6', name: 'Australian Dollar', tickValue: 10.00, tickSize: 0.0001, microVersion: 'M6A' },
  { id: 'M6A', name: 'Micro AUD/USD', tickValue: 1.00, tickSize: 0.0001, regularVersion: 'A6' },
  { id: 'B6', name: 'British Pound', tickValue: 6.25, tickSize: 0.0001, microVersion: 'M6B' },
  { id: 'M6B', name: 'Micro GBP/USD', tickValue: 0.625, tickSize: 0.0001, regularVersion: 'B6' },
  { id: 'E6', name: 'Euro FX', tickValue: 12.50, tickSize: 0.0001, microVersion: 'M6E' },
  { id: 'M6E', name: 'Micro EUR/USD', tickValue: 1.25, tickSize: 0.0001, regularVersion: 'E6' },
  { id: 'J6', name: 'Japanese Yen', tickValue: 12.50, tickSize: 0.0000005 },
  { id: 'S6', name: 'Swiss Franc', tickValue: 12.50, tickSize: 0.0001 },
  { id: 'N6', name: 'New Zealand Dollar', tickValue: 10.00, tickSize: 0.0001 },
  { id: 'M6', name: 'Mexican Peso', tickValue: 5.00, tickSize: 0.00001 },
  { id: 'D6', name: 'Canadian Dollar', tickValue: 10.00, tickSize: 0.0001 },

  // CME Interest Rate Futures
  { id: 'ZT', name: '2-Year Note', tickValue: 15.625, tickSize: 1/128 },
  { id: 'ZF', name: '5-Year Note', tickValue: 31.25, tickSize: 1/64 },
  { id: 'ZN', name: '10-Year Note', tickValue: 31.25, tickSize: 1/64 },
  { id: 'ZB', name: '30-Year Bond', tickValue: 31.25, tickSize: 1/32 },
  { id: 'UB', name: 'Ultra Bond', tickValue: 31.25, tickSize: 1/32 },
  { id: 'TN', name: 'Ultra Note', tickValue: 31.25, tickSize: 1/64 },
  { id: 'GE', name: 'Eurodollar', tickValue: 12.50, tickSize: 0.0025 },

  // CME Energy Futures
  { id: 'CL', name: 'Crude Oil', tickValue: 10.00, tickSize: 0.01, microVersion: 'MCL' },
  { id: 'MCL', name: 'Micro Crude Oil', tickValue: 1.00, tickSize: 0.01, regularVersion: 'CL' },
  { id: 'QM', name: 'E-mini Crude Oil', tickValue: 5.00, tickSize: 0.01 },
  { id: 'NG', name: 'Natural Gas', tickValue: 10.00, tickSize: 0.001, microVersion: 'MNG' },
  { id: 'MNG', name: 'Micro Henry Hub Natural Gas', tickValue: 1.00, tickSize: 0.001, regularVersion: 'NG' },
  { id: 'QG', name: 'E-mini Natural Gas', tickValue: 5.00, tickSize: 0.001 },
  { id: 'RB', name: 'RBOB Gasoline', tickValue: 4.20, tickSize: 0.0001 },
  { id: 'HO', name: 'Heating Oil', tickValue: 4.20, tickSize: 0.0001 },
  { id: 'PL', name: 'Platinum', tickValue: 5.00, tickSize: 0.10 },

  // CME Metals Futures
  { id: 'GC', name: 'Gold', tickValue: 10.00, tickSize: 0.10, microVersion: 'MGC' },
  { id: 'MGC', name: 'Micro Gold', tickValue: 1.00, tickSize: 0.10, regularVersion: 'GC' },
  { id: 'SI', name: 'Silver', tickValue: 5.00, tickSize: 0.005, microVersion: 'SIL' },
  { id: 'SIL', name: 'Micro Silver', tickValue: 0.50, tickSize: 0.005, regularVersion: 'SI' },
  { id: 'HG', name: 'Copper', tickValue: 12.50, tickSize: 0.0005, microVersion: 'MHG' },
  { id: 'MHG', name: 'Micro Copper', tickValue: 1.25, tickSize: 0.0005, regularVersion: 'HG' },

  // CME Agricultural Futures
  { id: 'ZC', name: 'Corn', tickValue: 12.50, tickSize: 0.25 },
  { id: 'ZW', name: 'Wheat', tickValue: 12.50, tickSize: 0.25 },
  { id: 'ZS', name: 'Soybeans', tickValue: 12.50, tickSize: 0.25 },
  { id: 'ZM', name: 'Soybean Meal', tickValue: 10.00, tickSize: 0.10 },
  { id: 'ZL', name: 'Soybean Oil', tickValue: 6.00, tickSize: 0.0001 },
  { id: 'HE', name: 'Lean Hogs', tickValue: 10.00, tickSize: 0.025 },
  { id: 'LE', name: 'Live Cattle', tickValue: 10.00, tickSize: 0.025 }
];

const exchangeGroups = [
  {
    name: "Direct Brokers",
    exchanges: [
      { id: 'none', name: 'Custom Fee', fee: null },
      { id: 'amp', name: 'AMP', fee: 4.08 },
      { id: 'ninjatrader', name: 'NinjaTrader', fee: 3.58 },
      { id: 'tradovate', name: 'Tradovate', fee: 4.50 },
      { id: 'optimus', name: 'Optimus', fee: 3.44 }
    ]
  },
  {
    name: "TopStep",
    exchanges: [
      { id: 'topstep_x', name: 'TopStepX', fee: 2.80 },
      { id: 'topstep_rithmic', name: 'TopStep (Rithmic)', fee: 4.36 },
      { id: 'topstep_tradovate', name: 'TopStep (Tradovate)', fee: 4.28 },
      { id: 'topstep_t4', name: 'TopStep (T4)', fee: 4.80 }
    ]
  }
];

// Create a map of instrument-specific fees for each exchange
const exchangeFeeMap = {
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
  },
  topstep_tradovate: {
    // Similar structure for Tradovate fees
    ES: 4.28, MES: 1.34,
    NQ: 4.28, MNQ: 1.34,
    // Add all other Tradovate fees...
  },
  topstep_rithmic: {
    // Similar structure for Rithmic fees
    ES: 4.36, MES: 1.42,
    NQ: 4.36, MNQ: 1.42,
    // Add all other Rithmic fees...
  },
  topstep_t4: {
    // Similar structure for T4 fees
    ES: 4.80, MES: null, // Currently unavailable
    NQ: 4.80, MNQ: null, // Currently unavailable
    // Add all other T4 fees...
  }
};

// Flatten exchanges for easier lookup
const exchanges = exchangeGroups.flatMap(group => group.exchanges);

interface CalculatorInstance {
  id: string;
  selectedInstrument: typeof instruments[0];
  ticks: number;
  riskAmount: number;
  selectedExchange: typeof exchanges[0];
  customFee: number;
}

function getInstrumentFee(exchangeId: string, instrumentId: string): number | null {
  if (exchangeId.startsWith('topstep_')) {
    return exchangeFeeMap[exchangeId as keyof typeof exchangeFeeMap]?.[instrumentId as keyof typeof exchangeFeeMap['topstep_x']] ?? null;
  }
  const exchange = exchanges.find(ex => ex.id === exchangeId);
  return exchange?.fee ?? null;
}

function RiskCalculator({ 
  data, 
  onUpdate, 
  onRemove 
}: { 
  data: CalculatorInstance; 
  onUpdate: (id: string, updates: Partial<CalculatorInstance>) => void;
  onRemove: (id: string) => void;
}) {
  const instrumentFee = getInstrumentFee(data.selectedExchange.id, data.selectedInstrument.id);
  const feePerContract = instrumentFee ?? data.customFee;
  const contracts = Math.floor(data.riskAmount / ((data.selectedInstrument.tickValue * data.ticks) + feePerContract));
  const totalRisk = (contracts * data.selectedInstrument.tickValue * data.ticks) + (contracts * feePerContract);
  const totalFees = contracts * feePerContract;

  const getMicroSavingsRecommendation = () => {
    if (!data.selectedInstrument.regularVersion) return null;
    const regularInstrument = instruments.find(i => i.id === data.selectedInstrument.regularVersion);
    if (!regularInstrument) return null;

    const currentTotalFees = totalFees;
    const regularContracts = Math.floor(contracts / 10);
    if (regularContracts < 1) return null;

    const regularFees = regularContracts * feePerContract;
    const savings = currentTotalFees - regularFees;
    
    if (savings <= 0) return null;
    
    return {
      regularContracts,
      savings,
      instrument: regularInstrument
    };
  };

  const savingsRecommendation = getMicroSavingsRecommendation();

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 relative">
      <button 
        onClick={() => onRemove(data.id)}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-400"
      >
        <X size={20} />
      </button>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Instrument Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Instrument</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.selectedInstrument.id}
              onChange={(e) => onUpdate(data.id, {
                selectedInstrument: instruments.find(i => i.id === e.target.value) || instruments[0]
              })}
            >
              {instruments.map((instrument) => (
                <option key={instrument.id} value={instrument.id}>
                  {instrument.name} (${instrument.tickValue}/tick)
                </option>
              ))}
            </select>
          </div>

          {/* Exchange Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Exchange</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.selectedExchange.id}
              onChange={(e) => onUpdate(data.id, {
                selectedExchange: exchanges.find(ex => ex.id === e.target.value) || exchanges[0]
              })}
            >
              {exchangeGroups.map((group) => (
                <optgroup key={group.name} label={group.name}>
                  {group.exchanges.map((exchange) => (
                    <option key={exchange.id} value={exchange.id}>
                      {exchange.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Custom Fee Input (shown only when "Custom Fee" is selected) */}
          {data.selectedExchange.id === 'none' && (
            <div>
              <label className="block text-sm font-medium mb-2">Custom Roundtrip Fee per Contract ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={data.customFee}
                onChange={(e) => onUpdate(data.id, { customFee: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Risk Parameters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Number of Ticks</label>
              <input
                type="number"
                min="1"
                value={data.ticks}
                onChange={(e) => onUpdate(data.id, { ticks: Math.max(1, parseInt(e.target.value) || 0) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Risk Amount ($)</label>
              <input
                type="number"
                min="0"
                value={data.riskAmount}
                onChange={(e) => onUpdate(data.id, { riskAmount: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Instrument Details */}
          <div className="text-sm text-gray-400">
            <p>Tick Value: ${data.selectedInstrument.tickValue}</p>
            <p>Tick Size: {data.selectedInstrument.tickSize}</p>
            <p>Round-turn Fee: ${feePerContract.toFixed(2)}</p>
            <p>Risk per Contract: ${(data.selectedInstrument.tickValue * data.ticks + feePerContract).toFixed(2)} (including fees)</p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-lg p-4 space-y-4">
            <div>
              <h3 className="text-sm text-gray-400">Recommended Contracts</h3>
              <p className="text-2xl font-bold text-blue-400">{contracts}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400">Total Risk (including fees)</h3>
              <p className="text-2xl font-bold text-green-400">${totalRisk.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400">Total Fees</h3>
              <p className="text-2xl font-bold text-yellow-400">${totalFees.toFixed(2)}</p>
            </div>
          </div>

          {/* Fee Savings Recommendation */}
          {savingsRecommendation && (
            <div className="bg-blue-900/50 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div className="text-sm">
                  <p className="text-blue-400 font-medium">Fee Savings Opportunity</p>
                  <p className="text-gray-300 mt-1">
                    Instead of {contracts} {data.selectedInstrument.name} contracts, 
                    consider using {savingsRecommendation.regularContracts} {savingsRecommendation.instrument.name} contracts 
                    to save ${savingsRecommendation.savings.toFixed(2)} in fees.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Index = () => {
  const [calculators, setCalculators] = useState<CalculatorInstance[]>([{
    id: '1',
    selectedInstrument: instruments[0],
    ticks: 4,
    riskAmount: 1000,
    selectedExchange: exchanges[0],
    customFee: 4.50
  }]);

  const addCalculator = () => {
    setCalculators(prev => [...prev, {
      id: String(Date.now()),
      selectedInstrument: instruments[0],
      ticks: 4,
      riskAmount: 1000,
      selectedExchange: exchanges[0],
      customFee: 4.50
    }]);
  };

  const updateCalculator = (id: string, updates: Partial<CalculatorInstance>) => {
    setCalculators(prev => prev.map(calc => 
      calc.id === id ? { ...calc, ...updates } : calc
    ));
  };

  const removeCalculator = (id: string) => {
    setCalculators(prev => prev.filter(calc => calc.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold">CME Futures Risk Calculator</h1>
            </div>
            <button
              onClick={addCalculator}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
            >
              <Plus size={20} />
              Add Calculator
            </button>
          </div>
          
          <div className="space-y-6">
            {calculators.map(calc => (
              <RiskCalculator
                key={calc.id}
                data={calc}
                onUpdate={updateCalculator}
                onRemove={removeCalculator}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
