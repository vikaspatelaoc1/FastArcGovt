import React from 'react';

interface CategoryIconProps {
  icon?: string | React.ReactNode;
  alt?: string;
  className?: string;
  fallback?: string;
}

export const isImageIconUrl = (val: unknown): boolean => {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  return (
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('/') ||
    /\.(png|jpe?g|svg|webp|gif|ico)(\?.*)?$/i.test(trimmed)
  );
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  icon,
  alt = 'Category Icon',
  className = 'w-5 h-5 object-contain shrink-0',
  fallback = '📌'
}) => {
  if (!icon) {
    return <span>{fallback}</span>;
  }

  if (typeof icon !== 'string') {
    return <>{icon}</>;
  }

  if (isImageIconUrl(icon)) {
    return (
      <img
        src={icon}
        alt={alt}
        className={className}
        loading="lazy"
        onError={(e) => {
          // If image fails, replace with fallback
          const target = e.currentTarget;
          target.style.display = 'none';
          if (target.parentElement) {
            const span = document.createElement('span');
            span.textContent = fallback;
            target.parentElement.appendChild(span);
          }
        }}
      />
    );
  }

  return <span>{icon}</span>;
};
