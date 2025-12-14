import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card Component - Reusable card container
 * @param {ReactNode} children - Card content
 * @param {string} title - Card title
 * @param {string} subtitle - Card subtitle
 * @param {string} className - Additional CSS classes
 * @param {boolean} shadow - Show shadow
 * @param {string} variant - 'default', 'elevated', 'outlined'
 * @param {ReactNode} footer - Card footer content
 * @param {ReactNode} header - Card header content
 */
const Card = ({
  children,
  title,
  subtitle,
  className = '',
  shadow = true,
  variant = 'default',
  footer,
  header,
  onClick,
  ...props
}) => {
  const variants = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg',
    outlined: 'bg-white border-2 border-gray-300',
  };

  return (
    <div
      className={`rounded-lg overflow-hidden transition-all duration-300 ${variants[variant]} ${
        shadow && variant === 'default' ? 'shadow-md hover:shadow-lg' : ''
      } ${onClick ? 'cursor-pointer hover:shadow-lg' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {header && <div className="border-b border-gray-200">{header}</div>}

      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="px-6 py-4">{children}</div>

      {footer && <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.string,
  shadow: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined']),
  footer: PropTypes.node,
  header: PropTypes.node,
  onClick: PropTypes.func,
};

export default Card;
