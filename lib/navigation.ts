export const reloadPage = () => {
    if (typeof window !== 'undefined') {
        window.location.reload();
    }
};
