
import React from 'react';
import { Instrument } from '../../data/instruments';
import { Exchange } from '../../data/exchanges';

interface MarginInfoProps {
  instrument: Instrument;
  contracts: number;
  exchange: Exchange;
}

export const MarginInfo: React.FC<MarginInfoProps> = ({ instrument, contracts, exchange }) => {
  if (exchange.type === 'prop') return null;
  
  const totalMaintenanceMargin = contracts * (instrument.marginPerContract || 0);
  const totalDayMargin = contracts * (instrument.dayMarginPerContract || 0);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm text-gray-400">Maintenance Margin</h3>
        <p className="text-2xl font-bold text-orange-400">
          ${totalMaintenanceMargin.toLocaleString()}
        </p>
      </div>
      <div>
        <h3 className="text-sm text-gray-400">Day Trading Margin</h3>
        <p className="text-2xl font-bold text-orange-400">
          ${totalDayMargin.toLocaleString()}
        </p>
      </div>
    </div>
  );
};
