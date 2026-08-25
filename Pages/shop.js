const shop = document.querySelector(".shop");

if (shop) {
    const apiUrl = shop.dataset.shopApi.replace(/\/$/, "");
    const productsElement = document.getElementById("shop-products");
    const statusElement = document.getElementById("shop-status");
    const cartElement = document.getElementById("shop-cart-items");
    const totalElement = document.getElementById("shop-cart-total");
    const checkoutButton = document.getElementById("shop-checkout");
    const productTemplate = document.getElementById("shop-product-template");
    const cart = new Map();

    function formatPrice(amount, currency) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.toUpperCase(),
        }).format(amount / 100);
    }

    function selectedVariant(product, select) {
        return product.variants.find((variant) => variant.id === select.value);
    }

    function renderCart() {
        const entries = [...cart.values()];
        const total = entries.reduce(
            (sum, item) => sum + item.variant.price * item.quantity,
            0,
        );

        cartElement.replaceChildren();
        totalElement.textContent = `Total: ${formatPrice(total, entries[0]?.variant.currency ?? "usd")}`;
        checkoutButton.disabled = entries.length === 0 || !apiUrl;

        if (entries.length === 0) {
            cartElement.innerHTML = "<p>Your cart is empty.</p>";
            return;
        }

        const list = document.createElement("ul");
        list.className = "shop-cart-list";
        for (const item of entries) {
            const row = document.createElement("li");
            row.className = "shop-cart-item";
            const name = document.createElement("span");
            name.textContent = `${item.product.name} (${item.variant.label}) × ${item.quantity}`;
            const price = document.createElement("span");
            price.textContent = formatPrice(
                item.variant.price * item.quantity,
                item.variant.currency,
            );
            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "shop-remove-item";
            remove.textContent = "Remove";
            remove.addEventListener("click", () => {
                cart.delete(item.variant.id);
                renderCart();
            });
            row.append(name, price, remove);
            list.append(row);
        }
        cartElement.append(list);
    }

    function renderProducts(products) {
        productsElement.replaceChildren();
        for (const product of products) {
            if (
                !product.variants?.some(
                    (variant) => variant.availableQuantity > 0,
                )
            )
                continue;

            const content = productTemplate.content.cloneNode(true);
            const image = content.querySelector(".shop-product-image");
            const name = content.querySelector(".shop-product-name");
            const description = content.querySelector(
                ".shop-product-description",
            );
            const select = content.querySelector(".shop-product-options");
            const price = content.querySelector(".shop-product-price");
            const button = content.querySelector(".shop-add-to-cart");

            image.src = product.imageUrl;
            image.alt = product.name;
            name.textContent = product.name;
            description.textContent = product.description;

            for (const variant of product.variants) {
                if (variant.availableQuantity < 1) continue;
                const option = document.createElement("option");
                option.value = variant.id;
                option.textContent = `${variant.label} — ${formatPrice(variant.price, variant.currency)}`;
                select.append(option);
            }

            function updatePrice() {
                const variant = selectedVariant(product, select);
                price.textContent = `${formatPrice(variant.price, variant.currency)} · ${variant.availableQuantity} available`;
            }

            select.addEventListener("change", updatePrice);
            button.addEventListener("click", () => {
                const variant = selectedVariant(product, select);
                const current = cart.get(variant.id);
                if (current?.quantity >= variant.availableQuantity) return;
                cart.set(variant.id, {
                    product,
                    variant,
                    quantity: (current?.quantity ?? 0) + 1,
                });
                renderCart();
            });
            updatePrice();
            productsElement.append(content);
        }

        if (!productsElement.children.length) {
            statusElement.textContent =
                "There are no products available right now. Please check back soon.";
        } else {
            statusElement.textContent =
                "Choose an item to add it to your cart.";
        }
    }

    async function loadProducts() {
        if (!apiUrl) return;
        statusElement.textContent = "Loading the team shop…";
        try {
            const response = await fetch(`${apiUrl}/products`);
            if (!response.ok)
                throw new Error(`Shop request failed: ${response.status}`);
            renderProducts(await response.json());
        } catch (error) {
            console.error(error);
            statusElement.textContent =
                "The shop is unavailable right now. Please try again later.";
        }
    }

    checkoutButton.addEventListener("click", () => {
        // The Worker will replace this with an embedded Stripe Checkout session.
    });

    renderCart();
    loadProducts();
}
