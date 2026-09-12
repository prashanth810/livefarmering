import React from 'react'
import HeroBanner from './HeroBanner'
import CategorySection from './CategorySection'
import FeaturedProducts from './FeaturedProducts'
import PromoBanner from './PromoBanner'
import Testimonials from './Testimonials'

const HomePage = () => {
    return (
        <section>
            <HeroBanner />
            <CategorySection />
            <FeaturedProducts />
            <PromoBanner />
            <Testimonials />
        </section>
    )
}

export default HomePage
