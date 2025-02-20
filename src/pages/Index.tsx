import React, { useState } from 'react';
import RiskCalculator from '../components/RiskCalculator/RiskCalculator';
import { instruments } from '../data/instruments';
import { exchangeGroups } from '../data/exchanges';
import { CalculatorInstance } from '../components/RiskCalculator/utils';
import { Preset } from '../components/RiskCalculator/types';

const defaultCalculator: CalculatorInstance = {
  id: String(Date.now()),
  selectedInstrument: instruments[0],
  ticks: 0,
  points: 0,
  riskAmount: 0,
  profitAmount: 0,
  riskRewardRatio: 2,
  selectedExchange: exchangeGroups[0].exchanges[0],
  customFee: 4.50
};

const IndexPage: React.FC = () => {
  const [calculators, setCalculators] = useState<CalculatorInstance[]>([defaultCalculator]);
  const [presets, setPresets] = useState<Preset[]>([]);

  const addCalculator = () => {
    const newCalculator: CalculatorInstance = {
      id: String(Date.now()),
      selectedInstrument: instruments[0],
      ticks: 0,
      points: 0,
      riskAmount: 0,
      profitAmount: 0,
      riskRewardRatio: 2,
      selectedExchange: exchangeGroups[0].exchanges[0],
      customFee: 4.50
    };
    setCalculators([...calculators, newCalculator]);
  };

  const updateCalculator = (id: string, updates: Partial<CalculatorInstance>) => {
    setCalculators(calculators.map(calc => calc.id === id ? { ...calc, ...updates } : calc));
  };

  const removeCalculator = (id: string) => {
    setCalculators(calculators.filter(calc => calc.id !== id));
  };

  const resetCalculators = () => {
    setCalculators([defaultCalculator]);
  };

  const savePreset = (name: string, isUniversal: boolean) => {
    const calculator = calculators[calculators.length - 1];
    const newPreset: Preset = {
      id: String(Date.now()),
      name,
      instrumentId: isUniversal ? 'universal' : calculator.selectedInstrument.id,
      isUniversal,
      isDefault: false,
      settings: {
        selectedInstrument: calculator.selectedInstrument,
        ticks: calculator.ticks,
        points: calculator.points,
        riskAmount: calculator.riskAmount,
        profitAmount: calculator.profitAmount,
        riskRewardRatio: calculator.riskRewardRatio,
        selectedExchange: calculator.selectedExchange,
        customFee: calculator.customFee
      }
    };
    setPresets(prev => [...prev, newPreset]);
  };

  const updatePreset = (presetId: string, updates: Partial<Preset>) => {
    setPresets(prev =>
      prev.map(preset => (preset.id === presetId ? { ...preset, ...updates } : preset))
    );
  };

  const deletePreset = (presetId: string) => {
    setPresets(prev => prev.filter(preset => preset.id !== presetId));
  };

  const setDefaultPreset = (presetId: string) => {
    setPresets(prev =>
      prev.map(preset => ({
        ...preset,
        isDefault: preset.id === presetId
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="mb-4">
          <button
            onClick={addCalculator}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Calculator
          </button>
          <button
            onClick={resetCalculators}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Reset All Calculators
          </button>
        </div>
        <div className="space-y-6">
          {calculators.map((calculator) => (
            <RiskCalculator
              key={calculator.id}
              data={calculator}
              onUpdate={updateCalculator}
              onRemove={removeCalculator}
              onReset={resetCalculators}
              presets={presets}
              onSavePreset={savePreset}
              onUpdatePreset={updatePreset}
              onDeletePreset={deletePreset}
              onSetDefaultPreset={setDefaultPreset}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
