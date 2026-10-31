export const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    (typeof error?.response?.data === "string" ? error.response.data : null) ||
    (error?.response?.status === 429 ? "Too many requests" : null) ||
    error?.message ||
    "Something went wrong";
