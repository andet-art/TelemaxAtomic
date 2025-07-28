import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About TelemaxAtomic
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Revolutionizing the way you connect, communicate, and collaborate in the digital age
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Our Story Section */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-4">
                Founded in 2024, TelemaxAtomic emerged from a simple yet powerful vision: 
                to create seamless digital experiences that bring people together across 
                distances and differences.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                What started as a small team of passionate developers has grown into a 
                comprehensive platform that serves thousands of users worldwide, providing 
                innovative solutions for modern communication challenges.
              </p>
              <p className="text-lg text-gray-600">
                Today, we continue to push the boundaries of what's possible in digital 
                connectivity, always with our users' needs at the heart of everything we do.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">10K+</div>
                <div className="text-gray-600 mb-6">Active Users</div>
                
                <div className="text-4xl font-bold text-indigo-600 mb-2">99.9%</div>
                <div className="text-gray-600 mb-6">Uptime</div>
                
                <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Vision</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're driven by the belief that technology should enhance human connection, not replace it.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To empower individuals and organizations with cutting-edge communication 
                  tools that break down barriers and foster meaningful connections in an 
                  increasingly digital world.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To become the world's most trusted platform for digital communication, 
                  where every interaction is secure, seamless, and enriching for all participants.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Security First</h3>
              <p className="text-gray-600">
                Your privacy and data security are our top priorities. We implement 
                industry-leading encryption and security measures.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We continuously push the boundaries of technology to deliver 
                cutting-edge solutions that exceed expectations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">User-Centric</h3>
              <p className="text-gray-600">
                Every decision we make is guided by our users' needs and feedback. 
                Your success is our success.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">
              The passionate individuals behind TelemaxAtomic
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-blue-400 to-blue-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah Johnson</h3>
                <p className="text-indigo-600 mb-3">CEO & Founder</p>
                <p className="text-gray-600">
                  With over 15 years in tech leadership, Sarah brings vision and 
                  strategic thinking to drive TelemaxAtomic forward.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-green-400 to-green-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Michael Chen</h3>
                <p className="text-indigo-600 mb-3">CTO</p>
                <p className="text-gray-600">
                  A brilliant engineer and architect, Michael ensures our platform 
                  remains scalable, secure, and innovative.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-purple-400 to-purple-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Emily Rodriguez</h3>
                <p className="text-indigo-600 mb-3">Head of Design</p>
                <p className="text-gray-600">
                  Emily crafts beautiful, intuitive experiences that make complex 
                  technology accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white text-center py-16 px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust TelemaxAtomic for their communication needs.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
              Get Started Today
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-200">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;