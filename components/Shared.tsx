import React from 'react';

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-rf-dark border border-rf-panel rounded-lg p-4 shadow-sm ${className}`}>
    {title && <h3 className="text-lg font-semibold text-white mb-4 border-b border-rf-panel pb-2">{title}</h3>}
    {children}
  </div>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth = false, className = '', ...props }) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-rf-black";
  
  const variants = {
    primary: "bg-rf-orange text-white hover:bg-rf-orangeHover focus:ring-rf-orange",
    secondary: "bg-rf-panel text-rf-white hover:bg-zinc-700 focus:ring-zinc-600 border border-zinc-700",
    danger: "bg-red-900/50 text-red-200 hover:bg-red-900 border border-red-800 focus:ring-red-700",
    ghost: "bg-transparent text-rf-gray hover:text-white hover:bg-rf-panel"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1 mb-3">
    {label && <label className="text-sm text-rf-gray font-medium">{label}</label>}
    <input 
      className={`bg-rf-black border border-rf-panel text-white px-3 py-2 rounded-md focus:border-rf-orange focus:outline-none focus:ring-1 focus:ring-rf-orange placeholder-zinc-600 ${className}`}
      {...props}
    />
  </div>
);

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
  <div className="flex flex-col gap-1 mb-3">
    {label && <label className="text-sm text-rf-gray font-medium">{label}</label>}
    <select 
      className={`bg-rf-black border border-rf-panel text-white px-3 py-2 rounded-md focus:border-rf-orange focus:outline-none focus:ring-1 focus:ring-rf-orange ${className}`}
      {...props}
    >
      <option value="">Seleccionar...</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-zinc-700' }) => (
  <span className={`${color} text-xs font-semibold px-2 py-1 rounded-full text-white`}>
    {children}
  </span>
);
