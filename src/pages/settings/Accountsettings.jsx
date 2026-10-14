import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiBell, FiLock, FiUser } from "react-icons/fi";
import { handlefetchprofileinfo } from "../../redux/Slices/AuthSlice";
import DeleteConfirmModal from "../../reusables/DeleteConfirmModal";
import PersonalInfo from "./Personalinfo";
import ChangePassword from "./Changepassword";
import NotificationPrefs from "./Notificationprefs";
import DangerZone from "./Dangerzone";

const SECTIONS = [
    { id: "profile-settings", label: "Profile Settings", icon: FiUser },
    { id: "reset-password", label: "Reset Password", icon: FiLock },
    { id: "notifications", label: "Notifications", icon: FiBell },
];

const soon = (message) => toast(message, { id: "settings-toast" });

const AccountSettings = () => {
    const dispatch = useDispatch();
    const { profiledata: profile, profileerror } = useSelector((state) => state.auth.profile);

    const [activeId, setActiveId] = useState(SECTIONS[0].id);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const ready = Boolean(profile);

    useEffect(() => {
        if (!profile) dispatch(handlefetchprofileinfo());
    }, [dispatch, profile]);

    // highlight the sidebar item of the section that is on screen while scrolling
    useEffect(() => {
        if (!ready) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveId(entry.target.id);
                });
            },
            { rootMargin: "-20% 0px -65% 0px" }
        );

        SECTIONS.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [ready]);

    const goToSection = (id) => {
        setActiveId(id);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // ---- handlers (connect these to your APIs) ----
    const handleSaveProfile = async () => {
        // TODO: await dispatch(updateprofile(values)).unwrap(); then dispatch(handlefetchprofileinfo())
        soon("Profile update will be available soon");
    };

    const handleChangePassword = async () => {
        // TODO: await dispatch(changepassword(values)).unwrap(); return true;
        soon("Password change will be available soon");
        return false;
    };

    const handleConfirmDelete = () => {
        // TODO: await dispatch(deleteaccount()).unwrap(); then logout
        setDeleteOpen(false);
        soon("Account deletion will be available soon");
    };

    if (!profile) {
        return (
            <main className="mx-auto flex xl:max-w-[90%] flex-col gap-5 px-4 py-6 sm:px-6">
                <p role={profileerror ? "alert" : undefined} className="text-sm text-gray-600">
                    {profileerror ? "Unable to load your settings." : "Loading settings..."}
                </p>
            </main>
        );
    }

    return (
        <main className="mx-auto flex xl:max-w-[90%] flex-col gap-5 px-4 py-10 sm:px-6">
            <h1 className="text-2xl font-semibold text-gray-900">Account Settings</h1>

            <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                {/* ---------- sidebar ---------- */}
                <nav
                    aria-label="Settings sections"
                    className="flex gap-2 overflow-x-auto border border-gray-200 bg-white p-4 shadow-sm lg:sticky lg:top-40 lg:flex-col lg:overflow-visible"
                >
                    {SECTIONS.map(({ id, label, icon: Icon }) => {
                        const active = activeId === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => goToSection(id)}
                                aria-current={active ? "true" : undefined}
                                className={`flex shrink-0 cursor-pointer items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold transition-colors ${active
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                {label}
                            </button>
                        );
                    })}
                </nav>

                {/* ---------- sections ---------- */}
                <div className="flex min-w-0 flex-col gap-5">
                    <PersonalInfo profile={profile} onSave={handleSaveProfile} />
                    <ChangePassword onSubmit={handleChangePassword} />
                    <NotificationPrefs />
                    <DangerZone onDelete={() => setDeleteOpen(true)} />
                </div>
            </div>

            <DeleteConfirmModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={false}
                message="Are you sure you want to permanently delete your account? All your data will be removed and this action cannot be undone."
            />
        </main>
    );
};

export default AccountSettings;