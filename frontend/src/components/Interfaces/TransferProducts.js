import React, { useState } from "react";

export function TransferProducts({transferProducts}){
    //State for the storage of return message.
    
    return (
        <div style={{border: 'thin solid'}}>
            <h4 style={{'margin':'10px'}}>Transfer Products</h4>
            <form
                onSubmit={(event) => {
                    /**
                     * This function just calls the transferProducts callback with the
                     * form's data.
                     */
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const productAddresses = formData.get("product-addresses");
                    const recipientAddresses = formData.get("recipient-address")

                    transferProducts(productAddresses, recipientAddresses)
                        .then(() => {})
                        .catch(error => {
                            console.error("Error transfering products:", error);
                        })
                }}
            >
                <div style={{'margin':'10px'}}>
                    <label>Specify product addresses:</label>
                    <input style={{'marginLeft': '10px', 'width':'50%'}} 
                        type="text" name="product-addresses" 
                        placeholder="['0x0...','0x0...']"/> 
                </div>
                <div style={{'margin':'10px'}}>
                    <label>Specify recipient address:</label>
                    <input style={{'marginLeft': '10px', 'width':'50%'}} type="text" 
                        name="recipient-address"/> 
                </div>
                <button className="btn btn-warning" 
                    type="submit" style={{'margin':'10px'}}>
                        Transfer Products
                </button>
            </form>
        </div>
    )
}