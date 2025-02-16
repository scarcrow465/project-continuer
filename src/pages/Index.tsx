import React, { useState } from 'react';
import { Calculator, Plus } from 'lucide-react';
import { RiskCalculator } from '../components/RiskCalculator/RiskCalculator';
import { CalculatorInstance } from '../components/RiskCalculator/utils';
import { instruments } from '../data/instruments';
import { exchangeGroups } from '../data/exchanges';

const Index = () => {
  const [calculators, setCalculators] = useState<CalculatorInstance[]>([{
    id: '1',
    selectedInstrument: instruments[0],
    ticks: 4,
    points: instruments[0].tickSize * 4,
    riskAmount: 1000,
    profitAmount: 2000,
    riskRewardRatio: 2,
    selectedExchange: exchangeGroups[0].exchanges[0],
    customFee: 4.50
  }]);

  const addCalculator = () => {
    setCalculators(prev => [...prev, {
      id: String(Date.now()),
      selectedInstrument: instruments[0],
      ticks: 4,
      points: instruments[0].tickSize * 4,
      riskAmount: 1000,
      profitAmount: 2000,
      riskRewardRatio: 2,
      selectedExchange: exchangeGroups[0].exchanges[0],
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
