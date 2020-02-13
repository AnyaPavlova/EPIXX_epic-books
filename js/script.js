ready(function(){
  // В этом месте должен быть написан ваш код

  //массив товаров
  const productsArr = [
    {
      name: 'Гарри Поттер',
      img: 'img/4223.jpg',
      price: 1100,
      count: 1
    },
    {
      name: 'Алиса в стране чудес',
      img: 'img/100023075889b0.jpg',
      price: 1000,
      count: 2
    },
    {
      name: 'Охотники за головами',
      img: 'img/cover.jpg',
      price: 500,
      count: 1
    },
  ];

  //сумма товаров
  function counSumProducts() { 
    const cartSumProduct = document.querySelector('#cart-sum-product');    
    cartSumProduct.innerText = document.querySelectorAll('.cart__product').length;
  } 

  //Вспомогательная функция - разметка товара
  function createProduct() {
    let newProduct = document.createElement('tr');  //создали узел
    newProduct.classList.add('cart__product'); //добавили класс
    //добавили содержимое
    let newProductHtml = `<td class="cart__col-1">
                  <img class="cart__item-img" src="" alt="">
                </td>
                <td class="cart__col-2">
                  <div class="cart__item-name"></div>
                </td>
                <td class="cart__col-3">
                  <div class="field-num  field-num--bg-tran">
                    <span class="field-num__input-wrap">
                      <button class="field-num__btn-minus" type="button">-</button>
                      <input class="field-num__input" type="number" value="1" step="1" min="1"/>
                      <button class="field-num__btn-plus" type="button">+</button>
                    </span>
                  </div>
                </td>
                <td class="cart__col-4">
                  <span class="cart__item-price"></span>
                </td>
                <td class="cart__col-5">
                  <button class="close cart__product-del-btn" type="button">
                    <svg width="16" height="16">
                      <use xlink:href="#close"></use>
                    </svg>
                  </button>
                </td>`;   
      newProduct.innerHTML = newProductHtml;     //добавили в узел HTML
      return newProduct; //Вернули новый узел
   };

  //Сумма заказа
  function orderPrice() {
    const productsList = document.querySelectorAll('.cart__product');
    let allPrice = 0;

    for(let item of productsList) {
      let price = +(item.querySelector('.cart__item-price').innerText);
      let count = +(item.querySelector('.field-num__input').value);     
      let sum = price * count;
      allPrice += sum;
    }
    document.querySelector('#cart-products-price-num').innerText = `${allPrice} ₽`;
  }

  //Заполнение товаров
  function fillingProducts(arr) {
    const productsTab = document.querySelector('.cart__table-headers'); //после этого элемента будем вставлять
    
    for(let item of productsArr) {
      let product = createProduct(); //создали новый узел
      //добавляем в узел данные
      product.querySelector('.cart__item-name').innerText = item.name;
      product.querySelector('.field-num__input').value = item.count;
      product.querySelector('.cart__item-img').src = item.img;
      product.querySelector('.cart__item-img').alt = item.name;
      product.querySelector('.cart__item-price').innerText = item.price;
      //Добавили на странцу
      productsTab.after(product);      
    }  
    
    counSumProducts(); //Поменяли кол-во товаров
    orderPrice(); //Посчтитали сумму
  }
  fillingProducts(productsArr);

   //Уменьшение кол-ва единиц товара
  function reduceSum(el) { 
    let parent = el.closest('.cart__product');
    let fieldNum = parent.querySelector('.field-num__input');
    let count = +fieldNum.value;
    if(count > 1) {
      count -= 1;
      fieldNum.value = count;
    }
    else {
      alert('Количество не может быть меньше 1');
    }
    orderPrice();
  };
  //Увеличение кол-ва единиц товара
  function increase(el) {
    let parent = el.closest('.cart__product');
    let fieldNum = parent.querySelector('.field-num__input');
    let count = +fieldNum.value;
    if(count < 10) {
      count += 1;
      fieldNum.value = count;
    }
    else {
      alert('Количество не может быть больше 10');
    }
    orderPrice();
  };
  //Удаление товара
  function deleteProduct(el) {
    let parent = el.closest('.cart__product');
    parent.remove();
    orderPrice();
    counSumProducts();
  }
  //Функция проверки по чему был клик и вызова последующих функций
  function cardClick(event) {
    event.preventDefault;
    const eventTarget = event.target;
    if( eventTarget.classList.contains('field-num__btn-minus') ) {
      reduceSum(eventTarget);
    }
    if( eventTarget.classList.contains('field-num__btn-plus') ) {
      increase(eventTarget);
    }
    if( eventTarget.classList.contains('cart__product-del-btn') ) {
      deleteProduct(eventTarget);
    }
  }
  //Отслеживаем клик по корзине
  const card = document.querySelector('.cart');
  card.addEventListener('click', cardClick);
  card.addEventListener('change', changeProduct);

  function changeProduct(event) {
    const eventTarget = event.target;
    if( eventTarget.classList.contains('field-num__input') ) {
      let valueInput = +(eventTarget.value);
      if( valueInput===0 ) {
        eventTarget.value = 1;
        alert('Количество не может быть меньше 1');
      }
      else if( valueInput > 10 ) {
        eventTarget.value = 10;
        alert('Количество не может быть больше 10');
      }
      else {
        orderPrice();
      }
    }
  }

   //Удаление корзины по клику "Очистить корзину"
   let btnDeleteAll = document.querySelector('.cart__clear-btn')
   btnDeleteAll.addEventListener('click', deleteAllProducts);
   function deleteAllProducts(event) {
    event.preventDefault;
    const eventTarget = event.target;
    let productsTab = eventTarget.closest('.cart');
    productsTab.replaceWith('Ваша корзина пуста');
   }

  // ВНИМАНИЕ!
  // Нижеследующий код (кастомный селект и выбор диапазона цены) работает
  // корректно и не вызывает ошибок в консоли браузера только на главной.
  // Одна из ваших задач: сделать так, чтобы на странице корзины в консоли
  // браузера не было ошибок.

  // Кастомные селекты (кроме выбора языка)
  let hasSelectLang = document.querySelector('.select.field-select__select'); //проверяем наличие такого элемента

  if(hasSelectLang) { //если он есть, то вызываем следующий код
    new Choices('.field-select:not(#lang) select.field-select__select', {
      searchEnabled: false,
      shouldSort: false,
    });
    // Кастомный селект выбора языка отдельно
    new Choices('#lang select.field-select__select', {
      searchEnabled: false,
      shouldSort: false,
      callbackOnCreateTemplates: function (template) {
        return {
          item: (classNames, data) => {
            return template(`
              <div class="${classNames.item} ${data.highlighted ? classNames.highlightedState : classNames.itemSelectable}" data-item data-id="${data.id}" data-value="${data.value}" ${data.active ? 'aria-selected="true"' : ''} ${data.disabled ? 'aria-disabled="true"' : ''}>
                ${getLangInSelectIcon(data.value)} ${data.label.substr(0,3)}
              </div>
            `);
          },
          choice: (classNames, data) => {
            return template(`
              <div class="${classNames.item} ${classNames.itemChoice} ${data.disabled ? classNames.itemDisabled : classNames.itemSelectable}" data-select-text="${this.config.itemSelectText}" data-choice ${data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable'} data-id="${data.id}" data-value="${data.value}" ${data.groupId > 0 ? 'role="treeitem"' : 'role="option"'}>
                ${getLangInSelectIcon(data.value)} ${data.label}
              </div>
            `);
          },
        };
      }
    });
    function getLangInSelectIcon(value) {
      if (value == 'ru') return '<span class="field-select__lang-ru"></span>';
      else if (value == 'en') return '<span class="field-select__lang-en"></span>';
      return '<span class="field-select__lang-null"></span>';
    }
  }

  // Выбор диапазона цен
  var slider = document.getElementById('price-range');
  if(slider) { //если он есть, то вызываем следующий код
    noUiSlider.create(slider, {
      start: [400, 1000],
      connect: true,
      step: 100,
      range: {
        'min': 200,
        'max': 2000
      }
    });
  }

});

function ready (fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

