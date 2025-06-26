import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Menu, X, Sparkles, Bell, User, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const isActive = (path: string) => location === path;
  
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg shadow-slate-900/5">
      <Container className="py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link href="/" className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <Sparkles className="h-6 w-6 text-white animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-quicksand font-black text-2xl bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Featherweight
              </span>
              <span className="font-quicksand text-xs text-slate-500 dark:text-slate-400 -mt-1">
                AI Wellness Platform
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink href="/" isActive={isActive("/")} label="Home" />
            
            {user ? (
              <>
                <NavLink href="/journal" isActive={isActive("/journal")} label="Journal" />
                <NavLink href="/insights" isActive={isActive("/insights")} label="Insights" />
                <NavLink href="/conversation-center" isActive={isActive("/conversation-center")} label="Chat" />
                <NavLink href="/mood-tracker" isActive={isActive("/mood-tracker")} label="Mood" />
                {user?.isPremium && (
                  <NavLink href="/sms" isActive={isActive("/sms")} label="SMS" premium />
                )}
              </>
            ) : (
              <>
                <NavLink href="/about" isActive={isActive("/about")} label="About" />
                <NavLink href="/features" isActive={isActive("/features")} label="Features" />
                <NavLink href="/pricing" isActive={isActive("/pricing")} label="Pricing" />
              </>
            )}
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                {/* Notification Bell */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                >
                  <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
                </Button>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
                      <Avatar className="h-9 w-9 border-2 border-gradient-to-r from-blue-500 to-purple-500">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          {user.firstName?.[0] || user.username?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl" align="end">
                    <DropdownMenuLabel className="p-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {user.firstName || user.username}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>
                        {user.isPremium && (
                          <div className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-medium">
                            ✨ Premium
                          </div>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
                    <DropdownMenuItem asChild className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      <Link href="/settings" className="flex items-center space-x-3">
                        <Settings className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium">Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      <Link href="/subscription" className="flex items-center space-x-3">
                        <Sparkles className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium">Subscription</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer text-red-600 dark:text-red-400"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      <span className="text-sm font-medium">
                        {logoutMutation.isPending ? "Signing Out..." : "Sign Out"}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/auth">
                  <Button variant="ghost" className="font-quicksand font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth">
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-70"></div>
                    <Button className="relative font-quicksand font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                      Get Started
                    </Button>
                  </div>
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200" 
              onClick={toggleMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </Container>
      
      {/* Enhanced Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 shadow-xl">
          <Container className="py-6">
            <div className="flex flex-col space-y-4">
              <MobileNavLink href="/" isActive={isActive("/")} label="Home" onClick={() => setMobileMenuOpen(false)} />
              
              {user ? (
                <>
                  <MobileNavLink href="/journal" isActive={isActive("/journal")} label="Journal" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink href="/insights" isActive={isActive("/insights")} label="Insights" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink href="/conversation-center" isActive={isActive("/conversation-center")} label="Chat with Flappy" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink href="/mood-tracker" isActive={isActive("/mood-tracker")} label="Mood Tracker" onClick={() => setMobileMenuOpen(false)} />
                  {user?.isPremium && (
                    <MobileNavLink href="/sms" isActive={isActive("/sms")} label="SMS" premium onClick={() => setMobileMenuOpen(false)} />
                  )}
                  <MobileNavLink href="/settings" isActive={isActive("/settings")} label="Settings" onClick={() => setMobileMenuOpen(false)} />
                  
                  <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                    <Button 
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full font-quicksand font-medium border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                      disabled={logoutMutation.isPending}
                    >
                      {logoutMutation.isPending ? "Signing Out..." : "Sign Out"}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <MobileNavLink href="/about" isActive={isActive("/about")} label="About" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink href="/features" isActive={isActive("/features")} label="Features" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink href="/pricing" isActive={isActive("/pricing")} label="Pricing" onClick={() => setMobileMenuOpen(false)} />
                  
                  <div className="pt-4 space-y-3">
                    <Link 
                      href="/auth" 
                      className="block w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full font-quicksand font-medium rounded-xl">
                        Sign In
                      </Button>
                    </Link>
                    <Link 
                      href="/auth" 
                      className="block w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full font-quicksand font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

// Enhanced Navigation Link Component
function NavLink({ href, isActive, label, premium = false }: { 
  href: string; 
  isActive: boolean; 
  label: string; 
  premium?: boolean; 
}) {
  return (
    <Link href={href}>
      <div className={`group relative px-4 py-2 rounded-xl transition-all duration-200 ${
        isActive 
          ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400" 
          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
      }`}>
        <span className="font-quicksand font-medium text-sm flex items-center space-x-2">
          <span>{label}</span>
          {premium && (
            <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
          )}
        </span>
        {isActive && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        )}
      </div>
    </Link>
  );
}

// Enhanced Mobile Navigation Link Component
function MobileNavLink({ href, isActive, label, premium = false, onClick }: { 
  href: string; 
  isActive: boolean; 
  label: string; 
  premium?: boolean; 
  onClick: () => void;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <div className={`group relative px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400" 
          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
      }`}>
        <span className="font-quicksand font-medium flex items-center justify-between">
          <span>{label}</span>
          {premium && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">PRO</span>
            </div>
          )}
        </span>
      </div>
    </Link>
  );
}

