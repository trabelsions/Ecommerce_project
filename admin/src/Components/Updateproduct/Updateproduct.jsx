import React, { useEffect, useState } from "react";
import "./UpdateProduct.css";
import upload_area from "../../assets/upload_area.svg";

const UpdateProduct = ({ productToEdit, onUpdateSuccess, onCancel }) => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [originalDetails, setOriginalDetails] = useState({});

  useEffect(() => {
    if (productToEdit) {
      setProductDetails(productToEdit);
      setOriginalDetails(productToEdit);
      setImage(productToEdit.image);
    }
  }, [productToEdit]);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const ChangeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const update_product = async () => {
    const updatedFields = {};

    for (const key in productDetails) {
      if (productDetails[key] !== originalDetails[key]) {
        updatedFields[key] = productDetails[key];
      }
    }

    if (image instanceof File) {
      let formData = new FormData();
      formData.append("product", image);

      try {
        const uploadResponse = await fetch("http://localhost:4000/upload", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });
        const uploadData = await uploadResponse.json();

        if (uploadData.success) {
          updatedFields.image = uploadData.image_url;
        } else {
          alert("Failed to upload image.");
          return;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("An error occurred while uploading the image.");
        return;
      }
    }

    try {
      const response = await fetch(
        `http://localhost:4000/updateproduct/${productDetails._id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFields),
        }
      );
      const data = await response.json();

      if (data.success) {
        alert("Product updated successfully!");
        onUpdateSuccess();
      } else {
        alert("Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while updating the product.");
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name || ""}
          onChange={ChangeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price || ""}
            onChange={ChangeHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price || ""}
            onChange={ChangeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category || "women"}
          onChange={ChangeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={
              image instanceof File
                ? URL.createObjectURL(image)
                : image || upload_area
            }
            className="addproduct-thumnail-img"
            alt=""
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <div>
        <button onClick={update_product} className="addproduct-btn">
          Update
        </button>
        <button onClick={onCancel} className="addproduct-btn cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateProduct;
