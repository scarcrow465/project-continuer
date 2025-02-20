import React, { useState, useEffect } from 'react';
import { Calculator, Plus, LayoutGrid, Moon, Sun, RotateCcw } from 'lucide-react';
import { RiskCalculator } from '../components/RiskCalculator/RiskCalculator';
import { CalculatorInstance } from '../components/RiskCalculator/utils';
import { instruments } from '../data/instruments';
import { exchangeGroups } from '../data/exchanges';
import { ThemeProvider } from 'next-themes';
import { useTheme } from 'next-themes';

const STORAGE_KEY = 'lastCalculatorState';
const PRESETS_KEY = 'calculatorPresets';

interface Preset {
  id: string;
  name: string;
  instrumentId: string | 'universal';
  isDefault: boolean;
  settings: Omit<CalculatorInstance, 'id'>;
}

const getDefaultCalculator = (presets: Preset[]): CalculatorInstance => {
  const savedState = localStorage.getItem(STORAGE_KEY);
  const defaultPreset = presets.find(p => p.isDefault);
  
  if (savedState) {
    return JSON.parse(savedState);
  }
  
  if (defaultPreset) {
    return {
      id: '1',
      ...defaultPreset.settings
    };
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
  const [calculators, setCalculators] = useState<CalculatorInstance[]>([]);
  const [gridLayout, setGridLayout] = useState(false);
  const [presets, setPresets] = useState<Preset[]>([]);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const savedPresets = localStorage.getItem(PRESETS_KEY);
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets));
    }
    
    setCalculators([getDefaultCalculator(JSON.parse(savedPresets || '[]'))]);
  }, []);

  useEffect(() => {
    if (calculators.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(calculators[calculators.length - 1]));
    }
  }, [calculators]);

  useEffect(() => {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  }, [presets]);

  const addCalculator = () => {
    setCalculators(prev => [...prev, {
      ...getDefaultCalculator(presets),
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
      calc.id === id ? getDefaultCalculator(presets) : calc
    ));
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
    setPresets(prev => prev.map(preset => 
      preset.id === presetId ? { ...preset, ...updates } : preset
    ));
  };

  const deletePreset = (presetId: string) => {
    setPresets(prev => prev.filter(preset => preset.id !== presetId));
  };

  const setDefaultPreset = (presetId: string) => {
    setPresets(prev => prev.map(preset => ({
      ...preset,
      isDefault: preset.id === presetId
    })));
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-[1920px] mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="flex-1 flex justify-center items-center gap-3">
                <Calculator className="w-8 h-8 text-blue-400" />
                <h1 className="text-3xl font-bold">Futures Risk Calculator</h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button
                  onClick={() => setGridLayout(prev => !prev)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={addCalculator}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                >
                  <Plus size={20} />
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
      </div>
    </ThemeProvider>
  );
};

export default Index;
