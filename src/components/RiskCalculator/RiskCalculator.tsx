import React, { useState, useRef } from 'react';
import { X, AlertCircle, Trash2, Save, Settings, List, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalculatorInstance, OptimalContract, calculateOptimalContracts } from './utils';
import { instruments } from '../../data/instruments';
import { exchangeGroups, getInstrumentFee } from '../../data/exchanges';
import { MarginInfo } from './MarginInfo';
import { calculateRiskReward, getMicroSavingsRecommendation } from './utils';
import { useTheme } from 'next-themes';
import { Preset } from './types';
interface RiskCalculatorProps {
  data: CalculatorInstance;
  onUpdate: (id: string, updates: Partial<CalculatorInstance>) => void;
  onRemove: (id: string) => void;
  onReset: () => void;
  presets: Preset[];
  onSavePreset: (name: string, isUniversal: boolean) => void;
  onUpdatePreset: (presetId: string, updates: Partial<Preset>) => void;
  onDeletePreset: (presetId: string) => void;
  onSetDefaultPreset: (presetId: string) => void;
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
  const [tempThresholdPercentage, setTempThresholdPercentage] = useState(25);
  const [settings, setSettings] = useState<CalculatorSettings>({
    thresholdPercentage: 25
  });
  const previousState = useRef<CalculatorInstance>(data);
  const {
    theme
  } = useTheme();
  const findModifiedTicks = (userTicks: number, optimalContracts: OptimalContract[]): number => {
    if (!userTicks || optimalContracts.length === 0) return userTicks;
    const threshold = settings.thresholdPercentage / 100;
    const availableTicks = [...new Set(optimalContracts.map(c => c.ticksPerContract))].sort((a, b) => a - b);
    for (let i = 0; i < availableTicks.length; i++) {
      const tier = availableTicks[i];
      const nextTier = availableTicks[i + 1] || Number.MAX_VALUE;
      const lowerBound = tier - tier * threshold;
      const upperBound = tier + tier * threshold;
      if (userTicks >= lowerBound && userTicks <= upperBound) {
        return tier;
      }
      if (userTicks > upperBound && userTicks < nextTier - nextTier * threshold) {
        return tier;
      }
    }
    return availableTicks.reduce((prev, curr) => {
      return Math.abs(curr - userTicks) < Math.abs(prev - userTicks) ? curr : prev;
    });
  };
  const handleStateChange = (updates: Partial<CalculatorInstance>) => {
    previousState.current = data;
    onUpdate(data.id, updates);
  };
  const handleUndo = () => {
    if (previousState.current) {
      onUpdate(data.id, previousState.current);
    }
  };
  const instrumentFee = getInstrumentFee(data.selectedExchange.id, data.selectedInstrument.id);
  const feePerContract = instrumentFee ?? data.customFee;
  const optimalContracts = calculateOptimalContracts(data.riskAmount, data.selectedInstrument.tickValue, feePerContract);
  const modifiedTicks = findModifiedTicks(data.ticks, optimalContracts);
  const recommendedPoints = modifiedTicks * data.selectedInstrument.tickSize;
  const contracts = optimalContracts.find(c => c.ticksPerContract === modifiedTicks)?.contracts || 1;
  const totalRisk = contracts * data.selectedInstrument.tickValue * modifiedTicks + contracts * feePerContract;
  const totalFees = contracts * feePerContract;
  const riskRewardRatio = data.riskAmount > 0 ? (data.profitAmount / data.riskAmount).toFixed(2) : '0.00';
  const profitTargetTicks = Math.ceil(data.profitAmount / (contracts * data.selectedInstrument.tickValue));
  const instrumentsByCategory = instruments.reduce((acc, instrument) => {
    if (!acc[instrument.category]) {
      acc[instrument.category] = [];
    }
    acc[instrument.category].push(instrument);
    return acc;
  }, {} as Record<string, typeof instruments>);
  const handleTicksChange = (ticks: number) => {
    const points = ticks * data.selectedInstrument.tickSize;
    setActiveFields(prev => {
      const next = new Set(prev);
      next.delete('points');
      next.add('ticks');
      return next;
    });
    handleStateChange({
      ticks,
      points
    });
  };
  const handlePointsChange = (points: number) => {
    const ticks = Math.round(points / data.selectedInstrument.tickSize);
    setActiveFields(prev => {
      const next = new Set(prev);
      next.delete('ticks');
      next.add('points');
      return next;
    });
    handleStateChange({
      points,
      ticks
    });
  };
  const handleRiskRewardUpdate = (type: 'risk' | 'profit' | 'ratio', value: number) => {
    if (type === 'ratio') {
      handleStateChange({
        riskRewardRatio: value,
        profitAmount: data.riskAmount / value
      });
    } else if (type === 'risk') {
      setActiveFields(prev => {
        const next = new Set(prev);
        next.delete('profit');
        next.add('risk');
        return next;
      });
      handleStateChange({
        riskAmount: value,
        profitAmount: value / data.riskRewardRatio
      });
    } else {
      setActiveFields(prev => {
        const next = new Set(prev);
        next.delete('risk');
        next.add('profit');
        return next;
      });
      handleStateChange({
        profitAmount: value,
        riskRewardRatio: data.riskAmount / value
      });
    }
  };
  const getFieldStyle = (field: 'ticks' | 'points' | 'risk' | 'profit') => {
    return `w-full bg-gray-700 border ${activeFields.has(field) ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-600'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`;
  };
  const savingsRecommendation = getMicroSavingsRecommendation(contracts, data.selectedInstrument, feePerContract, instruments, data.selectedExchange.id);
  const handleReset = () => {
    onUpdate(data.id, {
      selectedInstrument: instruments[0],
      ticks: 0,
      points: 0,
      riskAmount: 0,
      profitAmount: 0,
      riskRewardRatio: 0,
      selectedExchange: exchangeGroups[0].exchanges[0],
      customFee: 4.50
    });
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} className="bg-gray-800 rounded-lg shadow-xl p-6 relative">
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button onClick={() => setShowSettingsModal(true)} className="text-gray-400 hover:text-purple-400 transition-colors" title="Settings">
          <Settings size={20} />
        </button>
        <button onClick={handleUndo} className="text-gray-400 hover:text-blue-400 transition-colors" title="Undo">
          <RotateCw size={20} />
        </button>
        <button onClick={handleReset} className="text-gray-400 hover:text-yellow-400 transition-colors" title="Reset Calculator">
          <Trash2 size={20} />
        </button>
        <button onClick={() => setShowPresetModal(true)} className="text-gray-400 hover:text-green-400 transition-colors" title="Save Preset">
          <Save size={20} />
        </button>
        <button onClick={() => setShowPresetsListModal(true)} className="text-gray-400 hover:text-blue-400 transition-colors" title="Load Preset">
          <List size={20} />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-center pt-12">
        <div className="md:col-span-2 space-y-6">
          <div className="text-gray-300 bg-gray-800 dark:bg-gray-900 rounded-md px-3 py-2 mb-4">
            <h2 className="text-lg font-medium text-center">
              {data.selectedExchange.name} - {data.selectedInstrument.name}
            </h2>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Instrument</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={data.selectedInstrument.id} onChange={e => onUpdate(data.id, {
            selectedInstrument: instruments.find(i => i.id === e.target.value) || instruments[0]
          })}>
              {Object.entries(instrumentsByCategory).map(([category, categoryInstruments]) => <optgroup key={category} label={category}>
                  {categoryInstruments.map(instrument => <option key={instrument.id} value={instrument.id}>
                      {instrument.name} (${instrument.tickValue}/tick)
                    </option>)}
                </optgroup>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Exchange</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={data.selectedExchange.id} onChange={e => {
            const selectedExchange = exchangeGroups.flatMap(group => group.exchanges).find(ex => ex.id === e.target.value) || exchangeGroups[0].exchanges[0];
            onUpdate(data.id, {
              selectedExchange: selectedExchange
            });
          }}>
              {exchangeGroups.map(group => <optgroup key={group.name} label={group.name}>
                  {group.exchanges.map(exchange => <option key={exchange.id} value={exchange.id}>
                      {exchange.name}
                    </option>)}
                </optgroup>)}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <motion.div layout>
                <label className="block text-sm font-medium mb-2">Tick Risk</label>
                <input type="number" min="1" value={data.ticks} onChange={e => handleTicksChange(Math.max(1, parseInt(e.target.value) || 0))} onFocus={() => handleTicksChange(data.ticks)} className={getFieldStyle('ticks')} />
              </motion.div>
              <motion.div layout>
                <label className="block text-sm font-medium mb-2">Modified Tick Risk</label>
                <div className="text-gray-300 bg-gray-800 dark:bg-gray-900 rounded-md px-3 py-2 cursor-not-allowed opacity-80">
                  {modifiedTicks}
                </div>
              </motion.div>
            </div>
            <div className="space-y-4">
              <motion.div layout>
                <label className="block text-sm font-medium mb-2">Point Risk</label>
                <input type="number" min="0" step={data.selectedInstrument.tickSize} value={data.points} onChange={e => handlePointsChange(Math.max(0, parseFloat(e.target.value) || 0))} onFocus={() => handlePointsChange(data.points)} className={getFieldStyle('points')} />
              </motion.div>
              <motion.div layout>
                <label className="block text-sm font-medium mb-2">Modified Point Risk</label>
                <div className="text-gray-300 bg-gray-800 dark:bg-gray-900 rounded-md px-3 py-2 cursor-not-allowed opacity-80">
                  {Math.round(recommendedPoints)}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Risk Amount ($)</label>
              <input type="number" min="0" value={data.riskAmount} onChange={e => handleRiskRewardUpdate('risk', Math.max(0, parseFloat(e.target.value) || 0))} onFocus={() => handleRiskRewardUpdate('risk', data.riskAmount)} className={getFieldStyle('risk')} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Risk/Reward Ratio</label>
              <input type="number" min="0" step="0.1" value={data.riskRewardRatio} onChange={e => handleRiskRewardUpdate('ratio', Math.max(0, parseFloat(e.target.value) || 0))} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Profit Target ($)</label>
              <input type="number" min="0" value={data.profitAmount} onChange={e => handleRiskRewardUpdate('profit', Math.max(0, parseFloat(e.target.value) || 0))} onFocus={() => handleRiskRewardUpdate('profit', data.profitAmount)} className={getFieldStyle('profit')} />
            </div>
          </div>

          <div className="text-sm text-gray-400">
            <p>Tick Value: ${data.selectedInstrument.tickValue}</p>
            <p>Tick Size: {data.selectedInstrument.tickSize}</p>
            <p>Round-turn Fee: ${feePerContract.toFixed(2)}</p>
            <p>Risk per Contract: ${(data.selectedInstrument.tickValue * data.ticks + feePerContract).toFixed(2)} (including fees)</p>
          </div>
        </div>

        <div className="space-y-6 self-center">
          <motion.div layout className="bg-gray-900 rounded-lg p-4 space-y-4">
            <div className="text-center">
              <h3 className="text-sm text-gray-400">Recommended Contracts</h3>
              <p className="text-2xl font-bold text-blue-400">{contracts}</p>
            </div>
            <div className="text-center">
              <h3 className="text-sm text-gray-400">Profit Target Ticks</h3>
              <p className="text-2xl font-bold text-blue-400">{profitTargetTicks}</p>
            </div>
            <div className="text-center">
              <h3 className="text-sm text-gray-400">Total Risk (including fees)</h3>
              <p className="text-2xl font-bold text-green-400">${totalRisk.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <h3 className="text-sm text-gray-400">Total Profit (including fees)</h3>
              <p className="text-2xl font-bold text-green-400">
                ${(data.profitAmount - contracts * feePerContract).toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-sm text-gray-400">Total Fees</h3>
              <p className="text-2xl font-bold text-yellow-400">${totalFees.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <h3 className="text-sm text-gray-400">Risk/Reward Ratio</h3>
              <p className="text-2xl font-bold text-purple-400">1:{riskRewardRatio}</p>
            </div>
            
            {data.selectedExchange.type === 'direct' && <div className="text-center">
                <MarginInfo instrument={data.selectedInstrument} contracts={contracts} exchange={data.selectedExchange} />
              </div>}
          </motion.div>

          {savingsRecommendation && <div className="bg-gray-900 rounded-lg p-4">
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
            </div>}
        </div>
      </div>

      <AnimatePresence>
        {showSettingsModal && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} exit={{
          scale: 0.9
        }} className="bg-gray-800 rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4 text-white">Calculator Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">
                    Threshold Percentage (%)
                  </label>
                  <input type="number" min="0" max="100" value={tempThresholdPercentage} onChange={e => setTempThresholdPercentage(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => {
              setSettings({
                ...settings,
                thresholdPercentage: tempThresholdPercentage
              });
              setShowSettingsModal(false);
            }} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                  Save
                </button>
                <button onClick={() => setShowSettingsModal(false)} className="px-4 py-2 text-gray-400 hover:text-gray-300">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {showPresetsListModal && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} exit={{
          scale: 0.9
        }} className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Load Preset</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {presets.filter(p => p.instrumentId === 'universal' || p.instrumentId === data.selectedInstrument.id).map(preset => <div key={preset.id} className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-md">
                      <span>{preset.name} {preset.isDefault && '(Default)'}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => {
                  onUpdate(data.id, preset.settings);
                  setShowPresetsListModal(false);
                }} className="text-blue-400 hover:text-blue-300">
                          Load
                        </button>
                        <button onClick={() => {
                  onSetDefaultPreset(preset.id);
                }} className="text-yellow-400 hover:text-yellow-300">
                          {preset.isDefault ? 'Default' : 'Set Default'}
                        </button>
                        <button onClick={() => onDeletePreset(preset.id)} className="text-red-400 hover:text-red-300">
                          Delete
                        </button>
                      </div>
                    </div>)}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowPresetsListModal(false)} className="px-4 py-2 text-gray-400 hover:text-gray-300">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {showPresetModal && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} exit={{
          scale: 0.9
        }} className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Save Preset</h3>
              <input type="text" placeholder="Preset Name" value={newPresetName} onChange={e => setNewPresetName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 mb-4" />
              <label className="flex items-center gap-2 mb-4">
                <input type="checkbox" checked={isUniversalPreset} onChange={e => setIsUniversalPreset(e.target.checked)} className="rounded border-gray-600" />
                <span>Make Universal Preset</span>
              </label>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowPresetModal(false)} className="px-4 py-2 text-gray-400 hover:text-gray-300">
                  Cancel
                </button>
                <button onClick={() => {
              if (newPresetName) {
                onSavePreset(newPresetName, isUniversalPreset);
                setNewPresetName('');
                setIsUniversalPreset(false);
                setShowPresetModal(false);
              }
            }} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md">
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
};
export default RiskCalculator;