"use client";

import { Badge } from "@/components/ui/badge";
import React from "react";

interface BadgeComponentProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function BadgeComponent({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: BadgeComponentProps) {
  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
  };
  
  return (
    <>
      {categories.map((cat) => (
        <Badge
          onClick={() => handleCategoryClick(cat)}
          key={cat}
          variant="secondary"
          className={`cursor-pointer border flex items-center justify-center rounded-lg px-4 py-1 text-[0.4rem] sm:text-sm ${selectedCategory === cat ? "bg-white" : "bg-[#ede8e6]"}`}
        >
          {cat}
        </Badge>
      ))} 
    </>
  );
}
