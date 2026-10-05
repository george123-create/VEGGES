// ======================================
// VEGGES - ADMIN DASHBOARD
// ======================================


// =========================
// CHECK ADMIN LOGIN
// =========================

const adminToken = localStorage.getItem("adminToken");
const adminUserData = localStorage.getItem("adminUser");


// If admin is not logged in
if (!adminToken || !adminUserData) {

    window.location.href = "admin-login.html";

}


// =========================
// GET ADMIN DETAILS
// =========================

let adminUser;

try {

    adminUser = JSON.parse(adminUserData);

} catch (error) {

    console.error("Invalid admin user data");

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    window.location.href = "admin-login.html";

}


// =========================
// CHECK ADMIN ROLE
// =========================

if (!adminUser || adminUser.role !== "admin") {

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    window.location.href = "admin-login.html";

}


// =========================
// DISPLAY ADMIN NAME
// =========================

const adminName = document.getElementById("adminName");
const topAdminName = document.getElementById("topAdminName");


if (adminUser && adminUser.name) {

    if (adminName) {

        adminName.textContent = adminUser.name;

    }

    if (topAdminName) {

        topAdminName.textContent = adminUser.name;

    }

}


// =========================
// SIDEBAR MOBILE MENU
// =========================

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");


if (menuBtn && sidebar) {

    menuBtn.addEventListener("click", () => {

        sidebar.classList.toggle("open");

    });

}


// =========================
// QUICK ACTION - PRODUCTS
// =========================

const manageProductsBtn =
    document.getElementById("manageProductsBtn");


if (manageProductsBtn) {

    manageProductsBtn.addEventListener("click", () => {

        window.location.href = "admin-products.html";

    });

}


// =========================
// QUICK ACTION - CATEGORIES
// =========================

const manageCategoriesBtn =
    document.getElementById("manageCategoriesBtn");


if (manageCategoriesBtn) {

    manageCategoriesBtn.addEventListener("click", () => {

        window.location.href = "admin-categories.html";

    });

}


// =========================
// QUICK ACTION - ORDERS
// =========================

const manageOrdersBtn =
    document.getElementById("manageOrdersBtn");


if (manageOrdersBtn) {

    manageOrdersBtn.addEventListener("click", () => {

        window.location.href = "admin-orders.html";

    });

}


// =========================
// QUICK ACTION - CUSTOMERS
// =========================

const manageCustomersBtn =
    document.getElementById("manageCustomersBtn");


if (manageCustomersBtn) {

    manageCustomersBtn.addEventListener("click", () => {

        window.location.href = "admin-users.html";

    });

}


// =========================
// SIDEBAR CUSTOMERS
// =========================

const customersBtn =
    document.getElementById("customersBtn");


if (customersBtn) {

    customersBtn.addEventListener("click", (event) => {

        event.preventDefault();

        window.location.href = "admin-users.html";

    });

}


// =========================
// VIEW ALL ORDERS
// =========================

const viewAllOrdersBtn =
    document.getElementById("viewAllOrdersBtn");


if (viewAllOrdersBtn) {

    viewAllOrdersBtn.addEventListener("click", () => {

        window.location.href = "admin-orders.html";

    });

}


// =========================
// ADMIN PROFILE
// =========================

// =========================
// ADMIN PROFILE
// =========================

const adminProfileBtn =
    document.getElementById("adminProfileBtn");



if (adminProfileBtn) {

    adminProfileBtn.addEventListener("click", () => {

        window.location.href = "admin-profile.html";

    });

}

// =========================
// LOGOUT
// =========================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener("click", (event) => {

        event.preventDefault();


        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );


        if (!confirmLogout) {

            return;

        }


        // Remove admin login data
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");


        // Redirect to login
        window.location.href = "admin-login.html";

    });

}


// ======================================
// LOAD LIVE DASHBOARD DATA
// ======================================

async function loadDashboardData() {

    try {

        const API_URL = "https://vegges.onrender.com/api";
        const response = await fetch(
            `${API_URL}/dashboard`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + adminToken
                }
            }
        );


        const data = await response.json();


        // =========================
        // HANDLE UNAUTHORIZED ACCESS
        // =========================

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            alert(
                data.message ||
                "Your admin session has expired. Please login again."
            );


            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");


            window.location.href = "admin-login.html";

            return;

        }


        // =========================
        // HANDLE API ERROR
        // =========================

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Failed to load dashboard data."
            );

        }


        // =========================
        // GET DASHBOARD ELEMENTS
        // =========================

        const totalProducts =
            document.getElementById("totalProducts");


        const totalOrders =
            document.getElementById("totalOrders");


        const totalCustomers =
            document.getElementById("totalCustomers");


        const totalRevenue =
            document.getElementById("totalRevenue");


        // =========================
        // UPDATE STATISTICS
        // =========================

        if (totalProducts) {

            totalProducts.textContent =
                data.stats?.totalProducts ?? 0;

        }


        if (totalOrders) {

            totalOrders.textContent =
                data.stats?.totalOrders ?? 0;

        }


        if (totalCustomers) {

            totalCustomers.textContent =
                data.stats?.totalCustomers ?? 0;

        }


        if (totalRevenue) {

            const revenue =
                data.stats?.totalRevenue ?? 0;


            totalRevenue.textContent =
                "₹" +
                Number(revenue).toLocaleString("en-IN");

        }


        // =========================
        // LOAD RECENT ORDERS
        // =========================

        const recentOrdersTable =
            document.getElementById("recentOrdersTable");


        if (!recentOrdersTable) {

            return;

        }


        const orders =
            Array.isArray(data.recentOrders)
                ? data.recentOrders
                : [];


        // =========================
        // NO ORDERS
        // =========================

        if (orders.length === 0) {

            recentOrdersTable.innerHTML = `
                <tr>
                    <td colspan="5" class="no-data">
                        No orders available
                    </td>
                </tr>
            `;

            return;

        }


        // =========================
        // DISPLAY RECENT ORDERS
        // =========================

        recentOrdersTable.innerHTML =
            orders.map((order) => {

                const customerName =
                    order.user?.name ||
                    "Unknown Customer";


                const paymentStatus =
                    order.paymentStatus ||
                    "Pending";


                const orderStatus =
                    order.orderStatus ||
                    "Pending";


                const orderId =
                    order._id
                        ? order._id.slice(-6)
                        : "------";


                const amount =
                    Number(
                        order.totalAmount || 0
                    ).toLocaleString("en-IN");


                return `
                    <tr>

                        <td>
                            #${orderId}
                        </td>

                        <td>
                            ${customerName}
                        </td>

                        <td>
                            ₹${amount}
                        </td>

                        <td>
                            ${paymentStatus}
                        </td>

                        <td>
                            ${orderStatus}
                        </td>

                    </tr>
                `;

            }).join("");



    } catch (error) {

        console.error(
            "❌ Dashboard loading error:",
            error
        );


        const recentOrdersTable =
            document.getElementById("recentOrdersTable");


        if (recentOrdersTable) {

            recentOrdersTable.innerHTML = `
                <tr>
                    <td colspan="5" class="no-data">
                        Unable to load recent orders.
                    </td>
                </tr>
            `;

        }

    }

}


// ======================================
// LOAD DASHBOARD WHEN PAGE OPENS
// ======================================

loadDashboardData();


// =========================
// DASHBOARD LOADED
// =========================

console.log(
    "✅ VEGGES Admin Dashboard loaded successfully"
);