import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiBell, FiLock, FiUser } from "react-icons/fi";
import { deleteaccount, handlefetchprofileinfo, updateprofile } from "../../redux/Slices/AuthSlice";
import DeleteConfirmModal from "../../reusables/DeleteConfirmModal";
import PersonalInfo from "./Personalinfo";
import ChangePassword from "./Changepassword";
import NotificationPrefs from "./Notificationprefs";
import DangerZone from "./Dangerzone";
import { showErrorToast, showSuccessToast } from "../../components/Toast";
import { useNavigate } from "react-router-dom"; // NEW

const SECTIONS = [
    { id: "profile-settings", label: "Profile Settings", icon: FiUser },
    { id: "reset-password", label: "Reset Password", icon: FiLock },
    { id: "notifications", label: "Notifications", icon: FiBell },
];

const soon = (message) => toast(message, { id: "settings-toast" });

const AccountSettings = () => {
    const navigate = useNavigate(); // NEW
    const dispatch = useDispatch();
    const {
        profiledata: profile,
        profileerror,
        profileloading,
        profileupdating,
    } = useSelector((state) => state.auth.profile);

    const [activeId, setActiveId] = useState(SECTIONS[0].id);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [confirm, setConfirm] = useState("");

    const ready = Boolean(profile);

    useEffect(() => {
        dispatch(handlefetchprofileinfo());
    }, [dispatch]);

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

    const handleSaveProfile = async (values) => {
        if (!profile?._id) {
            showErrorToast("Unable to identify your profile. Please refresh and try again.");
            return;
        }

        const data = new FormData();
        data.append("name", values.name);
        if (values.phone) data.append("phone", values.phone);
        if (values.date_of_birth) data.append("date_of_birth", values.date_of_birth);
        if (values.gender) data.append("gender", values.gender);
        if (values.profile_pic instanceof File) data.append("profile_pic", values.profile_pic);

        try {
            await dispatch(updateprofile({ id: profile._id, data })).unwrap();
            showSuccessToast("Profile updated successfully");
        } catch (error) {
            showErrorToast(typeof error === "string" ? error : "Unable to update your profile");
        }
    };

    const handleChangePassword = async () => {
        // TODO: await dispatch(changepassword(values)).unwrap(); return true;
        soon("Password change will be available soon");
        return false;
    };

    const handleCloseDelete = () => {
        setDeleteOpen(false);
        setConfirm("");
    };

    const handleConfirmDelete = async () => {
        if (!profile?._id) {
            showErrorToast("Unable to identify your account. Please refresh and try again.");
            return;
        }

        if (confirm.trim() !== "DELETE") {
            showErrorToast('Type "DELETE" to confirm');
            return;
        }

        try {
            const result = await dispatch(
                deleteaccount({ id: profile._id, confirm })
            ).unwrap();

            handleCloseDelete();
            showSuccessToast(result?.message || "Account deleted successfully");
            navigate("/login", { replace: true });
        } catch (error) {
            showErrorToast(typeof error === "string" ? error : "Unable to delete your account");
        }
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
            {profileloading && profile && (
                <p role="status" className="text-sm text-gray-600">Refreshing your profile…</p>
            )}
            {profileerror && profile && (
                <p role="alert" className="text-sm text-red-700">
                    We couldn&apos;t refresh your profile. The details below may be out of date.
                </p>
            )}

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
                    <PersonalInfo
                        key={[
                            profile._id,
                            profile.name,
                            profile.email,
                            profile.phone,
                            profile.date_of_birth,
                            profile.gender,
                            profile.profile_pic,
                        ].join("|")}
                        profile={profile}
                        onSave={handleSaveProfile}
                        saving={profileupdating}
                    />
                    <ChangePassword onSubmit={handleChangePassword} />
                    <NotificationPrefs />
                    <DangerZone onDelete={() => setDeleteOpen(true)} />
                </div>
            </div>

            <DeleteConfirmModal
                open={deleteOpen}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
                requireConfirm
                confirm={confirm}
                setConfirm={setConfirm}
                loading={profileupdating}   // or a dedicated deleting flag
                title="Delete Account"
                confirmLabel="Delete Account"
                message="Are you sure you want to permanently delete your account? All your data will be removed and this action cannot be undone."
            />
        </main>
    );
};

export default AccountSettings;