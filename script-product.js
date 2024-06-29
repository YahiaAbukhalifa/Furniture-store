function getQueryParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

async function fetchProductData(productId) {
    try {
        let response = await fetch("./products.json");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        let products = await response.json();
        return products.find(product => product.id === productId);
    } catch (error) {
        console.error("Error fetching product data:", error);
    }
}

function displayProductData(product) {
    if (!product) {
        console.error("Product not found");
        return;
    }

    document.querySelector(".image-preview img").src = product.image;
    document.querySelector(".details .title").textContent = product.title;
    document.querySelector(".details .price").textContent = `${product.price} L.E`;

    let ratingContainer = document.querySelector(".details .rating");
    ratingContainer.innerHTML = "";

    let rating = parseFloat(product.rating);
    let fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {
        let star = document.createElement("i");
        star.classList.add("fa-solid", "fa-star", "active-rate");
        ratingContainer.appendChild(star);
    }

    if (rating % 1 !== 0) {
        let halfStar = document.createElement("i");
        halfStar.classList.add("fa-solid", "fa-star-half", "active-rate");
        ratingContainer.appendChild(halfStar);
    }

    for (let i = 0; i < 5 - Math.ceil(rating); i++) {
        let star = document.createElement("i");
        star.classList.add("fa-solid", "fa-star");
        ratingContainer.appendChild(star);
    }

    let ratingCount = document.createElement("span");
    ratingCount.textContent = ` (${product.ratingCount})`;
    ratingContainer.appendChild(ratingCount);

    document.querySelector(".dimensions .width").textContent = product.dimensions.width;
    document.querySelector(".dimensions .height").textContent = product.dimensions.height;
    document.querySelector(".dimensions .depth").textContent = product.dimensions.depth;

    let colorsContainer = document.querySelector(".details .colors");
    colorsContainer.innerHTML = "";
    product.colors.forEach(color => {
        let colorDiv = document.createElement("div");
        colorDiv.classList.add(color.toLowerCase());
        colorsContainer.appendChild(colorDiv);
    });
}

function showMoreProducts() {
    document.querySelectorAll(".product-item.hidden").forEach(product => {
        product.classList.remove("hidden");
    });

    document.getElementById("show-more-products").style.display = "none";
    document.getElementById("view-more-suggest").style.display = "none";
}

function showNotification(title) {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification("Product Added to Cart", {
                body: `${title} has been added to your cart.`,
                icon: "./images/cart-icon.png"
            });
        });
    } else {
        if (Notification.permission === "granted") {
            new Notification("Product Added to Cart", {
                body: `${title} has been added to your cart.`,
                icon: "./images/cart-icon.png"
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Product Added to Cart", {
                        body: `${title} has been added to your cart.`,
                        icon: "./assets/logo.png"
                    });
                }
            });
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./service-worker.js');
            console.log('Service worker registered successfully');
        } catch (error) {
            console.error('Service worker registration failed:', error);
        }
    }

    let productId = getQueryParam("id");
    if (!productId) {
        console.error("No product ID found in URL");
        return;
    }
    let productData = await fetchProductData(productId);
    displayProductData(productData);

    let addToCartButtons = document.querySelectorAll(".add-to-cart");
    let wishlistButtons = document.querySelectorAll(".wishlist");

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (!cart.some(item => item.id === product.id)) {
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartDisplay(cart);
            showNotification(product.title);
        }
    }

    function updateWishlist(product, button) {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        let index = wishlist.findIndex(item => item.id === product.id);
        if (index !== -1) {
            wishlist.splice(index, 1);
            button.classList.remove("liked");
        } else {
            wishlist.push(product);
            button.classList.add("liked");
        }
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        updateWishlistDisplay(wishlist);
    }

    function updateCartDisplay(cart) {
        document.getElementById("cart-items").innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.title}">
                <div class="cart-item-details">
                    <p>${item.title}</p>
                    <p>${item.price}</p>
                </div>
                <span class="remove" data-id="${item.id}">&times;</span>
            </div>
        `).join("");

        document.querySelectorAll(".cart-item .remove").forEach(removeButton => {
            removeButton.addEventListener("click", () => removeFromCart(removeButton.dataset.id));
        });
    }

    function updateWishlistDisplay(wishlist) {
        document.getElementById("wishlist-subset").innerHTML = wishlist.map(item => `
            <div class="wishlist-item">
                <img src="${item.img}" alt="${item.title}">
                <p>${item.title}</p>
                <span class="remove" data-id="${item.id}">&times;</span>
            </div>
        `).join("");

        document.querySelectorAll(".wishlist-item .remove").forEach(removeButton => {
            removeButton.addEventListener("click", () => removeFromWishlist(removeButton.dataset.id));
        });
    }

    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay(cart);
    }

    function removeFromWishlist(productId) {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        wishlist = wishlist.filter(item => item.id !== productId);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        updateWishlistDisplay(wishlist);
    }

    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            let productInfo = button.closest(".product-info");
            addToCart({
                id: productId,
                title: productInfo.querySelector(".title").textContent,
                img: productInfo.querySelector(".image-preview img").src,
                price: productInfo.querySelector(".price").textContent
            });
        });
    });

    wishlistButtons.forEach(button => {
        button.addEventListener("click", () => {
            let productInfo = button.closest(".product-info");
            updateWishlist({
                id: productId,
                title: productInfo.querySelector(".title").textContent,
                img: productInfo.querySelector(".image-preview img").src,
                price: productInfo.querySelector(".price").textContent
            }, button);
        });
    });
});
