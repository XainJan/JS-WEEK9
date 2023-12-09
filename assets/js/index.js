getCartList()
let data = [];
axios.get('https://livejs-api.hexschool.io/api/livejs/v1/customer/xain/products')
.then(function(res){
    data = res.data.products
    randerData()
})
.catch(function(err){
    console.log(err)
})

//搜尋
const productSearch =document.querySelector('#productSearch')
productSearch.addEventListener('change' , function(){
randerData(productSearch.value)
})


const productData = document.querySelector('#productData')
//渲染
const randerData = function(furniture){
    //篩選
    const cacheData = data.filter(function(item){
        if (furniture === item.category){
            return item
        }
        if(!furniture){
            return item
        }
        
    })
    let str =``;
    cacheData.forEach(function(item){
        
        str += `<div class="col ">
        <div class="position-relative">
            <img class="prodecut-img" src="${item.images}" alt="">
            <button class="bg-black text-white w-100 fs-5 py-10 cart" data-id=${item.id} id="addCart">加入購物車</button>
            <p class="fs-5 py-2 px-4 bg-black text-white position-absolute new-product">新品</p>
            <h2 class="fs-5 my-2">${item.title}</h2>
            <p class="fs-5 text-decoration-line-through ">${item.origin_price}</p>
            <p class="fs-3">${item.price}</p>
        </div>
      </div>`
    })
    productData.innerHTML = str;
}

//加入購物車
function addCartItem(id){
    let totalquantity =1
    cartData.forEach(function(item){
        if(item.product.id === id){
            totalquantity = item.quantity + 1
        }
    })
    axios.post('https://livejs-api.hexschool.io/api/livejs/v1/customer/xain/carts' ,
    {
        data: {
          "productId": id,
          "quantity": totalquantity
        }
    })
    .then(function(res){
        getCartList()
    })
}
productData.addEventListener('click', function(item){
    const addCartList = item.target.getAttribute('id')
    if (addCartList !== 'addCart' ){
        return
    }
    const productId = item.target.getAttribute('data-id')
    addCartItem(productId)
    alert('已加入購物車')
})






let cartData = []
let totalPrice = 0;
function getCartList(){
    axios.get('https://livejs-api.hexschool.io/api/livejs/v1/customer/xain/carts')
    .then(function(res){
        cartData = res.data.carts
        totalPrice =res.data.finalTotal
        randerCart()
    })
    .catch(function(err){
        console.log(err)
    })
}


const cartList = document.querySelector('#cartLiset')
//渲染購物車
const randerCart = function(){
    let cartStr = ``;
    let carAllStr = ``;
    cartData.forEach(function(item){
        cartStr += 
        `<tr>
            <td>
                <div class="cart-item d-flex align-items-center">
                    <img class="me-2" src="${item.product.images}" alt="">
                    <p>${item.product.title}</p>
                </div>
            </td>
                <td>${item.product.price}</th>
                <td>${item.quantity}</th>
                <td>${item.product.price * item.quantity}</th>
                <td>
                <span  class="material-icons but" data-id=${item.id} id="deleteOne">
                    close
                </span>
            </td>
        </tr>`;
    } )
    carAllStr =  
    `<thead>
        <tr>
        <th>品項</th>
        <th>單價</th>
        <th>數量</th>
        <th>金額</th>
        </tr>
    </thead>
    <tbody >
       ${cartStr}
        <tr> 
        <td>
            <button type="button" class="btn btn-outline-secondary" id="deleteList">刪除所有品項</button>
        </td>
        <td></td>
        <td></td>
        <td>總金額</td>
        <td>${totalPrice}</td>
        </tr>
    </tbody>`
    cartList.innerHTML = carAllStr;
    
}

//清空購物車
function deleteCart(){
    axios.delete('https://livejs-api.hexschool.io/api/livejs/v1/customer/xain/carts')
    .then(function(res){
        getCartList()
    })
}
cartList.addEventListener('click' , function(item){
    const deleteAll = item.target.getAttribute('id')
    if ( deleteAll !== 'deleteList'){
        return
    }
    deleteCart()
})


//刪除特定產品
function deleteCartItem(cartId) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/xain/carts/${cartId}`).
      then(function (response) {
        getCartList()
        
      })
  }

  cartList.addEventListener('click' , function(item){
   
    const deleteOne = item.target.getAttribute('id')
    console.log(deleteOne)
    if ( deleteOne !== 'deleteOne'){
        return
    }
    const cartId = item.target.getAttribute('data-id')
    deleteCartItem(cartId)
    
})

const oderSubmit =document.querySelector('.oderSubmit')

oderSubmit.addEventListener('click' , function(item){
    item.preventDefault()
    const odererName =document.querySelector('#odererName').value
    const odererTel =document.querySelector('#odererTel').value
    const odererMail =document.querySelector('#odererMail').value
    const odererAddress =document.querySelector('#odererAddress').value
    const odererPay =document.querySelector('#odererPay').value
    if (cartData.length === 0 ){
        alert('購物車沒有產品!')
        return
    }
    if (odererName === '' || odererTel === '' || odererMail === '' || odererAddress === ''){
        alert('資料不可空白!')
        console.log(odererTel)
        return
    }
    let orderForm = {}
    orderForm.name = odererName
    orderForm.email = odererMail
    orderForm.tel =  odererTel
    orderForm.address = odererAddress
    orderForm.payment = odererPay
    createOrder(orderForm)
})
const orderForm = document.querySelector('.orderForm')
function createOrder(item) {
console.log(item)
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/xain/orders`,
      {
        "data": {
          "user": {
            "name":item.name,
            "tel": item.tel,
            "email": item.email,
            "address": item.address,
            "payment": item.payment
          }
        }
      }
    ).
      then(function (response) {
        orderForm.reset()
        alert('成功預定訂單')
        getCartList()
        
      })
      .catch(function(error){
        console.log(error);
        console.error('Error:', error);
      })
  }

