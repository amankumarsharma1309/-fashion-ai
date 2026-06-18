function ProductCard({ name, price, image, addToCart }) {
  return (
    <div className="product-card">
      <img
        src={image}
        alt={name}
        className="product-image"
      />

      <h3>{name}</h3>
      <p>{price}</p>

      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;