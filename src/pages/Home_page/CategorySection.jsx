import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getallcategories, setSelectedCategory } from "../../redux/Slices/ProductSlice";
import Cateoryloader from "../../reusables/Cateoryloader";


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

                <div className="mt-8 flex gap-7 overflow-x-auto py-4 pb-3 scrollbar">
                    {categorydata.map((category) => (
                        <div
                            key={category._id}
                            className={`flex h-28 w-28 shrink-0 items-center justify-center border bg-white px-3 shadow-sm rounded ${selectedCategoryId === category._id
                                ? "border-orange-500"
                                : "border-0"
                                }`} >
                            <button
                                type="button"
                                aria-pressed={selectedCategoryId === category._id}
                                onClick={() => {
                                    dispatch(setSelectedCategory(category._id));
                                    document.getElementById("featured-products")?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                    });
                                }}
                                className="group flex h-full w-full flex-col items-center justify-center gap-3" >
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm transition-transform group-hover:scale-[1.02]">
                                    <img
                                        src={category.imageurl}
                                        alt={category._id}
                                        className="h-full w-full object-cover"
                                    />
                                </span>

                                <span className="whitespace-nowrap text-xs font-medium text-gray-900">
                                    {category.name}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;