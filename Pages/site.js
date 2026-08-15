// Load a shared file into one of the empty placeholders in a page.
async function loadFragment(elementId, path) {
    const container = document.getElementById(elementId);

    if (!container) return;

    try {
        const response = await fetch(path);

        // fetch() does not treat a 404 as an error, so check it here.
        if (!response.ok) {
            throw new Error(`Unable to load ${path} (${response.status})`);
        }

        container.innerHTML = await response.text();

        container.removeAttribute("aria-busy");
    } catch (error) {
        console.error(error);
        container.removeAttribute("aria-busy");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await Promise.all([
        loadFragment("navbar", "/Pages/navbar.html"),
        loadFragment("socials", "/Pages/socials.html"),
    ]);

    // `/` and `/index.html` are both the home page.
    const currentPath = window.location.pathname.replace(/\/$/, "/index.html");
    const currentLink = document.querySelector(
        `#navbar a[href="${currentPath}"]`
    );

    currentLink?.setAttribute("aria-current", "page");
});
