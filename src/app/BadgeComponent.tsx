"use client";

import { Badge } from "@/components/ui/badge";
import React from "react";
import { useState } from "react";

export default function BadgeComponent({categories}: {categories: string[]}) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>("All");
    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category === selectedCategory ? null : category);
    };
    
    return (
        <>
            {categories.map((cat) => (
                <Badge
                    onClick={() => handleCategoryClick(cat)}
                    key={cat}
                    variant="secondary"
                    className={`cursor-pointer border flex items-center justify-center rounded-lg px-4 py-1 text-sm ${selectedCategory === cat ? "bg-white" : "bg-[#ede8e6]"}`}
                >
                    {cat}
                </Badge>
            ))} 
        </>
    );
}
