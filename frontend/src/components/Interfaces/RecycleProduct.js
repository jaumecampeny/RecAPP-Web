import React, { useState } from "react";

export function RecycleProduct({recycleProduct}){

    return(
        <div style={{border: 'thin solid'}}>
            <h4 style={{'margin':'10px'}}>Recycle Product</h4>
            <form
                onSubmit={(event) => {
                    /**
                     * This function just calls the recycleProduct callback with the
                     * form's data.
                     */
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const productAddress = formData.get("product-address");

                    recycleProduct(productAddress)
                        .then(() => {})
                        .catch(error => {
                            console.error("Error recycling product:", error);
                        })
                }}
            >
                <div style={{'margin':'10px'}}>
                    <label>Specify product address:</label>
                    <input style={{'marginLeft': '10px', 'width':'50%'}} type="text" name="product-address"/> 
                </div>
                <button className="btn btn-warning" 
                    type="submit" style={{'margin':'10px'}}>
                        Recycle Product
                </button>
            </form>
        </div>
    )
}