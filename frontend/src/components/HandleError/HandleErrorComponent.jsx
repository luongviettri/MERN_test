import React from 'react';

export default function HandleErrorComponent({ error, resetErrorBoundary }) {
  console.log('vo day');
  return (
    <div role="alert" >
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
