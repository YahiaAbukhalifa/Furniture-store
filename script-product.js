// Function to get the value of a query parameter by name
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Function to fetch product data from JSON file
async function fetchProductData(id) {
  try {
    const response = await fetch("./products.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    return products.find((product) => product.id === id);
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
}

// Function to display product data on the page
function displayProductData(product) {
  if (!product) {
    console.error("Product not found");
    return;
  }

  document.querySelector(".image-preview img").src = product.image;
  document.querySelector(".details .title").textContent = product.title;
  document.querySelector(
    ".details .price"
  ).textContent = `${product.price} L.E`;

  // Display rating stars
  const ratingContainer = document.querySelector(".details .rating");
  ratingContainer.innerHTML = "";

  const maxStars = 5; // Maximum number of stars to display
  const rating = parseFloat(product.rating); // Assuming rating is a number (e.g., 4.5)
  const fullStars = Math.floor(rating); // Full stars count
  const hasHalfStar = rating % 1 !== 0; // Check for half star

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    const starIcon = document.createElement("i");
    starIcon.classList.add("fa-solid", "fa-star", "active-rate");
    ratingContainer.appendChild(starIcon);
  }

  // Add half star if applicable
  if (hasHalfStar) {
    const halfStarIcon = document.createElement("i");
    halfStarIcon.classList.add("fa-solid", "fa-star-half", "active-rate");
    ratingContainer.appendChild(halfStarIcon);
  }

  // Add empty stars to complete 5 stars
  for (let i = 0; i < maxStars - Math.ceil(rating); i++) {
    const emptyStarIcon = document.createElement("i");
    emptyStarIcon.classList.add("fa-solid", "fa-star");
    ratingContainer.appendChild(emptyStarIcon);
  }

  // Clear existing color divs
  const colorsContainer = document.querySelector(".details .colors");
  colorsContainer.innerHTML = "";

  // Add color divs based on product.colors
  product.colors.forEach((color) => {
    const colorDiv = document.createElement("div");
    colorDiv.classList.add(color.toLowerCase()); // Assuming class names are lowercase versions of color names
    colorsContainer.appendChild(colorDiv);
  });

  // Add other fields as necessary
}

document.addEventListener("DOMContentLoaded", async () => {
  const productId = getQueryParam("id");
  if (!productId) {
    console.error("No product ID found in URL");
    return;
  }

  const product = await fetchProductData(productId);
  displayProductData(product);
});
document.addEventListener("DOMContentLoaded", async () => {
  const productId = getQueryParam("id");
  if (!productId) {
    console.error("No product ID found in URL");
    return;
  }

  const product = await fetchProductData(productId);
  displayProductData(product);

  // Select elements
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const wishlistIcons = document.querySelectorAll(".wishlist");

  // Add event listeners for Add to Cart buttons
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productItem = button.closest(".product-info");
      const product = {
        id: productId,
        title: productItem.querySelector(".title").textContent,
        img: productItem.querySelector(".image-preview img").src,
        price: productItem.querySelector(".price").textContent,
      };
      addToCart(product);
    });
  });

  // Add event listeners for Wishlist icons
  wishlistIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const productItem = icon.closest(".product-info");
      const product = {
        id: productId,
        title: productItem.querySelector(".title").textContent,
        img: productItem.querySelector(".image-preview img").src,
        price: productItem.querySelector(".price").textContent,
      };
      toggleWishlist(product, icon);
    });
  });

  // Function to add item to cart
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay(cart);
  }

  // Function to toggle wishlist
  function toggleWishlist(product, icon) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const existingIndex = wishlist.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      // Remove from wishlist
      wishlist.splice(existingIndex, 1);
      icon.classList.remove("liked");
    } else {
      // Add to wishlist
      wishlist.push(product);
      icon.classList.add("liked");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistDisplay(wishlist);
  }

  // Function to update cart display in header
  function updateCartDisplay(cart) {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.title}">
          <div class="cart-item-details">
            <p>${item.title}</p>
            <p>${item.price}</p>
          </div>
          <span class="remove" data-id="${item.id}">&times;</span>
        </div>
      `
      )
      .join("");

    // Add event listeners to remove buttons
    document.querySelectorAll(".cart-item .remove").forEach((button) => {
      button.addEventListener("click", (e) =>
        removeFromCart(e.target.dataset.id)
      );
    });
  }

  // Function to update wishlist display in header
  function updateWishlistDisplay(wishlist) {
    const wishlistSubset = document.getElementById("wishlist-subset");
    wishlistSubset.innerHTML = wishlist
      .map(
        (item) => `
        <div class="wishlist-item">
          <img src="${item.img}" alt="${item.title}">
          <p>${item.title}</p>
          <span class="remove" data-id="${item.id}">&times;</span>
        </div>
      `
      )
      .join("");

    // Add event listeners to remove buttons
    document.querySelectorAll(".wishlist-item .remove").forEach((button) => {
      button.addEventListener("click", (e) =>
        removeFromWishlist(e.target.dataset.id)
      );
    });
  }

  // Function to remove item from cart
  function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay(cart);
  }

  // Function to remove item from wishlist
  function removeFromWishlist(id) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist = wishlist.filter((item) => item.id !== id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistDisplay(wishlist);
  }
});
