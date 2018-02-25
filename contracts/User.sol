pragma solidity ^0.4.17;

contract User {


    mapping (uint256 => address) animalIndexToOwner;


    mapping (address => uint256) ownershipTokenCount;


    mapping (address => uint256) ownershipWater;


    mapping (address => uint256) ownershipFood;


    mapping (address => uint256[]) ownerAnimal;


    mapping (address => uint256[]) wantAnimal;



    address[] users;






    struct Animal {


        uint animalType;

        //表示宠物状态，0-正常，1-出售，2-交配
        uint animalSataus;


        uint64 birthTime;


        uint64 cooldownEndBlock;


        uint256 matronId;
        uint256 sireId;


        uint32 siringWithId;

        address owner;



    }


    Animal[] animals;


    uint32[14] public cooldowns = [
    uint32(1 minutes),
    uint32(2 minutes),
    uint32(5 minutes),
    uint32(10 minutes),
    uint32(30 minutes),
    uint32(1 hours),
    uint32(2 hours),
    uint32(4 hours),
    uint32(8 hours),
    uint32(16 hours),
    uint32(1 days),
    uint32(2 days),
    uint32(4 days),
    uint32(7 days)
    ];




    function addUser() public  returns (uint){



        uint newUserId = users.push(msg.sender) - 1;



        return newUserId;

    }




    function checkIfUser() public view returns (bool){

        uint256 tmpId;

        for (tmpId = 0; tmpId < users.length; tmpId++) {
            if(users[tmpId]==msg.sender)
                return true;
        }

        return false;

    }





    function addFood() public returns (uint256){



        ownershipFood[msg.sender] = ownershipFood[msg.sender] + 2;

        return ownershipFood[msg.sender];



    }

    function getFood() public  returns (uint256){



        uint256 foodCount = ownershipFood[msg.sender];

        return foodCount;



    }



    function addWater() public  returns (uint256){



        ownershipWater[msg.sender] = ownershipWater[msg.sender] + 4 ;

        return ownershipWater[msg.sender];



    }


    function getWater() public  returns (uint256){


        uint256 waterCount = ownershipWater[msg.sender];

        return waterCount;


    }





    function createAnimal( uint256 _matronId, uint256 _sireId,uint _type) returns (uint) {

        Animal memory _animal = Animal({
            animalType:_type,
            animalSataus:0,
            birthTime: uint64(now),
            cooldownEndBlock: 0,
            matronId: _matronId,
            sireId: _sireId,
            siringWithId: 0,
            owner:msg.sender
            });

        uint256 newAnimalId = animals.push(_animal) - 1;

        ownerAnimal[msg.sender].push(newAnimalId);

        return newAnimalId;

    }








    function getAnimals() returns (uint256[]) {

         return  ownerAnimal[msg.sender];
    }






    function getAnimal(uint256 annimalId) public  view returns (uint,uint64,uint64,uint256,uint256,address,uint){
        return (
        animals[annimalId].animalType,
        animals[annimalId].birthTime,
        animals[annimalId].cooldownEndBlock,
        animals[annimalId].matronId,
        animals[annimalId].sireId,
        animals[annimalId].owner,
        animals[annimalId].animalSataus
        );

    }


    function setAnimalStatus(uint256 annimalId,uint status) returns (uint){

        animals[annimalId].animalSataus = status;

        return animals[annimalId].animalSataus;
    }



    function eatFood(uint256 annimalId,uint animalType) returns (uint){

        ownershipFood[msg.sender] = ownershipFood[msg.sender] - animalType;

        return ownershipFood[msg.sender];
    }


    function eatWater(uint256 annimalId,uint animalType) returns (uint){

        ownershipWater[msg.sender] = ownershipWater[msg.sender] - animalType ;

        return ownershipWater[msg.sender];
    }



    function getAllAnimalCount() returns (uint){

        return  animals.length ;

    }


//
//    function buyAnimalByAnimal(uint256 annimalId) returns (uint256){
//
//        address owner = animals[annimalId].owner;
//
//        for (uint i = 0;i < ownerAnimal[owner].length ;i++){
//            if(ownerAnimal[owner][i]==annimalId){
//                ownerAnimal[owner][i] = 0;
//            }
//        }
//
//        animals[annimalId].owner = msg.sender;
//
//        ownerAnimal[msg.sender].push(annimalId);
//
//        animals[annimalId].animalSataus = 0;
//
//        return  annimalId ;
//
//    }
//
//
    function wantAnimalById(uint256 annimalId) returns (uint){

        wantAnimal[msg.sender].push(annimalId);

        return  annimalId  ;

    }



    function getWantAnimalById() returns (uint256[]){

        return   wantAnimal[msg.sender];

    }


}


contract ERC721 {
    // Required methods
    function totalSupply() public view returns (uint256 total);
    function balanceOf(address _owner) public view returns (uint256 balance);
    function ownerOf(uint256 _tokenId) external view returns (address owner);
    function approve(address _to, uint256 _tokenId) external;
    function transfer(address _to, uint256 _tokenId) external;
    function transferFrom(address _from, address _to, uint256 _tokenId) external;

    // Events
    event Transfer(address from, address to, uint256 tokenId);
    event Approval(address owner, address approved, uint256 tokenId);

    // Optional
    // function name() public view returns (string name);
    // function symbol() public view returns (string symbol);
    // function tokensOfOwner(address _owner) external view returns (uint256[] tokenIds);
    // function tokenMetadata(uint256 _tokenId, string _preferredTransport) public view returns (string infoUrl);

    // ERC-165 Compatibility (https://github.com/ethereum/EIPs/issues/165)
    function supportsInterface(bytes4 _interfaceID) external view returns (bool);
}