ready(function () {
  // В этом месте должен быть написан ваш код

  //Изменение кол-ва единиц в input по клику на +/-
  function changeValueInputByButton(el) {
    let parent = el.closest('.field-num');
    let fieldNum = parent.querySelector('.field-num__input');
    let change = 0; //изменение
    let minNum = +fieldNum.min || 1; //минимальное значение
    let maxNum = +fieldNum.max || Infinity; //максимальное значение
    let step = +fieldNum.step || 1; //шаг
    if (el.classList.contains('field-num__btn-minus')) {
      change = -step;
    } else if (el.classList.contains('field-num__btn-plus')) {
      change = +step;
    }
    let count = +fieldNum.value;
    let newCount = count + change;
    if ((newCount >= minNum) && (newCount <= maxNum)) {
      fieldNum.value = newCount;
    } else if (newCount < minNum) {
      alert(`Количество не может быть меньше ${minNum}`);
    }
    else if (newCount > maxNum) {
      alert(`Количество не может быть больше ${maxNum}`);
    }
  }
  //Изменение кол-ва единиц в input по заполнению
  function changeValueInput(el) {
    let minNum = +el.min || 1; //минимальное значение
    let maxNum = +el.max || Infinity; //максимальное значение
    let valueInput = +(el.value);
    if (valueInput < minNum) {
      el.value = minNum;
      alert(`Количество не может быть меньше ${minNum}`);
    }
    else if (valueInput > maxNum) {
      el.value = maxNum;
      alert(`Количество не может быть больше ${maxNum}`);
    }
    else {
      return true;
    }
  }

  //Валидация формы (проверка, что обязательный поля не пустые)
  function validateForm(event) {
    event.preventDefault();
    const eventTarget = event.target;
    const inputArrRequired = eventTarget.closest('form').querySelectorAll('.field-text__input[required]');
    for (let item of inputArrRequired) {
      if (item.value == "") {
        item.closest('.field-text').classList.add('field-text--error');
      }
    }
  };
  //Проверка заполнения input при его изменении - если ранее был навешен класс ошибки - убираем его
  function fillStatusInput(event) {
    const eventTarget = event.target;
    let check = eventTarget.closest('.field-text').classList;
    if (check.contains('field-text--error')) {
      check.remove('field-text--error');
    }
  };

  const isCartPage = document.querySelector('.cart');  // выполняем наш код только если на странице есть корзина
  if (isCartPage) {

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
      const headerBasketSumProducts = document.querySelector('.page-header__cart-num');
      headerBasketSumProducts.innerText = cartSumProduct.innerText = document.querySelectorAll('.cart__product').length;
    }

    //Вспомогательная функция - разметка товара
    function createProduct(name, count, img, price) {
      let newProduct = document.createElement('tr');  //создали узел
      newProduct.classList.add('cart__product'); //добавили класс
      //добавили содержимое
      let newProductHtml = `<td class="cart__col-1">
                  <img class="cart__item-img" src="${img}" alt="${name}">
                </td>
                <td class="cart__col-2">
                  <div class="cart__item-name">${name}</div>
                </td>
                <td class="cart__col-3">
                  <div class="field-num  field-num--bg-tran">
                    <span class="field-num__input-wrap">
                      <button class="field-num__btn-minus" type="button">-</button>
                      <input class="field-num__input" type="number" value="${count}" step="1" min="1" max="10"/>
                      <button class="field-num__btn-plus" type="button">+</button>
                    </span>
                  </div>
                </td>
                <td class="cart__col-4">
                  <span class="cart__item-price">${price}</span>
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
    let promotionalCodeDiscount = 0; //здесь будет храниться скидка по промокоду
    function orderPrice() {
      const productsList = document.querySelectorAll('.cart__product');
      let allPrice = 0;

      for (let item of productsList) {
        let price = +(item.querySelector('.cart__item-price').innerText);
        let count = +(item.querySelector('.field-num__input').value);
        let sum = price * count;
        allPrice += sum;
      }
      document.querySelector('#cart-products-price-num').innerText = `${allPrice} ₽`;

      let checkoutPrice = document.querySelector('.checkout__price');
      checkoutPrice.innerText = `${allPrice - promotionalCodeDiscount} ₽`;
    }

    //Заполнение товаров
    function fillingProducts(arr) {
      const productsTab = document.querySelector('.cart__table-headers'); //после этого элемента будем вставлять

      for (let item of productsArr) {
        let product = createProduct(item.name, item.count, item.img, item.price); //создали новый узел
        productsTab.after(product); //Добавили на странцу
      }

      counSumProducts(); //Поменяли кол-во товаров
      orderPrice(); //Посчтитали сумму
    }
    fillingProducts(productsArr);

    //Изменение кол-ва единиц товара по клику на +/-
    function changeSumGoodsBtn(element) {
      changeValueInputByButton(element);
      orderPrice();
    }
    //Изменение кол-ва единиц товара
    function changeSumGoodsInput(event) {
      const eventTarget = event.target;
      if (eventTarget.classList.contains('field-num__input')) {
        changeValueInput(eventTarget);
        orderPrice();
      }
    };
    //Удаление товара
    function deleteProduct(el) {
      let parent = el.closest('.cart__product');
      parent.remove();
      orderPrice();
      counSumProducts();
    };
    //Функция проверки по чему был клик и вызова последующих функций
    function cardClick(event) {
      const eventTarget = event.target;
      if ((eventTarget.classList.contains('field-num__btn-minus')) || (eventTarget.classList.contains('field-num__btn-plus'))) {
        changeSumGoodsBtn(eventTarget);
      }
      if (eventTarget.classList.contains('cart__product-del-btn')) {
        deleteProduct(eventTarget);
      }
    };
    //Отслеживаем клик по корзине
    const card = document.querySelector('.cart');
    card.addEventListener('click', cardClick);
    card.addEventListener('change', changeSumGoodsInput);

    //Удаление корзины по клику "Очистить корзину"
    let btnDeleteAll = document.querySelector('.cart__clear-btn')
    btnDeleteAll.addEventListener('click', deleteAllProducts);
    function deleteAllProducts(event) {
      event.preventDefault();
      const eventTarget = event.target;
      let productsTab = eventTarget.closest('.cart');
      productsTab.replaceWith('Ваша корзина пуста');
    };

    // Проверка формы
    const submitBtn = document.querySelector('.field-actions .btn');
    submitBtn.addEventListener('click', validateForm);

    const userInfo = document.querySelector('.checkout__user-data');
    userInfo.addEventListener('change', fillStatusInput);

    /*В зависимости от способа доставки показываем ту или иную инф.*/
    const checkDelivery = document.querySelectorAll('.field-radio__input[name=delivery]');
    for (let item of checkDelivery) {
      item.addEventListener('change', choiseDelivery);
    }
    function choiseDelivery(event) {
      const eventTarget = event.target;
      let value = eventTarget.value;

      const allDelivery = document.querySelectorAll('.cart__delivery'); //сначала ищем активный элемент и скрываем его
      for (let item of allDelivery) {
        if (!(item.classList.contains('cart__delivery--hidden'))) {
          item.classList.add('cart__delivery--hidden');
        }
      }

      let newActiveDeliveryID = `#cart-delivery-${value}`;
      document.querySelector(newActiveDeliveryID).classList.remove('cart__delivery--hidden');
    };

    /*Промокод*/
    const promotionalCode = document.querySelector('input[name=promocode]');
    promotionalCode.addEventListener('change', changePromotionalCode);

    function changePromotionalCode(event) {
      const eventTarget = event.target;
      let classPromocode = eventTarget.closest('.field-text--promocode').classList;
      if (eventTarget.value.toUpperCase() === 'EPIXX') {
        if (classPromocode.contains('field-text--input-error')) {
          classPromocode.remove('field-text--input-error');
        }
        classPromocode.add('field-text--input-checked');
        document.querySelector('.checkout__discount').classList.remove('checkout__discount--hidden');
        promotionalCodeDiscount = 150;
      }
      else {
        classPromocode.add('field-text--input-error');
        document.querySelector('.checkout__discount').classList.add('checkout__discount--hidden');
        promotionalCodeDiscount = 0;
      }
      orderPrice(); //Пересчитаем сумму
    };


  };

  // ВНИМАНИЕ!
  // Нижеследующий код (кастомный селект и выбор диапазона цены) работает
  // корректно и не вызывает ошибок в консоли браузера только на главной.
  // Одна из ваших задач: сделать так, чтобы на странице корзины в консоли
  // браузера не было ошибок.

  // Кастомные селекты (кроме выбора языка)
  let hasSelectLang = document.querySelector('.select.field-select__select'); //проверяем наличие такого элемента

  if (hasSelectLang) { //если он есть, то вызываем следующий код
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
                ${getLangInSelectIcon(data.value)} ${data.label.substr(0, 3)}
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
  if (slider) { //если он есть, то вызываем следующий код
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

function ready(fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

