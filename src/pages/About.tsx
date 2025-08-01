import React from 'react';
import { Sparkles, Crown, Flame, Shield, Zap, Users, Award, Truck, Play, ArrowRight, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-24 flex items-center justify-center overflow-hidden text-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-background" />
        <div className="z-10 space-y-8 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Who We Are</span>
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
            Designed for the Future
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-muted-foreground">
            At TelemaxAtomic, we're reshaping connectivity. We believe technology should bring people closer, not further apart.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="luxury-gradient px-8 py-6 text-lg rounded-2xl font-bold">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="glass-card border-primary/30 px-8 py-6 text-lg rounded-2xl">
              <Play className="w-5 h-5 mr-2" />
              <span>Watch Our Vision</span>
            </Button>
          </div>
        </div>
      </section>

      {/* About Sections */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">

        {/* Our Story */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="text-lg text-muted-foreground">
              TelemaxAtomic was born in 2024 with a simple vision—to redefine how people interact in the digital world. From a small team of dreamers, we've evolved into a cutting-edge platform trusted by thousands.
            </p>
            <p className="text-lg text-muted-foreground">
              We fuse art and engineering to deliver stunning digital tools that empower, connect, and inspire.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              ['10K+', 'Active Users'],
              ['99.9%', 'Uptime'],
              ['24/7', 'Support'],
              ['Global', 'Reach']
            ].map(([stat, label], i) => (
              <div key={i} className="text-center p-6 glass-card rounded-2xl border border-border/30">
                <div className="text-3xl font-bold text-primary">{stat}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="text-center space-y-20">
          <h2 className="text-3xl font-bold">Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-10 glass-card border border-border/30 rounded-2xl text-center space-y-6">
              <Shield className="w-10 h-10 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Our Mission</h3>
              <p className="text-muted-foreground">
                Empowering people through intuitive, powerful, and secure digital tools that enhance collaboration and foster meaningful connections.
              </p>
            </div>
            <div className="p-10 glass-card border border-border/30 rounded-2xl text-center space-y-6">
              <Zap className="w-10 h-10 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Our Vision</h3>
              <p className="text-muted-foreground">
                To become the most trusted global platform for communication, built on principles of elegance, accessibility, and performance.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="text-center space-y-20">
          <h2 className="text-3xl font-bold">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Flame, title: 'Innovation', desc: 'Constantly pushing boundaries to stay ahead of the curve.' },
              { icon: Users, title: 'Human-Centric', desc: 'Putting people at the center of every experience we design.' },
              { icon: Award, title: 'Excellence', desc: 'Uncompromising commitment to quality in everything we do.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="p-8 glass-card border border-border/30 rounded-2xl text-center space-y-4">
                <Icon className="w-10 h-10 text-primary mx-auto" />
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="text-center space-y-20">
          <h2 className="text-3xl font-bold">Meet Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The dedicated minds crafting your digital experience.
          </p>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              ['Sarah Johnson', 'CEO & Founder'],
              ['Michael Chen', 'CTO'],
              ['Emily Rodriguez', 'Head of Design']
            ].map(([name, role], i) => (
              <div key={i} className="rounded-2xl overflow-hidden glass-card border border-border/30 text-left">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20" />
                <div className="p-6">
                  <h3 className="text-xl font-bold">{name}</h3>
                  <p className="text-primary mb-2">{role}</p>
                  <p className="text-muted-foreground text-sm">
                    Passionate, visionary, and dedicated to creating excellence.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-24 space-y-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20">
            <Gift className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold">Join Telemax</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black">
            Become Part of the Future
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Discover how TelemaxAtomic can empower your journey. We’re here to make your digital life more seamless and beautiful.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="luxury-gradient text-foreground font-bold px-10 py-6 text-lg rounded-2xl">
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" className="glass-card border-primary/30 px-10 py-6 text-lg rounded-2xl">
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
