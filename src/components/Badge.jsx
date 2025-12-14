import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge Component - Reusable badge/tag element
 * @param {string} variant - 'primary', 'success', 'warning', 'danger', 'info'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {ReactNode} children - Badge content
 * @param {string} className - Additional CSS classes
 * @param {string} icon - Icon class (Font Awesome)
 */
const Badge = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  icon = null,
  ...props
}) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <i className={`fas ${icon}`}></i>}
      {children}
    </span>
  );
};

Badge.propTypes = {
  variant: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  icon: PropTypes.string,
};

export default Badge;
