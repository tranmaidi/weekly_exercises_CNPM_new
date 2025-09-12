import React from "react";

type CardProps = {
  title: string;
  children: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ title, children }) => (
  <div className="border rounded shadow p-4">
    <h3 className="font-bold mb-2">{title}</h3>
    {children}
  </div>
);
