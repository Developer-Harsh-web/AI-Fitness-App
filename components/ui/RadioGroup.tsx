import React from 'react';

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function RadioGroup({ value, onChange, className = '', children }: RadioGroupProps) {
  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            checked: value === child.props.value,
            onChange: () => handleChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
}

interface RadioGroupItemProps {
  value: string;
  id: string;
  checked?: boolean;
  onChange?: () => void;
  className?: string;
}

export function RadioGroupItem({ value, id, checked, onChange, className = '' }: RadioGroupItemProps) {
  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={checked}
      onChange={onChange}
      className={`peer sr-only ${className}`}
    />
  );
} 