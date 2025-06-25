
import React from 'react';

interface AuthToggleProps {
  isLogin: boolean;
  onToggle: () => void;
  loading: boolean;
}

export const AuthToggle: React.FC<AuthToggleProps> = ({ isLogin, onToggle, loading }) => {
  return (
    <div className="mt-6 text-center">
      <button
        type="button"
        onClick={onToggle}
        className="text-ry-yellow hover:text-ry-black transition-colors"
        disabled={loading}
      >
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
      </button>
    </div>
  );
};
