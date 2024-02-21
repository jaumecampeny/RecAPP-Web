/**
 * @title ProduceProduct
 * @author Jaume Campeny <jaume@campeny.net>
 * @notice ProduceProduct is the interface which describes the view for producing products and the communications with Dapp.
 */

import React, { useState } from "react";

export function ProduceProduct({produceProduct}){
    //State for the storage of product address and owner address
    const [productAddress, setProductAddress] = useState("");
    const [ownerAddress, setOwnerAddress] = useState("");

    return (
        <div style={{border: 'thin solid'}}>
            <h4 style={{'margin':'10px'}}>Produce Product</h4>
            <form
                onSubmit={(event) => {
                    /**
                     * This function just calls the produceProduct callback with the
                     * form's data.
                     */
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const productType = formData.get("productType");
                    const productName = formData.get("product-name");
                    const fileInput = formData.get("file-input");
                                        
                    produceProduct(productType, productName, fileInput)
                        .then(([productAddress, ownerAddress]) => {
                            setOwnerAddress(ownerAddress);
                            setProductAddress(productAddress);
                        })
                        .catch(error => {
                            console.error("Error producing product:", error);
                        })
                }}
            >
                <div style={{'margin':'10px'}}>
                    <label>Choose a product type:</label>
                    <select style={{'marginLeft': '10px'}} name="productType" required>
                        <option value="0">Plastic bottle</option>
                        <option value="1">Can</option>
                        <option value="2">Glass bottle</option>
                        <option value="3">Cardboard</option>
                    </select>
                </div>
                <div style={{'margin':'10px'}}>
                    <label>Specify product name:</label>
                    <input style={{'marginLeft': '10px'}} type="text" name="product-name"/>
                </div>
                <div style={{'margin':'10px'}}>
                    <label>Select an image:</label>
                    <input style={{'marginLeft': '10px'}} type="file" name="file-input" accept=".car"/>
                </div>
                <button className="btn btn-warning" 
                    type="submit" style={{'margin':'10px'}}>
                        Produce Product
                </button>
            </form>
            <div style={{'margin':'10px'}}>
                <label>Owner Address: </label>
                <output style={{'marginLeft': '10px'}}>{ownerAddress}</output>
            </div>
            <div style={{'margin':'10px'}}>
                <label>Product Address: </label>
                <output style={{'marginLeft': '10px'}}>{productAddress}</output>
            </div>
        </div>
    );
}