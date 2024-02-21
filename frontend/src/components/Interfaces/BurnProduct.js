import React, { useState } from "react";

export function BurnProduct({burnProduct}){

    return(
        <div style={{border: 'thin solid'}}>
            <h4 style={{'margin':'10px'}}>Burn Product</h4>
            <form
                onSubmit={(event) => {
                    /**
                     * This function just calls the burnProduct callback with the
                     * form's data.
                     */
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const productAddress = formData.get("product-address");
                    const recycle = formData.get("recycle");

                    burnProduct(productAddress,recycle)
                        .then(() => {})
                        .catch(error => {
                            console.error("Error burning product:", error);
                        })
                }}
            >
                <div style={{'margin':'10px'}}>
                    <label>Specify product address:</label>
                    <input style={{'marginLeft': '10px', 'width':'50%'}} type="text" name="product-address"/> 
                </div>
                <div style={{'margin':'10px'}}>
                    <input type="checkbox" name="recycle"/> 
                    <label style={{'marginLeft': '10px', 'width':'50%'}}>Send to recycle</label>
                </div>
                <button className="btn btn-warning" 
                    type="submit" style={{'margin':'10px'}}>
                        Burn Product
                </button>
            </form>
        </div>
    )

}