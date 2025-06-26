
import React, { useState } from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { GraduationCap, Trophy, TrendingUp, Users, BookOpen, Award, ChevronDown, Lightbulb, Building, Palette, Megaphone, BarChart, Settings } from 'lucide-react';

const TrainingProgram = () => {
  const [openLevels, setOpenLevels] = useState<{ [key: string]: boolean }>({});

  const toggleLevel = (levelId: string) => {
    setOpenLevels(prev => ({
      ...prev,
      [levelId]: !prev[levelId]
    }));
  };

  const curriculumLevels = [
    {
      id: "level1",
      level: "Level 1: Idea Explorer",
      icon: <Lightbulb className="h-8 w-8 text-ry-yellow" />,
      profitShare: "Base Rate",
      description: "Discover your spark and learn to identify opportunities.",
      modules: [
        {
          title: "1.1 Discover Your Spark",
          subModules: [
            "Identifying your passions & strengths",
            "Turning hobbies into product ideas",
            "Setting your first mini-goals"
          ]
        },
        {
          title: "1.2 Creative Thinking Tools",
          subModules: [
            "Brainstorming & mind-mapping",
            "SCAMPER (Substitute, Combine…)",
            "Idea journaling & sketching"
          ]
        },
        {
          title: "1.3 Know Your Customer",
          subModules: [
            "Who's going to buy? (age, interests)",
            "Empathy mapping (their wants & pain points)",
            "Simple \"friends & family\" surveys"
          ]
        },
        {
          title: "1.4 Test Your Concept",
          subModules: [
            "Making a quick paper or digital mock-up",
            "Getting feedback and iterating",
            "Deciding \"go/no-go\" on your idea"
          ]
        }
      ]
    },
    {
      id: "level2",
      level: "Level 2: Business Fundamentals",
      icon: <Building className="h-8 w-8 text-ry-yellow" />,
      profitShare: "Increased Share",
      description: "Learn the core concepts of what makes a business work.",
      modules: [
        {
          title: "2.1 What Is a Business?",
          subModules: [
            "Definitions: entrepreneur, profit, risk",
            "Traits of successful kid CEOs",
            "Growth-mindset basics"
          ]
        },
        {
          title: "2.2 Business Models & Plans",
          subModules: [
            "Product vs. service vs. hybrid models",
            "Your first one-page business plan",
            "SMART goals (Specific, Measurable…)"
          ]
        },
        {
          title: "2.3 Legal Setup & Structure",
          subModules: [
            "Sole proprietorship vs. LLC explained",
            "How to register your business name",
            "Intro to permits, EINs and basic compliance"
          ]
        },
        {
          title: "2.4 Money Management & Budgeting",
          subModules: [
            "Opening a kid-friendly business bank account",
            "Income vs. expenses: the simple ledger",
            "Planning a basic budget & break-even point"
          ]
        }
      ]
    },
    {
      id: "level3",
      level: "Level 3: Design & Product Development",
      icon: <Palette className="h-8 w-8 text-ry-yellow" />,
      profitShare: "Higher Share",
      description: "Create amazing products that customers will love.",
      modules: [
        {
          title: "3.1 Fundamentals of Graphic Design",
          subModules: [
            "Basic design principles (color, balance)",
            "Free tools: Canva, simplified Adobe apps",
            "Creating your first shirt mock-up"
          ]
        },
        {
          title: "3.2 Sourcing & Production",
          subModules: [
            "Print-on-demand vs. small-batch printing",
            "Comparing cost, quality & turnaround",
            "Ordering and reviewing samples"
          ]
        },
        {
          title: "3.3 Pricing & Profit Margins",
          subModules: [
            "Calculating cost of goods sold (COGS)",
            "Setting a profitable price point",
            "Intro to discounts, bundles & value offers"
          ]
        },
        {
          title: "3.4 Building Your Online Store",
          subModules: [
            "Platform choices (built-in marketplace vs. standalone)",
            "Writing clear product titles & descriptions",
            "Setting up shipping options & policies"
          ]
        }
      ]
    },
    {
      id: "level4",
      level: "Level 4: Branding & Marketing Basics",
      icon: <Megaphone className="h-8 w-8 text-ry-yellow" />,
      profitShare: "Premium Share",
      description: "Build your brand and attract customers through marketing.",
      modules: [
        {
          title: "4.1 Brand Identity",
          subModules: [
            "Choosing a memorable name & logo",
            "Crafting your brand \"voice\"",
            "Simple brand guidelines (colors, fonts)"
          ]
        },
        {
          title: "4.2 Content Creation",
          subModules: [
            "Basic product photography (phone + good light)",
            "Writing engaging product stories",
            "Intro to short-form video (TikTok/Reels)"
          ]
        },
        {
          title: "4.3 Social Media Starter",
          subModules: [
            "Which platforms fit your audience",
            "Planning your first 4-week content calendar",
            "Hashtags, captions & timing best practices"
          ]
        },
        {
          title: "4.4 Community Engagement",
          subModules: [
            "Inviting reviews & user-generated content",
            "Starting a Facebook/Discord \"fan club\"",
            "Partnering with classmates & local friends"
          ]
        }
      ]
    },
    {
      id: "level5",
      level: "Level 5: Sales Growth & Optimization",
      icon: <BarChart className="h-8 w-8 text-ry-yellow" />,
      profitShare: "Advanced Share",
      description: "Scale your business and optimize for maximum growth.",
      modules: [
        {
          title: "5.1 Data & Analytics 101",
          subModules: [
            "Tracking orders, revenue & refunds",
            "Simple metrics: conversion rate & avg. order value",
            "Using built-in dashboard reports"
          ]
        },
        {
          title: "5.2 Intro to Paid Ads",
          subModules: [
            "Basics of social media ads (budget, targeting)",
            "Designing your first ad creative",
            "Measuring ad performance"
          ]
        },
        {
          title: "5.3 Email Marketing Essentials",
          subModules: [
            "Building a subscriber list (pop-ups, signup freebies)",
            "Writing your first newsletter",
            "Setting up an automated \"welcome\" email"
          ]
        },
        {
          title: "5.4 Promotions & Partnerships",
          subModules: [
            "Planning discount codes & limited-time offers",
            "Running giveaways & contests",
            "Collaborating with other young creators"
          ]
        }
      ]
    },
    {
      id: "level6",
      level: "Level 6: Operations & Scaling",
      icon: <Settings className="h-8 w-8 text-ry-yellow" />,
      profitShare: "Maximum Share",
      description: "Master entrepreneurial operations and plan for the future.",
      modules: [
        {
          title: "6.1 Bookkeeping & Taxes",
          subModules: [
            "Recording all sales & costs every week",
            "Sales tax basics & filing online",
            "When and how to talk to an accountant"
          ]
        },
        {
          title: "6.2 Customer Service Excellence",
          subModules: [
            "Responding to questions & complaints",
            "Writing friendly return/refund policies",
            "Turning a \"problem\" into a happy fan"
          ]
        },
        {
          title: "6.3 Outsourcing & Team Building",
          subModules: [
            "When to ask for help (family, classmates)",
            "Finding safe, age-appropriate freelancers",
            "Simple task checklists & handoffs"
          ]
        },
        {
          title: "6.4 Vision & Long-Term Planning",
          subModules: [
            "Reinvesting profits for growth",
            "Setting 6- and 12-month milestones",
            "Dreaming up your next product line"
          ]
        }
      ]
    }
  ];

  const features = [
    {
      icon: <GraduationCap className="h-12 w-12 text-ry-yellow" />,
      title: "Interactive Online Courses",
      description: "Age-appropriate lessons designed specifically for young entrepreneurs, covering everything from idea generation to scaling a business."
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
              A comprehensive online learning platform designed to teach young creators the complete journey of entrepreneurship. 
              Complete courses, hit milestones, and increase your profit-sharing rate as you master each level.
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

        {/* Curriculum Levels Section */}
        <section className="bg-ry-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-ry-black text-center mb-12">
              Complete Entrepreneur Curriculum
            </h2>
            <div className="space-y-6">
              {curriculumLevels.map((level) => (
                <RYCard key={level.id} className="overflow-hidden">
                  <Collapsible
                    open={openLevels[level.id]}
                    onOpenChange={() => toggleLevel(level.id)}
                  >
                    <CollapsibleTrigger className="w-full p-6 text-left hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {level.icon}
                          <div>
                            <h3 className="text-xl font-bold text-ry-black mb-2">
                              {level.level}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {level.description}
                            </p>
                            <div className="inline-block bg-ry-yellow text-ry-black px-3 py-1 rounded-full text-sm font-medium">
                              Profit Share: {level.profitShare}
                            </div>
                          </div>
                        </div>
                        <ChevronDown 
                          className={`h-6 w-6 text-gray-400 transition-transform duration-200 ${
                            openLevels[level.id] ? 'transform rotate-180' : ''
                          }`}
                        />
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="px-6 pb-6 border-t border-gray-200">
                        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {level.modules.map((module, moduleIndex) => (
                            <div key={moduleIndex} className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-ry-black mb-3">
                                {module.title}
                              </h4>
                              <ul className="space-y-2">
                                {module.subModules.map((subModule, subIndex) => (
                                  <li key={subIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-ry-yellow rounded-full mt-2 flex-shrink-0"></span>
                                    {subModule}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
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
                    the next generation of business leaders, innovators, and creative entrepreneurs through a 
                    comprehensive 6-level curriculum.
                  </p>
                  <p>
                    As young creators progress through each level—from Idea Explorer to Operations & Scaling—they'll 
                    earn higher profit-sharing rates on their designs, rewarding learning with increased earning potential.
                  </p>
                  <p>
                    This program embodies our mission: to inspire children to become entrepreneurs, 
                    teach them real business skills along the way, and allow them to earn money from an early age 
                    while building a foundation for lifelong success.
                  </p>
                </div>
              </div>
              <div className="bg-ry-white rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-ry-black mb-4">
                  Coming Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  We're currently developing this comprehensive curriculum. Sign up to be notified 
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
