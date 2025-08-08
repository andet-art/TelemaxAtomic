// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import {
  ArrowRight, Sparkles, Play, Crown, ShoppingCart, Flame, Users, Star, Shield, Truck, PackageSearch
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import heroBackground from '@/assets/hero-background.jpg';

const sampleProducts = [
  {
    id: 1,
    name: 'Atomic Jet Lighter',
    description: 'Windproof Flame with Piercer',
    price: 190.0,
    image: '/assets/products/test.png'
  },
  {
    id: 2,
    name: 'Luxury Tobacco Grinder',
    description: 'Magnetic top, aluminum teeth',
    price: 240.0,
    image: '/assets/products/test.png'
  },
  {
    id: 3,
    name: 'Elegant Ashtray',
    description: 'Ceramic ashtray with metallic finish',
    price: 120.0,
    image: '/assets/products/test.png'
  }
];

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
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="relative py-32 bg-gradient-to-b from-background via-secondary/5 to-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-black text-center mb-16">
            Featured Products
          </h2>
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {sampleProducts.map((prod) => (
              <motion.div
                key={prod.id}
                className="glass-card border border-border/40 hover:border-primary/30 p-6 rounded-2xl shadow-lg group transition-all"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="aspect-video overflow-hidden rounded-xl mb-4">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1 text-foreground">{prod.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{prod.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary">{prod.price.toFixed(2)} ден</span>
                  <Button size="sm" className="luxury-gradient rounded-full px-4 py-1 text-sm">
                    <ShoppingCart className="w-4 h-4 mr-1" /> Add to Cart
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Experience Section */}
      <section className="py-32 bg-gradient-to-b from-background to-secondary/10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-black mb-12">
            The Telemax Experience
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              className="p-6 glass-card border border-border/30 rounded-2xl"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Shield className="w-10 h-10 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lifetime Warranty</h3>
              <p className="text-sm text-muted-foreground">
                Every product is built to last and backed by our lifetime guarantee.
              </p>
            </motion.div>

            <motion.div
              className="p-6 glass-card border border-border/30 rounded-2xl"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Truck className="w-10 h-10 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Worldwide Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Fast and reliable delivery to your doorstep, anywhere in the world.
              </p>
            </motion.div>

            <motion.div
              className="p-6 glass-card border border-border/30 rounded-2xl"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <PackageSearch className="w-10 h-10 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Hand-Checked Quality</h3>
              <p className="text-sm text-muted-foreground">
                Each piece is inspected by hand for flawless detail and function.
              </p>
            </motion.div>

            <motion.div
              className="p-6 glass-card border border-border/30 rounded-2xl"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Flame className="w-10 h-10 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Crafted with Passion</h3>
              <p className="text-sm text-muted-foreground">
                Built by artisans using premium materials and timeless techniques.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
