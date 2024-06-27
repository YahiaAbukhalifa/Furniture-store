let slideIndex = 1;
showSlides(slideIndex);

function autoSlides() {
  plusSlides(1);
}

setInterval(autoSlides, 5000);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("Slides");
  let dots = document.getElementsByClassName("dot");
  if (slides.length === 0 || dots.length === 0) return; // Check if slides and dots exist
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

document.addEventListener("DOMContentLoaded", (event) => {
  const productItems = document.querySelectorAll(".product-item");

  productItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      item.classList.add("w3-animate-opacity");
    });

    item.addEventListener("mouseleave", () => {
      item.classList.remove("w3-animate-opacity");
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // Wishlist functionality
  const wishlistIcon = document.getElementById("wishlist-icon");
  const wishlistSubset = document.getElementById("wishlist-subset");
  const likeButtons = document.querySelectorAll(".product-item .fa-heart");

  // Load wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  updateWishlistDisplay();
  applyLikedClass();

  // Add event listeners to like buttons
  likeButtons.forEach((button) => {
    button.addEventListener("click", () => toggleLike(button));
  });

  // Toggle like state and update localStorage
  function toggleLike(button) {
    const productItem = button.closest(".product-item");
    const product = {
      title: productItem.querySelector(".title").innerText,
      img: productItem.querySelector("img").src,
      description: productItem.querySelector(".description").innerText,
      price:
        productItem.querySelector(".price-offer").innerText ||
        productItem.querySelector(".price").innerText,
    };

    const productIndex = wishlist.findIndex(
      (item) => item.title === product.title
    );

    if (productIndex > -1) {
      wishlist.splice(productIndex, 1);
      button.classList.remove("liked");
    } else {
      wishlist.push(product);
      button.classList.add("liked");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistDisplay();
  }

  // Apply 'liked' class to like buttons based on wishlist
  function applyLikedClass() {
    wishlist.forEach((item) => {
      const productItem = [...document.querySelectorAll(".product-item")].find(
        (product) => product.querySelector(".title").innerText === item.title
      );
      if (productItem) {
        productItem.querySelector(".fa-heart").classList.add("liked");
      }
    });
  }

  // Update the wishlist display in the subset
  function updateWishlistDisplay() {
    wishlistSubset.innerHTML = wishlist
      .map(
        (item) => `
      <div class="wishlist-item">
        <img src="${item.img}" alt="${item.title}">
        <p>${item.title}</p>
        <span class="remove" data-title="${item.title}">&times;</span>
      </div>
    `
      )
      .join("");

    document.querySelectorAll(".wishlist-item .remove").forEach((button) => {
      button.addEventListener("click", (e) =>
        removeFromWishlist(e.target.dataset.title)
      );
    });
  }

  // Remove item from wishlist
  function removeFromWishlist(title) {
    const productIndex = wishlist.findIndex((item) => item.title === title);
    if (productIndex > -1) {
      wishlist.splice(productIndex, 1);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      updateWishlistDisplay();

      // Remove liked class from the corresponding product item
      const productItem = [...document.querySelectorAll(".product-item")].find(
        (item) => item.querySelector(".title").innerText === title
      );
      if (productItem) {
        productItem.querySelector(".fa-heart").classList.remove("liked");
      }
    }
  }

  // Toggle wishlist display
  if (wishlistIcon) {
    wishlistIcon.addEventListener("click", () => {
      wishlistSubset.classList.toggle("active");
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  // Load cart items from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Add event listeners to "Add to cart" buttons
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productItem = button.closest(".product-item");
      const product = {
        id: productItem.dataset.productId,
        title: productItem.querySelector(".title").innerText,
        img: productItem.querySelector("img").src,
        price:
          productItem.querySelector(".price-offer").innerText ||
          productItem.querySelector(".price-no-offer").innerText,
      };
      addToCart(product);
    });
  });

  // Add item to cart and update localStorage
  function addToCart(product) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
  }

  // Update the cart display in the main header
  function updateCartDisplay() {
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

  // Remove item from cart
  function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
  }

  // Initial cart display
  updateCartDisplay();
});

// Function to toggle the cart items visibility
function toggleCart() {
  var cartItems = document.getElementById("cart-items");
  cartItems.classList.toggle("active");
}

document.addEventListener("mouseup", function (e) {
  var cartItems = document.getElementById("cart-items");
  var cartIcon = document.querySelector(".cart-icon");

  // If the click is outside the cart items and cart icon, hide cart items
  if (!cartItems.contains(e.target) && !cartIcon.contains(e.target)) {
    cartItems.classList.remove("active");
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const shareIcons = document.querySelectorAll(".material-symbols-outlined");

  if (shareIcons.length === 0) return; // Check if share icons exist

  shareIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const productItem = icon.closest(".product-item");
      const productURL = window.location.href;

      navigator.clipboard.writeText(productURL).then(
        function () {
          showShareNotification();
        },
        function (err) {
          console.error("Could not copy text: ", err);
        }
      );
    });
  });

  function showShareNotification() {
    const shareNotification = document.getElementById("share-notification");
    if (shareNotification) {
      shareNotification.style.display = "block";
      setTimeout(function () {
        shareNotification.style.display = "none";
      }, 3000);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    document.getElementById("loader").style.display = "none";
  }, 1000);
});
function updatemenu() {
  if (document.getElementById("responsive-menu").checked == true) {
    document.getElementById("menu").style.borderBottomRightRadius = "0";
    document.getElementById("menu").style.borderBottomLeftRadius = "0";
  } else {
    document.getElementById("menu").style.borderRadius = "10px";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      window.products = products;
    });
});

function filterProducts() {
  const searchQuery = document.getElementById("search").value.toLowerCase();
  const filteredProducts = window.products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery)
  );

  const searchResultsContainer = document.getElementById("search-results");
  searchResultsContainer.classList.add("flex");
  searchResultsContainer.innerHTML = "";

  filteredProducts.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("product-item");
    productItem.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <p class="title">${product.title}</p>
      <div class="price">
        <p class="price-offer">L.E ${product.price}</p>
      </div>
    `;
    productItem.addEventListener("mousedown", () => {
      window.location.href = `./product-info.html?id=${product.id}`;
    });
    searchResultsContainer.appendChild(productItem);
  });
}

document.getElementById("search").addEventListener("blur", () => {
  setTimeout(() => {
    document.getElementById("search-results").classList.remove("flex");
  }, 100);
});
document.getElementById("search-mobile").addEventListener("blur", () => {
  setTimeout(() => {
    document.getElementById("search-results").classList.remove("flex");
  }, 100);
});
function filterProductsMobile() {
  const searchQuery = document.getElementById("search-mobile").value.toLowerCase();
  const filteredProducts = window.products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery)
  );

  const searchResultsContainer = document.getElementById("search-results");
  searchResultsContainer.classList.add("flex");
  searchResultsContainer.innerHTML = "";

  filteredProducts.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("product-item");
    productItem.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <p class="title">${product.title}</p>
      <div class="price">
        <p class="price-offer">L.E ${product.price}</p>
      </div>
    `;
    productItem.addEventListener("mousedown", () => {
      window.location.href = `./product-info.html?id=${product.id}`;
    });
    searchResultsContainer.appendChild(productItem);
  });
}


