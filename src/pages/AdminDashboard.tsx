
import React, { useState, useRef } from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import DesignActionsDialog from '@/components/admin/DesignActionsDialog';
import AdminStats from '@/components/admin/AdminStats';
import DesignStatusCards from '@/components/admin/DesignStatusCards';
import AdminAccessControl from '@/components/admin/AdminAccessControl';
import AdminDashboardHeader from '@/components/admin/AdminDashboardHeader';
import CollectionManager from '@/components/admin/CollectionManager';
import DesignCollectionAssigner from '@/components/admin/DesignCollectionAssigner';
import ProductManager from '@/components/admin/ProductManager';

interface Design {
  id: string;
  title: string;
  file_url: string;
  status: string;
  created_at: string;
  user_id: string;
}

const AdminDashboard = () => {
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'collections' | 'assign'>('overview');
  const designSectionRef = useRef<HTMLDivElement>(null);

  const handleDesignClick = (design: Design) => {
    setSelectedDesign(design);
    setDialogOpen(true);
  };

  const handleDialogComplete = () => {
    // Trigger a refresh of the data
    setDialogOpen(false);
    setSelectedDesign(null);
  };

  const handleStatusClick = (status: string) => {
    // Switch to overview tab and scroll to designs
    setActiveTab('overview');
    
    // Scroll to the design management section first
    if (designSectionRef.current) {
      designSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Then scroll to the specific status section after a short delay
      setTimeout(() => {
        const statusElement = document.getElementById(`status-${status}`);
        if (statusElement) {
          statusElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 300);
    }
  };

  return (
    <AdminAccessControl>
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        
        <div className="pt-16">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <AdminDashboardHeader />

            {/* Navigation Tabs */}
            <div className="mb-8">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-ry-yellow text-ry-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'products'
                      ? 'border-ry-yellow text-ry-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Products
                </button>
                <button
                  onClick={() => setActiveTab('collections')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'collections'
                      ? 'border-ry-yellow text-ry-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Collections
                </button>
                <button
                  onClick={() => setActiveTab('assign')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'assign'
                      ? 'border-ry-yellow text-ry-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Assign to Collections
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <>
                {/* Stats Section */}
                <div className="mb-12">
                  <AdminStats onStatusClick={handleStatusClick} />
                </div>

                {/* Design Management Section */}
                <div className="mb-12" ref={designSectionRef}>
                  <h2 className="text-2xl font-semibold text-ry-black mb-6">
                    Design Management
                  </h2>
                  <DesignStatusCards onDesignClick={handleDesignClick} />
                </div>
              </>
            )}

            {activeTab === 'products' && (
              <ProductManager />
            )}

            {activeTab === 'collections' && (
              <CollectionManager />
            )}

            {activeTab === 'assign' && (
              <DesignCollectionAssigner />
            )}
          </main>
        </div>

        <DesignActionsDialog
          design={selectedDesign}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onComplete={handleDialogComplete}
        />

        <Footer />
      </div>
    </AdminAccessControl>
  );
};

export default AdminDashboard;
