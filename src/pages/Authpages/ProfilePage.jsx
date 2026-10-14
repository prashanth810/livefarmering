import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ProfileBanner from "../profile/Profilebanner";
import ProfileSummary from "../profile/Profilesummary";
import RecentOrders from "../profile/Recentorders";
import QuickActions from "../profile/Quickactions";
import OffersBanner from "../profile/Offersbanner";
import { DUMMY_ORDERS } from "../profile/Profiledata";
import { handlefetchprofileinfo } from "../../redux/Slices/AuthSlice";
import ProfileSummarySkeleton from "../../reusables/ProfileSummarySkeleton";
import RecentOrdersSkeleton from "../../reusables/RecentOrdersSkeleton";
import QuickActionsSkeleton from "../../reusables/QuickActionsSkeleton";

const formatMemberSince = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { profileloading, profiledata: profile, profileerror } = useSelector((state) => state.auth.profile);

    useEffect(() => {
        if (!profile) dispatch(handlefetchprofileinfo());
    }, [dispatch, profile]);

    const orders = Array.isArray(profile?.orders) && profile.orders.length ? profile.orders : DUMMY_ORDERS; // dummy until backend sends orders

    const stats = {
        orders: profile?.totalOrders ?? orders.length,
        favourites: profile?.favourites,
        wallet: profile?.walletBalance,
        offers: profile?.activeOffers,
    };

    const comingSoon = () => toast("Coming soon", { id: "profile-toast" });

    const handleQuickAction = (action) => {
        if (action.to) navigate(action.to);
        else comingSoon();
    };

    if (!profile) {
        return (
            <main className="mx-auto flex xl:max-w-[90%] flex-col gap-5 px-4 py-6 sm:px-6">
                {profileerror ? (
                    <p role="alert" className="text-sm text-gray-600">
                        Unable to load your profile.
                    </p>
                ) : (
                    <>
                        <div className="flex items-center gap-4 my-3 p-5 border border-gray-300">
                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="h-6 w-40 max-w-full rounded bg-gray-200" />
                                <div className="h-5 w-52 max-w-full rounded bg-gray-200" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-5 w-32 rounded bg-gray-200" />
                                <div className="h-5 w-32 rounded bg-gray-200" />
                                <div className="h-5 w-32 rounded bg-gray-200" />
                            </div>
                        </div>
                        <ProfileSummarySkeleton />
                        <RecentOrdersSkeleton />
                        <QuickActionsSkeleton />


                        <div className="flex items-center justify-between gap-4 border border-gray-200 shadow-sm p-4">
                            <div className="border border-gray-300 bg-gray-100 h-8 w-72">
                            </div>
                            <div className="border border-gray-300 bg-gray-100 h-8 w-72">
                            </div>
                            <div className="border border-gray-300 bg-gray-100 h-8 w-72">
                            </div>
                            <div className="border border-gray-300 bg-gray-100 h-8 w-72">
                            </div>
                        </div>
                    </>
                )}
            </main>
        );
    }

    return (
        <main className="mx-auto flex xl:max-w-[90%] flex-col gap-5 px-4 py-6 sm:px-6">
            <ProfileBanner name={profile.name} />
            <ProfileSummary
                name={profile.name}
                email={profile?.email}
                phone={profile?.phone}
                image={profile?.profile_pic}
                role={profile?.role}
                memberSince={formatMemberSince(profile?.createdAt)}
                stats={stats}
                onEdit={comingSoon}
                onChangePhoto={comingSoon}
            />
            <RecentOrders orders={orders} />
            <QuickActions onAction={handleQuickAction} />
            <OffersBanner />
        </main>
    );
};

export default ProfilePage;