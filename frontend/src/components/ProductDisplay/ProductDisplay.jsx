import React, { useContext } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../context/ShopContext";

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);

  if (!product) {
    return <div className="loading">Loading product details...</div>;
  }

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        {/* Product Image Thumbnails */}
        <div className="productdisplay-img-list">
          {[...Array(4)].map((_, index) => (
            <img
              key={index}
              src={product.image}
              alt={`Thumbnail ${index + 1}`}
            />
          ))}
        </div>

        {/* Main Product Image */}
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={product.image}
            alt={product.name}
          />
        </div>
      </div>

      <div className="productdisplay-right">
        {/* Product Name */}
        <h1>{product.name}</h1>

        {/* Product Ratings */}
        <div className="productdisplay-right-stars">
          {[...Array(4)].map((_, index) => (
            <img key={index} src={star_icon} alt="Star" />
          ))}
          <img src={star_dull_icon} alt="Star" />
          <p>122</p>
        </div>

        {/* Prices */}
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            ${product.old_price.toFixed(2)}
          </div>
          <div className="productdisplay-right-price-new">
            ${product.new_price.toFixed(2)}
          </div>
        </div>

        {/* Description */}
        <div className="productdisplay-right-description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
          necessitatibus inventore odio consequatur, nostrum error sed, amet
          beatae magnam in natus qui, autem totam nisi unde magni assumenda!
          Eos, corporis?
        </div>

        {/* Sizes */}
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div key={size}>{size}</div>
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(product.id)}
          className="add-to-cart-button"
        >
          ADD TO CART
        </button>

        {/* Categories and Tags */}
        <p className="productdisplay-right-category">
          <span>Category: </span>
          {product.category || "Unknown"}
        </p>
        <p className="productdisplay-right-category">
          <span>Tags: </span>Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
