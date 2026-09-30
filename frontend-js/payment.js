// ======================================
// VEGGES PAYMENT SYSTEM
// ======================================

const API_URL = "http://localhost:5000/api";


// ======================================
// GET ELEMENTS
// ======================================

const paymentAmount = document.getElementById("paymentAmount");
const confirmPayment = document.getElementById("confirmPayment");
const paymentMessage = document.getElementById("paymentMessage");


// ======================================
// GET CART
// ======================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length === 0) {

    alert("Your cart is empty.");

    window.location.href = "cart.html";

}


// ======================================
// CALCULATE TOTAL
// ======================================

let total = 0;

cart.forEach(item => {

    total += Number(item.price) * Number(item.quantity);

});

paymentAmount.innerHTML = "₹" + total.toFixed(2);


// ======================================
// GET CUSTOMER DETAILS
// ======================================

const customer =
    JSON.parse(localStorage.getItem("customer")) || null;


// ======================================
// GET USER DETAILS
// ======================================

const user =
    JSON.parse(localStorage.getItem("user")) || null;


// ======================================
// CHECK LOGIN
// ======================================

if (!user) {

    alert("Please login before placing an order.");

    window.location.href = "login.html";

}


// ======================================
// GET USER ID
// ======================================

const userId = user?._id;


// ======================================
// GET DELIVERY ADDRESS
// ======================================

const deliveryAddress = [
    customer?.address,
    customer?.city,
    customer?.pincode
]
    .filter(Boolean)
    .join(", ");


// ======================================
// DEBUG INFORMATION
// ======================================

console.log("User:", user);
console.log("Customer:", customer);
console.log("User ID:", userId);
console.log("Delivery Address:", deliveryAddress);


// ======================================
// SHOW MESSAGE
// ======================================

function showMessage(message) {

    if (paymentMessage) {

        paymentMessage.style.display = "block";
        paymentMessage.textContent = message;

    }

}


// ======================================
// HIDE MESSAGE
// ======================================

function hideMessage() {

    if (paymentMessage) {

        paymentMessage.style.display = "none";

    }

}


// ======================================
// DISABLE BUTTON
// ======================================

function disableButton() {

    confirmPayment.disabled = true;
    confirmPayment.textContent = "Processing...";

}


// ======================================
// ENABLE BUTTON
// ======================================

function enableButton() {

    confirmPayment.disabled = false;
    confirmPayment.textContent = "Confirm Order";

}


// ======================================
// CREATE VEGGES ORDER
// ======================================

async function createVeggesOrder(paymentMethod) {

    const response = await fetch(
        `${API_URL}/orders/place`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                userId: userId,

                deliveryAddress: deliveryAddress,

                paymentMethod: paymentMethod

            })
        }
    );


    const data = await response.json();


    console.log("Create Order Response:", data);


    if (!response.ok || !data.success) {

        throw new Error(
            data.message || "Unable to create order"
        );

    }


    return data.order;

}


// ======================================
// CREATE PAYMENT RECORD
// ======================================

async function createPaymentRecord(
    orderId,
    paymentMethod
) {

    const response = await fetch(
        `${API_URL}/payments/create`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                orderId: orderId,

                paymentMethod: paymentMethod

            })
        }
    );


    const data = await response.json();


    console.log(
        "Create Payment Response:",
        data
    );


    if (!response.ok || !data.success) {

        throw new Error(
            data.message ||
            "Unable to create payment"
        );

    }


    return data.payment;

}


// ======================================
// CREATE RAZORPAY ORDER
// ======================================

async function createRazorpayOrder(orderId) {

    const response = await fetch(
        `${API_URL}/payments/razorpay/order`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                orderId: orderId

            })
        }
    );


    const data = await response.json();


    console.log(
        "Razorpay Order Response:",
        data
    );


    if (!response.ok || !data.success) {

        throw new Error(
            data.message ||
            "Unable to create Razorpay order"
        );

    }


    return data.razorpayOrder;

}


// ======================================
// VERIFY RAZORPAY PAYMENT
// ======================================

async function verifyRazorpayPayment(
    orderId,
    razorpayResponse
) {

    const response = await fetch(
        `${API_URL}/payments/razorpay/verify`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                orderId: orderId,

                razorpay_order_id:
                    razorpayResponse.razorpay_order_id,

                razorpay_payment_id:
                    razorpayResponse.razorpay_payment_id,

                razorpay_signature:
                    razorpayResponse.razorpay_signature

            })
        }
    );


    const data = await response.json();


    console.log(
        "Payment Verification Response:",
        data
    );


    if (!response.ok || !data.success) {

        throw new Error(
            data.message ||
            "Payment verification failed"
        );

    }


    return data;

}


// ======================================
// SAVE ORDER FOR SUCCESS PAGE
// ======================================

function saveOrderForSuccess(
    order,
    paymentMethod,
    paymentId = ""
) {

    const successOrder = {

        orderId: order._id,

        customerName:
            user?.name || "Customer",

        totalAmount:
            order.totalAmount,

        paymentMethod:
            paymentMethod,

        paymentId:
            paymentId,

        orderStatus:
            order.orderStatus,

        paymentStatus:
            paymentMethod === "ONLINE"
                ? "Paid"
                : "Pending"

    };


    localStorage.setItem(
        "order",
        JSON.stringify(successOrder)
    );

}


// ======================================
// COD PAYMENT
// ======================================

async function processCOD() {

    try {

        showMessage(
            "Placing your order..."
        );

        disableButton();


        // Create VEGGES order
        const order =
            await createVeggesOrder("COD");


        // Create payment record
        await createPaymentRecord(
            order._id,
            "COD"
        );


        // Save order
        saveOrderForSuccess(
            order,
            "COD"
        );


        // Clear cart
        localStorage.removeItem("cart");


        // Go to success page
        window.location.href =
            "order-success.html";


    } catch (error) {

        console.error(
            "COD Error:",
            error
        );


        alert(
            error.message ||
            "Unable to place order."
        );


        enableButton();

        hideMessage();

    }

}


// ======================================
// ONLINE PAYMENT
// ======================================

async function processOnlinePayment() {

    try {

        showMessage(
            "Preparing online payment..."
        );

        disableButton();


        // ==================================
        // 1. CREATE VEGGES ORDER
        // ==================================

        const order =
            await createVeggesOrder("ONLINE");


        // ==================================
        // 2. CREATE RAZORPAY ORDER
        // ==================================

        const razorpayOrder =
            await createRazorpayOrder(
                order._id
            );


        // ==================================
        // 3. RAZORPAY CHECKOUT
        // ==================================

        const options = {

            key: "rzp_test_TMWqLaFcok34wD",

            amount:
                razorpayOrder.amount,

            currency:
                razorpayOrder.currency,

            name:
                "VEGGES",

            description:
                "VEGGES Grocery Order",

            order_id:
                razorpayOrder.id,


            // ==================================
            // CUSTOMER DETAILS
            // ==================================

            prefill: {

                name:
                    user?.name || "",

                email:
                    user?.email || "",

                contact:
                    customer?.phone || ""

            },


            theme: {

                color: "#2e7d32"

            },


            // ==================================
            // PAYMENT SUCCESS
            // ==================================

            handler: async function (
                razorpayResponse
            ) {

                try {

                    showMessage(
                        "Verifying payment..."
                    );


                    const verification =
                        await verifyRazorpayPayment(
                            order._id,
                            razorpayResponse
                        );


                    if (
                        verification.success
                    ) {

                        saveOrderForSuccess(
                            order,
                            "ONLINE",
                            razorpayResponse
                                .razorpay_payment_id
                        );


                        localStorage.removeItem(
                            "cart"
                        );


                        window.location.href =
                            "order-success.html";

                    }

                } catch (error) {

                    console.error(
                        "Verification Error:",
                        error
                    );


                    alert(
                        error.message ||
                        "Payment verification failed."
                    );


                    enableButton();

                    hideMessage();

                }

            },


            // ==================================
            // PAYMENT WINDOW CLOSED
            // ==================================

            modal: {

                ondismiss: function () {

                    enableButton();

                    hideMessage();

                }

            }

        };


        const razorpay =
            new Razorpay(options);


        razorpay.open();


    } catch (error) {

        console.error(
            "Online Payment Error:",
            error
        );


        alert(
            error.message ||
            "Unable to start online payment."
        );


        enableButton();

        hideMessage();

    }

}


// ======================================
// CONFIRM ORDER
// ======================================

confirmPayment.addEventListener(
    "click",
    async function () {

        const selectedPayment =
            document.querySelector(
                'input[name="payment"]:checked'
            );


        if (!selectedPayment) {

            alert(
                "Please select a payment method."
            );

            return;

        }


        const paymentMethod =
            selectedPayment.value;


        // ==================================
        // CHECK USER
        // ==================================

        if (!userId) {

            alert(
                "User information not found. Please login again."
            );

            window.location.href =
                "login.html";

            return;

        }


        // ==================================
        // CHECK ADDRESS
        // ==================================

        if (!deliveryAddress) {

            alert(
                "Delivery address not found. Please update your profile."
            );

            window.location.href =
                "profile.html";

            return;

        }


        // ==================================
        // COD
        // ==================================

        if (
            paymentMethod === "COD"
        ) {

            await processCOD();

        }


        // ==================================
        // ONLINE
        // ==================================

        else if (
            paymentMethod === "ONLINE"
        ) {

            await processOnlinePayment();

        }

    }
);