import React from "react";
import { FiStar } from "react-icons/fi";

const testimonials = [
    {
        id: "sarah",
        rating: 5,
        quote:
            "The freshness of the vegetables is unmatched. It feels like they were picked right out of the garden just hours ago! Fast delivery too.",
        name: "Sarah Jenkins",
        role: "Verified Buyer",
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    },
    {
        id: "mark",
        rating: 5,
        quote:
            "I love being able to support local vendors directly. The platform is so easy to use, and the organic selection is absolutely fantastic.",
        name: "Mark Thompson",
        role: "Verified Buyer",
        avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    },
    {
        id: "emily",
        rating: 5,
        quote:
            "Excellent customer service and everything arrives perfectly packed. Green Leaf Grocers has completely replaced my supermarket runs.",
        name: "Emily Rodriguez",
        role: "Verified Buyer",
        avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    },
];

const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex gap-0.5 text-orange-400">
                {Array.from({ length: 5 }).map((_, index) => (
                    <FiStar
                        key={index}
                        className={`h-4 w-4 ${index < testimonial.rating ? "fill-orange-400" : "fill-none"
                            }`}
                    />
                ))}
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-700">
                "{testimonial.quote}"
            </p>
            <div className="mt-6 flex items-center gap-3">
                <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                    <p className="text-sm font-bold text-gray-900">
                        {testimonial.name}
                    </p>
                    <p className="text-xs text-green-600">{testimonial.role}</p>
                </div>
            </div>
        </div>
    );
};

const Testimonials = () => {
    return (
        <section className="bg-gray-50 px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl text-center">
                <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    What Our Customers Say
                </h2>
                <p className="mt-2 text-sm text-gray-500 sm:text-base">
                    Real feedback from our wonderful community of shoppers
                </p>

                <div className="mt-10 grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;