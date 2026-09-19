import { useSelector } from "react-redux";
import { FiUser } from "react-icons/fi";

const ProfilePage = () => {
    const profile = useSelector((state) => state.auth.profile.profiledata);
    const image = profile?.imageurl || profile?.imageUrl || profile?.profileImage || profile?.avatar;
    const name = profile?.name || profile?.fullname || profile?.username || "User";

    return (
        <main className="mx-auto max-w-3xl px-4 py-12">
            <div className="border border-gray-200 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-4">
                    {image ? (
                        <img src={image} alt={name} className="h-16 w-16 rounded-full object-cover" />
                    ) : (
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                            <FiUser className="h-7 w-7" />
                        </span>
                    )}
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">{name}</h1>
                        {profile?.email && <p className="text-sm text-gray-500">{profile.email}</p>}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;
