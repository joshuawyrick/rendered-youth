
import React, { useState } from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import DesignActionsDialog from '@/components/admin/DesignActionsDialog';
import AdminStats from '@/components/admin/AdminStats';
import DesignStatusCards from '@/components/admin/DesignStatusCards';
import AdminAccessControl from '@/components/admin/AdminAccessControl';
import AdminDashboardHeader from '@/components/admin/AdminDashboardHeader';

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

  const handleDesignClick = (design: Design) => {
    setSelectedDesign(design);
    setDialogOpen(true);
  };

  const handleDialogComplete = () => {
    // Trigger a refresh of the data
    setDialogOpen(false);
    setSelectedDesign(null);
  };

  return (
    <AdminAccessControl>
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        
        <div className="pt-16">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <AdminDashboardHeader />

            {/* Stats Section */}
            <div className="mb-12">
              <AdminStats />
            </div>

            {/* Design Management Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-ry-black mb-6">
                Design Management
              </h2>
              <DesignStatusCards onDesignClick={handleDesignClick} />
            </div>
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
