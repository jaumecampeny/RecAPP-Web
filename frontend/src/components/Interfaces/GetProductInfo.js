import React, { useState } from "react";

export function GetProductInfo({getProductInfo}){
    //State for the owner address, product name, product type, times recycled, CID.
    const [ownerAddress, setOwnerAddress] = useState("");
    const [productName, setProductName] = useState("");
    const [productType, setProductType] = useState("");
    const [productState, setProductState] = useState("");
    const [timesRecycled, setTimesRecycled] = useState("");
    const [cid, setCID] = useState("");

    return (
        <div style={{border: 'thin solid'}}>
            <h4 style={{'margin':'10px'}}>Get Product Info</h4>
            <form
                onSubmit={(event) => {
                    /**
                     * This function just calls the produceProduct callback with the
                     * form's data.
                     */
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const productAddress = formData.get("product-address");

                    getProductInfo(productAddress)
                        .then(([ownerAddress, productName, productType, productState, timesRecycled, cid, imageURL]) => {
                            setOwnerAddress(ownerAddress);
                            setProductName(productName);
                            setProductType(productType);
                            setProductState(productState);
                            setTimesRecycled(timesRecycled);
                            setCID(cid);
                            document.getElementById('product-image').setAttribute('src',imageURL);
                        })
                        .catch(error => {
                            console.error("Error getting product info:", error);
                        })
                }}
            >
                <div style={{'margin':'10px'}}>
                    <label>Specify product address:</label>
                    <input style={{'marginLeft': '10px', 'width':'50%'}} type="text" name="product-address"/> 
                </div>
                <button className="btn btn-warning" 
                    type="submit" style={{'margin':'10px'}}>
                        Get Product Info
                </button>
            </form>
            <div style={{'margin':'10px'}}>
                <label>Owner Address: </label>
                <output style={{'marginLeft': '10px'}}>{ownerAddress}</output>
            </div>
            <div style={{'margin':'10px'}}>
                <label>Product Name: </label>
                <output style={{'marginLeft': '10px'}}>{productName}</output>
            </div>
            <div style={{'margin':'10px'}}>
                <label>Product Type: </label>
                <output style={{'marginLeft': '10px'}}>{productType}</output>
            </div>
            <div style={{'margin':'10px'}}>
                <label>Product State: </label>
                <output style={{'marginLeft': '10px'}}>{productState}</output>
            </div>
            <div style={{'margin':'10px'}}>
                <label>Times Recycled: </label>
                <output style={{'marginLeft': '10px'}}>{timesRecycled}</output>
            </div>
            <div style={{'margin':'10px'}}>
                <label>CID: </label>
                <output style={{'marginLeft': '10px'}}>{cid}</output>
            </div>
            <label style={{'margin':'10px'}}>Product Image: </label>
            <div style={{'margin':'10px', 'textAlign':'center'}}>
                <img style={{'width':'50%'}} id="product-image"/>
            </div>
        </div>
    )
}