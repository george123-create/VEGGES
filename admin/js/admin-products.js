// ======================================
// VEGGES - ADMIN PRODUCT MANAGEMENT
// ======================================


// =========================
// API URLs
// =========================

const PRODUCT_API_URL =
    "http://localhost:5000/api/products";

const CATEGORY_API_URL =
    "http://localhost:5000/api/admin/categories";


// =========================
// CHECK ADMIN LOGIN
// =========================

const adminToken =
    localStorage.getItem("adminToken");

const adminUserData =
    localStorage.getItem("adminUser");


if (!adminToken || !adminUserData) {

    window.location.href =
        "admin-login.html";

}


// =========================
// GET ADMIN DATA
// =========================

let adminUser;

try {

    adminUser =
        JSON.parse(adminUserData);

} catch (error) {

    console.error(
        "Invalid admin data"
    );

    localStorage.removeItem(
        "adminToken"
    );

    localStorage.removeItem(
        "adminUser"
    );

    window.location.href =
        "admin-login.html";
}


// =========================
// CHECK ADMIN ROLE
// =========================

if (
    !adminUser ||
    adminUser.role !== "admin"
) {

    localStorage.removeItem(
        "adminToken"
    );

    localStorage.removeItem(
        "adminUser"
    );

    window.location.href =
        "admin-login.html";
}


// =========================
// DOM ELEMENTS
// =========================

const productsTableBody =
    document.getElementById(
        "productsTableBody"
    );

const addProductBtn =
    document.getElementById(
        "addProductBtn"
    );

const productMessage =
    document.getElementById(
        "productMessage"
    );

const productModal =
    document.getElementById(
        "productModal"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

const closeModalBtn =
    document.getElementById(
        "closeModalBtn"
    );

const cancelBtn =
    document.getElementById(
        "cancelBtn"
    );

const productForm =
    document.getElementById(
        "productForm"
    );

const productName =
    document.getElementById(
        "productName"
    );

const productPrice =
    document.getElementById(
        "productPrice"
    );

const productStock =
    document.getElementById(
        "productStock"
    );

const productCategory =
    document.getElementById(
        "productCategory"
    );

const productImage =
    document.getElementById(
        "productImage"
    );

const productDescription =
    document.getElementById(
        "productDescription"
    );

const searchProduct =
    document.getElementById(
        "searchProduct"
    );

const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );

const menuBtn =
    document.getElementById(
        "menuBtn"
    );

const sidebar =
    document.getElementById(
        "sidebar"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

const adminName =
    document.getElementById(
        "adminName"
    );


// =========================
// VARIABLES
// =========================

let allProducts = [];

let allCategories = [];

let editingProductId = null;


// =========================
// DISPLAY ADMIN NAME
// =========================

if (
    adminName &&
    adminUser &&
    adminUser.name
) {

    adminName.textContent =
        adminUser.name;

}


// =========================
// MESSAGE
// =========================

function showMessage(
    message,
    type = "success"
) {

    if (!productMessage) {
        return;
    }

    productMessage.textContent =
        message;

    productMessage.className =
        `product-message ${type}`;

    setTimeout(() => {

        productMessage.textContent =
            "";

        productMessage.className =
            "product-message";

    }, 3000);

}


// =========================
// UNAUTHORIZED
// =========================

function handleUnauthorized(
    message
) {

    alert(
        message ||
        "Session expired. Please login again."
    );

    localStorage.removeItem(
        "adminToken"
    );

    localStorage.removeItem(
        "adminUser"
    );

    window.location.href =
        "admin-login.html";
}


// =========================
// ESCAPE HTML
// =========================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


// =========================
// LOAD CATEGORIES
// =========================

async function loadCategories() {

    try {

        const response =
            await fetch(
                CATEGORY_API_URL,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${adminToken}`
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "Categories API Response:",
            data
        );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleUnauthorized(
                data.message
            );

            return;

        }


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load categories."
            );

        }


        allCategories =
            Array.isArray(
                data.categories
            )
                ? data.categories
                : [];


        populateCategoryDropdown();

        populateCategoryFilter();


    } catch (error) {

        console.error(
            "Load categories error:",
            error
        );

        showMessage(
            "Unable to load categories.",
            "error"
        );

    }

}


// =========================
// POPULATE PRODUCT CATEGORY
// DROPDOWN
// =========================

function populateCategoryDropdown() {

    if (!productCategory) {
        return;
    }


    productCategory.innerHTML = `

        <option value="">
            Select Category
        </option>

    `;


    allCategories.forEach(
        category => {

            if (
                !category ||
                !category.name
            ) {
                return;
            }


            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category.name;

            option.textContent =
                category.name;

            productCategory.appendChild(
                option
            );

        }
    );

}


// =========================
// POPULATE CATEGORY FILTER
// =========================

function populateCategoryFilter() {

    if (!categoryFilter) {
        return;
    }


    categoryFilter.innerHTML = `

        <option value="">
            All Categories
        </option>

    `;


    allCategories.forEach(
        category => {

            if (
                !category ||
                !category.name
            ) {
                return;
            }


            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category.name;

            option.textContent =
                category.name;

            categoryFilter.appendChild(
                option
            );

        }
    );

}


// =========================
// LOAD PRODUCTS
// =========================

async function loadProducts() {

    try {

        productsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="no-data"
                >
                    Loading products...
                </td>

            </tr>

        `;


        const response =
            await fetch(
                PRODUCT_API_URL,
                {
                    method: "GET"
                }
            );


        const data =
            await response.json();


        console.log(
            "Products API Response:",
            data
        );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleUnauthorized(
                data.message
            );

            return;

        }


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load products."
            );

        }


        allProducts =
            Array.isArray(
                data.products
            )
                ? data.products
                : [];


        renderProducts(
            allProducts
        );


    } catch (error) {

        console.error(
            "Load products error:",
            error
        );


        productsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="no-data"
                >
                    Unable to load products.
                </td>

            </tr>

        `;

    }

}


// =========================
// RENDER PRODUCTS
// =========================

function renderProducts(
    products
) {

    if (!productsTableBody) {
        return;
    }


    if (
        !Array.isArray(products) ||
        products.length === 0
    ) {

        productsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="no-data"
                >
                    No products found.
                </td>

            </tr>

        `;

        return;

    }


    productsTableBody.innerHTML =
        products.map(
            product => {

                const image =
                    product.image &&
                    product.image.trim()
                        ? product.image
                        : "";


                const stock =
                    Number(
                        product.stock
                    ) || 0;


                const status =
                    stock > 0
                        ? "In Stock"
                        : "Out of Stock";


                const statusClass =
                    stock > 0
                        ? "in-stock"
                        : "out-of-stock";


                return `

                    <tr>

                        <!-- IMAGE -->

                        <td>

                            ${
                                image

                                    ? `

                                        <img
                                            src="${escapeHTML(image)}"
                                            alt="${escapeHTML(product.name)}"
                                            class="product-image"
                                            onerror="this.style.display='none'"
                                        >

                                      `

                                    : `

                                        <div
                                            class="no-image"
                                        >
                                            🥬
                                        </div>

                                      `
                            }

                        </td>


                        <!-- NAME -->

                        <td>

                            <strong>
                                ${escapeHTML(
                                    product.name
                                )}
                            </strong>

                        </td>


                        <!-- CATEGORY -->

                        <td>

                            ${escapeHTML(
                                product.category
                            )}

                        </td>


                        <!-- PRICE -->

                        <td>

                            ₹${Number(
                                product.price || 0
                            ).toFixed(2)}

                        </td>


                        <!-- STOCK -->

                        <td>

                            ${stock}

                        </td>


                        <!-- STATUS -->

                        <td>

                            <span
                                class="status-badge ${statusClass}"
                            >
                                ${status}
                            </span>

                        </td>


                        <!-- ACTIONS -->

                        <td>

                            <div
                                class="action-buttons"
                            >

                                <button
                                    type="button"
                                    class="edit-btn"
                                    onclick="editProduct('${product._id}')"
                                >
                                    ✏️ Edit
                                </button>


                                <button
                                    type="button"
                                    class="delete-btn"
                                    onclick="deleteProduct('${product._id}')"
                                >
                                    🗑 Delete
                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


// =========================
// SEARCH + FILTER
// =========================

function filterProducts() {

    const searchTerm =
        searchProduct
            ? searchProduct.value
                .trim()
                .toLowerCase()
            : "";


    const selectedCategory =
        categoryFilter
            ? categoryFilter.value
            : "";


    const filteredProducts =
        allProducts.filter(
            product => {

                const name =
                    String(
                        product.name || ""
                    ).toLowerCase();


                const category =
                    String(
                        product.category || ""
                    );


                const matchesSearch =
                    !searchTerm ||
                    name.includes(
                        searchTerm
                    );


                const matchesCategory =
                    !selectedCategory ||
                    category ===
                        selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    renderProducts(
        filteredProducts
    );

}


// Search

if (searchProduct) {

    searchProduct.addEventListener(
        "input",
        filterProducts
    );

}


// Category filter

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterProducts
    );

}


// =========================
// OPEN ADD PRODUCT MODAL
// =========================

if (addProductBtn) {

    addProductBtn.addEventListener(
        "click",
        () => {

            editingProductId =
                null;


            productForm.reset();


            modalTitle.textContent =
                "Add Product";


            populateCategoryDropdown();


            productModal.classList.add(
                "show"
            );

        }
    );

}


// =========================
// CLOSE MODAL
// =========================

function closeModal() {

    if (!productModal) {
        return;
    }


    productModal.classList.remove(
        "show"
    );


    if (productForm) {

        productForm.reset();

    }


    editingProductId =
        null;


    modalTitle.textContent =
        "Add Product";

}


// Close button

if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closeModal
    );

}


// Cancel button

if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        closeModal
    );

}


// Click outside

if (productModal) {

    productModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                productModal
            ) {

                closeModal();

            }

        }
    );

}


// =========================
// ADD / UPDATE PRODUCT
// =========================

if (productForm) {

    productForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                productName.value.trim();


            const price =
                Number(
                    productPrice.value
                );


            const stock =
                Number(
                    productStock.value
                );


            const category =
                productCategory.value.trim();


            const image =
                productImage.value.trim();


            const description =
                productDescription.value.trim();


            // Validation

            if (!name) {

                alert(
                    "Please enter a product name."
                );

                return;

            }


            if (
                Number.isNaN(price) ||
                price < 0
            ) {

                alert(
                    "Please enter a valid price."
                );

                return;

            }


            if (
                Number.isNaN(stock) ||
                stock < 0
            ) {

                alert(
                    "Please enter a valid stock quantity."
                );

                return;

            }


            if (!category) {

                alert(
                    "Please select a category."
                );

                return;

            }


            try {

                const isEditing =
                    Boolean(
                        editingProductId
                    );


                const url =
                    isEditing

                        ? `${PRODUCT_API_URL}/${editingProductId}`

                        : `${PRODUCT_API_URL}/add`;


                const method =
                    isEditing
                        ? "PUT"
                        : "POST";


                const response =
                    await fetch(
                        url,
                        {
                            method,

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${adminToken}`

                            },

                            body:
                                JSON.stringify({

                                    name,

                                    price,

                                    stock,

                                    category,

                                    image,

                                    description

                                })

                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Save product response:",
                    data
                );


                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    handleUnauthorized(
                        data.message
                    );

                    return;

                }


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Unable to save product."
                    );

                }


                showMessage(

                    isEditing

                        ? "Product updated successfully."

                        : "Product added successfully.",

                    "success"

                );


                closeModal();


                await loadProducts();


            } catch (error) {

                console.error(
                    "Save product error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to save product.",
                    "error"
                );

            }

        }
    );

}


// =========================
// EDIT PRODUCT
// =========================

window.editProduct =
    function (id) {

        const product =
            allProducts.find(
                item =>
                    item._id === id
            );


        if (!product) {

            alert(
                "Product not found."
            );

            return;

        }


        editingProductId =
            product._id;


        modalTitle.textContent =
            "Edit Product";


        productName.value =
            product.name || "";


        productPrice.value =
            product.price ?? "";


        productStock.value =
            product.stock ?? 0;


        productImage.value =
            product.image || "";


        productDescription.value =
            product.description || "";


        // Reload categories first

        populateCategoryDropdown();


        // Select existing category

        productCategory.value =
            product.category || "";


        // If old product category is not
        // currently present in MongoDB,
        // keep it visible so editing does
        // not destroy existing data.

        if (
            product.category &&
            productCategory.value !==
                product.category
        ) {

            const oldOption =
                document.createElement(
                    "option"
                );

            oldOption.value =
                product.category;

            oldOption.textContent =
                `${product.category} (Existing)`;


            productCategory.appendChild(
                oldOption
            );


            productCategory.value =
                product.category;

        }


        productModal.classList.add(
            "show"
        );

    };


// =========================
// DELETE PRODUCT
// =========================

window.deleteProduct =
    async function (id) {

        const product =
            allProducts.find(
                item =>
                    item._id === id
            );


        const productNameText =
            product
                ? product.name
                : "this product";


        const confirmed =
            confirm(
                `Are you sure you want to delete "${productNameText}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${PRODUCT_API_URL}/${id}`,
                    {
                        method: "DELETE",

                        headers: {
                            "Authorization":
                                `Bearer ${adminToken}`
                        }
                    }
                );


            const data =
                await response.json();


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                handleUnauthorized(
                    data.message
                );

                return;

            }


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Failed to delete product."
                );

            }


            showMessage(
                "Product deleted successfully.",
                "success"
            );


            await loadProducts();


        } catch (error) {

            console.error(
                "Delete product error:",
                error
            );


            showMessage(
                error.message ||
                "Unable to delete product.",
                "error"
            );

        }

    };


// =========================
// MOBILE SIDEBAR
// =========================

if (
    menuBtn &&
    sidebar
) {

    menuBtn.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


// =========================
// CUSTOMERS BUTTON
// =========================

// =========================
// CUSTOMERS BUTTON
// =========================

const customersBtn =
    document.getElementById(
        "customersBtn"
    );


if (customersBtn) {

    customersBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();

            window.location.href =
                "admin-users.html";

        }
    );

}

// =========================
// LOGOUT
// =========================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();


            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {
                return;
            }


            localStorage.removeItem(
                "adminToken"
            );

            localStorage.removeItem(
                "adminUser"
            );


            window.location.href =
                "admin-login.html";

        }
    );

}


// =========================
// INITIAL LOAD
// =========================

async function initializeProductsPage() {

    console.log(
        "VEGGES Admin Products initializing..."
    );


    // Load categories and products
    // independently so one failure does
    // not prevent the other.

    await Promise.all([
        loadCategories(),
        loadProducts()
    ]);


    console.log(
        "✅ VEGGES Admin Products loaded successfully"
    );

}


initializeProductsPage();