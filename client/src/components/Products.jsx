import ProductCard from "./ProductCard";
import products from "./storeProducts";

function Products({ addToCart }) {
  return (
    <section id="shop">
      <h2>Trending Collection</h2>

      <div className="products-container">
        <ProductCard
          name="Oversized Hoodie"
          price="₹1999"
          image={products[0].image}
          addToCart={() => addToCart(products[0])}
        />

        <ProductCard
          name="Casual Shirt"
          price="₹1499"
          image={products[1].image}
          addToCart={() => addToCart(products[1])}
        />

        <ProductCard
          name="Night Blazer"
          price="₹3499"
          image={products[2].image}
          addToCart={() => addToCart(products[2])}
        />
      </div>
    </section>
  );
}

export default Products;