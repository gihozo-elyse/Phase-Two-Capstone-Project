'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiEdit2, FiSearch, FiUser, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <FiHome className="mr-2" /> },
    { 
      name: 'Write', 
      path: '/write', 
      icon: <FiEdit2 className="mr-2" />,
      dropdown: [
        { name: 'New Story', path: '/write' },
        { name: 'Drafts', path: '/drafts' },
        { name: 'Stories', path: '/stories' },
      ]
    },
    { 
      name: 'Search', 
      path: '/search', 
      icon: <FiSearch className="mr-2" />,
      dropdown: [
        { name: 'Popular', path: '/search?sort=popular' },
        { name: 'Recent', path: '/search?sort=recent' },
        { name: 'Following', path: '/search?following=true' },
      ]
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: <FiUser className="mr-2" />,
      dropdown: [
        { name: 'My Profile', path: '/profile' },
        { name: 'Settings', path: '/settings' },
        { name: 'Sign Out', path: '/signout' },
      ]
    },
  ];

  return (
    <header className="bg-white text-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Medium
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                <button
                  onClick={() => item.dropdown && toggleDropdown(item.name)}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    pathname === item.path ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  {item.name}
                  {item.dropdown && (
                    <span className="ml-1">
                      {activeDropdown === item.name ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </span>
                  )}
                </button>
                
                {item.dropdown && activeDropdown === item.name && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 bg-white">
            {navItems.map((item) => (
              <div key={item.name} className="px-4">
                <button
                  onClick={() => item.dropdown ? toggleDropdown(item.name) : null}
                  className={`w-full flex items-center px-3 py-2 text-base font-medium rounded-md ${
                    pathname === item.path ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  {item.name}
                  {item.dropdown && (
                    <span className="ml-1">
                      {activeDropdown === item.name ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </span>
                  )}
                </button>
                
                {item.dropdown && activeDropdown === item.name && (
                  <div className="pl-6 mt-1 space-y-1">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.path}
                        className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                        onClick={() => {
                          setActiveDropdown(null);
                          setIsOpen(false);
                        }}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
