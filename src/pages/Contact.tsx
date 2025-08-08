// src/pages/Contact.tsx
import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Smile,
} from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-pink-500/10 to-background" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-5xl mx-auto px-4 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-medium tracking-wide">We’d love to hear from you</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight bg-gradient-to-r from-primary via-amber-400 to-pink-500 bg-clip-text text-transparent animate-gradient-shift">
            Get in Touch with Telemax
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Whether you’re a customer, fan, or just curious — let’s talk.
          </p>
        </motion.div>
      </section>

      {/* Form + Info Section */}
      <section className="relative z-10 pb-28">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Contact Details</h2>
              <p className="text-muted-foreground text-sm">
                Reach us through any of the following or fill out the form.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary" /> Skopje, North Macedonia</li>
                <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-primary" /> +389 70 123 456</li>
                <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-primary" /> contact@telemax.com</li>
                <li className="flex items-center gap-3"><Clock className="w-4 h-4 text-primary" /> Mon - Fri, 9AM - 6PM</li>
              </ul>
            </div>
            <div className="flex gap-4 pt-4">
              {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn].map((Icon, idx) => (
                <a key={idx} href="#" className="p-3 rounded-full bg-muted hover:bg-primary hover:text-white transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 rounded-2xl space-y-6 shadow-xl backdrop-blur-lg border border-border/30"
          >
            <h2 className="text-2xl font-semibold">Send Us a Message</h2>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background/70 focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background/70 focus:ring-2 focus:ring-primary"
            />
            <textarea
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              className="w-full px-4 py-3 rounded-lg border border-border bg-background/70 focus:ring-2 focus:ring-primary"
            />
            <Button
              type="submit"
              className="w-full luxury-gradient text-lg font-bold py-3 hover:scale-105 transition-transform group"
            >
              Send Message <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            {submitted && (
              <div className="text-green-500 text-sm font-medium mt-2 flex items-center gap-2">
                <Smile className="w-4 h-4" /> Message sent successfully!
              </div>
            )}
          </motion.form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
