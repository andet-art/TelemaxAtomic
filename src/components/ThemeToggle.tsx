import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "gap-2 bg-slate-800/35 hover:bg-slate-700/45 border border-slate-600/35 hover:border-slate-500/45 text-slate-200 hover:text-white transition-all duration-300 backdrop-blur-2xl px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl relative overflow-hidden group",
            "dark:bg-slate-800/35 dark:hover:bg-slate-700/45 dark:border-slate-600/35 dark:hover:border-slate-500/45 dark:text-slate-200 dark:hover:text-white",
            "light:bg-white/20 light:hover:bg-white/30 light:border-slate-300/35 light:hover:border-slate-400/45 light:text-slate-800 light:hover:text-slate-900"
          )}
        >
          {/* Button background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/10 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          
          {actualTheme === 'dark' ? (
            <Moon className="w-4 h-4 relative z-10 transition-all duration-300" />
          ) : (
            <Sun className="w-4 h-4 relative z-10 transition-all duration-300" />
          )}
          
          <span className="text-sm font-semibold hidden lg:inline relative z-10">
            {theme === 'system' ? 'Auto' : actualTheme === 'dark' ? 'Dark' : 'Light'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-slate-900/98 backdrop-blur-3xl border border-slate-700/50 shadow-2xl shadow-slate-900/40"
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={cn(
            "flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-all duration-200",
            theme === 'light' 
              ? "bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 text-white" 
              : "text-slate-200 hover:text-white hover:bg-slate-800/40"
          )}
        >
          <Sun className="w-4 h-4" />
          <span className="font-medium">Light</span>
          {theme === 'light' && (
            <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={cn(
            "flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-all duration-200",
            theme === 'dark' 
              ? "bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 text-white" 
              : "text-slate-200 hover:text-white hover:bg-slate-800/40"
          )}
        >
          <Moon className="w-4 h-4" />
          <span className="font-medium">Dark</span>
          {theme === 'dark' && (
            <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={cn(
            "flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-all duration-200",
            theme === 'system' 
              ? "bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 text-white" 
              : "text-slate-200 hover:text-white hover:bg-slate-800/40"
          )}
        >
          <Monitor className="w-4 h-4" />
          <span className="font-medium">System</span>
          {theme === 'system' && (
            <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}