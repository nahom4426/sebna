import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Alert Component - Reusable alert/notification
 * @param {string} variant - 'success', 'error', 'warning', 'info'
 * @param {string} title - Alert title
 * @param {ReactNode} children - Alert message
 * @param {boolean} closeable - Show close button
 * @param {string} className - Additional CSS classes
 * @param {string} icon - Icon class (Font Awesome)
 */
const Alert = ({
  variant = 'info',
  title,
  children,
  closeable = true,
  className = '',
  icon = null,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const variants = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'fa-check-circle text-green-600',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'fa-exclamation-circle text-red-600',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'fa-exclamation-triangle text-yellow-600',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'fa-info-circle text-blue-600',
    },
  };

  const style = variants[variant];

  if (!isVisible) return null;

  return (
    <div
      className={`${style.bg} border ${style.border} ${style.text} px-4 py-4 rounded-lg flex gap-3 ${className}`}
      role="alert"
    >
      {icon || <i className={`fas ${style.icon} text-lg flex-shrink-0`}></i>}
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <p className="text-sm">{children}</p>
      </div>
      {closeable && (
        <button
          onClick={() => setIsVisible(false)}
          className="text-lg flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Close alert"
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  variant: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  closeable: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.string,
};

export default Alert;
