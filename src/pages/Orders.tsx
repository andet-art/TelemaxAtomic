import React from 'react';
import Sidebar from './Sidebar';
import { Sparkles, ShoppingBag } from 'lucide-react';
import Footer from '@/components/Footer';

const Orders: React.FC = () => {
  return (
    <>
      <div className="flex">
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 
                         bg-background text-foreground 
                         flex flex-col items-center justify-center text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 
                            rounded-full border border-primary/20 
                            bg-slate-900/60 shadow-md glass-card">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Your Orders
              </span>
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            No Orders Yet
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            You haven't placed any orders yet. Once you do, they’ll appear here with full details.
          </p>
        </main>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </>
  );
};

export default Orders;
