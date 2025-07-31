import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Flame, Sparkles, Shield, Truck, Award, Users, ChevronRight, Play, Zap, Gem, Crown, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';

// Import images
import heroBackground from '@/assets/hero-background.jpg';
import lightersCollection from '@/assets/lighters-collection.jpg';
import grindersCollection from '@/assets/grinders-collection.jpg';
import accessoriesCollection from '@/assets/accessories-collection.jpg';

const Index = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeProduct, setActiveProduct] = useState(0);

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

  const products = [
    {
      id: 1,
      name: 'Premium Lighters',
      description: 'Luxury flame that never fails you',
      image: lightersCollection,
      features: ['Windproof Design', 'Lifetime Warranty', 'Premium Materials']
    },
    {
      id: 2,
      name: 'Precision Grinders',
      description: 'Engineering perfection in every turn',
      image: grindersCollection,
      features: ['Sharp Teeth', 'Magnetic Closure', 'Multiple Chambers']
    },
    {
      id: 3,
      name: 'Elite Accessories',
      description: 'Complete your collection with style',
      image: accessoriesCollection,
      features: ['Premium Quality', 'Elegant Design', 'Professional Grade']
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Lifetime Warranty',
      description: 'Every product backed by our confidence in quality'
    },
    {
      icon: Truck,
      title: 'Lightning Fast Delivery',
      description: 'Express shipping worldwide with tracking'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Handpicked materials and craftsmanship'
    },
    {
      icon: Users,
      title: '24/7 Expert Support',
      description: 'Dedicated customer service team'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '99.9%', label: 'Satisfaction Rate' },
    { number: '1000+', label: 'Premium Products' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 flex items-center justify-center overflow-hidden">
        {/* Dynamic background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
            style={{ backgroundImage: `url(${heroBackground})` }}
          />
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/80" />
          
          {/* Floating gradient orbs */}
          <div 
            className="absolute w-96 h-96 luxury-gradient rounded-full blur-3xl opacity-20 animate-float"
            style={{
              left: `${20 + mousePosition.x * 0.1}%`,
              top: `${10 + mousePosition.y * 0.1}%`,
            }}
          />
          <div 
            className="absolute w-80 h-80 gold-gradient rounded-full blur-3xl opacity-15 animate-float-delayed"
            style={{
              right: `${15 + mousePosition.x * 0.05}%`,
              bottom: `${15 + mousePosition.y * 0.05}%`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 sm:space-y-12">
            {/* Main headline */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20">
                <Crown className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Premium Tobacco Accessories</span>
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight">
                <span className="block bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Luxury That
                </span>
                <span className="block bg-gradient-to-r from-primary via-amber-rich to-gold-shine bg-clip-text text-transparent animate-gradient-shift">
                  Ignites Passion
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Discover our exclusive collection of premium tobacco accessories. 
                Where craftsmanship meets innovation, and quality becomes an art form.
              </p>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="luxury-gradient hover:scale-105 shadow-luxury text-foreground font-bold px-8 py-6 text-lg rounded-2xl group"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="glass-card border-primary/30 hover:border-primary/50 px-8 py-6 text-lg rounded-2xl group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span>Watch Story</span>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-primary to-amber-rich bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm lg:text-base text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-20 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center space-y-6 mb-16 lg:mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20">
              <Gem className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Premium Collections</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black">
              <span className="block text-foreground">Crafted for the</span>
              <span className="block bg-gradient-to-r from-primary via-amber-rich to-gold-shine bg-clip-text text-transparent">
                Connoisseur
              </span>
            </h2>
            
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Each product in our collection represents the pinnacle of design and functionality, 
              carefully curated for those who demand excellence.
            </p>
          </div>

          {/* Product grid */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {products.map((product, index) => (
              <Card 
                key={product.id} 
                className="group glass-card border-border/50 hover:border-primary/30 transition-all duration-700 hover:shadow-luxury overflow-hidden"
                onMouseEnter={() => setActiveProduct(index)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  
                  {/* Floating badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 glass-card rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-primary fill-primary" />
                      <span className="text-xs font-semibold">Premium</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6 lg:p-8 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-foreground transition-all border-primary/30 group-hover:border-primary mt-6"
                  >
                    <span>Explore Range</span>
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 via-background to-secondary/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16 lg:mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Why Choose Telemax</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground">
              Excellence in Every Detail
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="text-center space-y-4 p-6 lg:p-8 rounded-3xl glass-card border border-border/50 hover:border-primary/30 transition-all duration-500 group hover:shadow-elegant"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl luxury-gradient flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                  <feature.icon className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Experience Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-background" />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 gold-gradient rounded-full blur-3xl opacity-10 animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 copper-gradient rounded-full blur-3xl opacity-10 animate-float-delayed" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20">
                  <Gift className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">Premium Experience</span>
                </div>
                
                <h2 className="text-3xl sm:text-5xl font-black">
                  <span className="block text-foreground">Unmatched Quality,</span>
                  <span className="block bg-gradient-to-r from-primary to-amber-rich bg-clip-text text-transparent">
                    Timeless Elegance
                  </span>
                </h2>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  At Telemax, we don't just sell tobacco accessories – we create experiences. 
                  Each piece is meticulously crafted using the finest materials and cutting-edge 
                  technology, ensuring that every moment with our products is extraordinary.
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  'Hand-selected premium materials',
                  'Artisan-level craftsmanship',
                  'Rigorous quality testing',
                  'Exclusive limited editions'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                size="lg" 
                className="luxury-gradient hover:scale-105 shadow-luxury text-foreground font-bold px-8 py-6 text-lg rounded-2xl group"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden glass-card border border-border/50 shadow-luxury">
                <img 
                  src={heroBackground} 
                  alt="Premium craftsmanship" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>
              
              {/* Floating stats */}
              <div className="absolute -top-6 -right-6 p-6 glass-card rounded-2xl border border-primary/20 shadow-gold">
                <div className="text-center space-y-1">
                  <div className="text-2xl font-black text-primary">25+</div>
                  <div className="text-xs text-muted-foreground font-medium">Years Excellence</div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 p-6 glass-card rounded-2xl border border-primary/20 shadow-gold">
                <div className="text-center space-y-1">
                  <div className="text-2xl font-black text-primary">100%</div>
                  <div className="text-xs text-muted-foreground font-medium">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-primary/5 to-background" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20">
                <Flame className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold">Join the Elite</span>
              </div>
              
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black">
                <span className="block text-foreground">Ready to Ignite</span>
                <span className="block bg-gradient-to-r from-primary via-amber-rich to-gold-shine bg-clip-text text-transparent">
                  Your Passion?
                </span>
              </h2>
              
              <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of satisfied customers who have elevated their experience 
                with our premium tobacco accessories.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Button 
                size="lg" 
                className="luxury-gradient hover:scale-105 shadow-luxury text-foreground font-bold px-10 py-6 text-lg rounded-2xl group"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="glass-card border-primary/30 hover:border-primary/50 px-10 py-6 text-lg rounded-2xl"
              >
                Contact Expert
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;