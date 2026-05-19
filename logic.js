// Policy
function openPolicy(policyId, btnElement) {
  var i;
  var x = document.getElementsByClassName("policy-section");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(policyId).style.display = "block";

  var tabBtns = document.getElementsByClassName("tab-btn");
  for (i = 0; i < tabBtns.length; i++) {
    tabBtns[i].classList.remove("active");
  }
  btnElement.classList.add("active");
}

// Product
var products = {
  1: {
    name: "Belle Bodysuits",
    price: "$49.9",
    image: "png/product1.png",
    intro: "The Belle Bodysuit is designed for maximum comfort and style. Made with premium four-way stretch fabric, it moves with your body during any workout. Features a flattering scoop neckline and snap closure for easy wear."
  },
  2: {
    name: "Rainbow 2pc Legging & Crop Set",
    price: "$49.9",
    image: "png/product2.png",
    intro: "Stand out in the Rainbow 2pc Set. Featuring a vibrant color palette and sweat-wicking technology, this matching legging and crop top combo keeps you cool and confident through every rep and stretch."
  },
  3: {
    name: "Cali 2pc Leggings & Crop",
    price: "$49.9",
    image: "png/product3.png",
    intro: "The Cali Set brings effortless California vibes to your activewear rotation. With a high-waisted legging for core support and a breathable crop top, this set is perfect for yoga, Pilates, or casual streetwear."
  }
};

function loadProduct() {
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");

  if (id && products[id]) {
    var p = products[id];
    document.getElementById("productImage").src = p.image;
    document.getElementById("productName").textContent = p.name;
    document.getElementById("productPrice").textContent = p.price;
    document.getElementById("productIntro").textContent = p.intro;
    document.title = p.name + " - NIMBU ACTIVE";
  }
}

function setupOptionClicks() {
  var colorDots = document.querySelectorAll(".color-dot");
  colorDots.forEach(function(dot) {
    dot.addEventListener("click", function() {
      colorDots.forEach(function(d) { d.classList.remove("active"); });
      dot.classList.add("active");
    });
  });

  var sizeBoxes = document.querySelectorAll(".size-box");
  sizeBoxes.forEach(function(box) {
    box.addEventListener("click", function() {
      sizeBoxes.forEach(function(b) { b.classList.remove("active"); });
      box.classList.add("active");
    });
  });
}

function addToCart() {
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");

  if (id && products[id]) {
    var p = products[id];
    var selectedSize = document.querySelector(".size-box.active");
    var size = selectedSize ? selectedSize.textContent : "M";

    var cart = JSON.parse(localStorage.getItem("nimbuCart") || "[]");

    var found = false;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id && cart[i].size === size) {
        cart[i].qty += 1;
        found = true;
        break;
      }
    }

    if (!found) {
      cart.push({ id: id, name: p.name, price: p.price, size: size, qty: 1 });
    }

    localStorage.setItem("nimbuCart", JSON.stringify(cart));
    window.location.href = "cart.html";
  }
}

// Toggle
function toggleSidebar() {
  var sidebar = document.getElementById("shopSidebar");
  var btn = document.getElementById("toggleBtn");
  sidebar.classList.toggle("collapsed");
  if (sidebar.classList.contains("collapsed")) {
    btn.textContent = "→";
  } else {
    btn.textContent = "←";
  }
}

// Initialize
window.onload = function() {
  if (document.getElementById("productImage")) {
    loadProduct();
    setupOptionClicks();
    document.getElementById("addToCartBtn").addEventListener("click", addToCart);
  }

  if (document.getElementById("cartItemsContainer")) {
    loadCart();
  }
};

// Cart
function loadCart() {
  var cart = JSON.parse(localStorage.getItem("nimbuCart") || "[]");
  var container = document.getElementById("cartItemsContainer");
  var subtotalEl = document.getElementById("cartSubtotal");
  var totalEl = document.getElementById("cartTotal");

  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-item"><div class="item-details"><h3 class="item-name">No items yet</h3><p class="item-price">Go add something to your cart!</p></div></div>';
    subtotalEl.textContent = "$0.0";
    totalEl.textContent = "$0.0";
    return;
  }

  container.innerHTML = "";
  var subtotal = 0;

  cart.forEach(function(item, index) {
    var priceNum = parseFloat(item.price.replace("$", ""));
    var qty = item.qty || 1;
    var lineTotal = priceNum * qty;
    subtotal += lineTotal;

    var itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = '<div class="item-details"><h3 class="item-name">' + item.name + '</h3><p class="item-price">' + item.price + ' / Size: ' + item.size + '</p></div><div class="quantity-control"><button class="qty-btn" onclick="changeQty(' + index + ', -1)">-</button><input type="number" class="qty-input" value="' + qty + '" min="1" onchange="setQty(' + index + ', this.value)"><button class="qty-btn" onclick="changeQty(' + index + ', 1)">+</button></div>';
    container.appendChild(itemDiv);
  });

  subtotalEl.textContent = "$" + subtotal.toFixed(1);
  totalEl.textContent = "$" + subtotal.toFixed(1);
}

function changeQty(index, delta) {
  var cart = JSON.parse(localStorage.getItem("nimbuCart") || "[]");
  if (!cart[index]) return;

  cart[index].qty = (cart[index].qty || 1) + delta;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("nimbuCart", JSON.stringify(cart));
  loadCart();
}

function setQty(index, value) {
  var cart = JSON.parse(localStorage.getItem("nimbuCart") || "[]");
  if (!cart[index]) return;

  var newQty = parseInt(value);

  if (isNaN(newQty) || newQty <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].qty = newQty;
  }

  localStorage.setItem("nimbuCart", JSON.stringify(cart));
  loadCart();
}