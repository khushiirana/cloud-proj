import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600"></div>
    </div>
  );
};

export default LoadingSpinner;