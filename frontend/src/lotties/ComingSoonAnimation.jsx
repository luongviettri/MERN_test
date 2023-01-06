import React from 'react';
import Lottie from 'react-lottie';
import animationData from './dinoLove.json';
export default function ComingSoonAnimation() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="temporaryMobileComponent">
      <h1 className="text-center">Mình đang tích cực build</h1>
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
}
