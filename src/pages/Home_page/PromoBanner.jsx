import React from "react";
import { Promobarimg } from "../../constants/Imageconstants";

const PromoBanner = () => {
    return (
        <section className="bg-orange-500 px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid items-stretch gap-6 lg:grid-cols-2">
                <div className="flex flex-col justify-center text-white">
                    <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                        Get 20% Off Your First Order
                    </h2>
                    <p className="mt-4 max-w-md text-sm text-orange-50 sm:text-base">
                        Use code <span className="font-bold">FRESH20</span> at checkout
                        and enjoy our premium selection of organic produce straight from
                        local farms.
                    </p>
                    <button
                        type="button"
                        className="mt-6 w-fit rounded-lg bg-white px-6 py-3 text-sm font-semibold text-orange-500 shadow-sm transition-colors hover:bg-orange-50"
                    >
                        Claim Offer
                    </button>
                </div>

                <div className="h-60 w-full overflow-hidden rounded-xl sm:h-64 lg:h-92">
                    <img
                        src={Promobarimg}
                        alt="Fresh vegetables splashing into a glass bowl"
                        className="h-full w-full object-cover object-center"
                    />
                </div>
            </div>
        </section>
    );
};

export default PromoBanner;