import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import Header from './Header';
import { Menu, X, Home, Users, BarChart3, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mobile Navigation Items (customize based on your routes)
  const mobileNavItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Users, label: 'Clients', href: '/clients' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          {/* <AppSidebar /> */}
        </div>

        <div className="flex-1 flex flex-col w-full">
          {/* Mobile Header with Hamburger Menu */}
          <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
              </div>
              {/* Add mobile header actions here if needed */}
            </div>
          </div>

          {/* Mobile Slide-out Menu */}
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Slide-out Menu */}
              <div className="lg:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                
                <nav className="p-4 space-y-2">
                  {mobileNavItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon size={20} className="text-gray-600" />
                      <span className="text-gray-900 font-medium">{item.label}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </>
          )}

          {/* Desktop Header - Hidden on mobile */}
          <div className="hidden lg:block">
            {/* <Header /> */}
          </div>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
            <nav className="flex items-center justify-around px-2 py-3">
              {mobileNavItems.slice(0, 4).map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors min-w-0 flex-1"
                >
                  <item.icon size={20} className="text-gray-600" />
                  <span className="text-xs text-gray-600 truncate">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;