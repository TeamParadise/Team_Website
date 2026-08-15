import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Keep this script dependency-free so it can also run on its own.
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDirectory, "..");
const pagesDirectory = join(root, "Pages");
const fragmentNames = new Set(["navbar.html", "socials.html"]);

const htmlFiles = [
    join(root, "index.html"),
    ...readdirSync(pagesDirectory)
        .filter((name) => name.endsWith(".html"))
        .sort()
        .map((name) => join(pagesDirectory, name)),
];

const problems = [];

for (const file of htmlFiles) {
    const source = readFileSync(file, "utf8");
    const liveSource = source.replace(/<!--[\s\S]*?-->/g, "");
    const relativeName = file.slice(root.length + 1);

    // External URLs and page anchors are not files in this repository.
    for (const match of liveSource.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
        const target = match[1];

        if (!target.startsWith("/") || target.startsWith("//")) continue;

        const pathWithoutQuery = target.split(/[?#]/, 1)[0];
        const localPath = join(root, decodeURIComponent(pathWithoutQuery));

        if (!existsSync(localPath)) {
            problems.push(`${relativeName}: missing local target ${target}`);
        }
    }

    // Duplicate IDs break labels, skip links and JavaScript selectors.
    const ids = [...liveSource.matchAll(/\bid=["']([^"']+)["']/g)].map(
        (match) => match[1]
    );
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

    for (const id of new Set(duplicateIds)) {
        problems.push(`${relativeName}: duplicate id "${id}"`);
    }

    // Image dimensions stop the layout jumping while an image downloads.
    for (const match of liveSource.matchAll(/<img\b[^>]*>/g)) {
        const image = match[0];
        if (!/\bwidth=["'][^"']+["']/.test(image)) {
            problems.push(`${relativeName}: image is missing a width`);
        }
        if (!/\bheight=["'][^"']+["']/.test(image)) {
            problems.push(`${relativeName}: image is missing a height`);
        }
    }

    for (const match of liveSource.matchAll(/<iframe\b[^>]*>/g)) {
        if (!/\btitle=["'][^"']+["']/.test(match[0])) {
            problems.push(`${relativeName}: iframe is missing a title`);
        }
    }

    if (fragmentNames.has(relativeName.split("/").at(-1))) continue;

    const requiredPatterns = [
        ["a page title", /<title>[^<]+<\/title>/],
        ["one main heading", /<h1(?:\s|>)/],
        ["the main-content landmark", /<main[^>]+id=["']main-content["']/],
        ["a skip link", /class=["'][^"']*skip-link/],
        ["the shared site script", /src=["']\/Pages\/site\.js["']/],
        ["the navigation placeholder", /id=["']navbar["']/],
        ["the footer placeholder", /id=["']socials["']/],
    ];

    for (const [description, pattern] of requiredPatterns) {
        if (!pattern.test(liveSource)) {
            problems.push(`${relativeName}: missing ${description}`);
        }
    }

    if (liveSource.includes("cdn.tailwindcss.com")) {
        problems.push(`${relativeName}: Tailwind Play CDN must not be used in production`);
    }
}
if (problems.length > 0) {
    console.error("Site checks failed:\n");
    for (const problem of problems) console.error(`- ${problem}`);
    process.exitCode = 1;
} else {
    console.log(`Site checks passed for ${htmlFiles.length} HTML files.`);
}
