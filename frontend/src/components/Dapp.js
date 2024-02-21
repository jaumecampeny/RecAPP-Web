/**
 * @title Dapp
 * @author Jaume Campeny <jaume@campeny.net>
 * @notice Dapp is the major component which ensures the management of the frontend logistics in addition to the render of the multiple interfaces
 */

import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// Import for NFTStorage
import { NFTStorage} from 'nft.storage'

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import TokenArtifact from "../contracts/ProductManager.json";
import contractAddress from "../contracts/contract-address_productManager.json";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./Interfaces/NoWalletDetected";
import { ConnectWallet } from "./Interfaces/ConnectWallet";
import { Loading } from "./Interfaces/Loading";
import { ProduceProduct } from "./Interfaces/ProduceProduct";
import { GetProductInfo } from "./Interfaces/GetProductInfo";
import { TransferProducts } from "./Interfaces/TransferProducts";
import { BurnProduct } from "./Interfaces/BurnProduct";
import { RecycleProduct } from "./Interfaces/RecycleProduct";

// This is the default id used by the Hardhat Network
const HARDHAT_NETWORK_ID = '31337';

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

// NFT storage variables
const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDIzNTRFYUM1NEYxN0QxQWRkQmZBOEI4NDMxQjMzYUVjOTk0NTY4YzEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwODE5ODUzNzg4NCwibmFtZSI6IlRGTV9ORlRfU1RPUkFHRSJ9.nm2vy11fJfzF1Hx4n0bKnZUWhxIVgz8rQ5OWUJ10bWQ';
const client = new NFTStorage({token: NFT_STORAGE_TOKEN});

/**
 * This component is in charge of doing these thigs:
 *  1. It connects to the user's wallet.
 *  2. Initalizes etherss and the ProductManager contract.
 *  3. Produce new Products.
 *  4. Get product info from its address.
 *  5. Transfer products to the recipient.
 *  6. Burn products.
 *  7. Recycle products via its burn and further reproduction.
 *  8. Renders the whole application
 */
export class Dapp extends React.Component {
    constructor(props) {
      super(props);
  
      // We store multiple things in Dapp's state.
      // You don't need to follow this pattern, but it's an useful example.
      this.initialState = {
        // The user's address
        selectedAddress: undefined,
        // The ID about transactions being sent, and any possible error with them
        txBeingSent: undefined,
        transactionError: undefined,
        networkError: undefined,
      };

      this.state = this.initialState;

    }

    render() {
        // Ethereum wallets inject the window.ethereum object. If it hasn't been
        // injected, we instruct the user to install a wallet.
        if (window.ethereum === undefined) {
          return <NoWalletDetected />;
        }
    
        // The next thing we need to do, is to ask the user to connect their wallet.
        // When the wallet gets connected, we are going to save the users's address
        // in the component's state. So, if it hasn't been saved yet, we have
        // to show the ConnectWallet component.
        //
        // Note that we pass it a callback that is going to be called when the user
        // clicks a button. This callback just calls the _connectWallet method.
        if (!this.state.selectedAddress) {
          return (
            <ConnectWallet 
              connectWallet={() => this._connectWallet()} 
              networkError={this.state.networkError}
              dismiss={() => this._dismissNetworkError()}
            />
          );
        }

        // If the token data hasn't loaded yet, we show
        // a loading component.
        if (!this.state.selectedAddress) {
            return <Loading />;
        }
    
        // If everything is loaded, we render the application.
        return (
          <div className="container p-4">
            <div className="row">
              <div className="col-12">
                <h1>
                  RecDAPP
                </h1>
                <p>
                  Welcome <b>{this.state.selectedAddress}</b>.
                </p>
              </div>
            </div>
    
            <hr />
    
            <div className="row">
              <div className="col-12">
                {/*
                  This component displays a form that the user can use to produce
                  products.
                  The component doesn't have logic, it just calls the create
                  callback.
                */}
                {(
                  <ProduceProduct
                    produceProduct={(productType, productName, fileInput) => this._produceProduct(productType, productName, fileInput)}
                  />
                )}
              </div>
            </div>

            <hr />
    
            <div className="row">
              <div className="col-12">
                {/*
                  This component displays a form that the user can use to gather
                  information related to a specific product located on the chain.
                  The component doesn't have logic, it just calls the getProduct
                  callback.
                */}
                {(
                  <GetProductInfo
                    getProductInfo={(productAddress) => this._getProductInfo(productAddress)}
                  />
                )}
              </div>
            </div>

            <hr />
    
            <div className="row">
              <div className="col-12">
                {/*
                  This component displays a form that the user can use to transfer
                  products listed on productAddresses to recipientAddresses if the
                  owner is who performes the request.
                  The component doesn't have logic, it just calls the transfer
                  callback.
                */}
                {(
                  <TransferProducts
                    transferProducts={(productAddresses,recipientAddresses) => this._transferProducts(productAddresses,recipientAddresses)}
                  />
                )}
              </div>
            </div>

            <hr />
    
            <div className="row">
              <div className="col-12">
                {/*
                  This component displays a form that the user can use to burn
                  the product specified in productAddress if the owner is who
                  performs the request.
                  The component doesn't have logic, it just calls the burn
                  callback.
                */}
                {(
                  <BurnProduct
                    burnProduct={(productAddress,recycle) => this._burnProduct(productAddress,recycle)}
                  />
                )}
              </div>
            </div>

            <hr />
    
            <div className="row">
              <div className="col-12">
                {/*
                  This component displays a form that the user can use to recycle
                  the product specified in productAddress if the owner is who
                  performs the request.
                  The component doesn't have logic, it just calls the recycle
                  callback.
                */}
                {(
                  <RecycleProduct
                    recycleProduct={(productAddress) => this._recycleProduct(productAddress)}
                  />
                )}
              </div>
            </div>
          </div>
        );
    }

    async _connectWallet() {
        // This method is run when the user clicks the Connect. It connects the
        // dapp to the user's wallet, and initializes it.

        // To connect to the user's wallet, we have to run this method.
        // It returns a promise that will resolve to the user's address.
        const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Once we have the address, we can initialize the application.

        // First we check the network
        this._checkNetwork();

        this._initialize(selectedAddress);

        // We reinitialize it whenever the user changes their account.
        window.ethereum.on("accountsChanged", ([newAddress]) => {
            // `accountsChanged` event can be triggered with an undefined newAddress.
            // This happens when the user removes the Dapp from the "Connected
            // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
            // To avoid errors, we reset the dapp state 
            if (newAddress === undefined) {
            return this._resetState();
            }
            
            this._initialize(newAddress);
        });
    }

    _initialize(userAddress) {
        // This method initializes the dapp
    
        // We first store the user's address in the component's state
        this.setState({
          selectedAddress: userAddress,
        });
    
        // Then, we initialize ethers
        this._initializeEthers();
    }
    
    async _initializeEthers() {
        // We first initialize ethers by creating a provider using window.ethereum
        this._provider = new ethers.providers.Web3Provider(window.ethereum);

        // Then, we initialize the contract using that provider and the token's
        // artifact. You can do this same thing with your contracts.
        this._token = new ethers.Contract(
            contractAddress.ProductManager,
            TokenArtifact.abi,
            this._provider.getSigner(0)
        );
    }
    
    // This method just clears part of the state.
    _dismissNetworkError() {
        this.setState({ networkError: undefined });
    }

    // This method resets the state
    _resetState() {
        this.setState(this.initialState);
    }

    async _switchChain() {
        const chainIdHex = `0x${HARDHAT_NETWORK_ID.toString(16)}`
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }],
        });
        await this._initialize(this.state.selectedAddress);
    }
    
    // This method checks if the selected network is Localhost:8545
    _checkNetwork() {
        if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID) {
          this._switchChain();
        }
    }

    /**
     * FUNCTIONS RELATED TO SMART CONTRACT
     */

    /**
     * Clean address deleting left zeros.
     * @param {*} address Address to be cleaned.
     * @returns Address cleaned
     */
    cleanAddress(address){
        address = address.replace(/^0x/, '');
        address = address.replace(/^0+/, '');
        return '0x' + address;
    }

    /**
     * Creates a product. Add the product .cap file to the NFT.Storage database, and add product info to the chain.
     * @param {*} productType Type of the product produced
     * @param {*} name Name as the identifier of the product produced
     * @param {*} fileInput CAP file with metadata of the product produced.
     * @returns Addresses of the product produced and identified in the chain, and the owner of the product.
     */
    async _produceProduct(productType, name, fileInput) {
        try{
            const cid = await client.storeCar(fileInput);
            const createRequest = await this._token.create(productType, 'ipfs://'+ cid, name);
            const receipt = await createRequest.wait();
            const productAddress = this.cleanAddress(receipt.logs[0].topics[2]);
            const ownerAddress = this.cleanAddress(receipt.logs[0].topics[1]);
            if (receipt.status === 0){
                throw new Error("Produce product failed");
            }
    
            return [productAddress,ownerAddress];
        } catch(error){
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }else{
                console.error("Produce product error:", error);
            }
        }      
    }

    /**
     * Get Product information given the product address.
     * @param {*} productAddress Address of the product to gather documentation.
     * @returns Address and the owner, product name-type-state, product times recycled, and product CID and IPFS URL.
     */
    async _getProductInfo(productAddress){
        try{
            const createRequest = await this._token.getProduct(productAddress);
            console.log(createRequest);
            const ownerAddress = this.cleanAddress(createRequest[0]);
            let productType = "";
            switch(createRequest[1]){
                case 0:
                    productType = "plastic";
                    break;
                case 1:
                    productType = "can";
                    break;
                case 2:
                    productType = "glass";
                    break;
                case 3:
                    productType = "cardboard";
                    break;
            }
            const getProductTimesRecycled = createRequest[2];
            const cid = createRequest[3].replace(/^ipfs:\/\//, '');
            const productName = createRequest[4];
            let productState = "";
            switch(createRequest[5]){
                case 0:
                    productState = "usable";
                    break;
                case 1:
                    productState = "pendingRecycle";
                    break;
            }
            const productIPFS_URL = "https://" + cid + ".ipfs.nftstorage.link/" + productName + ".jpg";
            return [ownerAddress, productName, productType, productState, getProductTimesRecycled, cid, productIPFS_URL];
        }catch(error){
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }else{
                console.error("Get product information error:", error);
            }
        }
    }

    async _transferProducts(productAddresses, recipientAddresses){
        try{
            const productArrayAddresses = JSON.parse(productAddresses.replace(/'/g, '"'));
            const createRequest = await this._token.transfer(productArrayAddresses,recipientAddresses);
            const receipt = await createRequest.wait();
            console.log(receipt);
        }catch(error){
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }else{
                console.error("Transfer products error:", error);
            }
        }
    }

    async _burnProduct(productAddress, recycle){
        try{
            let createRequest;
            if(recycle){
                createRequest = await this._token.recycleBurn(productAddress);
            }else{
                createRequest = await this._token.burn(productAddress);
            }
            const receipt = await createRequest.wait();
            console.log(receipt);
        }catch(error){
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }else{
                console.error("Burning product error:", error);
            }
        }
    }

    async _recycleProduct(productAddress){
        try{
            const createRequest = await this._token.recycleProduce(productAddress);
            const receipt = await createRequest.wait();
            console.log(receipt);
        }catch(error){
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }else{
                console.error("Recycling product error:", error);
            }
        }
    }
}