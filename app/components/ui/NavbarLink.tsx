'use client';

import Link from 'next/link';

interface NavbarLinkProps {
  href: string;
  text: string;
  emoji: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function NavbarLink({ 
  href, 
  text, 
  emoji, 
  isActive = false, 
  onClick,
  className = ''
}: NavbarLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
        isActive
          ? 'bg-[var(--tavern-copper)]/20 text-[var(--tavern-gold)]'
          : 'text-[var(--tavern-cream)] hover:text-[var(--tavern-gold)] hover:bg-[var(--tavern-copper)]/10'
      } ${className}`}
    >
      <span className="text-lg group-hover:scale-110 transition-transform duration-300">
        {emoji}
      </span>
      <span className="body-font font-medium">{text}</span>
    </Link>
  );
} 