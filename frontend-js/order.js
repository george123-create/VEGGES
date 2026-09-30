// ======================================
// VEGGES - ORDER PAGE
// ======================================

const API_URL = "http://localhost:5000/api";


// ======================================
// HTML ELEMENTS
// ======================================

const loadingMessage =
    document.getElementById("loadingMessage");

const errorMessage =
    document.getElementById("errorMessage");

const errorText =
    document.getElementById("errorText");

const emptyOrders =
    document.getElementById("emptyOrders");

const ordersList =
    document.getElementById("ordersList");

const retryBtn =
    document.getElementById("retryBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const historyBtn =
    document.getElementById("historyBtn");

const currentOrderBtn =
    document.getElementById("currentOrderBtn");

const historyHeader =
    document.getElementById("historyHeader");

const ordersSubtitle =
    document.getElementById("ordersSubtitle");


// ======================================
// STORE ORDERS
// ======================================

let allOrders = [];

let currentOrder = null;


// ======================================
// GET ORDER ID FROM URL
// ======================================

const urlParams =
    new URLSearchParams(window.location.search);

const requestedOrderId =
    urlParams.get("orderId");


// ======================================
// GET LOGGED-IN USER
// ======================================

function getLoggedInUser() {

    const token =
        localStorage.getItem("token");

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (!token || !user) {

        alert(
            "Please login to view your orders."
        );

        window.location.href =
            "login.html";

        return null;
    }


    return {
        token,
        user
    };
}


// ======================================
// FORMAT DATE
// ======================================

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ======================================
// LOAD ORDERS
// ======================================

async function loadOrders() {

    const loginData =
        getLoggedInUser();


    if (!loginData) {
        return;
    }


    const {
        token,
        user
    } = loginData;


    // Show loading

    loadingMessage.style.display =
        "block";

    errorMessage.style.display =
        "none";

    emptyOrders.style.display =
        "none";

    ordersList.innerHTML =
        "";

    if (historyHeader) {

        historyHeader.style.display =
            "none";

    }


    try {

        console.log(
            "Loading orders for user:",
            user._id
        );


        const response =
            await fetch(
                `${API_URL}/orders/${user._id}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "Orders API response:",
            data
        );


        loadingMessage.style.display =
            "none";


        // ======================================
        // API ERROR
        // ======================================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load orders"
            );

        }


        // ======================================
        // NO ORDERS
        // ======================================

        if (
            !data.orders ||
            data.orders.length === 0
        ) {

            emptyOrders.style.display =
                "block";


            if (historyBtn) {

                historyBtn.style.display =
                    "none";

            }


            return;
        }


        // ======================================
        // SORT NEWEST ORDER FIRST
        // ======================================

        allOrders =
            [...data.orders].sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );


        // ======================================
        // FIND REQUESTED ORDER
        // ======================================

        if (requestedOrderId) {

            currentOrder =
                allOrders.find(
                    order =>
                        String(order._id) ===
                        String(requestedOrderId)
                );


            // ======================================
            // IF ORDER ID WAS NOT FOUND
            // ======================================

            if (!currentOrder) {

                console.warn(
                    "Requested order was not found:",
                    requestedOrderId
                );


                // Fall back to latest order

                currentOrder =
                    allOrders[0];

            }

        } else {

            // ======================================
            // NORMAL ORDER PAGE
            // SHOW LATEST ORDER
            // ======================================

            currentOrder =
                allOrders[0];

        }


        // ======================================
        // SHOW CURRENT ORDER
        // ======================================

        displayCurrentOrder();


    } catch (error) {

        console.error(
            "Error loading orders:",
            error
        );


        loadingMessage.style.display =
            "none";


        errorMessage.style.display =
            "block";


        errorText.textContent =
            error.message ||
            "Unable to load your orders.";
    }
}


// ======================================
// DISPLAY CURRENT ORDER
// ======================================

function displayCurrentOrder() {

    ordersList.innerHTML =
        "";


    if (historyHeader) {

        historyHeader.style.display =
            "none";

    }


    if (ordersSubtitle) {

        ordersSubtitle.textContent =
            "View your latest VEGGES order";

    }


    if (!currentOrder) {
        return;
    }


    displayOrderCard(
        currentOrder
    );


    // Show history button

    if (historyBtn) {

        historyBtn.style.display =
            "block";

    }


    // Show current button only if history is active

    if (currentOrderBtn) {

        currentOrderBtn.style.display =
            "none";

    }
}


// ======================================
// DISPLAY ORDER HISTORY
// ======================================

function displayOrderHistory() {

    ordersList.innerHTML =
        "";


    if (historyHeader) {

        historyHeader.style.display =
            "flex";

    }


    if (ordersSubtitle) {

        ordersSubtitle.textContent =
            "View all your previous VEGGES orders";

    }


    allOrders.forEach(
        order => {

            displayOrderCard(
                order
            );

        }
    );


    // Hide history button

    if (historyBtn) {

        historyBtn.style.display =
            "none";

    }


    // Show current order button

    if (currentOrderBtn) {

        currentOrderBtn.style.display =
            "block";

    }
}


// ======================================
// DISPLAY ORDER CARD
// ======================================

function displayOrderCard(order) {

    const orderCard =
        document.createElement("div");


    orderCard.className =
        "order-card";


    // ======================================
    // ORDER ID
    // ======================================

    const orderId =
        order._id
            ? order._id
                .slice(-8)
                .toUpperCase()
            : "N/A";


    // ======================================
    // ORDER STATUS
    // ======================================

    const orderStatus =
        order.status ||
        order.orderStatus ||
        "Pending";


    // ======================================
    // PAYMENT METHOD
    // ======================================

    const paymentMethod =
        order.paymentMethod ||
        "N/A";


    // ======================================
    // PAYMENT STATUS
    // ======================================

    const paymentStatus =
        order.paymentStatus ||
        "Pending";


    // ======================================
    // DELIVERY ADDRESS
    // ======================================

    const deliveryAddress =
        order.deliveryAddress ||
        "Address not available";


    // ======================================
    // DATE
    // ======================================

    const orderDate =
        order.createdAt
            ? formatDate(
                order.createdAt
            )
            : "N/A";


    // ======================================
    // PRODUCTS
    // ======================================

    let productsHTML =
        "";


    if (
        order.products &&
        order.products.length > 0
    ) {

        order.products.forEach(
            item => {

                const productName =
                    item.product?.name ||
                    "Product";


                const quantity =
                    item.quantity ||
                    1;


                const price =
                    item.product?.price ||
                    0;


                productsHTML += `

                    <div class="order-item">

                        <div>

                            <span class="order-item-name">
                                ${productName}
                            </span>

                            <span class="order-item-quantity">
                                × ${quantity}
                            </span>

                        </div>


                        <span class="order-item-price">
                            ₹${price * quantity}
                        </span>

                    </div>

                `;
            }
        );

    } else {

        productsHTML = `

            <p>
                No product information available.
            </p>

        `;
    }


    // ======================================
    // ORDER CARD HTML
    // ======================================

    orderCard.innerHTML = `

        <div class="order-top">

            <div>

                <div class="order-id">
                    Order #${orderId}
                </div>

                <small>
                    ${orderDate}
                </small>

            </div>


            <div class="order-status">
                ${orderStatus}
            </div>

        </div>


        <div class="order-details">


            <div class="detail-box">

                <h4>
                    Payment Method
                </h4>

                <p>
                    ${paymentMethod}
                </p>

            </div>


            <div class="detail-box">

                <h4>
                    Payment Status
                </h4>

                <p>
                    ${paymentStatus}
                </p>

            </div>


            <div class="detail-box">

                <h4>
                    Delivery Address
                </h4>

                <p>
                    ${deliveryAddress}
                </p>

            </div>


            <div class="detail-box">

                <h4>
                    Total Amount
                </h4>

                <p>
                    ₹${order.totalAmount || 0}
                </p>

            </div>


        </div>


        <div class="order-items">

            <h3>
                Ordered Products
            </h3>

            ${productsHTML}

        </div>


        <div class="order-total">

            <span>
                Total
            </span>

            <span>
                ₹${order.totalAmount || 0}
            </span>

        </div>

    `;


    ordersList.appendChild(
        orderCard
    );
}


// ======================================
// ORDER HISTORY BUTTON
// ======================================

if (historyBtn) {

    historyBtn.addEventListener(
        "click",
        () => {

            displayOrderHistory();

        }
    );

}


// ======================================
// CURRENT ORDER BUTTON
// ======================================

if (currentOrderBtn) {

    currentOrderBtn.addEventListener(
        "click",
        () => {

            displayCurrentOrder();

        }
    );

}


// ======================================
// RETRY BUTTON
// ======================================

if (retryBtn) {

    retryBtn.addEventListener(
        "click",
        () => {

            loadOrders();

        }
    );

}


// ======================================
// LOGOUT
// ======================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (confirmLogout) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );


                window.location.href =
                    "login.html";

            }

        }
    );

}


// ======================================
// LOAD ORDERS WHEN PAGE OPENS
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadOrders();

    }
);