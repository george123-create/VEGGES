// ======================================
// VEGGES - ADMIN ORDERS
// ======================================


// ======================================
// API URL
// ======================================

const API_URL = "https://vegges.onrender.com/api";


// ======================================
// CHECK ADMIN LOGIN
// ======================================

const adminToken = localStorage.getItem("adminToken");
const adminUserData = localStorage.getItem("adminUser");


if (!adminToken || !adminUserData) {

    window.location.href = "admin-login.html";

}


// ======================================
// GET ADMIN DETAILS
// ======================================

let adminUser;

try {

    adminUser = JSON.parse(adminUserData);

} catch (error) {

    console.error("Invalid admin data:", error);

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    window.location.href = "admin-login.html";

}


// ======================================
// CHECK ADMIN ROLE
// ======================================

if (!adminUser || adminUser.role !== "admin") {

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    window.location.href = "admin-login.html";

}


// ======================================
// DISPLAY ADMIN NAME
// ======================================

const topAdminName =
    document.getElementById("topAdminName");


if (topAdminName && adminUser.name) {

    topAdminName.textContent =
        adminUser.name;

}


// ======================================
// DOM ELEMENTS
// ======================================

const sidebar =
    document.getElementById("sidebar");

const menuBtn =
    document.getElementById("menuBtn");

const ordersTable =
    document.getElementById("ordersTable");

const searchOrder =
    document.getElementById("searchOrder");

const statusFilter =
    document.getElementById("statusFilter");

const paymentFilter =
    document.getElementById("paymentFilter");

const orderMessage =
    document.getElementById("orderMessage");


// ======================================
// MODAL ELEMENTS
// ======================================

const orderModal =
    document.getElementById("orderModal");

const closeOrderModal =
    document.getElementById("closeOrderModal");

const closeOrderBtn =
    document.getElementById("closeOrderBtn");

const modalOrderId =
    document.getElementById("modalOrderId");

const customerDetails =
    document.getElementById("customerDetails");

const deliveryAddress =
    document.getElementById("deliveryAddress");

const orderProducts =
    document.getElementById("orderProducts");

const paymentDetails =
    document.getElementById("paymentDetails");

const orderStatusSelect =
    document.getElementById("orderStatusSelect");

const updateOrderStatusBtn =
    document.getElementById("updateOrderStatusBtn");


// ======================================
// STORE ORDERS
// ======================================

let allOrders = [];

let selectedOrderId = null;


// ======================================
// MOBILE SIDEBAR
// ======================================

if (menuBtn && sidebar) {

    menuBtn.addEventListener("click", () => {

        sidebar.classList.toggle("open");

    });

}


// ======================================
// SHOW MESSAGE
// ======================================

function showMessage(message, type = "success") {

    if (!orderMessage) return;

    orderMessage.textContent = message;

    orderMessage.className =
        "order-message " + type;


    setTimeout(() => {

        orderMessage.className =
            "order-message";

        orderMessage.textContent = "";

    }, 3000);

}


// ======================================
// FORMAT CURRENCY
// ======================================

function formatCurrency(amount) {

    return "₹" +
        Number(amount || 0).toLocaleString("en-IN");

}


// ======================================
// FORMAT DATE
// ======================================

function formatDate(date) {

    if (!date) return "N/A";

    const orderDate = new Date(date);

    return orderDate.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ======================================
// GET PAYMENT CLASS
// ======================================

function getPaymentClass(status) {

    if (
        String(status).toLowerCase() === "paid"
    ) {

        return "payment-paid";

    }

    return "payment-pending";

}


// ======================================
// GET STATUS CLASS
// ======================================

function getStatusClass(status) {

    return "status-" +
        String(status || "pending")
            .toLowerCase();

}


// ======================================
// LOAD ALL ORDERS
// ======================================

async function loadOrders() {

    try {

        if (ordersTable) {

            ordersTable.innerHTML = `
                <tr>
                    <td colspan="8" class="loading-row">
                        Loading orders...
                    </td>
                </tr>
            `;

        }


        const response = await fetch(

            `${API_URL}/admin/orders`,

            {
                method: "GET",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + adminToken

                }

            }

        );


        const data =
            await response.json();


        // =========================
        // UNAUTHORIZED
        // =========================

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            localStorage.removeItem(
                "adminToken"
            );

            localStorage.removeItem(
                "adminUser"
            );


            alert(
                data.message ||
                "Session expired. Please login again."
            );


            window.location.href =
                "admin-login.html";

            return;

        }


        // =========================
        // API ERROR
        // =========================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(

                data.message ||
                "Failed to load orders."

            );

        }


        // =========================
        // STORE ORDERS
        // =========================

        allOrders =
            Array.isArray(data.orders)
                ? data.orders
                : [];


        // =========================
        // DISPLAY ORDERS
        // =========================

        displayOrders(allOrders);


    } catch (error) {

        console.error(
            "Load orders error:",
            error
        );


        if (ordersTable) {

            ordersTable.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-row">
                        Unable to load orders.
                    </td>
                </tr>
            `;

        }


        showMessage(
            error.message ||
            "Unable to connect to server.",
            "error"
        );

    }

}


// ======================================
// DISPLAY ORDERS
// ======================================

function displayOrders(orders) {

    if (!ordersTable) return;


    // =========================
    // NO ORDERS
    // =========================

    if (!orders || orders.length === 0) {

        ordersTable.innerHTML = `
            <tr>
                <td colspan="8" class="empty-row">
                    No orders found.
                </td>
            </tr>
        `;

        return;

    }


    // =========================
    // CREATE TABLE
    // =========================

    ordersTable.innerHTML =
        orders.map((order) => {


            // Customer
            const customerName =
                order.user?.name ||
                "Unknown Customer";


            const customerEmail =
                order.user?.email ||
                "No email";


            // Order ID
            const orderId =
                order._id
                    ? order._id.slice(-6)
                    : "------";


            // Products
            const productsCount =
                Array.isArray(order.products)
                    ? order.products.length
                    : 0;


            // Payment
            const paymentStatus =
                order.paymentStatus ||
                "Pending";


            // Order Status
            const orderStatus =
                order.orderStatus ||
                "Pending";


            return `

                <tr>

                    <!-- ORDER ID -->

                    <td>

                        <span class="order-id">

                            #${orderId}

                        </span>

                    </td>


                    <!-- CUSTOMER -->

                    <td>

                        <div class="customer-name">

                            ${customerName}

                        </div>


                        <div class="customer-email">

                            ${customerEmail}

                        </div>

                    </td>


                    <!-- PRODUCTS -->

                    <td>

                        <span class="products-count">

                            ${productsCount} Product${productsCount !== 1 ? "s" : ""}

                        </span>

                    </td>


                    <!-- AMOUNT -->

                    <td>

                        <span class="order-amount">

                            ${formatCurrency(order.totalAmount)}

                        </span>

                    </td>


                    <!-- PAYMENT -->

                    <td>

                        <span class="badge ${getPaymentClass(paymentStatus)}">

                            ${paymentStatus}

                        </span>

                    </td>


                    <!-- STATUS -->

                    <td>

                        <span class="badge ${getStatusClass(orderStatus)}">

                            ${orderStatus}

                        </span>

                    </td>


                    <!-- DATE -->

                    <td>

                        <span class="order-date">

                            ${formatDate(order.createdAt)}

                        </span>

                    </td>


                    <!-- ACTION -->

                    <td>

                        <button
                            class="view-order-btn"
                            onclick="viewOrder('${order._id}')"
                        >

                            View

                        </button>

                    </td>

                </tr>

            `;

        }).join("");

}


// ======================================
// SEARCH AND FILTER ORDERS
// ======================================

function filterOrders() {

    const searchText =
        searchOrder.value
            .toLowerCase()
            .trim();


    const selectedStatus =
        statusFilter.value;


    const selectedPayment =
        paymentFilter.value;


    const filteredOrders =
        allOrders.filter((order) => {


            const customerName =
                order.user?.name
                    ?.toLowerCase() || "";


            const orderId =
                order._id
                    ?.toLowerCase() || "";


            // Search
            const matchesSearch =

                customerName.includes(searchText) ||

                orderId.includes(searchText) ||

                order._id
                    ?.slice(-6)
                    .toLowerCase()
                    .includes(searchText);


            // Status
            const matchesStatus =

                !selectedStatus ||

                order.orderStatus ===
                selectedStatus;


            // Payment
            const matchesPayment =

                !selectedPayment ||

                order.paymentStatus ===
                selectedPayment;


            return (

                matchesSearch &&

                matchesStatus &&

                matchesPayment

            );

        });


    displayOrders(filteredOrders);

}


// ======================================
// SEARCH EVENT
// ======================================

if (searchOrder) {

    searchOrder.addEventListener(
        "input",
        filterOrders
    );

}


// ======================================
// STATUS FILTER EVENT
// ======================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        filterOrders
    );

}


// ======================================
// PAYMENT FILTER EVENT
// ======================================

if (paymentFilter) {

    paymentFilter.addEventListener(
        "change",
        filterOrders
    );

}


// ======================================
// VIEW ORDER
// ======================================

function viewOrder(orderId) {

    const order =
        allOrders.find(

            (item) =>
                item._id === orderId

        );


    if (!order) {

        showMessage(
            "Order not found.",
            "error"
        );

        return;

    }


    selectedOrderId =
        order._id;


    // =========================
    // ORDER ID
    // =========================

    modalOrderId.textContent =
        "Order #" +
        order._id.slice(-6);


    // =========================
    // CUSTOMER DETAILS
    // =========================

    const customerName =
        order.user?.name ||
        "Unknown Customer";


    const customerEmail =
        order.user?.email ||
        "Not available";


    customerDetails.innerHTML = `

        <div class="customer-detail-item">

            <strong>Name:</strong>

            ${customerName}

        </div>


        <div class="customer-detail-item">

            <strong>Email:</strong>

            ${customerEmail}

        </div>

    `;


    // =========================
    // DELIVERY ADDRESS
    // =========================

    deliveryAddress.textContent =
        order.deliveryAddress ||
        "Address not available";


    // =========================
    // PRODUCTS
    // =========================

    const products =
        Array.isArray(order.products)
            ? order.products
            : [];


    if (products.length === 0) {

        orderProducts.innerHTML = `
            <p>No products available.</p>
        `;

    } else {

        orderProducts.innerHTML =
            products.map((item) => {


                const productName =
                    item.product?.name ||
                    "Unknown Product";


                const quantity =
                    item.quantity || 0;


                // Product price may vary
                const productPrice =
                    item.product?.price || 0;


                return `

                    <div class="order-product-item">

                        <div>

                            <div class="order-product-name">

                                ${productName}

                            </div>


                            <div class="order-product-quantity">

                                Quantity: ${quantity}

                            </div>

                        </div>


                        <div class="order-product-price">

                            ${formatCurrency(
                                productPrice * quantity
                            )}

                        </div>

                    </div>

                `;

            }).join("");

    }


    // =========================
    // PAYMENT DETAILS
    // =========================

    paymentDetails.innerHTML = `

        <div class="payment-detail-item">

            <strong>Payment Method:</strong>

            ${order.paymentMethod || "COD"}

        </div>


        <div class="payment-detail-item">

            <strong>Payment Status:</strong>

            ${order.paymentStatus || "Pending"}

        </div>


        <div class="payment-detail-item">

            <strong>Total Amount:</strong>

            ${formatCurrency(order.totalAmount)}

        </div>

    `;


    // =========================
    // ORDER STATUS
    // =========================

    orderStatusSelect.value =
        order.orderStatus ||
        "Pending";


    // =========================
    // OPEN MODAL
    // =========================

    orderModal.classList.add("show");

}


// Make function available globally
window.viewOrder = viewOrder;


// ======================================
// CLOSE MODAL
// ======================================

function closeModal() {

    if (orderModal) {

        orderModal.classList.remove("show");

    }


    selectedOrderId = null;

}


// Close X button

if (closeOrderModal) {

    closeOrderModal.addEventListener(
        "click",
        closeModal
    );

}


// Close button

if (closeOrderBtn) {

    closeOrderBtn.addEventListener(
        "click",
        closeModal
    );

}


// Close when clicking outside

if (orderModal) {

    orderModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === orderModal
            ) {

                closeModal();

            }

        }
    );

}


// ======================================
// UPDATE ORDER STATUS
// ======================================

async function updateOrderStatus() {

    try {

        if (!selectedOrderId) {

            showMessage(
                "No order selected.",
                "error"
            );

            return;

        }


        const newStatus =
            orderStatusSelect.value;


        // Disable button
        updateOrderStatusBtn.disabled =
            true;


        updateOrderStatusBtn.textContent =
            "Updating...";


        const response = await fetch(

            `${API_URL}/admin/orders/${selectedOrderId}/status`,

            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + adminToken

                },

                body: JSON.stringify({

                    orderStatus:
                        newStatus

                })

            }

        );


        const data =
            await response.json();


        // Unauthorized

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            localStorage.removeItem(
                "adminToken"
            );

            localStorage.removeItem(
                "adminUser"
            );


            window.location.href =
                "admin-login.html";

            return;

        }


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(

                data.message ||
                "Failed to update order."

            );

        }


        // Success

        showMessage(
            "Order status updated successfully!",
            "success"
        );


        closeModal();


        // Reload orders

        await loadOrders();


    } catch (error) {

        console.error(
            "Update order error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to update order.",
            "error"
        );

    } finally {

        updateOrderStatusBtn.disabled =
            false;


        updateOrderStatusBtn.textContent =
            "Update Status";

    }

}


// ======================================
// UPDATE BUTTON EVENT
// ======================================

if (updateOrderStatusBtn) {

    updateOrderStatusBtn.addEventListener(

        "click",

        updateOrderStatus

    );

}


// ======================================
// CUSTOMERS BUTTON
// ======================================

// ======================================
// CUSTOMERS BUTTON
// ======================================

const customersBtn =
    document.getElementById("customersBtn");



if (customersBtn) {

    customersBtn.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            window.location.href =
                "admin-users.html";

        }
    );

}

// ======================================
// ADMIN PROFILE
// ======================================

const adminProfileBtn =
    document.getElementById("adminProfileBtn");


if (adminProfileBtn) {

    adminProfileBtn.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            alert(
                "Admin profile will be added later."
            );

        }
    );

}


// ======================================
// LOGOUT
// ======================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        (event) => {

            event.preventDefault();


            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {

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


// ======================================
// LOAD ORDERS ON PAGE OPEN
// ======================================

loadOrders();


// ======================================
// CONSOLE MESSAGE
// ======================================

console.log(
    "✅ VEGGES Admin Orders loaded successfully"
);