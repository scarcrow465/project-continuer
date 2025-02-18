
import React, { useState, useEffect } from 'react';
import { Calculator, Plus, LayoutGrid, Moon, Sun, RotateCcw } from 'lucide-react';
import { RiskCalculator } from '../components/RiskCalculator/RiskCalculator';
import { CalculatorInstance } from '../components/RiskCalculator/utils';
import { instruments } from '../data/instruments';
import { exchangeGroups } from '../data/exchanges';
import { ThemeProvider } from 'next-themes';

const STORAGE_KEY = 'lastCalculatorState';

const getDefaultCalculator = (): CalculatorInstance => {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    return JSON.parse(savedState);
  }
  return {
    id: '1',
    selectedInstrument: instruments[0],
    ticks: 4,
    points: instruments[0].tickSize * 4,
    riskAmount: 1000,
    profitAmount: 2000,
    riskRewardRatio: 2,
    selectedExchange: exchangeGroups[0].exchanges[0],
    customFee: 4.50
  };
};

const Index = () => {
  const [calculators, setCalculators] = useState<CalculatorInstance[]>([getDefaultCalculator()]);
  const [gridLayout, setGridLayout] = useState(true);

  useEffect(() => {
    // Save last state when calculators change
    if (calculators.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(calculators[calculators.length - 1]));
    }
  }, [calculators]);

  const addCalculator = () => {
    setCalculators(prev => [...prev, {
      ...getDefaultCalculator(),
      id: String(Date.now())
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

  const resetCalculator = (id: string) => {
    setCalculators(prev => prev.map(calc => 
      calc.id === id ? { ...getDefaultCalculator(), id } : calc
    ));
  };

  return (
    <ThemeProvider attribute="class">
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-[1920px] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Calculator className="w-8 h-8 text-blue-400" />
                <h1 className="text-3xl font-bold text-center">Futures Risk Calculator</h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setGridLayout(prev => !prev)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                >
                  <LayoutGrid size={20} />
                  {gridLayout ? 'Single Column' : 'Grid Layout'}
                </button>
                <button
                  onClick={addCalculator}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                >
                  <Plus size={20} />
                  Add Calculator
                </button>
              </div>
            </div>
            
            <div className={`grid ${gridLayout ? 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {calculators.map(calc => (
                <RiskCalculator
                  key={calc.id}
                  data={calc}
                  onUpdate={updateCalculator}
                  onRemove={removeCalculator}
                  onReset={() => resetCalculator(calc.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
