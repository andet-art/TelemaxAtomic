// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import {
  ArrowRight, Star, Flame, Sparkles, Shield, Truck, Award, Users, ChevronRight,
  Play, Zap, Gem, Crown, Gift
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import heroBackground from '@/assets/hero-background.jpg';
import lightersCollection from '@/assets/lighters-collection.jpg';
import grindersCollection from '@/assets/grinders-collection.jpg';
import accessoriesCollection from '@/assets/accessories-collection.jpg';

const Index = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '99.9%', label: 'Satisfaction Rate' },
    { number: '1000+', label: 'Premium Products' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-24 flex items-center justify-center">
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroBackground})` }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-black/40 to-background" />

          {/* Floating gradients */}
          <motion.div
            className="absolute w-96 h-96 rounded-full luxury-gradient blur-3xl opacity-30 animate-float"
            style={{ left: `${20 + mousePosition.x * 0.1}%`, top: `${10 + mousePosition.y * 0.1}%` }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full gold-gradient blur-3xl opacity-20 animate-float-delayed"
            style={{ right: `${15 + mousePosition.x * 0.05}%`, bottom: `${15 + mousePosition.y * 0.05}%` }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <motion.div
          className="relative z-10 text-center max-w-5xl mx-auto px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20 animate-bounce">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Premium Tobacco Accessories</span>
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </motion.div>

          <h1 className="mt-8 text-5xl sm:text-7xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-gold-shine to-amber-rich animate-gradient-shift">
            Ignite Your Lifestyle
          </h1>
          <motion.p
            className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Discover timeless luxury with our hand-crafted accessories
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <Button size="lg" className="luxury-gradient shadow-xl hover:scale-105">
              Explore Collection <ArrowRight className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="glass-card border-primary/40">
              <Play className="mr-2" /> Watch Story
            </Button>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-3xl font-black bg-gradient-to-r from-primary to-gold-shine bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Extended Scroll Section */}
      <section className="relative py-32 bg-gradient-to-b from-background via-secondary/5 to-background">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl sm:text-6xl font-black mb-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Uncover More
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            Scroll deeper into our world of premium lifestyle. From timeless elegance to cutting-edge design,
            explore the future of luxury tobacco accessories.
          </motion.p>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="glass-card p-6 rounded-2xl border border-border/40 hover:border-primary/30 transition-all shadow-lg"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <h3 className="text-xl font-bold text-foreground mb-2">Exclusive Insight {i}</h3>
                <p className="text-muted-foreground text-sm">
                  A glimpse into innovation, elegance, and masterful craftsmanship. You won't find this anywhere else.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
