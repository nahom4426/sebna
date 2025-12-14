import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button Component - Reusable button with multiple variants
 * @param {string} variant - 'primary', 'secondary', 'outline', 'danger', 'success'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {boolean} disabled - Disable button
 * @param {function} onClick - Click handler
 * @param {ReactNode} children - Button content
 * @param {string} className - Additional CSS classes
 * @param {string} type - 'button', 'submit', 'reset'
 * @param {boolean} loading - Show loading state
 * @param {string} icon - Icon class (Font Awesome)
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
  loading = false,
  icon = null,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer';

  const variants = {
    primary: 'bg-gradient-to-r from-blue-900 to-orange-600 text-white hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-900 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'bg-transparent text-blue-900 border-2 border-blue-900 hover:bg-blue-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
    success: 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const buttonClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClass}
      {...props}
    >
      {loading ? (
        <>
          <span className="inline-block animate-spin">⏳</span>
          {children}
        </>
      ) : (
        <>
          {icon && <i className={`fas ${icon}`}></i>}
          {children}
        </>
      )}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  loading: PropTypes.bool,
  icon: PropTypes.string,
};

export default Button;
