/***********************************************************
 * Combined JavaScript for Computer Force
 * Original template.js functions by Leonard Siu
 * Extended with computerForce.js functions
 ***********************************************************/

// ==================== template.js 関数 ====================

function clearRegistrationForm() {
  document.querySelector(".registrationForm").reset();
}

function getCurrentYear() {
  return new Date().getFullYear();
}

function validateRegistrationForm() {
  let phoneNumber = document.forms["registrationForm"]["phoneNumber"].value;
  let password = document.querySelector("#password").value;
  let confirmPassword = document.querySelector("#confirmPassword").value;
  let isNoErrors = true;

  if (password != confirmPassword) {
    alert("Password and Confirm Password does not match. Please try again.");
    isNoErrors = false;
  }

  if (phoneNumber != '' && isNaN(phoneNumber)) {
    alert("Invalid telephone number. Please try again.");
    isNoErrors = false;
  }

  if (!isNoErrors)
    return isNoErrors;
}

// ==================== computerForce.js 関数 ====================

function ajaxChangeQuantityAndGrandTotal(parProductNumber, parUpdatedQuantity, parDifference, parUnitPrice, parAmount) {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let obj = JSON.parse(this.responseText);
      if (obj["numItemsBought"] > 0) {
        document.querySelector('.badge').textContent = obj["numItemsBought"];
      }
      else {
        document.querySelector('.badge').style.display = 'none';
      }
      const grandTotals = document.querySelectorAll('.grandTotal');
      for (var index = 0; index < grandTotals.length; index++) {
        grandTotals[index].textContent = "Total: " + formatAUD(obj["updatedGrandTotal"]);
      }
    }
  };
  xmlhttp.open('GET'
    , 'Processes/processChangeInQuantityAndGrandTotal.php?productNumber=' + parProductNumber
    + '&updatedQty=' + parUpdatedQuantity
    + '&diff=' + parDifference
    + '&unitPrice=' + parUnitPrice
    + '&amount=' + parAmount
    , true);
  xmlhttp.send();
}

function ajaxGetDataFromServer(parProcessingServerFile, callbackFunction) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callbackFunction(JSON.parse(this.responseText));
  };
  xhr.open('POST', parProcessingServerFile, true);
  xhr.send();
}

function ajaxRemoveThisCartItem(parProductNumber, parItemCounter) {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      if (this.responseText) {
        displayMessageEmptyCart(document.querySelector("form")
          , document.querySelector(".shoppingCart"));
      }
    }
  };
  xmlhttp.open('GET', 'Processes/processRemoveOrderItem.php?productNumber='
    + parProductNumber, true);
  xmlhttp.send();
}

function createCard(parProductDetails) {
  //Create Column
  let attributeList = { class: "col-md-4 mb-4" };
  const thisColumn = createElementWithAttributes("div", attributeList);

  //Create Card
  attributeList = { class: "card h-100 product-card" };
  const thisCard = createElementWithAttributes("div", attributeList);

  //Create Card Image top
  attributeList = {
    class: "card-img-top product-image"
    , src: "images/products/" + parProductDetails["image"]
    , alt: parProductDetails["productName"]
  };
  const thisImageTop = createElementWithAttributes("img", attributeList);

  //Create Card Body
  attributeList = { class: "card-body" };
  const thisCardBody = createElementWithAttributes("div", attributeList);

  //Create Card Body.Card Title
  attributeList = { class: "card-title product-name" };
  const thisCardTitle = createElementWithAttributes("h5", attributeList);
  thisCardTitle.appendChild(document.createTextNode(parProductDetails["productName"]));
  thisCardBody.appendChild(thisCardTitle);

  //Create Category badge
  attributeList = { class: "badge bg-secondary mb-2" };
  const thisCategory = createElementWithAttributes("span", attributeList);
  thisCategory.appendChild(document.createTextNode(parProductDetails["category"]));
  thisCardBody.appendChild(thisCategory);

  //Create Card Body.Card text - Price
  attributeList = { class: "card-text price" };
  const thisCardText = createElementWithAttributes("h5", attributeList);
  thisCardText.appendChild(document.createTextNode(formatAUD(parProductDetails["price"])));
  thisCardBody.appendChild(thisCardText);

  //Create Stock status
  if (parProductDetails["stock"] > 0) {
    attributeList = { class: "text-success mb-2" };
    const stockStatus = createElementWithAttributes("p", attributeList);
    stockStatus.appendChild(document.createTextNode("In Stock (" + parProductDetails["stock"] + " available)"));
    thisCardBody.appendChild(stockStatus);
  } else {
    attributeList = { class: "text-danger mb-2" };
    const stockStatus = createElementWithAttributes("p", attributeList);
    stockStatus.appendChild(document.createTextNode("Out of Stock"));
    thisCardBody.appendChild(stockStatus);
  }

  //Create Card Body.Form
  attributeList = { action: "Processes/processProductDetails.php", method: "post" };
  const thisForm = createElementWithAttributes("form", attributeList);

  //Create Card Body.Form.Input Product Number
  attributeList = {
    class: "d-none"
    , type: "text"
    , "name": "ProductNumber"
    , "value": parProductDetails["productNumber"]
  };
  const thisInputProductNumber = createElementWithAttributes("input"
    , attributeList);
  thisForm.appendChild(thisInputProductNumber);

  //Create Card Body.Form.Input Submit
  thisForm.appendChild(createSubmitButton("btn btn-primary w-100"
    , "View Details"
    , "VIEWITEM"));
  thisCardBody.appendChild(thisForm);

  //Create the card
  thisCard.appendChild(thisImageTop);
  thisCard.appendChild(thisCardBody);
  thisColumn.appendChild(thisCard);
  return thisColumn;
}

function createContainerImage(imageLocation) {
  let attributeList = { class: "col-md-6 col-sm-12 p-0 imageContainer" };
  const containerImage = createElementWithAttributes("div", attributeList);

  attributeList = { src: imageLocation, class: "w-100", alt: "Image not loaded" };
  const thisImage = createElementWithAttributes("img", attributeList)

  containerImage.appendChild(thisImage);
  return containerImage;
}

function createContainerText(parTextDescription) {
  let attributeList = { class: "col-md-6 col-sm-12 textDescription" };
  const containerText = createElementWithAttributes("div", attributeList);

  for (element in parTextDescription) {
    switch (element) {
      case "h3":
      case "p":
        containerText.appendChild(
          createElementWithTextNode(element, parTextDescription[element])
        );
        break;
      case "linkButton":
        containerText.appendChild(
          createLinkButton(parTextDescription[element]["hyperlink"]
            , parTextDescription[element]["buttonClass"]
            , parTextDescription[element]["buttonText"])
        );
        break;
      case "ul":
      case "ol":
        containerText.appendChild(
          createList(element, parTextDescription[element]));
        break;
    }
  }
  return containerText;
}

function createContainerWithTwoColumns(parFirstElement, parSecondElement) {
  let attributeList = { class: "container-fluid" };
  const containerFluid = createElementWithAttributes("div", attributeList);

  attributeList = { class: "row" };
  const rowContainer = createElementWithAttributes("div", attributeList);

  rowContainer.appendChild(parFirstElement);
  rowContainer.appendChild(parSecondElement);
  containerFluid.appendChild(rowContainer);
  return containerFluid;
}

function createElementWithAttributes(parElement, parAttributeList) {
  const thisElement = document.createElement(parElement);

  for (attribute in parAttributeList) {
    thisAttribute = document.createAttribute(attribute);
    thisAttribute.value = parAttributeList[attribute];
    thisElement.setAttributeNode(thisAttribute);
  }
  return thisElement;
}

function createElementWithAttributesAndTextNode(parElement, parAttributeList, parTextNode) {
  const thisElement = createElementWithAttributes(parElement, parAttributeList);
  const thisTextNode = document.createTextNode(parTextNode);
  thisElement.appendChild(thisTextNode);
  return thisElement;
}

function createElementWithTextNode(parElement, parTextNode) {
  const thisNewElement = document.createElement(parElement);
  const thisTitleTextNode = document.createTextNode(parTextNode);
  thisNewElement.appendChild(thisTitleTextNode);
  return thisNewElement;
}

function createJobPost(parPostNumber
  , parJobName
  , parJobDescription
  , parSalary
  , parNegotiable
  , parJobStatus) {
  const pageJobDetails = "JobDetails.php";
  const thisJobPost = createElementWithAttributes("div", { class: "row border p-2 m-2 rounded" });
  const thisJobDataContainer = createElementWithAttributes("div", { class: "jobDataContainer col-md-4" });
  const thisJobNameLink = createElementWithAttributes("a", {
    href: pageJobDetails.concat("?postNumber="
      , parPostNumber
    )
    , target: "_blank"
  });
  const thisJobName = createElementWithAttributesAndTextNode("h5", { class: "jobName card-title fw-bold" }, parJobName);
  const thisSalary = createElementWithAttributesAndTextNode("p", { class: "salary" }, "$" + parSalary.toLocaleString());
  const thisSpanNegotiable = createElementWithAttributesAndTextNode("span", { class: "isNegotiable" }, (parNegotiable === "yes") ? " negotiable" : "");
  const thisjobStatus = createElementWithAttributesAndTextNode("p", { class: "jobStatus" }, parJobStatus);
  const thisjobDescriptionContainer = createElementWithAttributes("div", { class: "jobDescriptionContainer col-md-8" });

  const thisBriefJobDescriptionTitle = createElementWithAttributesAndTextNode("h5", { class: "card-title" }, "Brief Job Description:");
  const thisBriefJobDescription = createElementWithAttributesAndTextNode("p", { class: "card-text" }, parJobDescription);

  thisSalary.appendChild(thisSpanNegotiable);
  thisJobNameLink.appendChild(thisJobName);
  thisJobDataContainer.appendChild(thisJobNameLink);
  thisJobDataContainer.appendChild(thisSalary);
  thisJobDataContainer.appendChild(thisjobStatus);

  thisjobDescriptionContainer.appendChild(thisBriefJobDescriptionTitle);
  thisjobDescriptionContainer.appendChild(thisBriefJobDescription);

  thisJobPost.appendChild(thisJobDataContainer);
  thisJobPost.appendChild(thisjobDescriptionContainer);
  return thisJobPost;
}

function createLinkButton(parPageLink, parButtonClass, parButtonText) {
  attributeList = {
    href: parPageLink
    , class: parButtonClass
    , role: "button"
    , "aria-pressed": "false"
  };
  const thisButton = createElementWithAttributes("a", attributeList);
  const thisButtonTextNode = document.createTextNode(parButtonText);
  thisButton.appendChild(thisButtonTextNode);
  return thisButton;
}

function createList(listType, listArray) {
  const thisElement = document.createElement(listType);
  listArray.forEach(function (value, index, array) {
    thisElement.appendChild(createListItemText(value));
  });
  return thisElement;
}

function createListItemText(parText) {
  const listItem = createElementWithTextNode("li", parText);
  return listItem;
}

function createMessage(parMessage, parButtonLink) {
  let attributeList = {
    class: "message card border-secondary my-4 mx-auto"
    , style: "max-width: 18rem;"
  };
  const thisMessageCard = createElementWithAttributes("div", attributeList);

  attributeList = { class: "card-body text-center" };
  const thisMessageCardBody = createElementWithAttributes("div", attributeList);

  attributeList = { class: "card-title text-secondary" };
  const thisMessageText = createElementWithAttributes("h5", attributeList);
  thisMessageText.appendChild(document.createTextNode(parMessage));

  const thisLinkButton = createLinkButton(parButtonLink
    , "btn btn-outline-secondary mt-3"
    , "Shop Products");

  thisMessageCardBody.appendChild(thisMessageText);
  thisMessageCardBody.appendChild(thisLinkButton);
  thisMessageCard.appendChild(thisMessageCardBody);
  return thisMessageCard;
}

function createShoppingCartItem(parProductDetails) {
  let attributeList = { class: "cartItem row border border-light me-1 mb-2" };
  const thisCartItem = createElementWithAttributes("div", attributeList);

  attributeList = { class: "col-12 col-md-2 pt-md-2 text-center bg-light" };
  const thisImageContainer = createElementWithAttributes("div", attributeList);

  attributeList = {
    class: "img-fluid img-thumbnail"
    , src: "images/products/" + parProductDetails["image"]
    , alt: "Image not loaded"
  };
  const thisImage = createElementWithAttributes("img", attributeList);

  thisImageContainer.appendChild(thisImage);

  attributeList = { class: "col-6 col-md-6 pt-3" };
  const thisPickUpContainer = createElementWithAttributes("div", attributeList);
  thisPickUpContainer.appendChild(createElementWithTextNode("h6", parProductDetails["productName"]));

  const productDetails = "Brand: " + parProductDetails["brand"] + " | Category: " + parProductDetails["category"];
  thisPickUpContainer.appendChild(createElementWithTextNode("p", productDetails));

  attributeList = { class: "col-6 col-md-4 pt-3" };
  const thisAmountContainer = createElementWithAttributes("div", attributeList);

  attributeList = { class: "row" };
  const thisRowContainer = createElementWithAttributes("div", attributeList);

  attributeList = { class: "col-5 col-md-4 p-2 priceContainer" };
  const thisPriceContainer = createElementWithAttributes("div", attributeList);
  const thisPrice = createElementWithTextNode("h6", formatAUD(parProductDetails["amount"]));
  thisPrice.setAttribute("class", "amount");
  thisPriceContainer.appendChild(thisPrice);

  attributeList = { class: "col-5 col-md-6 quantityContainer" };
  const thisQuantityContainer = createElementWithAttributes("div", attributeList);

  attributeList = {
    class: "form-control shoppingCartQuantity"
    , type: "number"
    , min: "1"
    , value: parProductDetails["quantityOrdered"]
    , name: "fcQuantity"
  };
  const thisQuantityBox = createElementWithAttributes("input", attributeList);
  thisQuantityContainer.appendChild(thisQuantityBox);

  attributeList = {
    class: "removeButton btn btn-outline-danger btn-sm col-2 col-md-2 pt-md-2 text-center px-0"
    , href: "#"
  };
  const thisRemoveButton = createElementWithAttributes("button", attributeList);

  attributeList = { class: "far fa-trash-alt" };
  const thisRemoveButtonText = createElementWithAttributes("i", attributeList);
  thisRemoveButton.appendChild(thisRemoveButtonText);

  thisRowContainer.appendChild(thisPriceContainer);
  thisRowContainer.appendChild(thisQuantityContainer);
  thisRowContainer.appendChild(thisRemoveButton);

  attributeList = { class: "form-group row rowProductNumber d-none" };
  const thisProductNumberRowContainer = createElementWithAttributes("div", attributeList);

  attributeList = {
    class: "cartItemProductNumber form-control"
    , type: "text"
    , value: parProductDetails["productNumber"]
    , readonly: ""
  };
  const thisProductNumberRowContainerTextBox = createElementWithAttributes("input", attributeList);

  thisProductNumberRowContainer.appendChild(thisProductNumberRowContainerTextBox);

  attributeList = { class: "form-group row rowUnitPrice d-none" };
  const thisUnitPriceRowContainer = createElementWithAttributes("div", attributeList);

  attributeList = {
    class: "cartItemUnitPrice form-control"
    , type: "text"
    , value: parProductDetails["unitPrice"]
    , readonly: ""
  };
  const thisUnitPriceRowContainerTextBox = createElementWithAttributes("input", attributeList);

  thisUnitPriceRowContainer.appendChild(thisUnitPriceRowContainerTextBox);

  attributeList = { class: "form-group row rowQuantityOrdered d-none" };
  const thisQuantityOrderedRowContainer = createElementWithAttributes("div", attributeList);

  attributeList = {
    class: "cartItemQuantityOrdered form-control"
    , type: "text"
    , value: parProductDetails["quantityOrdered"]
    , readonly: ""
  };
  const thisQuantityOrderedRowContainerTextBox = createElementWithAttributes("input", attributeList);

  thisQuantityOrderedRowContainer.appendChild(thisQuantityOrderedRowContainerTextBox);

  thisAmountContainer.appendChild(thisRowContainer);
  thisAmountContainer.appendChild(thisProductNumberRowContainer);
  thisAmountContainer.appendChild(thisUnitPriceRowContainer);
  thisAmountContainer.appendChild(thisQuantityOrderedRowContainer);

  thisCartItem.appendChild(thisImageContainer);
  thisCartItem.appendChild(thisPickUpContainer);
  thisCartItem.appendChild(thisAmountContainer);
  return thisCartItem;
}

function createSubmitButton(parClass, parValue, parName) {
  attributeList = {
    type: "submit"
    , class: parClass
    , role: "button"
    , target: "_blank"
    , value: parValue
    , name: parName
  };
  return createElementWithAttributes("input", attributeList);
}

function createTableRow(parItemName
  , parUnitPrice
  , parQuantityOrdered
  , parTotalAmount
  , parPickUpDate
  , parPickUpTime) {
  const thisTableRow = document.createElement("tr");
  let thisTableData = createElementWithTextNode("td", parItemName);
  thisTableRow.appendChild(thisTableData);

  thisTableData = createElementWithTextNode("td", formatAUD(parUnitPrice));
  thisTableRow.appendChild(thisTableData);

  thisTableData = createElementWithTextNode("td", parQuantityOrdered);
  thisTableRow.appendChild(thisTableData);

  thisTableData = createElementWithTextNode("td", formatAUD(parTotalAmount));
  thisTableRow.appendChild(thisTableData);

  thisTableData = createElementWithTextNode("td", parPickUpDate);
  thisTableRow.appendChild(thisTableData);

  thisTableData = createElementWithTextNode("td", parPickUpTime);
  thisTableRow.appendChild(thisTableData);

  return thisTableRow;
}

function displayMessageEmptyCart(parThisForm, parThisShoppingCartContainer) {
  thisForm.style.display = 'none';
  thisShoppingCartContainer.appendChild(createMessage('Your cart is empty'
    , 'products.php'));
}

function formatAUD(parAmount) {
  const locale = "en-US";
  const currencyCode = "USD";
  const dollarAU = Intl.NumberFormat(locale, {
    style: "currency"
    , currency: currencyCode
  });

  return dollarAU.format(parAmount)
}

function formatDateTimeOrderSummary(parDateTime) {
  let formattedDateTime = "";
  formattedDateTime = formatDateDDMMMMYYYY(parDateTime)
    .concat(", "
      , formatTimeHHMM(parDateTime)
    );
  return formattedDateTime;
}

function formatDateDDMMMMYYYY(parDateTime) {
  return new Date(parDateTime)
    .toLocaleDateString('en-AU'
      , {
        month: 'long'
        , day: 'numeric'
        , year: 'numeric'
      }
    );
}

function formatTimeHHMM(parDateTime) {
  return new Date(parDateTime)
    .toLocaleTimeString('en-AU'
      , {
        hour: 'numeric'
        , minute: 'numeric'
      }
    );
}

function getPostNumberFromURL(parQueryString) {
  const params = new URLSearchParams(parQueryString);
  let thisPostNumber = 0;

  for (postNumber of params.values()) {
    thisPostNumber = postNumber;
  }

  return thisPostNumber;
}

function removeItemFromCart(parThisElement) {
  const thisCartItem = parThisElement.closest(".cartItem");
  const unitPrice = thisCartItem.querySelector('.cartItemUnitPrice').value;
  const quantityOrdered = thisCartItem.querySelector('.cartItemQuantityOrdered').value;
  const difference = 0 - quantityOrdered;
  const productNumber = thisCartItem.querySelector('.cartItemProductNumber').value;
  const amount = unitPrice * quantityOrdered;

  ajaxChangeQuantityAndGrandTotal(productNumber, quantityOrdered, difference, unitPrice, amount);
  ajaxRemoveThisCartItem(productNumber);
  thisCartItem.remove();

  let myItems = document.querySelectorAll(".cartItemProductNumber");
  for (var i = 0; i < myItems.length; i++) {
    myItems[i].name = "productNumber[" + i + "]";
  }
}

// 注意: computerForce.jsにもsetFooterCurrentYearがありますが、
// template.jsのgetCurrentYear関数と統合します
function setFooterCurrentYear() {
  const yearElements = document.querySelectorAll(".currentYear");
  yearElements.forEach(element => {
    element.textContent = getCurrentYear();
  });
}

function setPageTitle(parCurrentPage) {
  const titleElements = document.querySelectorAll(".pageTitle");
  titleElements.forEach(element => {
    element.innerHTML = "Computer Force | " + parCurrentPage;
  });

  // ドキュメントタイトルも設定
  document.title = "Computer Force | " + parCurrentPage;
}

function filterProducts(category) {
  const products = document.querySelectorAll('.product-card');
  products.forEach(product => {
    if (category === 'all' || product.querySelector('.badge').textContent === category) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

function searchProducts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const products = document.querySelectorAll('.product-card');

  products.forEach(product => {
    const productName = product.querySelector('.product-name').textContent.toLowerCase();
    const productDesc = product.querySelector('.product-desc')?.textContent.toLowerCase() || '';

    if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

function sortProducts(criteria) {
  const container = document.querySelector('.products-container');
  const products = Array.from(container.querySelectorAll('.product-card'));

  products.sort((a, b) => {
    if (criteria === 'price-asc') {
      const priceA = parseFloat(a.querySelector('.price').textContent.replace(/[^0-9.-]+/g, ""));
      const priceB = parseFloat(b.querySelector('.price').textContent.replace(/[^0-9.-]+/g, ""));
      return priceA - priceB;
    } else if (criteria === 'price-desc') {
      const priceA = parseFloat(a.querySelector('.price').textContent.replace(/[^0-9.-]+/g, ""));
      const priceB = parseFloat(b.querySelector('.price').textContent.replace(/[^0-9.-]+/g, ""));
      return priceB - priceA;
    } else if (criteria === 'name-asc') {
      const nameA = a.querySelector('.product-name').textContent.toLowerCase();
      const nameB = b.querySelector('.product-name').textContent.toLowerCase();
      return nameA.localeCompare(nameB);
    }
    return 0;
  });

  products.forEach(product => container.appendChild(product));
}