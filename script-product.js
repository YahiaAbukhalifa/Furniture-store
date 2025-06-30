function updateCartCounter() {
  let cartCounter = document.getElementById("cart-counter");
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  cartCounter.textContent = cartItems.length;
}

function getQueryParameter(param) {
  let urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function fetchProductById(productId) {
  try {
    let response = await fetch("./products.json");
    if (!response.ok) throw Error(`HTTP error! status: ${response.status}`);
    let products = await response.json();
    return products.find(product => product.id === productId);
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
}

function displayProductDetails(product) {
  if (!product) {
    console.error("Product not found");
    return;
  }
  document.querySelector(".image-preview img").src = product.image;
  document.querySelector(".details .title").textContent = product.title;
  document.querySelector(".details .title").setAttribute("data-il8n" , "title-products-"  +product.id )
  document.querySelector(".details .price").textContent = `${product.price} L.E`;

  let ratingElement = document.querySelector(".details .rating");
  ratingElement.innerHTML = "";
  let ratingValue = parseFloat(product.rating),
    fullStars = Math.floor(ratingValue);

  for (let i = 0; i < fullStars; i++) {
    let star = document.createElement("i");
    star.classList.add("fa-solid", "fa-star", "active-rate");
    ratingElement.appendChild(star);
  }

  if (ratingValue % 1 != 0) {
    let halfStar = document.createElement("i");
    halfStar.classList.add("fa-solid", "fa-star-half", "active-rate");
    ratingElement.appendChild(halfStar);
  }

  for (let i = 0; i < 5 - Math.ceil(ratingValue); i++) {
    let emptyStar = document.createElement("i");
    emptyStar.classList.add("fa-solid", "fa-star");
    ratingElement.appendChild(emptyStar);
  }

  let ratingCount = document.createElement("span");
  ratingCount.textContent = ` (${product.ratingCount})`;
  ratingElement.appendChild(ratingCount);

  document.querySelector(".dimensions .width").textContent = product.dimensions.width;
  document.querySelector(".dimensions .height").textContent = product.dimensions.height;
  document.querySelector(".dimensions .depth").textContent = product.dimensions.depth;

  let colorsContainer = document.querySelector(".details .colors");
  colorsContainer.innerHTML = "";
  product.colors.forEach(color => {
    let colorElement = document.createElement("div");
    colorElement.classList.add(color.toLowerCase());
    colorsContainer.appendChild(colorElement);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  let productId = getQueryParameter("id");
  if (!productId) {
    console.error("No product ID found in URL");
    return;
  }
  let product = await fetchProductById(productId);
  displayProductDetails(product);

  let addToCartButtons = document.querySelectorAll(".add-to-cart"),
    wishlistButtons = document.querySelectorAll(".wishlist");

  function addToCart(product) {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cartItems.some(item => item.id === product.id)) {
      cartItems.push(product);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      updateCartDisplay(cartItems);
      updateCartCounter();
    }
  }

  function toggleWishlist(product, button) {
    let wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [],
      existingItemIndex = wishlistItems.findIndex(item => item.id === product.id);

    if (existingItemIndex !== -1) {
      wishlistItems.splice(existingItemIndex, 1);
      button.classList.remove("liked");
    } else {
      wishlistItems.push(product);
      button.classList.add("liked");
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    updateWishlistDisplay(wishlistItems);
    updateCartCounter();
  }

  function updateCartDisplay(cartItems) {
    let cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = cartItems.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.title}">
        <div class="cart-item-details">
          <p>${item.title}</p>
          <p>${item.price}</p>
        </div>
        <span class="remove" data-id="${item.id}">&times;</span>
      </div>
    `).join("");
    document.querySelectorAll(".cart-item .remove").forEach(button => {
      button.addEventListener("click", () => removeFromCart(button.dataset.id));
    });
  }

  function updateWishlistDisplay(wishlistItems) {
    let wishlistContainer = document.getElementById("wishlist-subset");
    wishlistContainer.innerHTML = wishlistItems.map(item => `
      <div class="wishlist-item" onclick="location.href='./product-info.html?id=${item.id}'">
        <img src="${item.img}" alt="${item.title}">
        <p>${item.title}</p>
        <span class="remove" data-id="${item.id}">&times;</span>
      </div>
    `).join("");
    document.querySelectorAll(".wishlist-item .remove").forEach(button => {
      button.addEventListener("click", () => removeFromWishlist(button.dataset.id));
    });
  }

  function removeFromCart(itemId) {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartItems = cartItems.filter(item => item.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    updateCartDisplay(cartItems);
    updateCartCounter();
  }

  function removeFromWishlist(itemId) {
    let wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlistItems = wishlistItems.filter(item => item.id !== itemId);
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    updateWishlistDisplay(wishlistItems);
    updateCartCounter();
  }

  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      let productInfo = button.closest(".product-info"),
        product = {
          id: productId,
          title: productInfo.querySelector(".title").textContent,
          img: productInfo.querySelector(".image-preview img").src,
          price: productInfo.querySelector(".price").textContent,
        };
      addToCart(product);
    });
  });

  wishlistButtons.forEach(button => {
    button.addEventListener("click", () => {
      let productInfo = button.closest(".product-info"),
        product = {
          id: productId,
          title: productInfo.querySelector(".title").textContent,
          img: productInfo.querySelector(".image-preview img").src,
          price: productInfo.querySelector(".price").textContent,
        };
      toggleWishlist(product, button);
    });
  });

  updateCartCounter();
});

function showMoreProducts() {
  const hiddenProducts = document.querySelectorAll(".product-item.hidden");
  hiddenProducts.forEach(product => {
    product.classList.remove("hidden");
  });

  const showMoreButton = document.getElementById("show-more-products");
  showMoreButton.style.display = "none";
  document.getElementById("view-more-suggest").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener('storage', function(event) {
    if (event.key === 'cart') {
      updateCartCounter();
    }
  });
  updateCartCounter();
});
