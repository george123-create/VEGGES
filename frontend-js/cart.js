// ======================================
// VEGGES CART SYSTEM
// ======================================


let cart = JSON.parse(localStorage.getItem("cart")) || [];


const cartContainer = document.getElementById("cartContainer");

const cartTotal = document.getElementById("cartTotal");




// Display Cart

function displayCart(){


    cartContainer.innerHTML = "";


    if(cart.length === 0){


        cartContainer.innerHTML = `

            <h2 style="text-align:center;">
                Your cart is empty 🛒
            </h2>

        `;


        cartTotal.innerHTML = "₹0";

        return;

    }




    let total = 0;



    cart.forEach((item,index)=>{


        total += item.price * item.quantity;



        const cartItem = document.createElement("div");


        cartItem.classList.add("cart-item");



        cartItem.innerHTML = `


            <img src="${item.image}">


            <div class="cart-info">


                <h3>${item.name}</h3>


                <p>
                    Price: ₹${item.price}
                </p>


            </div>




            <div class="quantity-box">


                <button onclick="decreaseQuantity(${index})">
                    -
                </button>


                <span>
                    ${item.quantity}
                </span>


                <button onclick="increaseQuantity(${index})">
                    +
                </button>


            </div>




            <button 
            class="remove-btn"
            onclick="removeItem(${index})">

                Remove

            </button>


        `;



        cartContainer.appendChild(cartItem);


    });



    cartTotal.innerHTML = "₹" + total;



}




// Increase Quantity

function increaseQuantity(index){


    cart[index].quantity++;


    saveCart();


}



// Decrease Quantity

function decreaseQuantity(index){


    if(cart[index].quantity > 1){

        cart[index].quantity--;

    }


    saveCart();


}



// Remove Item

function removeItem(index){


    cart.splice(index,1);


    saveCart();


}




// Save Cart

function saveCart(){


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    displayCart();

}




// Load Cart

displayCart();
// Go to Checkout Page

const checkoutBtn = document.getElementById("checkoutBtn");


checkoutBtn.addEventListener("click",()=>{


    if(cart.length === 0){

        alert("Your cart is empty 🛒");

        return;

    }


    window.location.href = "checkout.html";


});