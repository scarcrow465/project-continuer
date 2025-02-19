
import { Instrument } from '../../data/instruments';
import { Exchange, exchangeGroups, exchangeFeeMap, getInstrumentFee as getExchangeInstrumentFee } from '../../data/exchanges';

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

export const calculateRiskReward = (
  riskAmount: number,
  profitAmount: number,
  riskRewardRatio: number,
  updateType: 'risk' | 'profit' | 'ratio'
): { riskAmount: number; profitAmount: number; riskRewardRatio: number } => {
  switch (updateType) {
    case 'risk':
      return {
        riskAmount,
        profitAmount: riskAmount * riskRewardRatio,
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
        profitAmount: riskAmount * riskRewardRatio,
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

  // Get the fee for the regular instrument
  const regularFee = getExchangeInstrumentFee(exchangeId, regularInstrument.id) || feePerContract;
  const regularFees = regularContracts * regularFee;
  const savings = currentTotalFees - regularFees;
  
  if (savings <= 0) return null;
  
  return {
    regularContracts,
    savings,
    instrument: regularInstrument
  };
};
