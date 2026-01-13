'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Settings,
  X,
  Briefcase,
  Home,
  ShoppingBag,
  Heart,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Calendrier', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
];

const categories = [
  { name: 'Travail', icon: Briefcase, color: 'bg-blue-500', count: 12 },
  { name: 'Personnel', icon: Home, color: 'bg-green-500', count: 8 },
  { name: 'Courses', icon: ShoppingBag, color: 'bg-orange-500', count: 5 },
  { name: 'Santé', icon: Heart, color: 'bg-red-500', count: 3 },
  { name: 'Urgent', icon: Zap, color: 'bg-yellow-500', count: 7 },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <span className="text-xl font-bold text-gray-900">Mosala</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {/* Navigation principale */}
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Catégories */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Catégories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.name}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            category.color
                          )}
                        />
                        <Icon className="w-4 h-4" />
                        <span>{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* User section (bottom) */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                U
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Utilisateur
                </p>
                <p className="text-xs text-gray-500 truncate">Version gratuite</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo + Close button */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <span className="text-xl font-bold text-gray-900">Mosala</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation (même contenu que desktop) */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {/* Navigation principale */}
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Catégories */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Catégories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.name}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            category.color
                          )}
                        />
                        <Icon className="w-4 h-4" />
                        <span>{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                U
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Utilisateur
                </p>
                <p className="text-xs text-gray-500 truncate">Version gratuite</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}