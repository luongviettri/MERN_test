import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import AnimationLoadingComponent from './AnimationLoadingComponent';
export default function LoadingComponent() {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress && (
      <div className="loading-component-css">
        <AnimationLoadingComponent />
      </div>
    )
  );
}
