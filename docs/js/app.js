App = {  
  contracts: {},
  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    //var Web3 = require('web3')  ;  
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {

      //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        App.acc=await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = App.acc[0];  
    
  },
  loadContract: async () => {
      const Products = await $.getJSON('Products.json')
   App.contracts.Products = TruffleContract(Products)
    App.contracts.Products.setProvider(App.web3Provider)    
    App.product = await App.contracts.Products.deployed()
   
  },
  render: async () => {
    $("#addProductPage").hide();
    $("#displayProductPage").show();
    $("#buyProductPage").hide();
    var count =  parseInt(await App.product.count());
    console.log(count);
    for(var i=1; i<=count; i++){
     var p_list=await App.product.P_list(i);
     console.log(p_list)
     var str="<tr><td>"+i+"</td><td>"+p_list[1]+"</td><td>"+p_list[0]+"</td><td>"+p_list[3]+"</td><td>"+p_list[2]+"</td><tr>";
     $("#addproducts").append(str);
    }

  },
  displayAddProductPage: async () =>{
    $("#addProductPage").show();
    $("#displayProductPage").hide();
    $("#buyProductPage").hide();
  },
  AddNewProduct: async () =>{
    //window.alert("hi");
    var n = $("#n").val();
    window.alert(n)
    var q = $("#q").val();
    var p = $("#p").val();
    await App.product.AddProduct(n, q, p,{from:App.account});
  },
  displayBuyProductPage :async () =>{
    $("#addProductPage").hide();
    $("#displayProductPage").hide();
    $("#buyProductPage").show();
  },
  BuyProduct : async () =>{
    var id =( $("#pid").val());
    window.alert(parseInt(id))
    var qty = ($("#p_q").val());
    var count =  parseInt(await App.product.count());
    //if(id>=1 && id<=count){}
    await App.product.BuyProduct(parseInt(id), parseInt(qty), {from:App.account});

  }
}
$(function () {
  $(window).load(function () { 
       App.load();
  })
});










