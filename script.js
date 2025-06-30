let slideIndex = 1;

function autoSlides() {
    plusSlides(1);
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("Slides");
    let dots = document.getElementsByClassName("dot");

    if (slides.length > 0 && dots.length > 0) {
        if (n > slides.length) slideIndex = 1;
        if (n < 1) slideIndex = slides.length;

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
    }
}

function toggleCart() {
    document.getElementById("cart-items").classList.toggle("active");
}

function updateMenu() {
    let isMenuChecked = document.getElementById("responsive-menu").checked;
    let menu = document.getElementById("menu");
    if (isMenuChecked) {
        menu.style.borderBottomRightRadius = "0";
        menu.style.borderBottomLeftRadius = "0";
    } else {
        menu.style.borderRadius = "10px";
    }
}

function filterProducts() {
    let searchTerm = document.getElementById("search").value.toLowerCase();
    let filteredProducts = window.products.filter(product =>
        product.title.toLowerCase().includes(searchTerm)
    );
    displaySearchResults(filteredProducts, "search-results");
}

function filterProductsMobile() {
    let searchTerm = document.getElementById("search-mobile").value.toLowerCase();
    let filteredProducts = window.products.filter(product =>
        product.title.toLowerCase().includes(searchTerm)
    );
    displaySearchResults(filteredProducts, "search-results");
}

function displaySearchResults(products, resultsContainerId) {
    let searchResults = document.getElementById(resultsContainerId);
    searchResults.classList.add("flex");
    searchResults.innerHTML = "";

    products.forEach(product => {
        let highlightedTitle = highlightSearchTerm(product.title, searchTerm);
        let productItem = document.createElement("div");
        productItem.classList.add("product-item");
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}" />
            <p class="title">${highlightedTitle}</p>
            <div class="price">
                <p class="price-offer">L.E ${product.price}</p>
            </div>
        `;
        productItem.addEventListener("mousedown", () => {
            window.location.href = `./product-info.html?id=${product.id}`;
        });
        searchResults.appendChild(productItem);
    });
}

function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm) return text;
    let regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function updateWishlist() {
    let wishlistIcon = document.getElementById("wishlist-icon");
    let wishlistSubset = document.getElementById("wishlist-subset");
    let heartIcons = document.querySelectorAll(".product-item .fa-heart");
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    function toggleWishlist(itemElement) {
        let productItem = itemElement.closest(".product-item");
        let product = {
            title: productItem.querySelector(".title").innerText,
            img: productItem.querySelector("img").src,
            description: productItem.querySelector(".description").innerText,
            price: productItem.querySelector(".price-offer").innerText || productItem.querySelector(".price").innerText
        };
        let index = wishlist.findIndex(item => item.title === product.title);

        if (index > -1) {
            wishlist.splice(index, 1);
            itemElement.classList.remove("liked");
        } else {
            wishlist.push(product);
            itemElement.classList.add("liked");
        }
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        renderWishlist();
        updateCartCounter();
    }

    function renderWishlist() {
        wishlistSubset.innerHTML = wishlist.map(item => `
            <div class="wishlist-item" onclick="location.href='./product-info.html?id=${item.id}'">
                <img src="${item.img}" alt="${item.title}">
                <p>${item.title}</p>
                <span class="remove" data-title="${item.title}">&times;</span>
            </div>
        `).join("");

        document.querySelectorAll(".wishlist-item .remove").forEach(removeButton => {
            removeButton.addEventListener("click", (e) => {
                removeFromWishlist(e.target.dataset.title);
            });
        });
    }

    function removeFromWishlist(title) {
        let index = wishlist.findIndex(item => item.title === title);
        if (index > -1) {
            wishlist.splice(index, 1);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            renderWishlist();
            let productItem = [...document.querySelectorAll(".product-item")].find(item => item.querySelector(".title").innerText === title);
            if (productItem) productItem.querySelector(".fa-heart").classList.remove("liked");
        }
    }

    renderWishlist();
    heartIcons.forEach(icon => {
        icon.addEventListener("click", () => toggleWishlist(icon));
    });

    if (wishlistIcon) {
        wishlistIcon.addEventListener("click", () => {
            wishlistSubset.classList.toggle("active");
        });
    }
}

function updateCart() {
    let cartItemsElement = document.getElementById("cart-items");
    let addToCartButtons = document.querySelectorAll(".add-to-cart");
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    function addToCart(item) {
        if (!cartItems.find(cartItem => cartItem.id === item.id)) {
            cartItems.push(item);
            localStorage.setItem("cart", JSON.stringify(cartItems));
            renderCart();
            updateCartCounter();
        }
    }

    function renderCart() {
        cartItemsElement.innerHTML = cartItems.map(item => `
            <div class="cart-item" onclick="location.href='./product-info.html?id=${item.id}'">
                <img src="${item.img}" alt="${item.title}">
                <div class="cart-item-details">
                    <p>${item.title}</p>
                    <p>${item.price}</p>
                </div>
                <span class="remove" data-id="${item.id}">&times;</span>
            </div>
        `).join("");

        document.querySelectorAll(".cart-item .remove").forEach(removeButton => {
            removeButton.addEventListener("click", (e) => {
                removeFromCart(e.target.dataset.id);
            });
        });
    }

    function removeFromCart(id) {
        cartItems = cartItems.filter(item => item.id !== id);
        localStorage.setItem("cart", JSON.stringify(cartItems));
        renderCart();
        updateCartCounter()
    }

    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            let productItem = button.closest(".product-item");
            let product = {
                id: productItem.dataset.productId,
                title: productItem.querySelector(".title").innerText,
                img: productItem.querySelector("img").src,
                price: productItem.querySelector(".price-offer").innerText || productItem.querySelector(".price-no-offer").innerText
            };
            addToCart(product);
        });
    });

    renderCart();
}

function updateCartCounter() {
    let cartCounter = document.getElementById("cart-counter");
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartCounter.textContent = cartItems.length;
}

function setupEventListeners() {
    document.addEventListener("DOMContentLoaded", () => {
        showSlides(slideIndex);
        setInterval(autoSlides, 5000);

        updateWishlist();
        updateCart();
        updateCartCounter();

        document.getElementById("search").addEventListener("blur", () => {
            setTimeout(() => {
                document.getElementById("search-results").classList.remove("flex");
            }, 100);
        });

        document.getElementById("wishlist-icon").addEventListener("blur", () => {
            document.getElementById("wishlist-subset").classList.remove("active");
        });

        document.addEventListener("mouseup", (e) => {
            let cartItemsElement = document.getElementById("cart-items");
            let cartIcon = document.querySelector(".cart-icon");
            if (!cartItemsElement.contains(e.target) && !cartIcon.contains(e.target)) {
                cartItemsElement.classList.remove("active");
            }
        });

        document.querySelectorAll(".material-symbols-outlined").forEach(icon => {
            icon.addEventListener("click", () => {
                navigator.clipboard.writeText(window.location.href).then(
                    () => {
                        let notification = document.getElementById("share-notification");
                        if (notification) {
                            notification.style.display = "block";
                            setTimeout(() => {
                                notification.style.display = "none";
                            }, 3000);
                        }
                    },
                    (err) => console.error("Could not copy text: ", err)
                );
            });
        });

        setTimeout(() => {
            document.getElementById("loader").style.display = "none";
        }, 1000);

        fetch("products.json")
            .then(response => response.json())
            .then(products => {
                window.products = products;
            });
    });

    window.addEventListener('storage', (event) => {
        if (event.key === 'cart') {
            updateCartCounter();
        }
    });
}

setupEventListeners();
function hideLoader() {
    setTimeout(() => {
        document.getElementById("loader").style.display = "none";
    }, 1000);
}

document.addEventListener("DOMContentLoaded", hideLoader);
