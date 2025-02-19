
import { Instrument } from '../../data/instruments';
import { Exchange } from '../../data/exchanges';

export interface CalculatorInstance {
  id: string;
  selectedInstrument: Instrument;
  ticks: number;
  points: number;
  riskAmount: number;
  profitAmount: number;
  riskRewardRatio: number;
  selectedExchange: Exchange;
  customFee: number;
}

export interface OptimalContract {
  contracts: number;
  ticksPerContract: number;
  totalRisk: number;
}

export const calculateOptimalContracts = (
  riskAmount: number,
  tickValue: number,
  fees: number
): OptimalContract[] => {
  const results: OptimalContract[] = [];
  for (let contracts = 1; contracts <= 20; contracts++) {
    const ticksPerContract = Math.floor((riskAmount - (contracts * fees)) / (contracts * tickValue));
    if (ticksPerContract > 0) {
      const totalRisk = (contracts * tickValue * ticksPerContract) + (contracts * fees);
      results.push({ contracts, ticksPerContract, totalRisk });
    }
  }
  return results;
};

export const calculateRiskReward = (
  riskAmount: number,
  profitAmount: number,
  riskRewardRatio: number,
  updateType: 'risk' | 'profit' | 'ratio'
) => {
  switch (updateType) {
    case 'risk':
      return {
        riskAmount,
        profitAmount: riskAmount / riskRewardRatio,
        riskRewardRatio
      };
    case 'profit':
      return {
        riskAmount,
        profitAmount,
        riskRewardRatio: riskAmount / profitAmount
      };
    case 'ratio':
      return {
        riskAmount,
        profitAmount: riskAmount / riskRewardRatio,
        riskRewardRatio
      };
    default:
      return { riskAmount, profitAmount, riskRewardRatio };
  }
};

export const getMicroSavingsRecommendation = (
  contracts: number,
  instrument: Instrument,
  feePerContract: number,
  instruments: Instrument[],
  exchangeId: string
) => {
  if (!instrument.regularVersion) return null;
  const regularInstrument = instruments.find(i => i.id === instrument.regularVersion);
  if (!regularInstrument) return null;

  const currentTotalFees = contracts * feePerContract;
  const regularContracts = Math.floor(contracts / 10);
  if (regularContracts < 1) return null;

  const regularFee = feePerContract;
  const regularFees = regularContracts * regularFee;
  const savings = currentTotalFees - regularFees;
  
  if (savings <= 0) return null;
  
  return {
    regularContracts,
    savings,
    instrument: regularInstrument
  };
};
