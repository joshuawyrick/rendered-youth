
import React from 'react';

export const PasswordRequirements = () => {
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
      <p className="text-sm text-blue-800">
        <strong>Password Requirements:</strong><br />
        • At least 8 characters long<br />
        • Include uppercase and lowercase letters<br />
        • Include at least one number<br />
        • Include at least one special character
      </p>
    </div>
  );
};
