import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';


const BasketItem = ({ product, onIncrease, onDecrease, onRemove }) => {
  return (
    <li>
      <strong>{product.ProductName}</strong>
      <p>Price: ${product.UnitPrice}</p>
      <p>Quantity: {product.quantity}</p>
      <button onClick={() => onIncrease(product)}>+</button>
      <button onClick={() => onDecrease(product)}>-</button>
      <button onClick={() => onRemove(product)}>Remove</button>
    </li>
  );
};

function App() {
  const [products, setProducts] = useState([]);
  const [basket, setBasket] = useState([]);
  const [basketTotal, setBasketTotal] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    updateBasketTotal(); // Call updateBasketTotal whenever basket changes
  }, [basket]);

  const addToBasket = (product) => {
    setBasket((prevBasket) => {
      const existingItem = prevBasket.find((item) => item.id === product.id);
  
      if (existingItem && existingItem.UnitsInStock > existingItem.quantity) {
        //if the item does exist and there's enough stock increase the quantity
        const updatedBasket = prevBasket.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        return updatedBasket;
      } else if (!existingItem) {
        //if item doesn't exist, add it to basket as 1
        const newBasketItem = { ...product, quantity: 1 };
        return [...prevBasket, newBasketItem];
      } else {
        //not enough stock:
        window.alert("Sorry! We don't have more " + product.ProductName + " products in stock. :/");
        return prevBasket;
      }
    });
  };

  const removeFromBasket = (product) => {
    const updatedBasket = basket.filter(item => item.id !== product.id);
    setBasket(updatedBasket);
  };

  const increaseQuantity = (product) => {
    const updatedBasket = basket.map(item => {
      if (item.id === product.id && item.quantity < item.UnitsInStock) {
        item.quantity += 1;
      }
      return item;
    });

    setBasket(updatedBasket);
  };

  const decreaseQuantity = (product) => {
    const updatedBasket = basket.map(item => {
      if (item.id === product.id && item.quantity > 0) {
        item.quantity -= 1;
      }
      return item;
    });

    setBasket(updatedBasket);
  };

  const updateBasketTotal = () => {
    const total = basket.reduce((acc, item) => {
      return acc + item.UnitPrice * item.quantity;
    }, 0);

    setBasketTotal(total);
  };

  const handlePayment = () => {
    // Perform any payment-related logic here
    
    // Clear the basket
    setBasket([]);
  };

  const getColorBasedOnQuantity = (quantity) => {
    if (quantity > 75) {
      return 'gold';
    } else if (quantity > 40) {
      return 'green';
    } else if (quantity > 15) {
      return 'yellow';
    } else if (quantity > 5) {
      return 'orange';
    } else {
      return 'red';
    }
  };
  

  return (
    <div>
      <header>
        <h1>Shop!</h1>
        <p>Add things to your shopping basket :)</p>
      </header>
      <nav>
      <ul>
          <li class="navbarButton"><a href="#products">View Products</a></li>
          <li class="navbarButton"><a href="#basket">View Basket: {basket.length}</a></li> {/* New line for basket link */}
      </ul>
      </nav>
      <section id="products">
  <h2>Product List</h2>
  <ul>
    {products.map(product => (
      <li id= "productBox"
        key={product.id}
        style={{
          borderColor: getColorBasedOnQuantity(product.UnitsInStock),
        }}
      >
        <strong>{product.ProductName}</strong>
        <p>Price: ${product.UnitPrice}</p>
        <p>Stock: {product.UnitsInStock} units</p>
        <button onClick={() => { addToBasket(product) }}>Add to Basket</button>
      </li>
    ))}
  </ul>
</section>
      <section id="basket">
        <h2>Shopping Basket: {basket.length} Product(s)</h2>
        {basket.length === 0 ? (
          <p>Your basket is empty.</p>
        ) : (
          <div>
            <ul>
              {basket.map(item => (
                <BasketItem
                  key={item.id}
                  product={item}
                  onIncrease={increaseQuantity}
                  onDecrease={decreaseQuantity}
                  onRemove={removeFromBasket}
                />
              ))}
            </ul>
            <p>Total: ${basketTotal}</p>
            <a onClick={handlePayment} href="#pay" disabled={basket.length === 0}>Proceed to Pay</a>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;

