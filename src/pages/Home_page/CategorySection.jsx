import React from "react";
import { Link } from "react-router-dom";

const categories = [
    {
        id: "fresh-fruits",
        label: "Fresh Fruits",
        image:
            "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=200&q=80",
        href: "/category/fresh-fruits",
    },
    {
        id: "vegetables",
        label: "Vegetables",
        image:
            "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80",
        href: "/category/vegetables",
    },
    {
        id: "dairy-eggs",
        label: "Dairy & Eggs",
        image:
            "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80",
        href: "/category/dairy-eggs",
    },
    {
        id: "bakery",
        label: "Bakery",
        image:
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80",
        href: "/category/bakery",
    },
    {
        id: "meat-seafood",
        label: "Meat & Seafood",
        image:
            "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=200&q=80",
        href: "/category/meat-seafood",
    },
    {
        id: "pantry",
        label: "Pantry",
        image:
            "https://images.unsplash.com/photo-1584385002340-d886f3a0f097?auto=format&fit=crop&w=200&q=80",
        href: "/category/pantry",
    }, {
        id: "bakery",
        label: "Bakery",
        image:
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80",
        href: "/category/bakery",
    }, {
        id: "meat-seafood",
        label: "Meat & Seafood",
        image:
            "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=200&q=80",
        href: "/category/meat-seafood",
    }, {
        id: "dairy-eggs",
        label: "Dairy & Eggs",
        image:
            "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80",
        href: "/category/dairy-eggs",
    }, {
        id: "pantry",
        label: "Pantry",
        image:
            "https://images.unsplash.com/photo-1584385002340-d886f3a0f097?auto=format&fit=crop&w=200&q=80",
        href: "/category/pantry",
    }, {
        id: "fresh-fruits",
        label: "Fresh Fruits",
        image:
            "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=200&q=80",
        href: "/category/fresh-fruits",
    },
    {
        id: "vegetables",
        label: "Vegetables",
        image:
            "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80",
        href: "/category/vegetables",
    },
    {
        id: "dairy-eggs",
        label: "Dairy & Eggs",
        image:
            "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80",
        href: "/category/dairy-eggs",
    },
    {
        id: "bakery",
        label: "Bakery",
        image:
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80",
        href: "/category/bakery",
    },
    {
        id: "meat-seafood",
        label: "Meat & Seafood",
        image:
            "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=200&q=80",
        href: "/category/meat-seafood",
    },
    {
        id: "pantry",
        label: "Pantry",
        image:
            "https://images.unsplash.com/photo-1584385002340-d886f3a0f097?auto=format&fit=crop&w=200&q=80",
        href: "/category/pantry",
    }, {
        id: "bakery",
        label: "Bakery",
        image:
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80",
        href: "/category/bakery",
    },
];

const CategorySection = () => {
    return (
        <section className="bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[96%] text-center">
                <h2 className="text-xl font-bold text-gray-800 sm:text-3xl">
                    Shop by Category
                </h2>
                <p className="mt-1 text-xs text-gray-600 sm:text-base">
                    Browse through our wide variety of fresh and organic products
                </p>

                <div className="mt-8 flex gap-14 overflow-x-auto pb-3 scrollbar py-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={category.href}
                            className="group flex shrink-0 flex-col items-center gap-3"
                        >
                            <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform group-hover:scale-[1.02]">
                                <img
                                    src={category.image}
                                    alt={category.label}
                                    className="h-full w-full object-cover"
                                />
                            </span>

                            <span className="whitespace-nowrap text-sm font-medium text-gray-900">
                                {category.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;