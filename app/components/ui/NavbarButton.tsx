'use client';

import Link from 'next/link';

interface NavbarButtonProps {
  href?: string;
  text: string;
  emoji: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export default function NavbarButton({ 
  href, 
  text, 
  emoji, 
  onClick,
  className = '',
  variant = 'primary'
}: NavbarButtonProps) {
  const baseClasses = "beer-button px-4 py-2 rounded-lg flex items-center space-x-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl";
  const variantClasses = variant === 'secondary' 
    ? "bg-[var(--tavern-copper)]/20 text-[var(--tavern-cream)] hover:bg-[var(--tavern-copper)]/30" 
    : "";

  const content = (
    <>
      <span className="text-lg">{emoji}</span>
      <span className="body-font font-semibold">{text}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${variantClasses} ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {content}
    </button>
  );
} 