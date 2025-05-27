
import React, { useState } from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { StateSelect } from '@/components/ui/state-select';
import { Upload, User, ExternalLink } from 'lucide-react';

const CreatorProfile = () => {
  const [formData, setFormData] = useState({
    displayName: 'Emma Rodriguez',
    username: 'emma-r',
    ageBracket: '8-10',
    state: 'CA',
    bio: 'I love drawing dragons and magical creatures!',
    instagram: '',
    tiktok: ''
  });

  const ageBrackets = [
    { value: '4-7', label: 'Ages 4-7' },
    { value: '8-10', label: 'Ages 8-10' },
    { value: '11-13', label: 'Ages 11-13' },
    { value: '14-17', label: 'Ages 14-17' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving profile:', formData);
    // Here would be the actual save logic
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-16">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-ry-black mb-6">
              My Profile
            </h1>
            <p className="text-xl text-gray-600">
              Tell the world about yourself and your art!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Upload */}
            <RYCard className="p-6">
              <label className="block text-lg font-semibold text-ry-black mb-4">
                Profile Picture
              </label>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-ry-yellow">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <RYButton type="button" variant="secondary" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </RYButton>
                  <p className="text-sm text-gray-600 mt-2">
                    JPG or PNG, max 5MB
                  </p>
                </div>
              </div>
            </RYCard>

            {/* Basic Info */}
            <RYCard className="p-6">
              <h2 className="text-xl font-semibold text-ry-black mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-ry-black mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ry-black mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ry-black mb-2">
                    Age Bracket *
                  </label>
                  <select
                    value={formData.ageBracket}
                    onChange={(e) => setFormData({...formData, ageBracket: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
                    required
                  >
                    {ageBrackets.map(bracket => (
                      <option key={bracket.value} value={bracket.value}>
                        {bracket.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ry-black mb-2">
                    State
                  </label>
                  <StateSelect
                    selected={formData.state}
                    onChange={(value) => setFormData({...formData, state: value || ''})}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-ry-black mb-2">
                  Bio (280 characters)
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  maxLength={280}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent resize-none"
                  placeholder="Tell everyone about yourself and your art..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.bio.length}/280 characters
                </p>
              </div>
            </RYCard>

            {/* Social Links */}
            <RYCard className="p-6">
              <h2 className="text-xl font-semibold text-ry-black mb-6">Social Links</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ry-black mb-2">
                    Instagram
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
                      placeholder="username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ry-black mb-2">
                    TikTok
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      value={formData.tiktok}
                      onChange={(e) => setFormData({...formData, tiktok: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>
            </RYCard>

            {/* Stripe Connect */}
            <RYCard className="p-6 bg-yellow-50 border-ry-yellow">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">💳</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-ry-black mb-2">
                    Payment Setup Required
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Connect your Stripe account to receive payments for your designs automatically.
                  </p>
                  <RYButton variant="primary" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect Stripe Account
                  </RYButton>
                </div>
              </div>
            </RYCard>

            {/* Submit Button */}
            <div className="text-center">
              <RYButton type="submit" variant="primary" size="lg">
                Save Profile
              </RYButton>
            </div>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CreatorProfile;
