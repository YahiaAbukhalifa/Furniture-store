document.addEventListener("DOMContentLoaded", function () {
  let filterInputs = document.querySelectorAll("input[name='category'], input[name='material'], input[name='color'], input[name='rating'], input[name='availability'], #priceRange, #width, #height, #depth");
  let minPriceElement = document.getElementById("minPrice");
  let maxPriceElement = document.getElementById("maxPrice");
  let priceRangeElement = document.getElementById("priceRange");
  let productsContainer = document.getElementById("products-container");
  let productItems = document.querySelectorAll(".product-item");

  // Parse URL parameters
  function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Apply category filter from URL on page load
  function applyUrlCategoryFilter() {
    const category = getUrlParameter('category');
    if (category) {
      const categoryInput = document.querySelector(`input[name='category'][id='${category}']`);
      if (categoryInput) {
        categoryInput.checked = true;
        filterProducts();
      }
    }
  }

  function filterProducts() {
    let selectedCategories = getSelectedFilters("category");
    let selectedMaterials = getSelectedFilters("material");
    let selectedColors = getSelectedFilters("color");
    let selectedRatings = getSelectedFilters("rating");
    let selectedAvailability = getSelectedFilters("availability");
    let selectedPrice = priceRangeElement.value;
    let selectedDimensions = {
      width: document.getElementById("width").value,
      height: document.getElementById("height").value,
      depth: document.getElementById("depth").value
    };

    productItems.forEach((productItem) => {
      let productData = {
        category: productItem.dataset.category,
        material: productItem.dataset.material,
        color: productItem.dataset.color,
        rating: productItem.dataset.rating,
        availability: productItem.dataset.availability,
        price: parseInt(productItem.dataset.price, 10),
        dimensions: {
          width: productItem.dataset.width,
          height: productItem.dataset.height,
          depth: productItem.dataset.depth
        }
      };

      let isVisible = isProductVisible(productData, {
        selectedCategories,
        selectedMaterials,
        selectedColors,
        selectedRatings,
        selectedAvailability,
        selectedPrice,
        selectedDimensions
      });

      productItem.style.display = isVisible ? "" : "none";
    });
  }

  function getSelectedFilters(filterName) {
    return Array.from(document.querySelectorAll(`input[name='${filterName}']:checked`)).map((input) => input.id);
  }

  function isProductVisible(productData, selectedFilters) {
    let {
      selectedCategories,
      selectedMaterials,
      selectedColors,
      selectedRatings,
      selectedAvailability,
      selectedPrice,
      selectedDimensions
    } = selectedFilters;

    return (
      (selectedCategories.length === 0 || selectedCategories.includes(productData.category)) &&
      (selectedMaterials.length === 0 || selectedMaterials.includes(productData.material)) &&
      (selectedColors.length === 0 || selectedColors.includes(productData.color)) &&
      (selectedRatings.length === 0 || selectedRatings.includes(productData.rating)) &&
      (selectedAvailability.length === 0 || selectedAvailability.includes(productData.availability)) &&
      productData.price <= selectedPrice &&
      (!selectedDimensions.width || productData.dimensions.width <= selectedDimensions.width) &&
      (!selectedDimensions.height || productData.dimensions.height <= selectedDimensions.height) &&
      (!selectedDimensions.depth || productData.dimensions.height <= selectedDimensions.depth)
    );
  }

  filterInputs.forEach((input) => {
    input.addEventListener("change", filterProducts);
  });

  priceRangeElement.addEventListener("input", function () {
    maxPriceElement.textContent = `$${priceRangeElement.value}`;
    filterProducts();
  });

  // Cart counter update on page load and storage change
  function updateCartCounter() {
    let cartCounter = document.getElementById("cart-counter");
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartCounter.textContent = cartItems.length;
  }

  window.addEventListener('storage', function (event) {
    if (event.key === 'cart') {
      updateCartCounter();
    }
  });

  let filterTitle = document.querySelector(".filter-title");
  let filtersContainer = document.querySelector(".filters");

  if (filterTitle && filtersContainer) {
    filterTitle.addEventListener("click", function () {
      filtersContainer.classList.toggle("show-filters");
    });
  }

  // Apply URL filter and update cart counter on page load
  applyUrlCategoryFilter();
  updateCartCounter();
});