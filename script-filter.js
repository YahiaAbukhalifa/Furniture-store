document.addEventListener("DOMContentLoaded", function () {
    const filterInputs = document.querySelectorAll(
      "input[name='category'], input[name='material'], input[name='color'], input[name='rating'], input[name='availability'], #priceRange, #width, #height, #depth"
    );
    const minPriceDisplay = document.getElementById("minPrice");
    const maxPriceDisplay = document.getElementById("maxPrice");
    const priceRange = document.getElementById("priceRange");
    const productsContainer = document.getElementById("products-container");
    const products = document.querySelectorAll(".product-item");
  
    filterInputs.forEach((input) => {
      input.addEventListener("change", filterProducts);
    });
  
    priceRange.addEventListener("input", function () {
      maxPriceDisplay.textContent = `$${priceRange.value}`;
      filterProducts();
    });
  
    function filterProducts() {
      const selectedCategories = getSelectedValues("category");
      const selectedMaterials = getSelectedValues("material");
      const selectedColors = getSelectedValues("color");
      const selectedRatings = getSelectedValues("rating");
      const selectedAvailability = getSelectedValues("availability");
      const selectedPrice = priceRange.value;
      const selectedDimensions = {
        width: document.getElementById("width").value,
        height: document.getElementById("height").value,
        depth: document.getElementById("depth").value,
      };
  
      products.forEach((product) => {
        const productData = getProductData(product);
        const matchesFilter = matchFilter(productData, {
          selectedCategories,
          selectedMaterials,
          selectedColors,
          selectedRatings,
          selectedAvailability,
          selectedPrice,
          selectedDimensions,
        });
  
        product.style.display = matchesFilter ? "" : "none";
      });
    }
  
    function getSelectedValues(name) {
      return Array.from(
        document.querySelectorAll(`input[name='${name}']:checked`)
      ).map((input) => input.id);
    }
  
    function getProductData(product) {
      return {
        category: product.dataset.category,
        material: product.dataset.material,
        color: product.dataset.color,
        rating: product.dataset.rating,
        availability: product.dataset.availability,
        price: parseInt(product.dataset.price, 10),
        dimensions: {
          width: product.dataset.width,
          height: product.dataset.height,
          depth: product.dataset.depth,
        },
      };
    }
  
    function matchFilter(productData, filter) {
      const {
        selectedCategories,
        selectedMaterials,
        selectedColors,
        selectedRatings,
        selectedAvailability,
        selectedPrice,
        selectedDimensions,
      } = filter;
  
      return (
        (selectedCategories.length === 0 ||
          selectedCategories.includes(productData.category)) &&
        (selectedMaterials.length === 0 ||
          selectedMaterials.includes(productData.material)) &&
        (selectedColors.length === 0 ||
          selectedColors.includes(productData.color)) &&
        (selectedRatings.length === 0 ||
          selectedRatings.includes(productData.rating)) &&
        (selectedAvailability.length === 0 ||
          selectedAvailability.includes(productData.availability)) &&
        productData.price <= selectedPrice &&
        (!selectedDimensions.width ||
          productData.dimensions.width <= selectedDimensions.width) &&
        (!selectedDimensions.height ||
          productData.dimensions.height <= selectedDimensions.height) &&
        (!selectedDimensions.depth ||
          productData.dimensions.depth <= selectedDimensions.depth)
      );
    }
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    const filterTitle = document.querySelector(".filter-title");
    const filters = document.querySelector(".filters");
  
    if (filterTitle && filters) {
      filterTitle.addEventListener("click", function () {
        filters.classList.toggle("show-filters");
      });
    }
  });