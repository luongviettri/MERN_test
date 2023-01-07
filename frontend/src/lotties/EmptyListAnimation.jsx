import React from 'react';
import Lottie from 'react-lottie';
import animationData from './emptyList.json';
export default function EmptyListAnimation() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="py-5">
      <h2 className="text-center">Rất tiếc, danh mục này chưa có sản phẩm</h2>
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
}
