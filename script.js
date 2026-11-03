/* =========================
   1. MOBILE NAVIGATION
========================= */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });

  document.querySelectorAll("#nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    });
  });
}


/* =========================
   2. CROP ENQUIRY LINKS
========================= */

const cropLinks = document.querySelectorAll("[data-crop]");
const interestSelect = document.getElementById("interest");
const messageField = document.getElementById("message");

cropLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    const selectedCrop = link.dataset.crop;
    if (interestSelect) interestSelect.value = selectedCrop;
    if (messageField) {
      messageField.value = "Hello MATREB FARM, I would like to enquire about " +
        selectedCrop.toLowerCase() + ". Please provide more information.";
    }
  });
});


/* =========================
   3. CONTACT FORM DEMO
========================= */

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const customerName = document.getElementById("name").value.trim();
    formStatus.textContent = "Thank you, " + customerName +
      "! Your form is working. Connect an email service to receive enquiries.";
    formStatus.style.color = "#245c35";
    contactForm.reset();
  });
}


/* =========================
   4. AUTOMATIC FOOTER YEAR
========================= */

const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();


/* =========================
   5. SHOPPING CART
========================= */

let cart = [];

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");
const checkoutForm = document.getElementById("checkout-form");
const orderForm = document.getElementById("order-form");

function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);
}

function displayCart() {
  if (!cartItems || !cartTotal) return;

  cartItems.replaceChildren();

  if (cart.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Your shopping cart is empty.";
    cartItems.appendChild(emptyMessage);
    cartTotal.textContent = formatNaira(0);
    if (checkoutButton) checkoutButton.disabled = true;
    if (checkoutForm) checkoutForm.hidden = true;
    return;
  }

  let total = 0;

  cart.forEach(function (item) {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const row = document.createElement("div");
    row.className = "cart-item";

    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = item.name;
    const unitPrice = document.createElement("p");
    unitPrice.textContent = formatNaira(item.price) + " each";
    details.append(name, unitPrice);

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.className = "quantity-minus";
    minus.dataset.name = item.name;
    minus.setAttribute("aria-label", "Decrease " + item.name + " quantity");
    minus.textContent = "−";

    const quantity = document.createElement("span");
    quantity.textContent = String(item.quantity);

    const plus = document.createElement("button");
    plus.type = "button";
    plus.className = "quantity-plus";
    plus.dataset.name = item.name;
    plus.setAttribute("aria-label", "Increase " + item.name + " quantity");
    plus.textContent = "+";

    controls.append(minus, quantity, plus);

    const subtotal = document.createElement("strong");
    subtotal.textContent = formatNaira(itemTotal);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-item";
    remove.dataset.name = item.name;
    remove.textContent = "Remove";

    row.append(details, controls, subtotal, remove);
    cartItems.appendChild(row);
  });

  cartTotal.textContent = formatNaira(total);
  if (checkoutButton) checkoutButton.disabled = false;
}


// Add a product to the cart.
document.querySelectorAll(".add-to-cart").forEach(function (button) {
  button.addEventListener("click", function () {
    const productName = button.dataset.product;
    const productPrice = Number(button.dataset.price);

    if (!productName || !Number.isFinite(productPrice) || productPrice <= 0) {
      alert("Sorry, this product has an invalid name or price.");
      return;
    }

    const existingProduct = cart.find(function (item) {
      return item.name === productName;
    });

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    displayCart();

    const originalText = button.textContent;
    button.textContent = "Added!";
    button.disabled = true;
    window.setTimeout(function () {
      button.textContent = originalText;
      button.disabled = false;
    }, 900);
  });
});


// Change product quantities or remove a product.
if (cartItems) {
  cartItems.addEventListener("click", function (event) {
    const target = event.target;
    const productName = target.dataset.name;
    if (!productName) return;

    const product = cart.find(function (item) {
      return item.name === productName;
    });
    if (!product) return;

    if (target.classList.contains("quantity-plus")) {
      product.quantity += 1;
    } else if (target.classList.contains("quantity-minus")) {
      product.quantity -= 1;
      if (product.quantity <= 0) {
        cart = cart.filter(function (item) {
          return item.name !== productName;
        });
      }
    } else if (target.classList.contains("remove-item")) {
      cart = cart.filter(function (item) {
        return item.name !== productName;
      });
    } else {
      return;
    }

    displayCart();
  });
}


// Reveal the customer details form.
if (checkoutButton && checkoutForm) {
  checkoutButton.addEventListener("click", function () {
    if (cart.length === 0) return;
    checkoutForm.hidden = false;
    checkoutForm.scrollIntoView({ behavior: "smooth", block: "start" });
    const firstField = document.getElementById("customer-name");
    if (firstField) firstField.focus({ preventScroll: true });
  });
}


// Build the order and open WhatsApp.
if (orderForm) {
  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!orderForm.checkValidity()) {
      orderForm.reportValidity();
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty. Add a product before checking out.");
      return;
    }

    const customerName = document.getElementById("customer-name").value.trim();
    const customerPhone = document.getElementById("customer-phone").value.trim();
    const customerAddress = document.getElementById("customer-address").value.trim();
    const instructions = document.getElementById("order-instructions").value.trim();

    let total = 0;
    let message = "MATREB FARM - NEW ORDER ENQUIRY\n\n" +
      "Customer: " + customerName + "\n" +
      "Phone: " + customerPhone + "\n" +
      "Delivery address: " + customerAddress + "\n\n" +
      "ORDER DETAILS:\n";

    cart.forEach(function (item) {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      message += item.name + " | Quantity: " + item.quantity +
        " | " + formatNaira(itemTotal) + "\n";
    });

    message += "\nSubtotal: " + formatNaira(total);
    if (instructions) message += "\n\nAdditional instructions: " + instructions;
    message += "\n\nPlease confirm availability, product quantity/unit, final price and delivery charges. Thank you.";

    const whatsappNumber = "2347038739595";
    const whatsappURL = "https://wa.me/" + whatsappNumber +
      "?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank", "noopener");
  });
}

displayCart();
