import React from 'react';
import StatusBar from '../shared/StatusBar';

interface PlaceholderPageProps {
  onBack: () => void;
  onMenuClick: () => void;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ onBack }) => {
  return (
    <div className="relative bg-white min-h-screen w-full max-w-[412px] mx-auto">
      <StatusBar />
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h1>
        <p className="text-gray-500 mb-8">This page is under construction.</p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PlaceholderPage;
