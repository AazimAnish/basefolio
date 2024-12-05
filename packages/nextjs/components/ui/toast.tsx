import * as React from "react";

export interface ToastProps {
  visible?: boolean;
  className?: string;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  type?: "success" | "error" | "default";
}

export function Toast({ visible, className, children }: ToastProps) {
  return (
    <div className={`toast ${visible ? 'visible' : 'hidden'} ${className || ''}`}>
      {children}
    </div>
  );
} 