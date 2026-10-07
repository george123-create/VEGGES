// ======================================
// VEGGES PRODUCTS
// ======================================

const API_URL = "https://vegges.onrender.com/api";

const productContainer =
    document.getElementById("productContainer");

const pageTitle =
    document.getElementById("pageTitle");

const categoryFilter =
    document.getElementById("categoryFilter");


// ======================================
// GET CATEGORY FROM URL
// ======================================

const urlParams =
    new URLSearchParams(window.location.search);

let selectedCategory =
    urlParams.get("category") || "";


// ======================================
// LOAD CATEGORIES
// ======================================

async function loadCategories() {

    try {

        const response =
            await fetch(API_URL + "/categories");

        const data =
            await response.json();

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load categories"
            );

        }

        const categories =
            Array.isArray(data.categories)
                ? data.categories
                : [];

        if (!categoryFilter) {
            return;
        }

        categoryFilter.innerHTML = "";


        // ======================================
        // ALL BUTTON
        // ======================================

        const allButton =
            document.createElement("button");

        allButton.className =
            "category-btn";

        allButton.textContent =
            "All";

        allButton.dataset.category =
            "";

        if (!selectedCategory) {

            allButton.classList.add(
                "active"
            );

        }

        allButton.addEventListener(
            "click",
            function () {

                selectedCategory = "";

                updateCategoryButtons(
                    allButton
                );

                updatePageTitle();

                loadProducts();


                // Remove category from URL

                const newUrl =
                    new URL(
                        window.location.href
                    );

                newUrl.searchParams.delete(
                    "category"
                );

                window.history.pushState(
                    {},
                    "",
                    newUrl
                );

            }
        );

        categoryFilter.appendChild(
            allButton
        );


        // ======================================
        // DATABASE CATEGORIES
        // ======================================

        categories.forEach(
            function (category) {

                const categoryName =
                    typeof category === "string"
                        ? category
                        : category.name;

                if (!categoryName) {
                    return;
                }

                const button =
                    document.createElement(
                        "button"
                    );

                button.className =
                    "category-btn";

                button.textContent =
                    categoryName;

                button.dataset.category =
                    categoryName;


                // Select category from URL

                if (
                    selectedCategory &&
                    categoryName.toLowerCase() ===
                    selectedCategory.toLowerCase()
                ) {

                    button.classList.add(
                        "active"
                    );

                }


                // ======================================
                // CATEGORY CLICK
                // ======================================

                button.addEventListener(
                    "click",
                    function () {

                        selectedCategory =
                            categoryName;

                        updateCategoryButtons(
                            button
                        );

                        updatePageTitle();


                        // Update URL

                        const newUrl =
                            new URL(
                                window.location.href
                            );

                        newUrl.searchParams.set(
                            "category",
                            categoryName
                        );

                        window.history.pushState(
                            {},
                            "",
                            newUrl
                        );


                        // Load filtered products

                        loadProducts();

                    }
                );

                categoryFilter.appendChild(
                    button
                );

            }
        );

    } catch (error) {

        console.error(
            "Categories Error:",
            error
        );

    }

}


// ======================================
// UPDATE CATEGORY BUTTONS
// ======================================

function updateCategoryButtons(
    activeButton
) {

    const buttons =
        document.querySelectorAll(
            ".category-btn"
        );

    buttons.forEach(
        function (button) {

            button.classList.remove(
                "active"
            );

        }
    );

    if (activeButton) {

        activeButton.classList.add(
            "active"
        );

    }

}


// ======================================
// UPDATE PAGE TITLE
// ======================================

function updatePageTitle() {

    if (!pageTitle) {
        return;
    }

    if (selectedCategory) {

        pageTitle.textContent =
            selectedCategory;

    } else {

        pageTitle.textContent =
            "All Products";

    }

}


// ======================================
// LOAD PRODUCTS
// ======================================

async function loadProducts() {

    try {

        const response =
            await fetch(
                API_URL + "/products"
            );

        const data =
            await response.json();

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load products"
            );

        }

        let products =
            data.products || [];


        // ======================================
        // FILTER BY CATEGORY
        // ======================================

        if (selectedCategory) {

            products =
                products.filter(
                    function (product) {

                        return (
                            product.category &&
                            product.category
                                .toLowerCase() ===
                            selectedCategory
                                .toLowerCase()
                        );

                    }
                );

        }


        // Display products

        displayProducts(products);

    } catch (error) {

        console.error(
            "Products Error:",
            error
        );

        if (productContainer) {

            productContainer.innerHTML =
                '<p style="text-align:center;">' +
                'Unable to load products.' +
                '</p>';

        }

    }

}


// ======================================
// DISPLAY PRODUCTS
// ======================================

function displayProducts(products) {

    productContainer.innerHTML = "";


    // ======================================
    // NO PRODUCTS
    // ======================================

    if (
        !products ||
        products.length === 0
    ) {

        productContainer.innerHTML =
            '<h2 style="text-align:center;">' +
            'No products available' +
            '</h2>';

        return;

    }


    // ======================================
    // CREATE PRODUCT CARDS
    // ======================================

    products.forEach(
        function (product) {

            const productCard =
                document.createElement(
                    "div"
                );

            productCard.classList.add(
                "product-card"
            );


            // ======================================
            // PRODUCT IMAGE
            // ======================================

            const image =
                product.image ||
                "../images/vegetables/tomato.jpg";


            // ======================================
            // PRODUCT CARD CONTENT
            // ======================================

            productCard.innerHTML =
                '<img src="' +
                image +
                '" alt="' +
                product.name +
                '">' +

                '<h3>' +
                product.name +
                '</h3>' +

                '<p>₹' +
                product.price +
                '</p>' +

                '<button onclick="addToCart(\'' +
                product._id +
                '\'); event.stopPropagation();">' +
                'Add to Cart 🛒' +
                '</button>';


            // ======================================
            // OPEN PRODUCT DETAILS
            // ======================================

            productCard.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "product-details.html?id=" +
                        encodeURIComponent(
                            product._id
                        );

                }
            );


            productContainer.appendChild(
                productCard
            );

        }
    );

}


// ======================================
// ADD TO CART
// ======================================

async function addToCart(productId) {

    try {

        const user =
            JSON.parse(
                localStorage.getItem("user")
            );


        // ======================================
        // CHECK LOGIN
        // ======================================

        if (!user || !user._id) {

            alert(
                "Please login before adding products to cart."
            );

            window.location.href =
                "login.html";

            return;

        }


        // ======================================
        // ADD TO MONGODB CART
        // ======================================

        const response =
            await fetch(
                API_URL + "/cart/add",
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
                            productId,

                        quantity:
                            1

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


        // ======================================
        // GET PRODUCT DETAILS
        // ======================================

        const productsResponse =
            await fetch(
                API_URL +
                "/products/" +
                productId
            );


        const productData =
            await productsResponse.json();


        if (
            productData.success &&
            productData.product
        ) {

            const product =
                productData.product;


            const existingProduct =
                cart.find(
                    function (item) {

                        return (
                            item.id ===
                            product._id
                        );

                    }
                );


            if (existingProduct) {

                existingProduct.quantity++;

            } else {

                cart.push({

                    id:
                        product._id,

                    name:
                        product.name,

                    price:
                        product.price,

                    category:
                        product.category,

                    image:
                        product.image,

                    quantity:
                        1

                });

            }


            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

        }


        // ======================================
        // CART NOTIFICATION
        // ======================================

        const notification =
            document.getElementById(
                "cartNotification"
            );


        if (notification) {

            notification.classList.add(
                "show"
            );


            setTimeout(
                function () {

                    notification.classList.remove(
                        "show"
                    );

                },
                1000
            );

        }


        console.log(
            "Product added successfully:",
            productId
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


// ======================================
// INITIAL LOAD
// ======================================

updatePageTitle();

loadCategories();

loadProducts();


console.log(
    "✅ VEGGES Products loaded successfully"
);