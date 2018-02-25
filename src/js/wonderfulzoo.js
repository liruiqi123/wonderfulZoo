App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
    } else {
        // If no injected web3 instance is detected, fall back to Ganache
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var AdoptionArtifact = data;
        App.contracts.Adoption = TruffleContract(AdoptionArtifact);

        // Set the provider for our contract
        App.contracts.Adoption.setProvider(App.web3Provider);
    });


      $.getJSON('User.json', function(data) {
          // Get the necessary contract artifact file and instantiate it with truffle-contract
          var User = data;
          App.contracts.User = TruffleContract(User);

          // Set the provider for our contract
          App.contracts.User.setProvider(App.web3Provider);
      });
  }

};

$(function() {
  $(window).load(function() {
    checkIfUser();
    getAnimal();
    getAnimalById();
    getFood();
    getWater();

  });
});




function checkIfUser(){

    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            alert(error);
            console.log(error);
        }
        var account = accounts[0];

        var adoptionInstance;

        App.contracts.User.deployed().then(function(instance) {
            adoptionInstance = instance;
            return adoptionInstance.checkIfUser.call({from: account});
        }).then(function(result) {
            if(result){
                return;
            }else{
                alert("请您先注册用户");
                adoptionInstance.addUser.sendTransaction({from: account});
            }

        }).catch(function(err) {
            alert(err);
            console.log(err.message);
        });
    });

}



function addAnimal(){
    App.init();
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            alert(error);
            console.log(error);
        }
        var account = accounts[0];

        var adoptionInstance;

        var now = new Date();

        var sec = now.getSeconds();

        alert(sec);

        alert((sec%16)+1);

        var type = (sec%16)+1;




        App.contracts.User.deployed().then(function(instance) {
            adoptionInstance = instance;
            return adoptionInstance.createAnimal(0,1,type);
        }).then(function(result) {
        }).catch(function(err) {
            alert(err);
            console.log(err.message);
        });
    });

}


function getAnimal(){
    var divA = document.getElementById("animalId");
    divA = " ";
    App.init();
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            alert(error);
            console.log(error);
        }
        var account = accounts[0];

        var adoptionInstance;

        App.contracts.User.deployed().then(function(instance) {
            adoptionInstance = instance;
            return adoptionInstance.getAnimals.call();
        }).then(function(_animals) {
            for (var i = 0; i < _animals.length; i++) {
                var divA = document.getElementById("animalId");
                document.getElementById("animalId").innerHTML=divA.innerHTML+'<tr><td><span name = "myselfId" class="badge badge-warning">'+_animals[i]+'</span></td></tr>';
            }
        }).catch(function(err) {
            alert(err);
            console.log(err.message);
        });
    });
}






function getFood(){
    App.init();
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            alert(error);
            console.log(error);
        }
        var account = accounts[0];

        var adoptionInstance;

        App.contracts.User.deployed().then(function(instance) {
            adoptionInstance = instance;
            return adoptionInstance.getFood.call();
        }).then(function(foodCount) {
            document.getElementById("food").innerHTML='<tr><td><span class="badge badge-warning">'+foodCount+'</span></td></tr>';
        }).catch(function(err) {
            alert(err);
            console.log(err.message);
        });
    });
}




function getWater(){
    App.init();
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            alert(error);
            console.log(error);
        }
        var account = accounts[0];

        var adoptionInstance;

        App.contracts.User.deployed().then(function(instance) {
            adoptionInstance = instance;
            return adoptionInstance.getWater.call();
        }).then(function(waterCount) {
            document.getElementById("water").innerHTML='<tr><td><span class="badge badge-primary">'+waterCount+'</span></td></tr>';
        }).catch(function(err) {
            alert(err);
            console.log(err.message);
        });
    });
}






function addFood(){
    App.init();
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            alert(error);
            console.log(error);
        }
        var account = accounts[0];

        var adoptionInstance;

        App.contracts.User.deployed().then(function(instance) {
            adoptionInstance = instance;
            return adoptionInstance.addFood();
        }).then(function(waterCount) {
            getFood();
        }).catch(function(err) {
            alert(err);
            console.log(err.message);
        });
    });
}




function addWater(){
    App.init();
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            alert(error);
            console.log(error);
        }
        var account = accounts[0];

        var adoptionInstance;

        App.contracts.User.deployed().then(function(instance) {
            adoptionInstance = instance;
            return adoptionInstance.addWater();
        }).then(function(waterCount) {
            getWater();
        }).catch(function(err) {
            alert(err);
            console.log(err.message);
        });
    });
}




function resource(){
    getFood();
    getWater();
}






function getAnimalById(){
    App.init();
    var animalById = document.getElementsByName("myselfId");
    document.getElementById('old').innerHTML = "";
    for(var i=0;i<animalById.length;i++){
        var id = animalById[i].innerText; //这个值就是你要的
        printAnimalById(id);
    }
}






function printAnimalById(animalId){
    App.init();
    var tmpId = parseInt(animalId)+1;
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            alert(error);
            console.log(error);
        }
        var account = accounts[0];

        var adoptionInstance;

        App.contracts.User.deployed().then(function(instance) {
            adoptionInstance = instance;
            return adoptionInstance.getAnimal.call(animalId);
        }).then(function(result) {

            var animal=result.toString().split(",");

            var animalType = animal[0];
            var birthTime = animal[1];
            var cooldownEndBlock = animal[2];
            var matronId = animal[3];
            var sireId = animal[4];
            var owner = animal[5];
            var animalSataus = animal[6];

            if((animalSataus=="1")||(animalSataus=="2")){

            }else {
                divA = document.getElementById("old");
                divA.innerHTML = divA.innerHTML + '<div class="col-md-4 gallery-grid">'
                    + '<div class="grid">'
                    + '<figure class="effect-apollo">'
                    + '<a class="example-image-link">'
                    + '<img src="images/g' + animalType + '.jpg" alt="" />'
                    + '<figcaption>'
                    + ' <p>Proin vitae luctus dui, sit amet ultricies leo</p>'
                    + '</figcaption>'
                    + '</a>'
                    + '</figure>'
                    + '<h2>'
                    + ' <a onclick="eatFood(' + animalId + ',' + animalType + ')" ><span class="label label-info">喂食</span></a> '
                    + ' <a onclick="eatWater(' + animalId + ',' + animalType + ')" ><span class="label label-primary">喂水</span></a> '
                    + ' <a onclick="setAnimalStatus(' + animalId + ',1)"  ><span id=sale class="label label-danger">出售</span></a> '
                    + ' <a onclick="setAnimalStatus(' + animalId + ',2)"  ><span id=breed class="label label-warning">交配</span></a> '
                    + '</h2>'
                    + '</div>'
                    + '</div>';
            }

        }).catch(function(err) {
            alert(err);
            console.log(err.message);
        });
    });
}


function printMarketlById(animalId){
    App.init();
    var tmpId = parseInt(animalId)+1;
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            alert(error);
            console.log(error);
        }
        var account = accounts[0];

        var adoptionInstance;

        App.contracts.User.deployed().then(function(instance) {
            adoptionInstance = instance;
            return adoptionInstance.getAnimal.call(animalId);
        }).then(function(result) {

            var animal=result.toString().split(",");

            var animalType = animal[0];
            var birthTime = animal[1];
            var cooldownEndBlock = animal[2];
            var matronId = animal[3];
            var sireId = animal[4];
            var owner = animal[5];
            var animalSataus = animal[6];

            if(animalSataus=="1"){
                divA = document.getElementById("market");
                divA.innerHTML = divA.innerHTML + '<div class="col-md-4 gallery-grid">'
                    + '<div class="grid">'
                    + '<figure class="effect-apollo">'
                    + '<a class="example-image-link">'
                    + '<img src="images/g' + animalType + '.jpg" alt="" />'
                    + '<figcaption>'
                    + ' <p>Proin vitae luctus dui, sit amet ultricies leo</p>'
                    + '</figcaption>'
                    + '</a>'
                    + '</figure>'
                    + '<h2>'
                    + ' <a onclick="eatFood(' + animalId + ',' + animalType + ')" ><span class="label label-info">喂食</span></a> '
                    + ' <a onclick="eatWater(' + animalId + ',' + animalType + ')" ><span class="label label-primary">喂水</span></a> '
                    + ' <a onclick="setAnimalStatus(' + animalId + ',2)" ><span id=breed class="label label-warning">交配</span></a> '
                    + '</h2>'
                    + '</div>'
                    + '</div>';
            }
        }).catch(function(err) {
            alert(err);
            console.log(err.message);
        });
    });
}





function printLoveById(animalId){
    App.init();
    var tmpId = parseInt(animalId)+1;
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            alert(error);
            console.log(error);
        }
        var account = accounts[0];

        var adoptionInstance;

        App.contracts.User.deployed().then(function(instance) {
            adoptionInstance = instance;
            return adoptionInstance.getAnimal.call(animalId);
        }).then(function(result) {

            var animal=result.toString().split(",");

            var animalType = animal[0];
            var birthTime = animal[1];
            var cooldownEndBlock = animal[2];
            var matronId = animal[3];
            var sireId = animal[4];
            var owner = animal[5];
            var animalSataus = animal[6];


            if(animalSataus=="2"){
                divA = document.getElementById("love");
                divA.innerHTML = divA.innerHTML + '<div class="col-md-4 gallery-grid">'
                    + '<div class="grid">'
                    + '<figure class="effect-apollo">'
                    + '<a class="example-image-link">'
                    + '<img src="images/g' + animalType + '.jpg" alt="" />'
                    + '<figcaption>'
                    + ' <p>Proin vitae luctus dui, sit amet ultricies leo</p>'
                    + '</figcaption>'
                    + '</a>'
                    + '</figure>'
                    + '<h2>'
                    + ' <a onclick="eatFood(' + animalId + ',' + animalType + ')" ><span class="label label-info">喂食</span></a> '
                    + ' <a onclick="eatWater(' + animalId + ',' + animalType + ')" ><span class="label label-primary">喂水</span></a> '
                    + ' <a onclick="setAnimalStatus(' + animalId + ',1)" ><span id=breed class="label label-warning">出售</span></a> '
                    + '</h2>'
                    + '</div>'
                    + '</div>';

            }

        }).catch(function(err) {
            alert(err);
            console.log(err.message);
        });
    });
}











function eatFood(animalId,animalType){
    App.init();
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            alert(error);
            console.log(error);
        }
        var account = accounts[0];

        var adoptionInstance;

        App.contracts.User.deployed().then(function(instance) {
            adoptionInstance = instance;
            return adoptionInstance.eatFood(animalId,animalType);
        }).then(function(result) {
        }).catch(function(err) {
            alert(err);
            console.log(err.message);
        });
    });
}



function eatWater(animalId,animalType){
    App.init();
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            alert(error);
            console.log(error);
        }
        var account = accounts[0];

        var adoptionInstance;

        App.contracts.User.deployed().then(function(instance) {
            adoptionInstance = instance;
            return adoptionInstance.eatWater(animalId,animalType);
        }).then(function(result) {
        }).catch(function(err) {
            alert(err);
            console.log(err.message);
        });
    });
}



function setAnimalStatus(animalId,animalSattus){
    App.init();
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            alert(error);
            console.log(error);
        }
        var account = accounts[0];

        var adoptionInstance;

        App.contracts.User.deployed().then(function(instance) {
            adoptionInstance = instance;
            return adoptionInstance.setAnimalStatus(animalId,animalSattus);
        }).then(function(result) {
        }).catch(function(err) {
            alert(err);
            console.log(err.message);
        });
    });
}



function toSeeLoveAnimal(animalId){
    App.init();
    var animalById = document.getElementsByName("myselfId");
    document.getElementById('love').innerHTML = "";
    for(var i=0;i<animalById.length;i++){
        var id = animalById[i].innerText; //这个值就是你要的
        printLoveById(id);
    }

}



