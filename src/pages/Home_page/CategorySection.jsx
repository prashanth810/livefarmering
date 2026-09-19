import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getallcategories, setSelectedCategory } from "../../redux/Slices/ProductSlice";
import Cateoryloader from "../../reusables/Cateoryloader";

// const categories = [
//     {
//         id: "fresh-fruits",
//         label: "Fresh Fruits",
//         image:
//             "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=200&q=80",
//         href: "/category/fresh-fruits",
//     },
//     {
//         id: "vegetables",
//         label: "Vegetables",
//         image:
//             "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80",
//         href: "/category/vegetables",
//     },
//     {
//         id: "dairy-eggs",
//         label: "Dairy & Eggs",
//         image:
//             "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80",
//         href: "/category/dairy-eggs",
//     },
//     {
//         id: "bakery",
//         label: "Bakery",
//         image:
//             "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80",
//         href: "/category/bakery",
//     },
//     {
//         id: "meat-seafood",
//         label: "Meat & Seafood",
//         image:
//             "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=200&q=80",
//         href: "/category/meat-seafood",
//     },
//     {
//         id: "pantry",
//         label: "Pantry",
//         image:
//             "https://images.unsplash.com/photo-1584385002340-d886f3a0f097?auto=format&fit=crop&w=200&q=80",
//         href: "/category/pantry",
//     }, {
//         id: "bakery",
//         label: "Bakery",
//         image:
//             "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80",
//         href: "/category/bakery",
//     }, {
//         id: "meat-seafood",
//         label: "Meat & Seafood",
//         image:
//             "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=200&q=80",
//         href: "/category/meat-seafood",
//     }, {
//         id: "dairy-eggs",
//         label: "Dairy & Eggs",
//         image:
//             "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80",
//         href: "/category/dairy-eggs",
//     }, {
//         id: "pantry",
//         label: "Pantry",
//         image:
//             "https://images.unsplash.com/photo-1584385002340-d886f3a0f097?auto=format&fit=crop&w=200&q=80",
//         href: "/category/pantry",
//     }, {
//         id: "fresh-fruits",
//         label: "Fresh Fruits",
//         image:
//             "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=200&q=80",
//         href: "/category/fresh-fruits",
//     },
//     {
//         id: "vegetables",
//         label: "Vegetables",
//         image:
//             "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80",
//         href: "/category/vegetables",
//     },
//     {
//         id: "dairy-eggs",
//         label: "Dairy & Eggs",
//         image:
//             "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80",
//         href: "/category/dairy-eggs",
//     },
//     {
//         id: "bakery",
//         label: "Bakery",
//         image:
//             "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80",
//         href: "/category/bakery",
//     },
//     {
//         id: "meat-seafood",
//         label: "Meat & Seafood",
//         image:
//             "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=200&q=80",
//         href: "/category/meat-seafood",
//     },
//     {
//         id: "pantry",
//         label: "Pantry",
//         image:
//             "https://images.unsplash.com/photo-1584385002340-d886f3a0f097?auto=format&fit=crop&w=200&q=80",
//         href: "/category/pantry",
//     }, {
//         id: "bakery",
//         label: "Bakery",
//         image:
//             "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80",
//         href: "/category/bakery",
//     },
// ];

const CategorySection = () => {
    const dispatch = useDispatch();
    const { categorydata, categoryloading } = useSelector((state) => state.product.category);
    const selectedCategoryId = useSelector((state) => state.product.selectedCategoryId);


    useEffect(() => {
        dispatch(getallcategories());
    }, [dispatch]);

    useEffect(() => {
        if (!selectedCategoryId && categorydata.length > 0) {
            dispatch(setSelectedCategory(categorydata[0]._id));
        }
    }, [categorydata, dispatch, selectedCategoryId]);

    if (categoryloading) {
        return (
            <Cateoryloader />
        )
    }


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
                    {categorydata.map((category) => (
                        <Link
                            key={category._id}
                            to={category.href}
                            onClick={() => dispatch(setSelectedCategory(category._id))}
                            className="group flex shrink-0 flex-col items-center gap-3"
                        >
                            <span className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-white shadow-sm transition-colors transition-transform group-hover:scale-[1.02] ${selectedCategoryId === category._id
                                ? "border-orange-500"
                                : "border-transparent"
                                }`}>
                                <img
                                    src={category.imageurl}
                                    alt={category._id}
                                    className="h-full w-full object-cover"
                                />
                            </span>

                            <span className="whitespace-nowrap text-sm font-medium text-gray-900">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;