import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiBriefcase, FiEdit2, FiHome, FiMapPin, FiPhone, FiPlus, FiStar, FiTrash2 } from "react-icons/fi";
import {
    createaddress,
    deleteaddress,
    getalladdress,
    handlemakedefault,
    updateaddress,
} from "../../redux/Slices/AddressSlice";
import { showErrorToast, showSuccessToast, showWarningToast } from "../../components/Toast";
import AddressModal from "../../reusables/Addressmodal";
import DeleteConfirmModal from "../../reusables/DeleteConfirmModal";
import savelocation from '../../assets/savelocation.png'

const MAX_ADDRESSES = 3;

const typeMeta = {
    home: { label: "Home", icon: FiHome, tile: "bg-orange-50 text-orange-500" },
    work: { label: "Work", icon: FiBriefcase, tile: "bg-blue-50 text-blue-500" },
    other: { label: "Other", icon: FiMapPin, tile: "bg-red-50 text-red-500" },
};
const getMeta = (type) => typeMeta[String(type || "other").toLowerCase()] || typeMeta.other;

const getErrorMessage = (error, fallback) =>
    typeof error === "string" ? error : error?.message || fallback;

const ManageAddresses = () => {
    const dispatch = useDispatch();

    const { addressloading, addressdata, addresserror } = useSelector((s) => s.address.address);
    const { createaddressloading } = useSelector((s) => s.address.createaddress);
    const { updateaddressloading } = useSelector((s) => s.address.updateaddress);

    const [addressmodel, setAddressmodel] = useState(false);
    const [editTarget, setEditTarget] = useState(null); // null = add mode
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [defaultingId, setDefaultingId] = useState(null);

    const addresses = useMemo(() => {
        if (Array.isArray(addressdata)) return addressdata;
        if (Array.isArray(addressdata?.data)) return addressdata.data;
        return [];
    }, [addressdata]);

    const canAdd = addresses.length < MAX_ADDRESSES;
    const saving = createaddressloading || updateaddressloading;

    useEffect(() => {
        dispatch(getalladdress());
    }, [dispatch]);

    // ---- add / edit modal ----
    const openAdd = () => {
        if (!canAdd) {
            showWarningToast(`You can save up to ${MAX_ADDRESSES} addresses. Delete one to add a new address.`);
            return;
        }
        setEditTarget(null);
        setAddressmodel(true);
    };
    const openEdit = (address) => {
        setEditTarget(address);
        setAddressmodel(true);
    };
    const closeModal = () => {
        setAddressmodel(false);
        setEditTarget(null);
    };

    // ---- add / update ----
    const handleSubmit = async (formData) => {
        try {
            if (editTarget) {
                await dispatch(updateaddress({ id: editTarget._id, data: formData })).unwrap();
                showSuccessToast("Address updated successfully");
            } else {
                await dispatch(createaddress(formData)).unwrap();
                showSuccessToast("Address added successfully");
            }
            dispatch(getalladdress());
            closeModal();
        } catch (error) {
            showErrorToast(getErrorMessage(error, editTarget ? "Unable to update address" : "Unable to add address"));
        }
    };

    // ---- set default ----
    const handleSetDefault = async (address) => {
        if (address.is_default || defaultingId) return;
        setDefaultingId(address._id);
        try {
            await dispatch(handlemakedefault({ addressId: address._id, is_default: true })).unwrap();
            showSuccessToast("Default address updated successfully");
        } catch (error) {
            showErrorToast(getErrorMessage(error, "Unable to update default address"));
        } finally {
            setDefaultingId(null);
        }
    };

    // ---- delete ----
    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await dispatch(deleteaddress(deleteTarget._id)).unwrap();
            showSuccessToast("Address deleted successfully");
            setDeleteTarget(null);
        } catch (error) {
            showErrorToast(getErrorMessage(error, "Unable to delete address"));
        } finally {
            setDeleting(false);
        }
    };

    return (
        <main className="mx-auto min-h-[70vh] w-full px-4 py-6 sm:px-6 xl:max-w-[90%]">
            {/* header */}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Manage Addresses</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Save and manage your delivery addresses for a faster checkout experience.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openAdd}
                    className="flex cursor-pointer items-center gap-2 bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                    <FiPlus className="h-4 w-4" /> Add New Address
                </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* list */}
                <section className="space-y-4">
                    {addressloading && addresses.length === 0 && (
                        <>
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="h-36 animate-pulse border border-gray-100 bg-gray-50" />
                            ))}
                        </>
                    )}

                    {addresserror && !addressloading && addresses.length === 0 && (
                        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                            {getErrorMessage(addresserror, "Unable to load addresses")}
                            <button
                                type="button"
                                onClick={() => dispatch(getalladdress())}
                                className="ml-3 cursor-pointer font-semibold underline"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!addressloading && !addresserror && addresses.length === 0 && (
                        <div className="flex flex-col items-center border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <FiMapPin className="h-6 w-6" />
                            </span>
                            <h2 className="mt-4 text-base font-semibold text-gray-900">No saved addresses yet</h2>
                            <p className="mt-1 text-sm text-slate-500">Add your first address for faster checkout.</p>
                            <button
                                type="button"
                                onClick={openAdd}
                                className="mt-5 cursor-pointer bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                                Add New Address
                            </button>
                        </div>
                    )}

                    {addresses.slice(0, MAX_ADDRESSES).map((address) => {
                        const meta = getMeta(address.address_type);
                        const Icon = meta.icon;
                        return (
                            <article
                                key={address._id}
                                className={`flex flex-col gap-4 border p-4 shadow-sm transition-colors sm:flex-row sm:items-start ${address.is_default ? "border-emerald-300 bg-emerald-50/50" : "border-gray-200 bg-white"
                                    }`}
                            >
                                <span className={`flex h-16 w-16 shrink-0 items-center justify-center ${meta.tile}`}>
                                    <Icon className="h-7 w-7" />
                                </span>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-base font-bold text-gray-900">{meta.label}</h2>
                                        {address.is_default && (
                                            <span className="flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                                                <FiStar className="h-3 w-3" /> Default Address
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm font-semibold text-gray-800">{address.full_name}</p>
                                    <div className="mt-1 space-y-0.5 text-sm text-slate-500">
                                        <p>{[address.building_number, address.street].filter(Boolean).join(", ")}</p>
                                        {address.landmark && <p>{address.landmark}</p>}
                                        <p>
                                            {address.city}, {address.state} - {address.pincode}
                                        </p>
                                        <p>{address.country}</p>
                                    </div>
                                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                                        <FiPhone className="h-3.5 w-3.5 text-gray-400" /> +91 {address.phone}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                    {!address.is_default && (
                                        <button
                                            type="button"
                                            onClick={() => handleSetDefault(address)}
                                            disabled={Boolean(defaultingId)}
                                            className="flex cursor-pointer items-center gap-1.5 border border-emerald-500 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <FiStar className="h-3.5 w-3.5" />
                                            {defaultingId === address._id ? "Updating..." : "Set as Default"}
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => openEdit(address)}
                                        aria-label={`Edit ${meta.label} address`}
                                        className="flex h-8 w-8 cursor-pointer items-center justify-center border border-green-200 bg-green-50 text-green-500 transition-colors hover:bg-green-500 hover:text-white"
                                    >
                                        <FiEdit2 className="h-3.5 w-3.5" /> 
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteTarget(address)}
                                        aria-label={`Delete ${meta.label} address`}
                                        className="flex h-8 w-8 cursor-pointer items-center justify-center border border-orange-200 bg-orange-50 text-red-500 transition-colors hover:bg-orange-500 hover:text-white"
                                    >
                                        <FiTrash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </article>
                        );
                    })}
{/* info banner */}
<div className="flex items-center gap-4 overflow-hidden border border-white/60 bg-gradient-to-r from-orange-50 via-sky-50 to-indigo-100 px-4 py-4 sm:gap-8 sm:px-8 sm:py-5">
    <img
        src={savelocation}
        alt="Save multiple addresses"
        className="h-20 w-auto shrink-0 object-contain sm:h-28"
    />
    <div className="min-w-0">
        <h3 className="text-base font-semibold text-gray-700 sm:text-lg">
            Save multiple addresses
        </h3>
        <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500 sm:text-sm">
            Add home, work or other addresses and choose your preferred address during checkout.
        </p>
    </div>
</div>
                </section>

                {/* side summary (desktop) */}
                <aside className="hidden h-fit border border-gray-200 bg-white p-5 lg:block">
                    <h3 className="text-sm font-bold text-gray-900">Saved addresses</h3>
                    <p className="mt-2 text-3xl font-bold text-emerald-600">
                        {addresses.length}
                        <span className="text-base font-medium text-slate-400"> / {MAX_ADDRESSES}</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        {canAdd ? `You can add ${MAX_ADDRESSES - addresses.length} more.` : "Limit reached. Delete one to add a new address."}
                    </p>
                </aside>
            </div>

            {/* add / edit — your existing AddressModal */}
            <AddressModal
                open={addressmodel}
                onClose={closeModal}
                onSubmit={handleSubmit}
                initialData={editTarget}
                loading={saving}
            />

            <DeleteConfirmModal
                open={Boolean(deleteTarget)}
                onClose={() => !deleting && setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                loading={deleting}
                title="Delete Address"
                message="Are you sure you want to delete this address? This action cannot be undone."
                confirmLabel="Delete Address"
            />
        </main>
    );
};

export default ManageAddresses;