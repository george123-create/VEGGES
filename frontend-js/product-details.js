// ======================================
// VEGGES PRODUCT DETAILS
// ======================================

const API_URL = "https://vegges.onrender.com/api";

let quantity = 1;
let currentProduct = null;


// ======================================
// GET PRODUCT ID FROM URL
// ======================================

const urlParams =
    new URLSearchParams(window.location.search);

const productId =
    urlParams.get("id");


// ======================================
// GET HTML ELEMENTS
// ======================================

const productImage =
    document.getElementById("productImage");

const productName =
    document.getElementById("productName");

const productPrice =
    document.getElementById("productPrice");

const productDescription =
    document.getElementById("productDescription");

const quantityInput =
    document.getElementById("quantity");

const plusBtn =
    document.getElementById("plus");

const minusBtn =
    document.getElementById("minus");

const cartButton =
    document.querySelector(".cart-btn");


// ======================================
// CHECK PRODUCT ID
// ======================================

if (!productId) {

    console.error(
        "Product ID not found in URL"
    );

    if (productName) {
        productName.textContent =
            "Product not found";
    }

}


// ======================================
// LOAD PRODUCT
// ======================================

async function loadProduct() {

    if (!productId) {
        return;
    }

    try {

        const response =
            await fetch(
                API_URL +
                "/products/" +
                productId
            );

        const data =
            await response.json();

        console.log(
            "Product Details Response:",
            data
        );


        if (
            !response.ok ||
            !data.success ||
            !data.product
        ) {

            throw new Error(
                data.message ||
                "Product not found"
            );

        }


        // ======================================
        // SAVE CURRENT PRODUCT
        // ======================================

        currentProduct =
            data.product;


        // ======================================
        // DISPLAY PRODUCT IMAGE
        // ======================================

        if (productImage) {

            productImage.src =
                currentProduct.image ||
                "../images/vegetables/tomato.jpg";

            productImage.alt =
                currentProduct.name || "Product";

        }


        // ======================================
        // DISPLAY PRODUCT NAME
        // ======================================

        if (productName) {

            productName.textContent =
                currentProduct.name;

        }


        // ======================================
        // DISPLAY PRODUCT PRICE
        // ======================================

        if (productPrice) {

            productPrice.textContent =
                "₹" +
                currentProduct.price;

        }


        // ======================================
        // DISPLAY PRODUCT DESCRIPTION
        // ======================================

        if (productDescription) {

            productDescription.textContent =
                currentProduct.description ||
                "Fresh quality product from VEGGES.";

        }


        // ======================================
        // UPDATE PAGE TITLE
        // ======================================

        document.title =
            "VEGGES - " +
            currentProduct.name;


        console.log(
            "Product loaded successfully:",
            currentProduct
        );

    } catch (error) {

        console.error(
            "Product Details Error:",
            error
        );


        if (productName) {

            productName.textContent =
                "Unable to load product";

        }

        if (productDescription) {

            productDescription.textContent =
                "Unable to load product details. Please try again.";

        }

    }

}


// ======================================
// INCREASE QUANTITY
// ======================================

if (plusBtn) {

    plusBtn.addEventListener(
        "click",
        function () {

            quantity++;

            if (quantityInput) {

                quantityInput.value =
                    quantity;

            }

        }
    );

}


// ======================================
// DECREASE QUANTITY
// ======================================

if (minusBtn) {

    minusBtn.addEventListener(
        "click",
        function () {

            if (quantity > 1) {

                quantity--;

            }

            if (quantityInput) {

                quantityInput.value =
                    quantity;

            }

        }
    );

}


// ======================================
// MANUAL QUANTITY INPUT
// ======================================

if (quantityInput) {

    quantityInput.addEventListener(
        "change",
        function () {

            let value =
                parseInt(
                    quantityInput.value
                );


            if (
                isNaN(value) ||
                value < 1
            ) {

                value = 1;

            }


            quantity = value;

            quantityInput.value =
                quantity;

        }
    );

}


// ======================================
// ADD TO CART
// ======================================

if (cartButton) {

    cartButton.addEventListener(
        "click",
        async function () {

            try {

                // ======================================
                // CHECK LOGIN
                // ======================================

                const user =
                    JSON.parse(
                        localStorage.getItem("user")
                    );


                if (
                    !user ||
                    !user._id
                ) {

                    alert(
                        "Please login before adding products to cart."
                    );

                    window.location.href =
                        "login.html";

                    return;

                }


                // ======================================
                // CHECK PRODUCT
                // ======================================

                if (!currentProduct) {

                    alert(
                        "Product information is not available."
                    );

                    return;

                }


                // ======================================
                // ADD TO MONGODB CART
                // ======================================

                const response =
                    await fetch(
                        API_URL +
                        "/cart/add",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                userId:
                                    user._id,

                                productId:
                                    currentProduct._id,

                                quantity:
                                    quantity

                            })

                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Unable to add product to cart"
                    );

                }


                // ======================================
                // UPDATE LOCAL STORAGE CART
                // ======================================

                let cart =
                    JSON.parse(
                        localStorage.getItem("cart")
                    ) || [];


                const existingProduct =
                    cart.find(
                        function (item) {

                            return (
                                item.id ===
                                currentProduct._id
                            );

                        }
                    );


                if (existingProduct) {

                    existingProduct.quantity +=
                        quantity;

                } else {

                    cart.push({

                        id:
                            currentProduct._id,

                        name:
                            currentProduct.name,

                        price:
                            currentProduct.price,

                        category:
                            currentProduct.category,

                        image:
                            currentProduct.image,

                        quantity:
                            quantity

                    });

                }


                localStorage.setItem(
                    "cart",
                    JSON.stringify(cart)
                );


                // ======================================
                // SUCCESS MESSAGE
                // ======================================

                alert(
                    currentProduct.name +
                    " added to cart 🛒"
                );


                console.log(
                    "Product added to cart:",
                    currentProduct.name,
                    "Quantity:",
                    quantity
                );


            } catch (error) {

                console.error(
                    "Add To Cart Error:",
                    error
                );

                alert(
                    error.message ||
                    "Unable to add product to cart."
                );

            }

        }
    );

}


// ======================================
// INITIAL LOAD
// ======================================

loadProduct();
