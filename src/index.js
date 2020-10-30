import './style.css';
import data from './assets/data/coffees.json';

{
  let plantBasedCoffees = [];
  let orders = [];

  const init = () => {
    loadCoffees();
  };

  const calculateTotal = () => {
    if (orders.length > 0) {
      const total = orders.reduce((total, order) => {
        return total + order.coffee.prices.medium * order.amount;
      }, 0);
      document.querySelector(`.total__price span`).textContent = total;
    } else {
      document.querySelector(`.total__price span`).textContent = `0`;
    }
  };

  const handleClickRemove = e => {
    const coffeeId = parseInt(e.currentTarget.parentElement.dataset.id);

    orders = orders.filter(order => {
      return coffeeId !== order.coffee.id;
    });
    renderOrders();
  };

  const createOrder = order => {
    const $li = document.createElement(`li`);
    $li.classList.add(`order`);
    $li.dataset.id = order.coffee.id;
    $li.innerHTML = `
      <span class="order__name">
        <span class="order__amount">${order.amount} x</span> ${order.coffee.name}
      </span>
      <span class="order__price">&euro; ${order.coffee.prices.medium * order.amount}</span>
      <button class="order__remove">
        x
      </button>
    `;
    $li.querySelector(`.order__remove`).addEventListener(`click`, handleClickRemove);
    return $li;
  };

  const renderOrders = () => {
    if (orders.length > 0) {
      document.querySelector(`.orders__wrapper`).classList.remove(`hidden`);
      document.querySelector(`.emptystate`).classList.add(`hidden`);

      const $orders = document.querySelector(`.orders`);
      $orders.innerHTML = ``;
      orders.forEach(order => {
        const $li = createOrder(order);
        $orders.appendChild($li);
      });
    } else {
      document.querySelector(`.orders__wrapper`).classList.add(`hidden`);
      document.querySelector(`.emptystate`).classList.remove(`hidden`);
    }

    calculateTotal();
  };

  const findOrderByCoffeeId = id => {
    return orders.find(order => order.coffee.id === id);
  };

  const addToOrder = coffee => {
    const inorderCoffee = findOrderByCoffeeId(coffee.id);

    if (inorderCoffee) {
      inorderCoffee.amount ++;
    } else {
      orders.push({
        amount: 1,
        coffee: coffee
      });
    }

    renderOrders();
  };

  const handleClickLi = e => {
    const clickedCoffee = plantBasedCoffees.find(coffee => coffee.id === parseInt(e.currentTarget.dataset.id));
    addToOrder(clickedCoffee);
  };

  const makeCoffee = coffee => {
    const $li = document.createElement(`li`);
    $li.classList.add(`price`);
    $li.addEventListener(`click`, handleClickLi);
    $li.dataset.id = coffee.id;
    $li.innerHTML = `
      <a class="price__button">
        <span class="price__button__wrapper">
          <span class="price__button__name">${coffee.name}</span>
          <span class="price__button__amount">&euro; ${coffee.prices.medium}</span>
        </span>
        <span class="price__button__plus">+</span>
      </a>
    `;
    document.querySelector(`.prices__list`).appendChild($li);
  };

  const showCoffees = coffees => {
    coffees.forEach(coffee => {
      makeCoffee(coffee);
    });
  };

  const loadCoffees = () => {
    plantBasedCoffees = data.coffees.filter(coffee => coffee.plantbased === true);
    showCoffees(plantBasedCoffees);

  };

  init();
}
