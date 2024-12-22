import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";
import editer from "../../assets/editer.png";
import UpdateProduct from "../Updateproduct/Updateproduct";

const ListProduct = () => {
  const [allproducts, setallproducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null); 

  const fetchInfo = async () => {
    try {
      const response = await fetch("http://localhost:4000/products");
      const data = await response.json();
      console.log("API Response:", data);
      if (data.success && Array.isArray(data.products)) {
        setallproducts(data.products);
      } else {
        setallproducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setallproducts([]);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);
  const remove_product = async (id) => {
    const response = await fetch(`http://localhost:4000/deleteproduct/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    await fetchInfo();
  };
  const handleUpdateSuccess = () => {
    setEditProduct(null); 
    fetchInfo(); 
  };

  return (
    <div className="list-product">
      <h1>All products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
        <p>Update</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => {
          return (
            <>
              <div
                key={index}
                className="listproduct-format-main listproduct-format"
              >
                <img
                  src={product.image}
                  alt=""
                  className="listproduct-product-icon"
                />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img
                  onClick={() => {
                    remove_product(product._id);
                  }}
                  src={cross_icon}
                  alt=""
                  className="listproduct-remove-icon"
                />
                <img
                  onClick={() => setEditProduct(product)} 
                  src={editer}
                  alt="Edit"
                  className="listproduct-update-icon"
                />
              </div>
              <hr />
            </>
          );
        })}
      </div>

      {editProduct && (
        
        <div className="update-product-modal">
          
          <UpdateProduct
            productToEdit={editProduct}
            onUpdateSuccess={handleUpdateSuccess}
            onCancel={() => setEditProduct(null)} 
            
          />
          
        </div>
        
      )}
    </div>
  );
};

export default ListProduct;
