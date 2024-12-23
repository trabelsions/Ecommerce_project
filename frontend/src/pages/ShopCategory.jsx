import React, { useContext, useState } from "react";
import "./css/ShopCategory.css";
import { ShopContext } from "../context/ShopContext";
import Item from "../components/Item/Item";

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [sortOption, setSortOption] = useState("");

  const sortProducts = (products) => {
    if (sortOption === "price-low-to-high") {
      return [...products].sort((a, b) => a.new_price - b.new_price);
    } else if (sortOption === "price-high-to-low") {
      return [...products].sort((a, b) => b.new_price - a.new_price);
    } else if (sortOption === "name-asc") {
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      return [...products].sort((a, b) => b.name.localeCompare(a.name));
    }
    return products;
  };
  const filteredAndSortedProducts = sortProducts(
    all_product.filter((item) => item.category === props.category)
  );

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-12</span> out of {filteredAndSortedProducts.length}{" "}
          products
        </p>
        <div className="shopcategory-sort">
          <select
            onChange={(e) => setSortOption(e.target.value)}
            className="shopcategory-sort-dropdown"
          >
            <option value="">Sort by </option>
            <option value="price-low-to-high">Price: Low to High</option>
            <option value="price-high-to-low">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>
      <div className="shopcategory-products">
        {all_product.map((item, i) => {
          if (props.category === item.category) {
            return (
              <Item
                key={i}
                id={item._id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
      <div className="shopcategory-loadmore">Explore More</div>
    </div>
  );
};

export default ShopCategory;
