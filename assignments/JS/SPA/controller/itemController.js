var items = [];
items.push(
  { id: "I-001", name: "Tea", stock: 200, price: "200.00", weight: 250 },
  { id: "I-002", name: "Rice", stock: 100, price: "750.00", weight: 1000 }
);

// settle up
refreshItemsFromArray();
$("#item-id").text(calculateNextId(items));

function refreshItemsFromArray() {
  items.forEach((item) => {
    $("#item-container").append(
      `<div class="col col-lg-4 d-flex justify-content-center item">
          <div class="card" style="width: 18rem;">
            <img src="./assets/img/item.jpg" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
              <ul class="list-unstyled">
                <li id="item-id-txt">${item.id}</li>
                <li>Stock : ${item.stock}</li>
                <li>Price : ${item.price}</li>
                <li>Weight (g) : ${item.weight}</li>
              </ul>
              <a href="#" class="btn btn-primary update-item" data-bs-toggle="modal" data-bs-target="#itemModal2" onclick="openUpdateItemMenu(event)">Update Item</a>
            <a href="#" class="btn btn-danger" onclick="delItem('${item.id}')">Delete</a>
          </div>
          </div>
        </div>`
    );
    // add to combo
    $("#items-selector").append(`
        <option value="${item.id}">${item.id}</option>
    `);
  });
}

function delItem(id) {
  items = items.filter((item) => {
    return item.id != id;
  });
  clearAllItems();
  refreshItemsFromArray();
}

function clearAllItems() {
  // remove all existing items
  $(".item").remove();
}

$(function () {
  $("#addNewItem").click(() => {
    // appending to array
    let item = {
      id: $("#item-id").text(),
      name: $("#item-name").val(),
      stock: $("#item-stock").val(),
      price: $("#item-price").val(),
      weight: $("#item-weight").val(),
    };
    console.log("add item runs");
    items.push(item);
    clearAllItems();
    refreshItemsFromArray();
    $("#item-id").text(calculateNextId(items));
  });
});

function openUpdateItemMenu(event) {
  let id = $(event.target).parent().find("ul #item-id-txt").text();
  let item = items.find((element) => {
    return element.id === id;
  });
  console.log(item);
  $("#up-txt-item-id").text(item.id);
  $("#up-item-id").val(item.id);
}

function saveNewItemData() {
  let newItem = {
    id: $("#up-item-id").val(),
    name: $("#up-item-name").val(),
    stock: $("#up-item-stock").val(),
    price: $("#up-item-price").val(),
    weight: $("#up-item-weight").val(),
  };
  console.log(newItem);
  items = items.map((item) => {
    return newItem.id === item.id ? newItem : item;
  });
  clearAllItems();
  refreshItemsFromArray();
}

// calculate next ids for all models
function calculateNextId(arr) {
  if (arr.length > 0) {
    let id = arr[arr.length - 1].id;
    let [pre, frag] = id.split("-");
    let num = parseInt(frag) + 1;
    let count = num.toString().length;
    if (count == 1) {
      return pre + "-00" + num;
    } else if (count == 2) {
      return pre + "-0" + num;
    } else {
      return pre + "-" + num;
    }
  } else {
    return "I-001";
  }
}

function validateItem(event, regex, func) {
  event.preventDefault();
  // if enter key is pressed
  if (event.which == 13) {
    console.log("this happens bn");
    // to the next input
    var input = $(event.target).parent(".pass").next().find("input");
    if (input.length == 1) {
      input.focus();
    } else {
      $(event.target)
        .parent(".pass")
        .parent()
        .next()
        .find(".btn-primary")
        .click();
    }
    return;
  }

  let exp = new RegExp(regex, "i");
  if (exp.test(event.target.value)) {
    $(event.target).css("border-color", "green");
  } else {
    // invalid
    $(event.target).css("border-color", "rgb(179, 106, 106)");
  }
  func == "add"
    ? validateAllFields(regex1, "#addNewItem")
    : validateAllFields(regex2, "#updateItem");
}

let regex2 = new Map();
let regex1 = new Map();
(function () {
  regex1.set("#item-name", "[a-z]{3}");
  regex1.set("#item-price", "[0-9]{3,}.[0-9]{2}");
  regex1.set("#item-stock", "[0-9]{2,}");
  regex1.set("#item-weight", "[0-9]{2,}");
  regex2.set("#up-item-name", "[a-z]{3}");
  regex2.set("#up-item-price", "[0-9]{3,}.[0-9]{2}");
  regex2.set("#up-item-stock", "[0-9]{2,}");
  regex2.set("#up-item-weight", "[0-9]{2,}");
})();

function validateAllFields(map, section) {
  console.log("validation happens");
  let validated = true;
  map.forEach((value, key) => {
    console.log(value, key);
    let exp = new RegExp(value, "i");
    if (!exp.test($(key).val())) {
      console.log("failed");
      validated = false;
    }
  });
  if (validated) {
    $(section).removeAttr("disabled");
  } else {
    $(section).attr("disabled", true);
  }
}