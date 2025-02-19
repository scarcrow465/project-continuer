import React, { useState, useRef } from 'react';
import { X, AlertCircle, Trash2, Save, Settings, List, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalculatorInstance, OptimalContract, calculateOptimalContracts } from './utils';
import { Preset } from './types';
import { instruments } from '../../data/instruments';
import { exchangeGroups, getInstrumentFee } from '../../data/exchanges';
import { MarginInfo } from './MarginInfo';
import { calculateRiskReward, getMicroSavingsRecommendation } from './utils';
import { useTheme } from 'next-themes';

interface RiskCalculatorProps {
  data: CalculatorInstance;
  onUpdate: (id: string, updates: Partial<CalculatorInstance>) => void;
  onRemove: (id: string) => void;
  onReset: () => void;
  presets: Preset[];
  onSavePreset: (name: string, isUniversal: boolean) => void;
  onUpdatePreset: (id: string, updates: Partial<Preset>) => void;
  onDeletePreset: (id: string) => void;
  onSetDefaultPreset: (id: string) => void;
}

interface CalculatorSettings {
  thresholdPercentage: number;
}

export const RiskCalculator: React.FC<RiskCalculatorProps> = ({
  data,
  onUpdate,
  onRemove,
  onReset,
  presets,
  onSavePreset,
  onUpdatePreset,
  onDeletePreset,
  onSetDefaultPreset
}) => {
  const [activeFields, setActiveFields] = useState<Set<'ticks' | 'points' | 'risk' | 'profit'>>(new Set());
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showPresetsListModal, setShowPresetsListModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [isUniversalPreset, setIsUniversalPreset] = useState(false);
  const [settings, setSettings] = useState<CalculatorSettings>({ thresholdPercentage: 25 });
  const previousState = useRef<CalculatorInstance>(data);
  const { theme } = useTheme();

  const handleStateChange = (updates: Partial<CalculatorInstance>) => {
    previousState.current = data;
    onUpdate(data.id, updates);
  };

  const handleUndo = () => {
    if (previousState.current) {
      onUpdate(data.id, previousState.current);
    }
  };

  const findModifiedTicks = (userTicks: number, optimalContracts: OptimalContract[]): number => {
    if (!optimalContracts.length) return userTicks;

    const threshold = settings.thresholdPercentage / 100;
    const availableTicks = optimalContracts.map(c => c.ticksPerContract).sort((a, b) => a - b);
    
    for (let i = 0; i < availableTicks.length; i++) {
      const currentTicks = availableTicks[i];
      const lowerBound = currentTicks * (1 - threshold);
      const upperBound = currentTicks * (1 + threshold);
      
      if (userTicks >= lowerBound && userTicks <= upperBound) {
        return currentTicks;
      }
    }
    
    return availableTicks.reduce((prev, curr) => 
      Math.abs(curr - userTicks) < Math.abs(prev - userTicks) ? curr : prev,
      availableTicks[0]
    );
  };

  const instrumentFee = getInstrumentFee(data.selectedExchange.id, data.selectedInstrument.id);
  const feePerContract = instrumentFee ?? data.customFee;

  const optimalContracts = calculateOptimalContracts(
    data.riskAmount,
    data.selectedInstrument.tickValue,
    feePerContract
  );

  const modifiedTicks = findModifiedTicks(data.ticks, optimalContracts);
  const recommendedPoints = modifiedTicks * data.selectedInstrument.tickSize;
  const contracts = optimalContracts.find(c => c.ticksPerContract === modifiedTicks)?.contracts || 1;

  const riskRewardResults = calculateRiskReward(
    data.riskAmount,
    data.profitAmount,
    data.riskRewardRatio,
    'risk'
  );

  const savingsRecommendation = getMicroSavingsRecommendation(
    contracts,
    data.selectedInstrument,
    feePerContract,
    instruments,
    data.selectedExchange.id
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Risk Calculator</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={() => setShowPresetsListModal(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <List size={20} />
          </button>
          <button
            onClick={handleUndo}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <RotateCw size={20} />
          </button>
          <button
            onClick={() => onRemove(data.id)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-red-500"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Instrument</label>
          <select
            value={data.selectedInstrument.id}
            onChange={(e) => {
              const instrument = instruments.find(i => i.id === e.target.value);
              if (instrument) {
                handleStateChange({
                  selectedInstrument: instrument,
                  ticks: 4,
                  points: instrument.tickSize * 4,
                });
              }
            }}
            className="w-full p-2 border rounded"
          >
            {instruments.map(instrument => (
              <option key={instrument.id} value={instrument.id}>{instrument.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Exchange</label>
          <select
            value={data.selectedExchange.id}
            onChange={(e) => {
              const exchange = exchangeGroups.flatMap(group => group.exchanges).find(ex => ex.id === e.target.value);
              if (exchange) {
                handleStateChange({ selectedExchange: exchange });
              }
            }}
            className="w-full p-2 border rounded"
          >
            {exchangeGroups.flatMap(group => group.exchanges).map(exchange => (
              <option key={exchange.id} value={exchange.id}>{exchange.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Ticks
            <button onClick={() => setActiveFields(prev => new Set(prev.has('ticks') ? [] : ['ticks']))} className="ml-2">
              <AlertCircle className="inline-block w-4 h-4" />
            </button>
          </label>
          <input
            type="number"
            value={data.ticks}
            onChange={(e) => {
              const newTicks = Number(e.target.value);
              handleStateChange({
                ticks: newTicks,
                points: newTicks * data.selectedInstrument.tickSize,
              });
            }}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Points
            <button onClick={() => setActiveFields(prev => new Set(prev.has('points') ? [] : ['points']))} className="ml-2">
              <AlertCircle className="inline-block w-4 h-4" />
            </button>
          </label>
          <input
            type="number"
            value={data.points}
            onChange={(e) => {
              const newPoints = Number(e.target.value);
              handleStateChange({
                points: newPoints,
                ticks: newPoints / data.selectedInstrument.tickSize,
              });
            }}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Risk Amount
            <button onClick={() => setActiveFields(prev => new Set(prev.has('risk') ? [] : ['risk']))} className="ml-2">
              <AlertCircle className="inline-block w-4 h-4" />
            </button>
          </label>
          <input
            type="number"
            value={data.riskAmount}
            onChange={(e) => handleStateChange({ riskAmount: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Profit Amount
            <button onClick={() => setActiveFields(prev => new Set(prev.has('profit') ? [] : ['profit']))} className="ml-2">
              <AlertCircle className="inline-block w-4 h-4" />
            </button>
          </label>
          <input
            type="number"
            value={data.profitAmount}
            onChange={(e) => handleStateChange({ profitAmount: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Risk/Reward Ratio</label>
          <input
            type="number"
            value={data.riskRewardRatio}
            onChange={(e) => handleStateChange({ riskRewardRatio: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Custom Fee</label>
          <input
            type="number"
            value={data.customFee}
            onChange={(e) => handleStateChange({ customFee: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <MarginInfo
        instrument={data.selectedInstrument}
        exchange={data.selectedExchange}
        contracts={contracts}
      />

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setShowPresetModal(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          <Save className="inline-block w-4 h-4 mr-2" />
          Save as Preset
        </button>
        <button
          onClick={onReset}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          <RotateCw className="inline-block w-4 h-4 mr-2" />
          Reset
        </button>
      </div>

      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Settings</h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Threshold Percentage
                </label>
                <input
                  type="number"
                  value={settings.thresholdPercentage}
                  onChange={(e) => setSettings({ ...settings, thresholdPercentage: Number(e.target.value) })}
                  className="w-full p-2 border rounded"
                  min="0"
                  max="100"
                />
              </div>

              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPresetsListModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Presets</h3>
                <button
                  onClick={() => setShowPresetsListModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {presets.map((preset) => (
                  <div key={preset.id} className="flex items-center justify-between">
                    <span>{preset.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onSetDefaultPreset(preset.id)}
                        className={`p-1 rounded ${
                          preset.isDefault ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        Default
                      </button>
                      <button
                        onClick={() => onDeletePreset(preset.id)}
                        className="p-1 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowPresetsListModal(false);
                  setShowPresetModal(true);
                }}
                className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Create New Preset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPresetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Save Preset</h3>
                <button
                  onClick={() => setShowPresetModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Preset Name
                  </label>
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isUniversalPreset}
                    onChange={(e) => setIsUniversalPreset(e.target.checked)}
                    className="mr-2"
                  />
                  <label>Make Universal (apply to all instruments)</label>
                </div>

                <button
                  onClick={() => {
                    if (newPresetName) {
                      onSavePreset(newPresetName, isUniversalPreset);
                      setNewPresetName('');
                      setIsUniversalPreset(false);
                      setShowPresetModal(false);
                    }
                  }}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Save Preset
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
