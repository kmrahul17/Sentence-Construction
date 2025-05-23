import React from 'react';
import { X } from 'lucide-react';

interface HintPopupProps {
  hint: string;
  onClose: () => void;
}

export const HintPopup: React.FC<HintPopupProps> = ({ hint, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Hint</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-4">{hint}</p>
        <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};