
import React from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { GraduationCap, Trophy, TrendingUp, Users, BookOpen, Award } from 'lucide-react';

const TrainingProgram = () => {
  const milestones = [
    {
      level: "Beginner Entrepreneur",
      icon: <BookOpen className="h-8 w-8 text-ry-yellow" />,
      courses: ["Business Basics", "Art & Design Fundamentals", "Understanding Customers"],
      profitShare: "Base Rate",
      description: "Learn the foundations of entrepreneurship and creative business."
    },
    {
      level: "Rising Creator",
      icon: <TrendingUp className="h-8 w-8 text-ry-yellow" />,
      courses: ["Marketing Your Art", "Financial Literacy", "Building Your Brand"],
      profitShare: "Increased Share",
      description: "Develop advanced skills in marketing and business management."
    },
    {
      level: "Master Entrepreneur",
      icon: <Award className="h-8 w-8 text-ry-yellow" />,
      courses: ["Leadership Skills", "Advanced Business Strategy", "Mentoring Others"],
      profitShare: "Maximum Share",
      description: "Master entrepreneurial skills and help guide other young creators."
    }
  ];

  const features = [
    {
      icon: <GraduationCap className="h-12 w-12 text-ry-yellow" />,
      title: "Interactive Online Courses",
      description: "Age-appropriate lessons designed specifically for young entrepreneurs, covering everything from business basics to advanced strategy."
    },
    {
      icon: <Trophy className="h-12 w-12 text-ry-yellow" />,
      title: "Milestone-Based Rewards",
      description: "Complete courses and achieve milestones to unlock higher profit-sharing rates on your creative works."
    },
    {
      icon: <Users className="h-12 w-12 text-ry-yellow" />,
      title: "Peer Community",
      description: "Connect with other young entrepreneurs, share ideas, and learn from each other's experiences."
    }
  ];

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="bg-ry-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block bg-ry-yellow text-ry-black px-4 py-2 rounded-full text-sm font-medium mb-6">
              Coming Soon
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-ry-black mb-8">
              Young Entrepreneurs Area
              <span className="block text-ry-yellow mt-2">Future Founders</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              An innovative online learning platform designed to teach young creators the skills of entrepreneurship. 
              Complete courses, hit milestones, and increase your profit-sharing rate as you grow your business knowledge.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-ry-black text-center mb-12">
              Learn, Grow, Earn More
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <RYCard key={index} className="text-center p-8">
                  <div className="flex justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-ry-black mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </RYCard>
              ))}
            </div>
          </div>
        </section>

        {/* Milestone Levels Section */}
        <section className="bg-ry-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-ry-black text-center mb-12">
              Progress Through Entrepreneur Levels
            </h2>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <RYCard key={index} className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="text-center lg:text-left">
                      <div className="flex justify-center lg:justify-start items-center gap-4 mb-4">
                        {milestone.icon}
                        <h3 className="text-2xl font-bold text-ry-black">
                          {milestone.level}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {milestone.description}
                      </p>
                      <div className="inline-block bg-ry-yellow text-ry-black px-4 py-2 rounded-full text-sm font-medium">
                        Profit Share: {milestone.profitShare}
                      </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-semibold text-ry-black mb-4">Course Modules:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {milestone.courses.map((course, courseIndex) => (
                          <div key={courseIndex} className="bg-gray-50 px-4 py-3 rounded-lg text-center">
                            <span className="text-sm font-medium text-gray-700">{course}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </RYCard>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-ry-black mb-6">
                  Why This Program Matters
                </h2>
                <div className="space-y-4 text-lg text-gray-600">
                  <p>
                    Our Young Entrepreneurs Area: Future Founders goes beyond just creating art. We're building 
                    the next generation of business leaders, innovators, and creative entrepreneurs.
                  </p>
                  <p>
                    As young creators complete courses and demonstrate their growing business knowledge, 
                    they'll earn higher profit-sharing rates on their designs - rewarding learning with 
                    increased earning potential.
                  </p>
                  <p>
                    This program embodies our mission: to inspire children to become entrepreneurs, 
                    teach them along the way, and allow them to earn money from an early age.
                  </p>
                </div>
              </div>
              <div className="bg-ry-white rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-ry-black mb-4">
                  Coming Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  We're currently developing this exciting program. Sign up to be notified 
                  when enrollment opens!
                </p>
                <div className="space-y-3">
                  <a href="/age-verification" className="block bg-ry-yellow text-ry-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors">
                    Join the Waitlist
                  </a>
                  <a href="/how-it-works" className="block border-2 border-ry-yellow text-ry-yellow px-6 py-3 rounded-lg font-medium hover:bg-ry-yellow hover:text-ry-black transition-colors">
                    Learn How It Works
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default TrainingProgram;
