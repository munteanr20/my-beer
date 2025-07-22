'use client';

import Link from 'next/link';

interface NavbarDropdownItemProps {
  href?: string;
  text: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function NavbarDropdownItem({ 
  href, 
  text, 
  icon, 
  onClick,
  className = ''
}: NavbarDropdownItemProps) {
  const baseClasses = "flex items-center space-x-3 px-4 py-3 text-[var(--tavern-cream)] hover:text-[var(--tavern-gold)] hover:bg-[var(--tavern-copper)]/20 transition-all duration-300 group";

  const content = (
    <>
      <div className="w-5 h-5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span className="body-font font-medium">{text}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full ${baseClasses} ${className}`}
    >
      {content}
    </button>
  );
} 