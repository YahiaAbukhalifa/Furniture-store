let slideIndex=1;function autoSlides(){plusSlides(1)}function plusSlides(e){showSlides(slideIndex+=e)}function currentSlide(e){showSlides(slideIndex=e)}function showSlides(e){let t,i=document.getElementsByClassName("Slides"),l=document.getElementsByClassName("dot");if(0!==i.length&&0!==l.length){for(e>i.length&&(slideIndex=1),e<1&&(slideIndex=i.length),t=0;t<i.length;t++)i[t].style.display="none";for(t=0;t<l.length;t++)l[t].className=l[t].className.replace(" active","");i[slideIndex-1].style.display="block",l[slideIndex-1].className+=" active"}}function toggleCart(){document.getElementById("cart-items").classList.toggle("active")}function updatemenu(){!0==document.getElementById("responsive-menu").checked?(document.getElementById("menu").style.borderBottomRightRadius="0",document.getElementById("menu").style.borderBottomLeftRadius="0"):document.getElementById("menu").style.borderRadius="10px"}function filterProducts(){let e=document.getElementById("search").value.toLowerCase(),t=window.products.filter(t=>t.title.toLowerCase().includes(e)),i=document.getElementById("search-results");i.classList.add("flex"),i.innerHTML="",t.forEach(e=>{let t=document.createElement("div");t.classList.add("product-item"),t.innerHTML=`
  <img src="${e.image}" alt="${e.title}" />
  <p class="title">${e.title}</p>
  <div class="price">
    <p class="price-offer">L.E ${e.price}</p>
  </div>
`,t.addEventListener("mousedown",()=>{window.location.href=`./product-info.html?id=${e.id}`}),i.appendChild(t)})}function filterProductsMobile(){let e=document.getElementById("search-mobile").value.toLowerCase(),t=window.products.filter(t=>t.title.toLowerCase().includes(e)),i=document.getElementById("search-results");i.classList.add("flex"),i.innerHTML="",t.forEach(e=>{let t=document.createElement("div");t.classList.add("product-item"),t.innerHTML=`
  <img src="${e.image}" alt="${e.title}" />
  <p class="title">${e.title}</p>
  <div class="price">
    <p class="price-offer">L.E ${e.price}</p>
  </div>
`,t.addEventListener("mousedown",()=>{window.location.href=`./product-info.html?id=${e.id}`}),i.appendChild(t)})}showSlides(slideIndex),setInterval(autoSlides,5e3),document.addEventListener("DOMContentLoaded",e=>{document.querySelectorAll(".product-item").forEach(e=>{e.addEventListener("mouseenter",()=>{e.classList.add("w3-animate-opacity")}),e.addEventListener("mouseleave",()=>{e.classList.remove("w3-animate-opacity")})})}),document.addEventListener("DOMContentLoaded",()=>{let e=document.getElementById("wishlist-icon"),t=document.getElementById("wishlist-subset"),i=document.querySelectorAll(".product-item .fa-heart"),l=JSON.parse(localStorage.getItem("wishlist"))||[];function s(e){let t=e.closest(".product-item"),i={title:t.querySelector(".title").innerText,img:t.querySelector("img").src,description:t.querySelector(".description").innerText,price:t.querySelector(".price-offer").innerText||t.querySelector(".price").innerText},s=l.findIndex(e=>e.title===i.title);s>-1?(l.splice(s,1),e.classList.remove("liked")):(l.push(i),e.classList.add("liked")),localStorage.setItem("wishlist",JSON.stringify(l)),r()}function n(){l.forEach(e=>{let t=[...document.querySelectorAll(".product-item")].find(t=>t.querySelector(".title").innerText===e.title);t&&t.querySelector(".fa-heart").classList.add("liked")})}function r(){t.innerHTML=l.map(e=>`
  <div class="wishlist-item">
    <img src="${e.img}" alt="${e.title}">
    <p>${e.title}</p>
    <span class="remove" data-title="${e.title}">&times;</span>
  </div>
`).join(""),document.querySelectorAll(".wishlist-item .remove").forEach(e=>{e.addEventListener("click",e=>d(e.target.dataset.title))})}function d(e){let t=l.findIndex(t=>t.title===e);if(t>-1){l.splice(t,1),localStorage.setItem("wishlist",JSON.stringify(l)),r();let i=[...document.querySelectorAll(".product-item")].find(t=>t.querySelector(".title").innerText===e);i&&i.querySelector(".fa-heart").classList.remove("liked")}}r(),n(),i.forEach(e=>{e.addEventListener("click",()=>s(e))}),e&&e.addEventListener("click",()=>{t.classList.toggle("active")})}),document.addEventListener("DOMContentLoaded",()=>{let e=document.getElementById("cart-items"),t=document.querySelectorAll(".add-to-cart"),i=JSON.parse(localStorage.getItem("cart"))||[];function l(e){i.push(e),localStorage.setItem("cart",JSON.stringify(i)),s()}function s(){e.innerHTML=i.map(e=>`
  <div class="cart-item">
    <img src="${e.img}" alt="${e.title}">
    <div class="cart-item-details">
      <p>${e.title}</p>
      <p>${e.price}</p>
    </div>
    <span class="remove" data-id="${e.id}">&times;</span>
  </div>
`).join(""),document.querySelectorAll(".cart-item .remove").forEach(e=>{e.addEventListener("click",e=>n(e.target.dataset.id))})}function n(e){i=i.filter(t=>t.id!==e),localStorage.setItem("cart",JSON.stringify(i)),s()}t.forEach(e=>{e.addEventListener("click",()=>{let t=e.closest(".product-item");l({id:t.dataset.productId,title:t.querySelector(".title").innerText,img:t.querySelector("img").src,price:t.querySelector(".price-offer").innerText||t.querySelector(".price-no-offer").innerText})})}),s()}),document.addEventListener("mouseup",function(e){var t=document.getElementById("cart-items"),i=document.querySelector(".cart-icon");t.contains(e.target)||i.contains(e.target)||t.classList.remove("active")}),document.addEventListener("DOMContentLoaded",function(){let e=document.querySelectorAll(".material-symbols-outlined");0!==e.length&&e.forEach(e=>{e.addEventListener("click",function(){e.closest(".product-item");let t=window.location.href;navigator.clipboard.writeText(t).then(function(){let e;(e=document.getElementById("share-notification"))&&(e.style.display="block",setTimeout(function(){e.style.display="none"},3e3))},function(e){console.error("Could not copy text: ",e)})})})}),document.addEventListener("DOMContentLoaded",function(){setTimeout(function(){document.getElementById("loader").style.display="none"},1e3)}),document.addEventListener("DOMContentLoaded",()=>{fetch("products.json").then(e=>e.json()).then(e=>{window.products=e})}),document.getElementById("search").addEventListener("blur",()=>{setTimeout(()=>{document.getElementById("search-results").classList.remove("flex")},100)}),document.getElementById("search-mobile").addEventListener("blur",()=>{setTimeout(()=>{document.getElementById("search-results").classList.remove("flex")},100)}),document.getElementById("wishlist-icon").addEventListener("blur",()=>{document.getElementById("wishlist-subset").classList.remove("active")});
