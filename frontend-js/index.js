// ======================================
// VEGGES HOME PAGE
// LOAD CATEGORIES FROM MONGODB
// ======================================

const API_URL = "https://vegges.onrender.com/api";
const BACKEND_URL = "https://vegges.onrender.com";

const categoryContainer =
    document.getElementById("categoryContainer");


// ======================================
// LOAD CATEGORIES
// ======================================

async function loadCategories() {

    try {

        const response = await fetch(
            `${API_URL}/categories`
        );

        const data = await response.json();


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


        // Clear existing content
        categoryContainer.innerHTML = "";


        // No categories available
        if (categories.length === 0) {

            categoryContainer.innerHTML = `

                <p style="text-align:center;">
                    No categories available.
                </p>

            `;

            return;

        }


        // ======================================
        // DISPLAY CATEGORIES
        // ======================================

        categories.forEach(category => {

            const categoryCard =
                document.createElement("a");


            // Category click → Products page
            categoryCard.href =
                `products.html?category=${encodeURIComponent(
                    category.name
                )}`;


            categoryCard.classList.add(
                "category-card"
            );


            // ======================================
            // CATEGORY IMAGE
            // ======================================

            let imagePath =
                "../images/banners/vegetables hero.jpg";


            // If category has an uploaded image,
            // use the image stored in MongoDB
            if (category.image) {

                imagePath =
                    `${BACKEND_URL}${category.image}`;

            }


            // ======================================
            // CATEGORY CARD
            // ======================================

            categoryCard.innerHTML = `

                <img
                    src="${imagePath}"
                    alt="${category.name}"
                >

                <h3>
                    ${category.name}
                </h3>

                <p>
                    ${category.description || ""}
                </p>

            `;


            categoryContainer.appendChild(
                categoryCard
            );

        });

    } catch (error) {

        console.error(
            "Category loading error:",
            error
        );


        if (categoryContainer) {

            categoryContainer.innerHTML = `

                <p style="text-align:center;">
                    Unable to load categories.
                </p>

            `;

        }

    }

}


// ======================================
// LOAD CATEGORIES WHEN PAGE OPENS
// ======================================

if (categoryContainer) {

    loadCategories();

}