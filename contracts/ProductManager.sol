//SPDX-License-Identifier: MIT
/**
 * @title ProductManager
 * @author Jaume Campeny <jaume@campeny.net>
 * @notice ProductManager is a contract with capabilities to create other contracts of type Product. The products are the goods considered on the blockchain.
 */
pragma solidity >=0.8.0 <0.9.0;

enum ProductType {
	plastic,        //Envase de plastico (0)
	can,            //Envase de aluminio/acero (1)
	glass,          //Envase de vidrio (2)
	cardboard       //Envase de carton (3)
}

enum State {
    usable,         //Envase usable (0)
    pendingRecycle  //Envase en periodo de reciclado (1)
}

contract Product {
    address private owner;
    address private immutable productManagerAddr;
    address private immutable productAddr;
    uint16 private timesRecycled;
    ProductType private immutable productType;
    State private state;
    string private ipfs_url;
    string private name;

    /**
     * Constructor of the Product contract.
     * @param _owner Address of the owner of the product to be created.
     * @param _productType Type of the product to be created.
     * @param _ipfs_url String with the IPFS URL of the product.
     * @param _name String with the name of the product
     */
    constructor(address _owner, ProductType _productType, string memory _ipfs_url, string memory _name) {
        owner = _owner;
        productManagerAddr = msg.sender;
        productAddr = address(this);
        timesRecycled = 0;
        productType = _productType;
        state = State.usable;
        ipfs_url = _ipfs_url;
        name = _name;

    }

    /**
     * Getter of owner address.
     */
    function getOwner() public view returns (address){
        return (owner);
    }

    /**
     * Getter of product address.
     */
    function getProductAddress() public view returns (address){
        return (productAddr);
    }

    /**
     * Getter of product times recycled.
     */
    function getTimesRecycled() public view returns (uint16){
        return (timesRecycled);
    }

    /**
     * Getter of product type.
     */
    function getProductType() public view returns (ProductType){
        return (productType);
    }

    /**
     * Getter of product IPFS URL.
     */
    function getIPFS_URL() public view returns (string memory){
        return (ipfs_url);
    }

    /**
     * Getter of product name.
     */
    function getName() public view returns (string memory){
        return (name);
    }

    /**
     * Getter of product state.
     */
    function getState() public view returns (State){
        return (state);
    }

    /**
     * Function that permits change the onwer of a product if the request is called by ProductManager.
     * @param recipient Address of the new owner of the product.
     */
    function setOwner(address recipient) public {
        require(msg.sender == productManagerAddr,"Only productManager contract can call this function.");
        owner = recipient;
    }
    
    /**
     * Function that permits change the state of a product if the request is called by ProductManager.
     * @param _state New state of the product.
     */
    function changeState(State _state) public {
        require(msg.sender == productManagerAddr,"Only productManager contract can call this function.");
        state = _state;
    }

    /**
     * Function that permits increment the times a product has been recycled, if the request is called by ProductManager.
     */
    function incrementRecycledTimes() public {
        require(msg.sender == productManagerAddr,"Only productManager contract can call this function.");
        timesRecycled++;
    }
}

contract ProductManager {
    mapping(address => Product) private products;

    /**
     * Event generated on the product creation.
     * @param owner Address of the owner of the new product produced.
     * @param productAddr Address of the new product produced.
     * @param productType Type of the new product produced.
     */
    event createProductLog(address indexed owner, address indexed productAddr, ProductType productType);

    /**
     * Produce a new product.
     * @param _productType Type of the new product to be produced.
     * @param _ipfs_url String with the new product IPFS URL.
     * @param _name String with the new product name
     * @return productAddr Address of the new product produced.
     */
    function create(ProductType _productType, string memory _ipfs_url, string memory _name) public returns (address productAddr){
        Product product = new Product(msg.sender, _productType, _ipfs_url, _name);
        products[product.getProductAddress()] = product;
        emit createProductLog(product.getOwner(), product.getProductAddress(), product.getProductType());
        return (product.getProductAddress());
    }

    /**
     * Getter for a specific product.
     * @param _productAddr Address of the product to gather information.
     * @return owner Owner of the product consulted.
     * @return productType Type of the product consulted.
     * @return timesRecycled Recycled times of the product consulted.
     * @return ipfs_url String of product IPFS URL.
     * @return name String of product name.
     * @return state State of the product.
     */
    function getProduct(
        address _productAddr
    )
        public
        view
        returns (address owner, ProductType productType, uint16 timesRecycled, string memory ipfs_url, string memory name, State state)
    {
        Product product = products[_productAddr];

        return (product.getOwner(), product.getProductType(), product.getTimesRecycled(), product.getIPFS_URL(), product.getName(), product.getState());
    }

    /**
     * Transfer productAddr products to the recipient. Restrict transfer to addr(0) and only permits the owner of the products to transfer them.
     * @param productAddrs Array of productAddr products to be transfered to recipient
     * @param recipient Recipient who will receives all productAddrs products.
     */
    function transfer(address[] memory productAddrs, address recipient) public{
        Product product;
        require(recipient != address(0),"Transfer to 0 address is prohibited. Use burn instead.");
        for(uint index = 0; index < productAddrs.length; index++){
            product = products[productAddrs[index]];
            require(msg.sender == product.getOwner(),"Only the owner of a token can transfer it.");
            product.setOwner(recipient);
        }
    }

    /**
     * Burn a specific product.
     * @param productAddr Address of the product to be burnt.
     */
    function burn(address productAddr) public {
        Product product = products[productAddr];
        require(msg.sender == product.getOwner(),"Only the owner of a token can burn it.");
        delete products[productAddr];
    }

    /**
     * Burn a specific product for recycle, without deleting it.
     * @param productAddr Address of the product to recycle.
     */
    function recycleBurn(address productAddr) public {
        Product product = products[productAddr];
        require(msg.sender == product.getOwner(),"Only the owner of a token can change its state");
        product.changeState(State.pendingRecycle);
    }

    /**
     * Recycle a previous burned product, making it usable another time and incrementing its recycled times.
     * @param productAddr Address of the product to recycle.
     */
    function recycleProduce(address productAddr) public {
        Product product = products[productAddr];
        require(msg.sender == product.getOwner(),"Only the owner of a token can change its state");
        product.changeState(State.usable);
        product.incrementRecycledTimes();
    }

    /**
     * Used to clean metamask logs on hardhat chain.
     */
    receive() external payable {}
    fallback() external payable {}
}