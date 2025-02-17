import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { CalculatorInstance } from './utils';
import { instruments } from '../../data/instruments';
import { exchangeGroups, getInstrumentFee } from '../../data/exchanges';
import { MarginInfo } from './MarginInfo';
import { calculateRiskReward, getMicroSavingsRecommendation } from './utils';

interface RiskCalculatorProps {
  data: CalculatorInstance;
  onUpdate: (id: string, updates: Partial<CalculatorInstance>) => void;
  onRemove: (id: string) => void;
}

export const RiskCalculator: React.FC<RiskCalculatorProps> = ({ data, onUpdate, onRemove }) => {
  const instrumentFee = getInstrumentFee(data.selectedExchange.id, data.selectedInstrument.id);
  const feePerContract = instrumentFee ?? data.customFee;
  
  // Calculate contracts based on risk amount only, without limiting by total risk
  const contracts = Math.ceil(data.riskAmount / (data.selectedInstrument.tickValue * data.ticks));
  const totalRisk = (contracts * data.selectedInstrument.tickValue * data.ticks) + (contracts * feePerContract);
  const totalFees = contracts * feePerContract;
  
  // Fix Risk/Reward ratio calculation (1:2 instead of 2:1)
  const riskRewardRatio = totalRisk > 0 ? (totalRisk / data.profitAmount).toFixed(2) : '0.00';

  // Filter available instruments based on selected exchange
  const availableInstruments = instruments.filter(instrument => {
    const exchange = exchangeGroups.flatMap(group => group.exchanges).find(ex => ex.id === data.selectedExchange.id);
    if (!exchange?.availableInstruments) return true; // If no restriction, show all
    return exchange.availableInstruments.includes(instrument.id);
  });

  // Filter available exchanges based on selected instrument
  const availableExchanges = exchangeGroups.map(group => ({
    ...group,
    exchanges: group.exchanges.filter(exchange => {
      if (!exchange.availableInstruments) return true; // If no restriction, show all
      return exchange.availableInstruments.includes(data.selectedInstrument.id);
    })
  })).filter(group => group.exchanges.length > 0);

  const savingsRecommendation = getMicroSavingsRecommendation(
    contracts,
    data.selectedInstrument,
    feePerContract,
    instruments,
    data.selectedExchange.id
  );

  const handleTicksChange = (ticks: number) => {
    const points = ticks * data.selectedInstrument.tickSize;
    onUpdate(data.id, { ticks, points });
  };

  const handlePointsChange = (points: number) => {
    const ticks = Math.round(points / data.selectedInstrument.tickSize);
    onUpdate(data.id, { points, ticks });
  };

  const handleRiskRewardUpdate = (
    type: 'risk' | 'profit' | 'ratio',
    value: number
  ) => {
    if (type === 'ratio') {
      // When ratio is updated, update profit target based on risk amount
      onUpdate(data.id, {
        riskRewardRatio: value,
        profitAmount: data.riskAmount / value
      });
    } else if (type === 'risk') {
      // When risk is updated, update profit target based on ratio
      onUpdate(data.id, {
        riskAmount: value,
        profitAmount: value / data.riskRewardRatio
      });
    } else {
      // When profit is updated, update ratio based on risk amount
      onUpdate(data.id, {
        profitAmount: value,
        riskRewardRatio: data.riskAmount / value
      });
    }
  };

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
              {Object.entries(instrumentsByCategory).map(([category, categoryInstruments]) => (
                <optgroup key={category} label={category}>
                  {categoryInstruments.map((instrument) => (
                    <option key={instrument.id} value={instrument.id}>
                      {instrument.name} (${instrument.tickValue}/tick)
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Exchange Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Exchange</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data.selectedExchange.id}
              onChange={(e) => {
                const selectedExchange = exchangeGroups.flatMap(group => group.exchanges).find(ex => ex.id === e.target.value) || exchangeGroups[0].exchanges[0];
                onUpdate(data.id, {
                  selectedExchange: selectedExchange
                })
              }}
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
                onChange={(e) => handleTicksChange(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Number of Points</label>
              <input
                type="number"
                min="0"
                step={data.selectedInstrument.tickSize}
                value={data.points}
                onChange={(e) => handlePointsChange(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Risk Amount ($)</label>
              <input
                type="number"
                min="0"
                value={data.riskAmount}
                onChange={(e) => handleRiskRewardUpdate('risk', Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Risk/Reward Ratio</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={data.riskRewardRatio}
                onChange={(e) => handleRiskRewardUpdate('ratio', Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Profit Target ($)</label>
              <input
                type="number"
                min="0"
                value={data.profitAmount}
                onChange={(e) => handleRiskRewardUpdate('profit', Math.max(0, parseFloat(e.target.value) || 0))}
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
            <div>
              <h3 className="text-sm text-gray-400">Risk/Reward Ratio</h3>
              <p className="text-2xl font-bold text-purple-400">1:{riskRewardRatio}</p>
            </div>
          
          {/* Add Margin Info inside results panel */}
          {data.selectedExchange.type === 'direct' && (
            <MarginInfo
              instrument={data.selectedInstrument}
              contracts={contracts}
              exchange={data.selectedExchange}
            />
          )}
        </div>

        {/* Fee Savings Recommendation */}
        {savingsRecommendation && (
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertCircle size={20} />
              <h3 className="text-sm">Fee Savings Opportunity</h3>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Consider trading {savingsRecommendation.regularContracts} contract(s) of {savingsRecommendation.instrument.name} instead of {contracts} micro contracts.
            </p>
            <p className="text-sm text-green-400">
              Potential Savings: ${savingsRecommendation.savings.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
