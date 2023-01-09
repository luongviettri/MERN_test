import React from 'react';
import { InfinitySpin } from 'react-loader-spinner';
export default function AnimationLoadingComponent() {
  return (
    <div className="loading-component-css">
      <InfinitySpin width="200" color="#4fa94d" />
    </div>
  );
}
