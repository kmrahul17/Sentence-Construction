import React, { useEffect, useState } from 'react';
import { Coins } from 'lucide-react';

interface CoinEffectProps {
  amount: number;
  onComplete: () => void;
}

export const CoinEffect: React.FC<CoinEffectProps> = ({ amount, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full animate-bounce shadow-lg">
      <Coins className="w-6 h-6 text-yellow-500" />
      <span className="text-yellow-700 font-bold">+{amount}</span>
    </div>
  );
};