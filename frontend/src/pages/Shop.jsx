import React from "react";
import Hero from "../components/Hero/Hero";
import Popular from "../components/Popular/Popular";
import Offers from "../components/Offers/Offers";
import NewColllections from "../components/NewCollections/NewColllections";
import Newsletter from "../components/Newsletter/Newsletter";

const Shop = () => {
  return (
    <div>
      <Hero />
      <Popular />
      <Offers />
      <NewColllections />
      <Newsletter />
    </div>
  );
};

export default Shop;
