/**
 * Sidebar Component
 * YouTube-like navigation sidebar
 */

import { NavLink, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Home,
  Clock,
  Heart,
  RefreshCw,
  FolderOpen,
  Brain,
  Cpu,
  Shield,
  Activity,
  Folder,
  Plus,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { categoryService } from '../../services';

// Icon mapping for categories
const categoryIcons = {
  brain: Brain,
  cpu: Cpu,
  shield: Shield,
  activity: Activity,
  folder: Folder,
};

function SidebarItem({ to, icon: Icon, label, count, color }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx('sidebar-item', isActive && 'active')
      }
    >
      <Icon
        className="w-5 h-5 flex-shrink-0"
        style={color ? { color } : undefined}
      />
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-yt-text-secondary">{count}</span>
      )}
    </NavLink>
  );
}

export function Sidebar({ isOpen, onClose }) {
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const location = useLocation();

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const categories = categoriesData?.data || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-14 left-0 bottom-0 w-64 bg-yt-black z-40',
          'transform transition-transform duration-200 ease-in-out',
          'lg:translate-x-0 overflow-y-auto hide-scrollbar',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="p-3 space-y-1">
          {/* Main Navigation */}
          <SidebarItem to="/" icon={Home} label="Home" />
          <SidebarItem to="/watch-later" icon={Clock} label="Watch Later" />
          <SidebarItem to="/favorites" icon={Heart} label="Favorites" />
          <SidebarItem to="/watch-again" icon={RefreshCw} label="Watch Again" />

          {/* Divider */}
          <div className="border-t border-yt-lighter my-3" />

          {/* Categories Section */}
          <button
            onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-yt-text-secondary hover:text-yt-text"
          >
            <span>Categories</span>
            {categoriesExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {categoriesExpanded && (
            <div className="space-y-1">
              {categories.map((category) => {
                const IconComponent = categoryIcons[category.icon] || FolderOpen;
                return (
                  <SidebarItem
                    key={category._id}
                    to={`/category/${category.slug}`}
                    icon={IconComponent}
                    label={category.name}
                    count={category.videoCount}
                    color={category.color}
                  />
                );
              })}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-yt-lighter my-3" />

          {/* Actions */}
          <SidebarItem to="/add" icon={Plus} label="Add Video" />
          <SidebarItem to="/settings" icon={Settings} label="Settings" />
        </nav>

        {/* Footer */}
        <div className="p-4 mt-auto border-t border-yt-lighter">
          <p className="text-xs text-yt-text-secondary">
            Video Knowledge Manager
          </p>
          <p className="text-xs text-yt-text-secondary mt-1">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
