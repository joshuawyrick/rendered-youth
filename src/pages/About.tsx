
import React from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';

const About = () => {
  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      bio: "Former art teacher with 15 years of experience. Passionate about empowering young artists.",
      avatar: "👩‍🎨"
    },
    {
      name: "Mike Chen",
      role: "CTO",
      bio: "Software engineer and father of two. Believes technology should amplify creativity.",
      avatar: "👨‍💻"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Community",
      bio: "Youth mentor and advocate. Dedicated to creating safe spaces for young creators.",
      avatar: "👩‍🏫"
    }
  ];

  const stats = [
    { label: "Young Artists", value: "2,500+" },
    { label: "Designs Created", value: "12,000+" },
    { label: "T-Shirts Sold", value: "45,000+" },
    { label: "Money Earned by Kids", value: "$125,000+" }
  ];

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-16">
        {/* Hero Section */}
        <section className="bg-ry-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-ry-black mb-8">
                Empowering Young Artists
              </h1>
              <p className="text-xl text-gray-600 mb-12">
                Rendered Youth was born from a simple belief: every child's creativity deserves 
                to be celebrated, shared, and rewarded. We're building a platform where young 
                artists can turn their imagination into real income.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-ry-black mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  We believe that every child is an artist. Our mission is to provide a platform 
                  where young creators can showcase their work, earn money from their art, and 
                  build confidence in their creative abilities.
                </p>
                <p className="text-lg text-gray-600">
                  By turning children's drawings into wearable art, we're not just creating products 
                  – we're fostering entrepreneurship, creativity, and self-expression in the next generation.
                </p>
              </div>
              <div className="bg-ry-white rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-ry-black mb-2">
                  Supporting Young Entrepreneurs
                </h3>
                <p className="text-gray-600">
                  70% of every sale goes directly to the young artist who created the design.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-ry-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-ry-black text-center mb-12">
              Our Impact
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-ry-yellow mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-ry-black text-center mb-12">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <RYCard key={index} className="text-center">
                  <div className="text-6xl mb-4">{member.avatar}</div>
                  <h3 className="text-xl font-semibold text-ry-black mb-2">
                    {member.name}
                  </h3>
                  <p className="text-ry-yellow font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600">
                    {member.bio}
                  </p>
                </RYCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-ry-black py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-ry-white mb-8">
              Join Our Community
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Whether you're a young artist, a parent, or someone who believes in supporting 
              creativity, we'd love to have you be part of our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/auth/sign-up" className="bg-ry-yellow text-ry-black px-8 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors">
                Get Started
              </a>
              <a href="/creators" className="border-2 border-ry-yellow text-ry-yellow px-8 py-3 rounded-lg font-medium hover:bg-ry-yellow hover:text-ry-black transition-colors">
                Browse Creators
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
