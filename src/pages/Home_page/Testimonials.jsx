import React, { useRef } from "react";
import { FiArrowLeft, FiArrowRight, FiStar } from "react-icons/fi";

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
            "Excellent customer service and everything arrives perfectly packed. Freshies has completely replaced my supermarket runs.",
        name: "Emily Rodriguez",
        role: "Verified Buyer",
        avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    },
    {
        id: "john",
        rating: 5,
        quote:
            "The quality is amazing and delivery is always on time. I love supporting local farmers through Freshies.",
        name: "John Davis",
        role: "Verified Buyer",
        avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    },
    {
        id: "anna",
        rating: 5,
        quote:
            "Everything arrives fresh and beautifully packed. The experience is much better than shopping at a supermarket.",
        name: "Anna Wilson",
        role: "Verified Buyer",
        avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    },
    {
        id: "david",
        rating: 5,
        quote:
            "Freshies makes buying fresh produce incredibly easy. Great vendors, great quality, and great service.",
        name: "David Miller",
        role: "Verified Buyer",
        avatar:
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80",
    },
    {
        id: "lisa",
        rating: 5,
        quote:
            "I can finally get farm-fresh products without spending hours visiting different stores.",
        name: "Lisa Anderson",
        role: "Verified Buyer",
        avatar:
            "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=100&q=80",
    },
    {
        id: "robert",
        rating: 5,
        quote:
            "Fantastic selection and very reliable delivery. Freshies has become part of our weekly routine.",
        name: "Robert Brown",
        role: "Verified Buyer",
        avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
    },
];

const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="flex h-[280px] w-full shrink-0 flex-col border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">

            {/* Rating */}
            <div className="flex gap-0.5 text-orange-400">
                {Array.from({ length: 5 }).map((_, index) => (
                    <FiStar
                        key={index}
                        className={`h-4 w-4 ${index < testimonial.rating
                            ? "fill-orange-400"
                            : "fill-none"
                            }`}
                    />
                ))}
            </div>

            {/* Quote */}
            <p className="mt-5 flex-1 text-sm leading-6 text-gray-600">
                "{testimonial.quote}"
            </p>

            {/* Divider */}
            <div className="my-5 border-t border-gray-100" />

            {/* User */}
            <div className="flex items-center gap-3">
                <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-10 w-10 rounded-full object-cover"
                />

                <div>
                    <p className="text-sm font-bold text-gray-900">
                        {testimonial.name}
                    </p>

                    <p className="text-xs text-green-600">
                        {testimonial.role}
                    </p>
                </div>
            </div>
        </div>
    );
};

const Testimonials = () => {

    const sliderRef = useRef(null);

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: -350,
                behavior: "smooth",
            });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: 350,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 xl:py-20">

            <div className="mx-auto max-w-7xl">

                {/* Header */}

                <div className="mx-auto max-w-3xl text-center">

                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        What Our Customers Say
                    </h2>

                    <p className="mt-4 text-sm leading-6 text-gray-500 sm:text-base">
                        Real feedback from our wonderful community of shoppers
                    </p>

                </div>

                {/* Trusted users */}

                <div className="mt-7 flex flex-col items-center">

                    <p className="text-xs font-medium text-gray-500">
                        Trusted by our growing community
                    </p>

                    <div className="mt-3 flex items-center">

                        {testimonials.slice(0, 6).map((testimonial, index) => (
                            <img
                                key={testimonial.id}
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className={`h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm ${index !== 0 ? "-ml-2" : ""
                                    }`}
                            />
                        ))}

                        <div className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-green-100 text-[10px] font-bold text-green-700">
                            +5K
                        </div>

                    </div>

                </div>

                {/* ================================
                    CAROUSEL
                ================================= */}

                <div className="relative mt-12">

                    <div
                        ref={sliderRef}
                        className="scrollbar-hide flex gap-5 overflow-x-hidden scroll-smooth"
                    >

                        {testimonials.map((testimonial) => (
                            <TestimonialCard
                                key={testimonial.id}
                                testimonial={testimonial}
                            />
                        ))}

                    </div>

                </div>

                {/* ================================
                    ARROWS
                ================================= */}

                <div className="mt-8 flex justify-center gap-3">

                    <button
                        type="button"
                        onClick={scrollLeft}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                        aria-label="Previous testimonials"
                    >
                        <FiArrowLeft className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={scrollRight}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white shadow-sm transition hover:bg-gray-800 cursor-pointer"
                        aria-label="Next testimonials"
                    >
                        <FiArrowRight className="h-4 w-4" />
                    </button>

                </div>

            </div>

        </section>
    );
};

export default Testimonials;