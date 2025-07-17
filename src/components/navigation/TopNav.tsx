
import React from 'react';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import OnboardingRouter from '@/components/onboarding/OnboardingRouter';
import { useTopNavLogic } from '@/hooks/useTopNavLogic';
import DesktopNavLinks from './DesktopNavLinks';
import NavActions from './NavActions';
import MobileMenu from './MobileMenu';

const TopNav = () => {
  const {
    user,
    signOut,
    isAdmin,
    isCreator,
    isMobileMenuOpen,
    showOnboardingDialog,
    profileLoading,
    toggleMobileMenu,
    closeMobileMenu,
    handleBecomeCreatorClick,
    handleSignInClick,
    setShowOnboardingDialog
  } = useTopNavLogic();

  const isMobile = useIsMobile();

  return (
    <>
      <nav className="fixed top-0 w-full bg-ry-black shadow-md z-50 h-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full w-full relative">
            {/* Logo */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex-shrink-0">
              <a href="/" className="block">
                <img 
                  src="/lovable-uploads/23f0546f-a058-438f-a6f8-2cb6f7352d35.png" 
                  alt="Rendered Youth" 
                  className="h-16 sm:h-18 w-auto filter brightness-0 saturate-100"
                  style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(58%) saturate(586%) hue-rotate(359deg) brightness(102%) contrast(104%)' }}
                />
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <DesktopNavLinks 
              user={user}
              profileLoading={profileLoading}
              isCreator={isCreator}
              isAdmin={isAdmin}
            />

            {/* Right side buttons - Desktop */}
            <NavActions 
              user={user}
              profileLoading={profileLoading}
              isCreator={isCreator}
              signOut={signOut}
              handleBecomeCreatorClick={handleBecomeCreatorClick}
              handleSignInClick={handleSignInClick}
            />

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-ry-yellow hover:text-ry-white transition-colors p-2"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <MobileMenu 
            isMobileMenuOpen={isMobileMenuOpen}
            user={user}
            profileLoading={profileLoading}
            isCreator={isCreator}
            isAdmin={isAdmin}
            closeMobileMenu={closeMobileMenu}
            signOut={signOut}
            handleBecomeCreatorClick={handleBecomeCreatorClick}
            handleSignInClick={handleSignInClick}
          />
        </div>
      </nav>

      {/* Onboarding Dialog */}
      <Dialog open={showOnboardingDialog} onOpenChange={setShowOnboardingDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <OnboardingRouter />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TopNav;
