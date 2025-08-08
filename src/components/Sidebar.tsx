// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface SidebarProps {
  onSelect: (category: string, product?: string) => void;
}

const categories = [
  {
    name: 'Grinder',
    products: ['Metal grinder', 'Plastic grinder'],
  },
  {
    name: 'Lighter',
    products: [
      'Festival',
      'Jetflame',
      'BBQ lighters',
      'Gas - Gasolin refills',
      'Myon collection',
      'F2 (electronic lighter)',
      'Promotion',
      'Turbo flame',
      'Mini BBQ',
    ],
  },
  {
    name: 'Cigarette Cases',
    products: ['Metal cigarette cases', 'Plastic cigarette cases'],
  },
  {
    name: 'Ashtrays',
    products: ['Table ashtry', 'Car ashtrys', 'Cigar ashtrys', 'Spinning ashtrys'],
  },
  {
    name: 'RYO (Roll Your Own)',
    products: ['Filter - papers', 'Rolling machines', 'Filling machines', 'Tobacco pouches - boxes'],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveringDropdown, setHoveringDropdown] = useState(false);

  return (
    <aside className="hidden md:block w-64 h-screen sticky top-0 bg-background/80 backdrop-blur-xl border-r border-border shadow-xl z-30">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-gold-shine bg-clip-text text-transparent">
          Telemax
        </h2>

        <nav className="space-y-4">
          {/* All Products Button */}
          <div
            onClick={() => onSelect('', '')}
            className="flex items-center justify-between px-4 py-2 rounded-lg glass-card border border-primary/20 text-foreground hover:bg-primary/10 cursor-pointer transition-all"
          >
            <span>All Products</span>
          </div>

          {/* Category Items */}
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="relative group"
              onMouseEnter={() => setHoveredCategory(cat.name)}
              onMouseLeave={() => {
                if (!hoveringDropdown) setHoveredCategory(null);
              }}
            >
              <div
                onClick={() => onSelect(cat.name)}
                className="flex items-center justify-between px-4 py-2 rounded-lg glass-card border border-primary/20 text-foreground hover:bg-primary/10 cursor-pointer transition-all"
              >
                <span>{cat.name}</span>
                <ChevronRight className="w-4 h-4" />
              </div>

              {/* Subcategory Dropdown */}
              {hoveredCategory === cat.name && (
                <div
                  className="absolute top-0 left-full ml-2 w-56 bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-lg p-4 space-y-2 z-40"
                  onMouseEnter={() => setHoveringDropdown(true)}
                  onMouseLeave={() => {
                    setHoveringDropdown(false);
                    setHoveredCategory(null);
                  }}
                >
                  {cat.products.map((prod, i) => (
                    <div
                      key={i}
                      onClick={() => onSelect(cat.name, prod)}
                      className="px-3 py-2 rounded-md hover:bg-primary/10 text-sm text-muted-foreground cursor-pointer transition-all"
                    >
                      {prod}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
