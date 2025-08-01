import React, { useState } from 'react';
import { ArrowRight, Sparkles, Mail, Phone, MapPin, Clock, Users, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    referral: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim() || formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', referral: '' });
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="glass-card p-10 rounded-2xl text-center max-w-lg">
          <div className="flex justify-center mb-6">
            <Smile className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Message Sent!</h2>
          <p className="text-muted-foreground mb-6">Thanks for reaching out. We'll get back to you within 24 hours.</p>
          <Button onClick={() => setIsSubmitted(false)} className="luxury-gradient">Send Another Message</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="relative pt-32 pb-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold">We'd love to hear from you</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black">Contact Us</h1>
          <p className="text-muted-foreground text-lg">Our team is here to answer your questions and provide the support you need.</p>
        </div>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-4 py-16 grid lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Get in Touch</h2>
            <p className="text-muted-foreground">Reach out to us by filling the form or through our contact details.</p>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              Skopje, Macedonia
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              +389 70 123 456
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              hello@telemaxatomic.com
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              Mon–Fri: 9AM–6PM
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">Full Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm mb-2">Email Address *</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Subject *</label>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary"
                placeholder="What’s this about?"
              />
              {errors.subject && <p className="text-sm text-red-500 mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">Message *</label>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary"
                placeholder="Tell us how we can help you..."
              ></textarea>
              {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">How did you hear about us?</label>
              <select
                name="referral"
                value={formData.referral}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose one</option>
                <option value="google">Google Search</option>
                <option value="instagram">Instagram</option>
                <option value="friend">Friend / Referral</option>
                <option value="ad">Ad / Promotion</option>
              </select>
            </div>

            <Button type="submit" className="w-full py-3 luxury-gradient text-lg font-bold">
              {isSubmitting ? 'Sending...' : 'Send Message'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;