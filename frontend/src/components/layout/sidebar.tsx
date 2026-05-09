'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarDays,
  CreditCard, ClipboardList, BarChart3, Settings, ChevronLeft,
  GraduationCap as Logo,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';

const navItems = [
  { href: '/dashboard', label: 'Bosh sahifa', icon: LayoutDashboard, permission: null },
  { href: '/students', label: 'O\'quvchilar', icon: Users, permission: 'student.read' },
  { href: '/teachers', label: 'O\'qituvchilar', icon: GraduationCap, permission: 'teacher.read' },
  { href: '/groups', label: 'Guruhlar', icon: BookOpen, permission: 'group.read' },
  { href: '/attendance', label: 'Davomat', icon: CalendarDays, permission: 'attendance.read' },
  { href: '/payments', label: 'To\'lovlar', icon: CreditCard, permission: 'payment.read' },
  { href: '/exams', label: 'Imtihonlar', icon: ClipboardList, permission: 'exam.read' },
  { href: '/analytics', label: 'Analitika', icon: BarChart3, permission: 'analytics.read' },
  { href: '/settings', label: 'Sozlamalar', icon: Settings, permission: 'settings.read' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { can } = useAuthStore();

  const visibleItems = navItems.filter(
    (item) => !item.permission || can(item.permission),
  );

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 68 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex flex-col h-full bg-sidebar border-r border-sidebar-border overflow-hidden z-20"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
          <Logo className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="ml-3 font-bold text-sidebar-foreground text-lg whitespace-nowrap"
            >
              EduCRM
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto scrollbar-hide">
        {visibleItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group',
                isActive
                  ? 'bg-sidebar-primary/20 text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
              )}
            >
              <item.icon
                className={cn(
                  'w-4.5 h-4.5 shrink-0 transition-colors',
                  isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground',
                )}
              />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-0.5 h-6 bg-sidebar-primary rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar-border border border-sidebar-border flex items-center justify-center hover:bg-sidebar-accent transition-colors z-30"
      >
        <motion.div animate={{ rotate: sidebarCollapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronLeft className="w-3 h-3 text-sidebar-foreground" />
        </motion.div>
      </button>
    </motion.aside>
  );
}
