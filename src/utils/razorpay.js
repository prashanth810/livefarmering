const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export const loadRazorpay = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);

        const script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

// resolves with { razorpay_payment_id, razorpay_order_id, razorpay_signature }
// rejects if the user closes the popup
export const openRazorpay = async ({ order, razorpay, profile, onFailed }) => {
    const loaded = await loadRazorpay();
    if (!loaded) throw new Error("Unable to load Razorpay. Check your internet connection.");

    return new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
            key: razorpay.key,
            amount: razorpay.amount, // paise, comes from the server
            currency: razorpay.currency,
            order_id: razorpay.id,
            name: "Freshies",
            description: `Order #${String(order._id).slice(-6).toUpperCase()}`,
            prefill: {
                name: profile?.name || "",
                email: profile?.email || "",
                contact: profile?.phone || "",
            },
            theme: { color: "#059669" },
            handler: (response) => resolve(response),
            modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
        });

        // user can retry inside the popup, so don't reject here
        rzp.on("payment.failed", (res) => onFailed?.(res?.error?.description));
        rzp.open();
    });
};