/* ======================================
   VEGGES - ADMIN CUSTOMERS
====================================== */

const API_URL = "http://localhost:5000/api";


// ======================================
// ELEMENTS
// ======================================

const customersTableBody =
    document.getElementById("customersTableBody");

const searchCustomer =
    document.getElementById("searchCustomer");

const customerMessage =
    document.getElementById("customerMessage");

const customerModal =
    document.getElementById("customerModal");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const closeCustomerBtn =
    document.getElementById("closeCustomerBtn");

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");

const logoutBtn =
    document.getElementById("logoutBtn");

const adminName =
    document.getElementById("adminName");


// ======================================
// CUSTOMER DATA
// ======================================

let customers = [];


// ======================================
// GET ADMIN TOKEN
// ======================================

const adminToken =
    localStorage.getItem("adminToken");


// ======================================
// CHECK ADMIN LOGIN
// ======================================

if (!adminToken) {

    window.location.href =
        "admin-login.html";

}


// ======================================
// LOAD ADMIN NAME
// ======================================

function loadAdminName() {

    try {

        const adminUser =
            JSON.parse(
                localStorage.getItem("adminUser")
            );

        if (
            adminUser &&
            adminUser.name &&
            adminName
        ) {

            adminName.textContent =
                adminUser.name;

        }

    } catch (error) {

        console.error(
            "Admin user data error:",
            error
        );

    }

}


// ======================================
// LOAD CUSTOMERS
// ======================================

async function loadCustomers() {

    try {

        showMessage(
            "Loading customers...",
            false
        );


        const response =
            await fetch(
                `${API_URL}/admin/customers`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${adminToken}`
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "Customers API Response:",
            data
        );


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Failed to load customers."
            );

        }


        customers =
            Array.isArray(data.customers)
                ? data.customers
                : [];


        renderCustomers(customers);


        showMessage(
            `${customers.length} customer(s) found.`,
            false
        );


    } catch (error) {

        console.error(
            "Load customers error:",
            error
        );


        customersTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="no-data"
                >
                    Unable to load customers.
                </td>

            </tr>

        `;


        showMessage(
            error.message ||
            "Failed to load customers.",
            true
        );

    }

}


// ======================================
// DISPLAY CUSTOMERS
// ======================================

function renderCustomers(customerList) {

    customersTableBody.innerHTML = "";


    if (!customerList.length) {

        customersTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="no-data"
                >
                    No customers found.
                </td>

            </tr>

        `;

        return;

    }


    customerList.forEach(
        (customer, index) => {

            const row =
                document.createElement("tr");


            const joinedDate =
                customer.createdAt
                    ? formatDate(
                        customer.createdAt
                    )
                    : "-";


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(
                            customer.name || "-"
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        customer.email || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        customer.phone || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        customer.address || "-"
                    )}
                </td>

                <td>
                    ${joinedDate}
                </td>

                <td>

                    <button
                        type="button"
                        class="view-customer-btn"
                        data-id="${customer._id}"
                    >
                        View
                    </button>

                </td>

            `;


            customersTableBody.appendChild(row);

        }
    );


    // =========================
    // VIEW BUTTONS
    // =========================

    const viewButtons =
        document.querySelectorAll(
            ".view-customer-btn"
        );


    viewButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const customerId =
                    button.dataset.id;

                openCustomerDetails(
                    customerId
                );

            }
        );

    });

}


// ======================================
// SEARCH CUSTOMERS
// ======================================

if (searchCustomer) {

    searchCustomer.addEventListener(
        "input",
        () => {

            const searchValue =
                searchCustomer.value
                    .trim()
                    .toLowerCase();


            if (!searchValue) {

                renderCustomers(
                    customers
                );

                return;

            }


            const filteredCustomers =
                customers.filter(
                    customer => {

                        const name =
                            customer.name ||
                            "";

                        const email =
                            customer.email ||
                            "";

                        const phone =
                            customer.phone ||
                            "";

                        const address =
                            customer.address ||
                            "";


                        return (

                            name
                                .toLowerCase()
                                .includes(searchValue)

                            ||

                            email
                                .toLowerCase()
                                .includes(searchValue)

                            ||

                            phone
                                .toLowerCase()
                                .includes(searchValue)

                            ||

                            address
                                .toLowerCase()
                                .includes(searchValue)

                        );

                    }
                );


            renderCustomers(
                filteredCustomers
            );

        }
    );

}


// ======================================
// OPEN CUSTOMER DETAILS
// ======================================

function openCustomerDetails(customerId) {

    const customer =
        customers.find(
            item =>
                item._id === customerId
        );


    if (!customer) {

        return;

    }


    document.getElementById(
        "detailName"
    ).textContent =
        customer.name || "-";


    document.getElementById(
        "detailEmail"
    ).textContent =
        customer.email || "-";


    document.getElementById(
        "detailPhone"
    ).textContent =
        customer.phone || "-";


    document.getElementById(
        "detailAddress"
    ).textContent =
        customer.address || "-";


    document.getElementById(
        "detailRole"
    ).textContent =
        customer.role || "customer";


    document.getElementById(
        "detailJoined"
    ).textContent =
        customer.createdAt
            ? formatDate(customer.createdAt)
            : "-";


    customerModal.classList.add(
        "active"
    );

}


// ======================================
// CLOSE CUSTOMER MODAL
// ======================================

function closeCustomerModal() {

    customerModal.classList.remove(
        "active"
    );

}


if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closeCustomerModal
    );

}


if (closeCustomerBtn) {

    closeCustomerBtn.addEventListener(
        "click",
        closeCustomerModal
    );

}


// ======================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ======================================

if (customerModal) {

    customerModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                customerModal
            ) {

                closeCustomerModal();

            }

        }
    );

}


// ======================================
// MOBILE SIDEBAR
// ======================================

if (menuBtn && sidebar) {

    menuBtn.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


// ======================================
// LOGOUT
// ======================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();


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
// SHOW MESSAGE
// ======================================

function showMessage(
    message,
    isError = false
) {

    if (!customerMessage) {

        return;

    }


    customerMessage.textContent =
        message;


    if (isError) {

        customerMessage.style.color =
            "#dc2626";

    } else {

        customerMessage.style.color =
            "#16a34a";

    }

}


// ======================================
// FORMAT DATE
// ======================================

function formatDate(dateValue) {

    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {

        return "-";

    }


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
// ESCAPE HTML
// ======================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ======================================
// INITIALIZE PAGE
// ======================================

loadAdminName();

loadCustomers();