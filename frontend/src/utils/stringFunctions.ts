export const getInitialsString = (fullName?: string): string => {
    if (!fullName) return "";

    const parts = fullName.trim().split(" ");

    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }

    const first = parts[0][0]?.toUpperCase() ?? "";
    const last = parts[parts.length - 1][0]?.toUpperCase() ?? "";

    return first + last;
};
