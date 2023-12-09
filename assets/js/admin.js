
let orderListData=[];
getOrderList()
function getOrderList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/xain/orders`,
      {
        headers: {
          'Authorization':'kMnwe3ZknjcAcPUxb23MTTkfEwj2'
        }
      })
      .then(function (response) {
        orderListData = response.data.orders
        
        randerOderList()
      })
      .catch(function(err){
        console.log(err)
    })
  }
  
  function deleteOrderItem(orderId) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/xain/orders/${orderId}`,
      {
        headers: {
          'Authorization':'kMnwe3ZknjcAcPUxb23MTTkfEwj2'
        }
      })
      .then(function (response) {
        alert('已刪除訂單')
        getOrderList()
      })
  }

  const deleteAllOderList = document.querySelector('#deleteAllOderList')
  deleteAllOderList.addEventListener('click' , function(){
    if(orderListData.length === 0){
        alert('已無訂單')
    }
    deleteAllOrder()
  })
  function deleteAllOrder() {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/xain/orders`,
      {
        headers: {
          'Authorization': 'kMnwe3ZknjcAcPUxb23MTTkfEwj2'
        }
      })
      .then(function (response) {
        alert('已刪除所有訂單')
        getOrderList()
      })
  }

const order = document.querySelector('#order')
order.addEventListener('click' , function(e){

    const deleteList = e.target.getAttribute('id')
    if (deleteList !== 'deleteList'){
        return
    }
    let orderId = e.target.getAttribute('data-id')
    deleteOrderItem(orderId)

})
const randerOderList = function(){
    let str =``;
    let totalProduct = []
    let newListProductsData={}
    let totalPoductsTitle=[]
    let newlistPoductsTitle={}
    orderListData.forEach(function(item){
        let orderListProductsData=[]
        orderListProductsData =item.products
        let orderListProductsTitle=``;
        let timeStamp = new Date(item.createdAt * 1000)
        let paid = ''
        if(item.paid === true){
            paid = '已處理'
        }else{
            paid = '未處理'
        }
        const orderTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth()}/${timeStamp.getDate()}`
        orderListProductsData.forEach(function(item){
            orderListProductsTitle += `${item.title} * ${item.quantity}</br> `
            if( newListProductsData[item.category] === undefined){
                newListProductsData[item.category] = item.quantity
            }else{
                newListProductsData[item.category] += item.quantity
            }

            if( newlistPoductsTitle[item.title] === undefined){
                newlistPoductsTitle[item.title] = item.quantity
            }else{
                newlistPoductsTitle[item.title] += item.quantity
            }
            console.log(item)
        })
        console.log( newlistPoductsTitle)
        
        str += `
        <tr>
            <td>
                ${item.createdAt}  
            </td>
            <td>
                ${item.user.name}</br>${item.user.tel}
            </td>
            <td>
                ${item.user.address}
            </td>
            <td>
                ${item.user.email}
            </td>
            <td>
                ${orderListProductsTitle}
            </td>
            <td>
                ${orderTime}
            </td>
            <td>
                <a class="text-decoration-underline text-blue" href="#">${paid}</a>
            </td>
            <td>
                <input class="text-white bg-warning border-0" type="button" id=deleteList data-id=${item.id} value="刪除">
            </td>
        </tr>`
    })
    
   
   
    order.innerHTML = str;

    let newTitleAry = Object.keys(newlistPoductsTitle)
    newTitleAry.forEach(function(item){
        let ary =[]
        ary.push(item)
        ary.push(newlistPoductsTitle[item])
        totalPoductsTitle.push(ary)
    })
    totalPoductsTitle.sort(function(a,b){
        return b[1] - a[1]
    })
    console.log(totalPoductsTitle)
    let newtotalPoductsTitle=[]
    let others = 0;
    for(i=0; i < totalPoductsTitle.length; i++){
        let titleAry=[]
        if( i < 3){
            newtotalPoductsTitle.push(totalPoductsTitle[i])
            console.log(totalPoductsTitle[i])
        }else if(i >= 3){
            others += totalPoductsTitle[i][1] 
        }   
        if( i == (totalPoductsTitle.length-1) ){
            titleAry.push('其他')
            titleAry.push(others)
            newtotalPoductsTitle.push(titleAry)
            console.log(titleAry)
        }
    }
    const chart1 = c3.generate({
        bindto: '#chart1',
        data: {
            // iris data from R
            columns: newtotalPoductsTitle,
            type : 'pie',
            onclick: function (d, i) { console.log("onclick", d, i); },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        }
    });
    console.log(newtotalPoductsTitle)
    console.log(others)
    let newAry = Object.keys(newListProductsData)
    newAry.forEach(function(item){
        let ary = []
        ary.push(item)
        ary.push(newListProductsData[item])
        totalProduct.push(ary)
    })
    
    console.log(totalProduct)
    const chart = c3.generate({
        bindto: '#chart',
        data: {
            // iris data from R
            columns: totalProduct,
            type : 'pie',
            onclick: function (d, i) { console.log("onclick", d, i); },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        }
    });
}




