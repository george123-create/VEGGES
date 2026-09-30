// ======================================
// VEGGES PRODUCT DETAILS
// ======================================


let quantity = 1;


const quantityInput = document.getElementById("quantity");

const plusBtn = document.getElementById("plus");

const minusBtn = document.getElementById("minus");



// Increase Quantity

plusBtn.addEventListener("click",()=>{


    quantity++;

    quantityInput.value = quantity;


});



// Decrease Quantity

minusBtn.addEventListener("click",()=>{


    if(quantity > 1){

        quantity--;

        quantityInput.value = quantity;

    }


});



// Manual Input Change

quantityInput.addEventListener("change",()=>{


    if(quantityInput.value < 1){

        quantityInput.value = 1;

    }


});
// ADD TO CART FROM PRODUCT DETAILS

const cartButton = document.querySelector(".cart-btn");


cartButton.addEventListener("click", () => {


    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    const product = {

        id: 1,
        name: "Fresh Tomato",
        price: 50,
        category: "Vegetables",
        image: "../images/vegetables/tomato.jpg",
        quantity: quantity

    };


    const existingProduct = cart.find(
        item => item.id === product.id
    );


    if(existingProduct){

        existingProduct.quantity += quantity;

    }
    else{

        cart.push(product);

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    alert("Product added to cart 🛒");


});