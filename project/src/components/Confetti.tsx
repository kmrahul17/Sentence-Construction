import React from 'react';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export const Confetti = () => {
  const { width, height } = useWindowSize();

  return (
    <ReactConfetti
      width={width}
      height={height}
      numberOfPieces={200}
      recycle={false}
      run={true}
      gravity={0.3}
      colors={['#60A5FA', '#34D399', '#FBBF24', '#F87171']}
    />
  );
};