
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Search } from 'lucide-react';

interface NavActionsProps {
  user: any;
  profileLoading: boolean;
  isCreator: boolean;
  signOut: () => void;
  handleBecomeCreatorClick: () => void;
  handleSignInClick: () => void;
}

const NavActions: React.FC<NavActionsProps> = ({
  user,
  profileLoading,
  isCreator,
  signOut,
  handleBecomeCreatorClick,
  handleSignInClick
}) => {
  return (
    <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 flex-shrink-0">
      <Search className="h-5 w-5 text-ry-yellow hover:text-ry-white cursor-pointer transition-colors" />
      
      {user ? (
        <>
          {!profileLoading && isCreator && (
            <RYButton 
              variant="secondary" 
              size="sm"
              onClick={() => window.location.href = '/creator/upload'}
              className="text-xs xl:text-sm"
            >
              Upload Art
            </RYButton>
          )}
          <RYButton 
            variant="primary" 
            size="sm"
            onClick={signOut}
            className="text-xs xl:text-sm"
          >
            Sign Out
          </RYButton>
        </>
      ) : (
        <>
          <RYButton 
            variant="secondary" 
            size="sm"
            onClick={handleBecomeCreatorClick}
            className="text-xs xl:text-sm"
          >
            Become a Creator
          </RYButton>
          <RYButton 
            variant="primary" 
            size="sm"
            onClick={handleSignInClick}
            className="text-xs xl:text-sm"
          >
            Sign In
          </RYButton>
        </>
      )}
    </div>
  );
};

export default NavActions;
