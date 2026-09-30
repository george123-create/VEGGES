// ======================================
// VEGGES - ADMIN CATEGORY MANAGEMENT
// ======================================


// =========================
// API URL
// =========================

const API_URL =
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

    console.error("Invalid admin data");

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

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

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    window.location.href =
        "admin-login.html";
}


// =========================
// DISPLAY ADMIN NAME
// =========================

const topAdminName =
    document.getElementById("topAdminName");


if (
    topAdminName &&
    adminUser.name
) {

    topAdminName.textContent =
        adminUser.name;

}


// =========================
// GET ELEMENTS
// =========================

const categoriesTable =
    document.getElementById("categoriesTable");

const addCategoryBtn =
    document.getElementById("addCategoryBtn");

const categoryModal =
    document.getElementById("categoryModal");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const categoryForm =
    document.getElementById("categoryForm");

const categoryId =
    document.getElementById("categoryId");

const categoryName =
    document.getElementById("categoryName");

const categoryDescription =
    document.getElementById(
        "categoryDescription"
    );

const categoryImage =
    document.getElementById(
        "categoryImage"
    );

const modalTitle =
    document.getElementById("modalTitle");

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");

const logoutBtn =
    document.getElementById("logoutBtn");


// =========================
// ESCAPE HTML
// =========================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;
}


// =========================
// HANDLE UNAUTHORIZED
// =========================

function handleUnauthorized(message) {

    alert(
        message ||
        "Session expired. Please login again."
    );

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    window.location.href =
        "admin-login.html";
}


// =========================
// LOAD CATEGORIES
// =========================

async function loadCategories() {

    try {

        categoriesTable.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="no-data"
                >
                    Loading categories...
                </td>
            </tr>
        `;


        const response =
            await fetch(
                API_URL,
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


        const categories =
            Array.isArray(data.categories)
                ? data.categories
                : [];


        if (categories.length === 0) {

            categoriesTable.innerHTML = `
                <tr>
                    <td
                        colspan="5"
                        class="no-data"
                    >
                        No categories available.
                    </td>
                </tr>
            `;

            return;
        }


        categoriesTable.innerHTML =
            categories.map(
                (category, index) => {

                    const categoryNameValue =
                        typeof category === "string"
                            ? category
                            : category.name;


                    const categoryDescriptionValue =
                        typeof category === "string"
                            ? "-"
                            : category.description || "-";


                    const categoryCreatedDate =
                        typeof category === "string"
                            ? "-"
                            : category.createdAt
                                ? new Date(
                                    category.createdAt
                                ).toLocaleDateString(
                                    "en-IN"
                                )
                                : "-";


                    const categoryIdValue =
                        typeof category === "string"
                            ? category
                            : category._id;


                    return `

                        <tr>

                            <td>
                                ${index + 1}
                            </td>

                            <td>
                                <strong>
                                    ${escapeHTML(
                                        categoryNameValue
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${escapeHTML(
                                    categoryDescriptionValue
                                )}
                            </td>

                            <td>
                                ${categoryCreatedDate}
                            </td>

                            <td>

                                <div
                                    class="action-buttons"
                                >

                                    <button
                                        type="button"
                                        class="edit-btn"
                                        onclick="editCategory('${categoryIdValue}')"
                                    >
                                        ✏️ Edit
                                    </button>

                                    <button
                                        type="button"
                                        class="delete-btn"
                                        onclick="deleteCategory('${categoryIdValue}')"
                                    >
                                        🗑 Delete
                                    </button>

                                </div>

                            </td>

                        </tr>

                    `;

                }
            ).join("");


    } catch (error) {

        console.error(
            "❌ Load categories error:",
            error
        );


        categoriesTable.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="no-data"
                >
                    Unable to load categories.
                </td>
            </tr>
        `;

    }

}


// =========================
// OPEN ADD CATEGORY MODAL
// =========================

if (addCategoryBtn) {

    addCategoryBtn.addEventListener(
        "click",
        () => {

            categoryForm.reset();

            categoryId.value = "";

            modalTitle.textContent =
                "Add Category";

            categoryModal.classList.add(
                "show"
            );

        }
    );

}


// =========================
// CLOSE MODAL
// =========================

function closeModal() {

    categoryModal.classList.remove(
        "show"
    );

    categoryForm.reset();

    categoryId.value = "";

    modalTitle.textContent =
        "Add Category";

}


// =========================
// CLOSE BUTTON
// =========================

if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closeModal
    );

}


// =========================
// CANCEL BUTTON
// =========================

if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        closeModal
    );

}


// =========================
// CLOSE OUTSIDE MODAL
// =========================

if (categoryModal) {

    categoryModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                categoryModal
            ) {

                closeModal();

            }

        }
    );

}


// =========================
// ADD / UPDATE CATEGORY
// =========================

if (categoryForm) {

    categoryForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                categoryName.value.trim();


            const description =
                categoryDescription.value.trim();


            if (!name) {

                alert(
                    "Please enter a category name."
                );

                return;

            }


            try {

                const isEditing =
                    Boolean(
                        categoryId.value
                    );


                const url =
                    isEditing
                        ? `${API_URL}/${categoryId.value}`
                        : API_URL;


                const method =
                    isEditing
                        ? "PUT"
                        : "POST";


                const formData =
                    new FormData();


                formData.append(
                    "name",
                    name
                );


                formData.append(
                    "description",
                    description
                );


                if (
                    categoryImage &&
                    categoryImage.files.length > 0
                ) {

                    formData.append(
                        "image",
                        categoryImage.files[0]
                    );

                }


                const response =
                    await fetch(
                        url,
                        {
                            method,

                            headers: {
                                "Authorization":
                                    `Bearer ${adminToken}`
                            },

                            body: formData
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Save category response:",
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
                    data.success === false
                ) {

                    throw new Error(
                        data.message ||
                        "Operation failed."
                    );

                }


                alert(
                    isEditing
                        ? "Category updated successfully!"
                        : "Category added successfully!"
                );


                closeModal();


                await loadCategories();


            } catch (error) {

                console.error(
                    "❌ Save category error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to save category."
                );

            }

        }
    );

}


// =========================
// EDIT CATEGORY
// =========================

async function editCategory(id) {

    try {

        const response =
            await fetch(
                API_URL,
                {
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
                "Unable to load categories."
            );

        }


        const categories =
            Array.isArray(data.categories)
                ? data.categories
                : [];


        const category =
            categories.find(
                item =>
                    typeof item === "string"
                        ? item === id
                        : item._id === id
            );


        if (!category) {

            alert(
                "Category not found."
            );

            return;

        }


        if (
            typeof category ===
            "string"
        ) {

            categoryId.value =
                category;

            categoryName.value =
                category;

            categoryDescription.value =
                "";

        } else {

            categoryId.value =
                category._id;

            categoryName.value =
                category.name || "";

            categoryDescription.value =
                category.description || "";

        }


        if (categoryImage) {

            categoryImage.value = "";

        }


        modalTitle.textContent =
            "Edit Category";


        categoryModal.classList.add(
            "show"
        );


    } catch (error) {

        console.error(
            "❌ Edit category error:",
            error
        );


        alert(
            error.message ||
            "Unable to load category."
        );

    }

}


window.editCategory =
    editCategory;


// =========================
// DELETE CATEGORY
// =========================

async function deleteCategory(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this category?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
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
            data.success === false
        ) {

            throw new Error(
                data.message ||
                "Failed to delete category."
            );

        }


        alert(
            data.message ||
            "Category deleted successfully!"
        );


        await loadCategories();


    } catch (error) {

        console.error(
            "❌ Delete category error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete category."
        );

    }

}


window.deleteCategory =
    deleteCategory;


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

const customersBtn =
    document.getElementById("customersBtn");

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

loadCategories();


console.log(
    "✅ VEGGES Category Management loaded successfully"
);