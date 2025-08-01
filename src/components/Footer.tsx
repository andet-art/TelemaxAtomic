import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, CreditCard, Banknote, ShieldCheck } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border py-10 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Telemax</h3>
          <p className="text-sm text-muted-foreground">
            Premium tobacco accessories designed with luxury, durability, and style in mind.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-primary">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/shop" className="hover:text-primary">Shop</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-primary">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/returns" className="hover:text-primary">Returns & Refunds</Link></li>
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-primary">Join Our Newsletter</h4>
          <form className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
              Subscribe
            </button>
          </form>

          <div className="flex items-center gap-4 pt-4">
            <a href="#" className="hover:text-primary"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="hover:text-primary"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="hover:text-primary"><Instagram className="w-5 h-5" /></a>
            <a href="mailto:hello@telemaxatomic.com" className="hover:text-primary"><Mail className="w-5 h-5" /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <span>&copy; {new Date().getFullYear()} Telemax. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <CreditCard className="w-4 h-4" />
            <Banknote className="w-4 h-4" />
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
