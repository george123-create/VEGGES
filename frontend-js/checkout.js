// ======================================
// VEGGES CHECKOUT SYSTEM
// ======================================


let cart = JSON.parse(localStorage.getItem("cart")) || [];


const checkoutItems = document.getElementById("checkoutItems");

const checkoutTotal = document.getElementById("checkoutTotal");



// Display Order Summary

function displayCheckout(){


    checkoutItems.innerHTML = "";


    let total = 0;



    if(cart.length === 0){


        checkoutItems.innerHTML = `

        <p>
        Your cart is empty 🛒
        </p>

        `;


        checkoutTotal.innerHTML = "₹0";

        return;

    }




    cart.forEach(item=>{


        total += item.price * item.quantity;



        checkoutItems.innerHTML += `


        <div class="checkout-item">


            <img src="${item.image}">


            <div>

                <p>
                ${item.name}
                </p>


                <p>
                Qty: ${item.quantity}
                </p>


            </div>



            <strong>
            ₹${item.price * item.quantity}
            </strong>



        </div>


        `;


    });



    checkoutTotal.innerHTML = "₹" + total;



}




// Form Submit


const checkoutForm = document.getElementById("checkoutForm");


checkoutForm.addEventListener("submit",(e)=>{


    e.preventDefault();



    const customer = {


        name:
        document.getElementById("name").value,


        phone:
        document.getElementById("phone").value,


        address:
        document.getElementById("address").value,


        city:
        document.getElementById("city").value,


        pincode:
        document.getElementById("pincode").value



    };



    localStorage.setItem(
        "customer",
        JSON.stringify(customer)
    );



    window.location.href="payment.html";


});





displayCheckout();