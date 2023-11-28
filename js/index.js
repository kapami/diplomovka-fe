let itemsContainer = document.getElementById("itemsContainer");

function sendJson() {
    const jsonInput = document.getElementById('jsonInput').value;

    fetch('https://cloud-assistant-be.onrender.com/process-json', {
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