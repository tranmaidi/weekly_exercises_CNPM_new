import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
};

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = "primary" }) => {
  const colors = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-300 text-black",
    danger: "bg-red-500 text-white"
  };
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${colors[variant]} hover:opacity-80`}
    >
      {children}
    </button>
  );
};
