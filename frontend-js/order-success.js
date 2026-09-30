// ======================================
// VEGGES ORDER SUCCESS
// ======================================

const order =
    JSON.parse(
        localStorage.getItem("order")
    );


// ======================================
// GET ELEMENTS
// ======================================

const orderId =
    document.getElementById("orderId");

const customerName =
    document.getElementById("customerName");

const orderAmount =
    document.getElementById("orderAmount");

const paymentMethod =
    document.getElementById("paymentMethod");

const viewOrderBtn =
    document.getElementById("viewOrderBtn");


// ======================================
// CHECK ORDER
// ======================================

if (!order) {

    orderId.textContent = "N/A";

    customerName.textContent = "Customer";

    orderAmount.textContent = "₹0";

    paymentMethod.textContent = "N/A";


    // Disable View Order if no order exists

    if (viewOrderBtn) {

        viewOrderBtn.href = "order.html";

    }

} else {

    // ======================================
    // DISPLAY ORDER ID
    // ======================================

    orderId.textContent =
        order.orderId || "N/A";


    // ======================================
    // DISPLAY CUSTOMER
    // ======================================

    customerName.textContent =
        order.customerName || "Customer";


    // ======================================
    // DISPLAY AMOUNT
    // ======================================

    orderAmount.textContent =
        "₹" +
        Number(
            order.totalAmount || 0
        ).toFixed(2);


    // ======================================
    // DISPLAY PAYMENT METHOD
    // ======================================

    paymentMethod.textContent =
        order.paymentMethod === "ONLINE"
            ? "Online Payment"
            : "Cash On Delivery";


    // ======================================
    // SAVE EXACT CURRENT ORDER ID
    // ======================================

    if (order.orderId) {

        localStorage.setItem(
            "currentOrderId",
            order.orderId
        );


        // ======================================
        // CONNECT VIEW ORDER BUTTON
        // TO EXACT CURRENT ORDER
        // ======================================

        if (viewOrderBtn) {

            viewOrderBtn.href =
                `order.html?orderId=${encodeURIComponent(order.orderId)}`;

        }

    }

}