
// JSON containing multiple items
// let json = [
//     {
//         "name": "Item 1",
//         "description": "This is item 1",
//         "price": 10
//     },
//     {
//         "name": "Item 2",
//         "description": "This is item 2",
//         "price": 20
//     },
//     {
//         "name": "Item 3",
//         "description": "This is item 3",
//         "price": 30
//     }
// ];
//
// // Get the search box, button, and items container elements
// let searchBox = document.getElementById("jsonInput");
// let showItemsButton = document.getElementById("showItemsButton");
//
// // Add event listener to button
// showItemsButton.addEventListener("click", function() {
//     // Remove the hide class from the items container
//     itemsContainer.classList.remove("hide");
//     searchBox.classList.add("hide");
//     showItemsButton.classList.add("hide");
//
//     // Clear any existing items
//     itemsContainer.innerHTML = "";
//
//     // Get the search term
//     let searchTerm = searchBox.value.toLowerCase();
//
//     // Filter the JSON array based on the search term
//     let filteredItems = json.filter(function(item) {
//         return item.name.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm);
//     });
//
//     // Loop through the filtered items
//     filteredItems.forEach(function(item) {
//         // Create a new element to display the item
//         let itemElement = document.createElement("div");
//         itemElement.className = "item";
//
//         // Create child elements to display the attributes (name, description, price)
//         let nameElement = document.createElement("h2");
//         nameElement.textContent = item.name;
//
//         let descriptionElement = document.createElement("p");
//         descriptionElement.textContent = item.description;
//
//         let priceElement = document.createElement("p");
//         priceElement.className = "price";
//         priceElement.textContent = "Price: $" + item.price;
//
//         // Append the child elements to the item element
//         itemElement.appendChild(nameElement);
//         itemElement.appendChild(descriptionElement);
//         itemElement.appendChild(priceElement);
//
//         // Append the item element to the container
//         itemsContainer.appendChild(itemElement);
//     });
// });


//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////


let itemsContainer = document.getElementById("itemsContainer");

function sendJson() {
    const jsonInput = document.getElementById('jsonInput').value;

    fetch('http://localhost:8080/process-json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonInput
    })
        .then(response => response.json())
        .then(data => displayOutput(data))
        .catch(error => console.error('Error:', error));
}

function displayOutput(data){

    // Clear all already displayed items
    itemsContainer.innerHTML = "";

    const resources = data.Resources;
    for (const key in resources) {
        console.log(key);
        const resource = resources[key];
        console.log(resource);

        // Create div block per item
        let itemElement = document.createElement("div");
        itemElement.className = "block";

        // Create child elements to display the attributes (name, description, price)
        let nameElement = document.createElement("h2");
        nameElement.textContent = key;


        // Type element
        let typeElement = document.createElement("p");
        let strongType = document.createElement("strong");
        strongType.textContent = "Type: ";
        typeElement.appendChild(strongType);
        typeElement.appendChild(document.createTextNode(resource.Type));


        // Price element
        let priceElement = document.createElement("p");
        let strongPrice = document.createElement("strong");
        strongPrice.textContent = "Price: ";
        priceElement.appendChild(strongPrice);
        priceElement.appendChild(document.createTextNode(resource.Price !== undefined ? `${resource.Price}` : 'not available'));

        let buttonContainerEl = document.createElement("div");
        buttonContainerEl.className = "button-container";
        let additionalDetailsButtonEl = document.createElement("button");
        additionalDetailsButtonEl.className = "button";
        additionalDetailsButtonEl.textContent = "Show additional details";
        additionalDetailsButtonEl.onclick = function () {toggleAdditionalContent(this)};
        buttonContainerEl.appendChild(additionalDetailsButtonEl);

        let propertiesContainer = document.createElement('div');
        propertiesContainer.className = 'additional-content'
        propertiesContainer.style.display = "none";
        createPropertyElements(resource, propertiesContainer);



        itemElement.appendChild(nameElement);
        itemElement.appendChild(typeElement);
        itemElement.appendChild(priceElement);
        itemElement.appendChild(buttonContainerEl);
        itemElement.appendChild(propertiesContainer);

        itemsContainer.appendChild(itemElement);
    }
}

function createPropertyElements(obj, parentElement, level = 0) {
    for (const key in obj) {
        if (key !== 'Type' && key !== 'Price') {
            if (typeof obj[key] === 'object' && key !== 'Properties') {
                let newParentElement = document.createElement('div');
                newParentElement.style.marginLeft = `${level * 20}px`;
                let strongKey = document.createElement('strong');
                strongKey.textContent = `${key}: `;
                newParentElement.appendChild(strongKey);
                parentElement.appendChild(newParentElement);
                createPropertyElements(obj[key], newParentElement, level + 1);
            } else if (key === 'Properties') {
                let propertiesObject = obj[key];
                let propertiesHeader = document.createElement('div');
                propertiesHeader.style.marginLeft = `${level * 20}px`;
                let strongProperties = document.createElement('strong');
                strongProperties.textContent = `${key}: `;
                propertiesHeader.appendChild(strongProperties);
                parentElement.appendChild(propertiesHeader);
                createPropertyElements(propertiesObject, parentElement, level + 1);
            } else {
                let propertyElement = document.createElement('p');
                propertyElement.style.marginLeft = `${level * 20}px`;
                let strongProperty = document.createElement('strong');
                strongProperty.textContent = `${key}: `;
                propertyElement.appendChild(strongProperty);
                propertyElement.appendChild(document.createTextNode(obj[key]));
                parentElement.appendChild(propertyElement);
            }
        }
    }
}

function toggleAdditionalContent(button) {
    var additionalContent = button.parentNode.nextElementSibling;
    if (additionalContent.style.display === 'none') {
        additionalContent.style.display = 'block';
        button.textContent = 'Hide Additional Content';
    } else {
        additionalContent.style.display = 'none';
        button.textContent = 'Show additional details';
    }
}