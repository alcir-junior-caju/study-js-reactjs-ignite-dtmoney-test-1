import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    sumAmount[product.id] = product.amount;
    return sumAmount;
  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      await api.get('products')
        .then(response => {
          const { data } = response;

          setProducts(data.map((product: Product) => {
            return {
              ...product,
              priceFormatted: formatPrice(product.price),
            };
          }));
        });
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  return (
    <ProductList>
      {products.map(({ id, title, image, priceFormatted }: ProductFormatted) => (
        <li key={id}>
          <img src={image} alt={title} />
          <strong>{title}</strong>
          <span>{priceFormatted}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cartItemsAmount[id] || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
