const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Use a CORS proxy to avoid CORS policy errors (appeared when trying to fetch data from the api w/out a proxy)

// Api links
const apiv3 = 'https://aggregation-challenge.esedsl.com/v3';
const apiv2 = 'https://aggregation-challenge.esedsl.com/v2';
const apiv1 = 'https://aggregation-challenge.esedsl.com/v1';


function updateProperties(data) {
    // Update properties of the data object recursively
    if (Array.isArray(data)) {
        return data.map(item => updateProperties(item));
    } else if (typeof data === 'object' && data !== null) {
        const newData = { ...data };
        if ('tag' in newData) {
            newData.family = newData.tag; // Rename "tag" to "family"
            delete newData.tag; // Remove the original "tag" field
        }
        if('category' in newData){
            newData.family = newData.category; // Rename "category" to "family"
            delete newData.category; // Remove the original "category" field
        }
        if('weight' in newData){
            newData.mass = newData.weight; // Rename "weight" to "mass"
            delete newData.weight; // Remove the original "weight" field
        }
        if('weight_unit' in newData){
            newData.mass_unit = newData.weight_unit; // Rename "weight_unit" to "mass_unit"
            delete newData.weight_unit; // Remove the original "weight_unit" field
        }
        // Recursively update nested objects or arrays
        Object.keys(newData).forEach(key => {
            newData[key] = updateProperties(newData[key]);
        });
        return newData;
    }
    return data;
}

function adduser(data){
    // Add a new property "user" with the value "Anonymous" to the data object recursively
    if (Array.isArray(data)) {
        return data.map(item => adduser(item));
    } else if (typeof data === 'object' && data !== null) {
        const newData = { ...data };
        if (!('user' in newData)) {
            newData.user = 'Anonymous'; // Add a new property "user" with the value "Anonymus"
        }
        // Recursively update nested objects or arrays
        Object.keys(newData).forEach(key => {
            newData[key] = adduser(newData[key]);
        });
        return newData;
    }
    return data;
}


async function fetchWithRetry(url, retries, delay) {
    try {
        const response = await fetch(url);
        if (response.ok) return response.json(); // Success case
        if (response.status === 500 && retries > 0) { // Retry on server error
            console.log(`Retry ${url}, attempts left: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, retries - 1, delay);
        }
        throw new Error(`Request failed with status ${response.status}`);
    } catch (error) {
        if (retries > 0) { // Retry on fetch errors
            console.log(`Retry ${url}, attempts left: ${retries}, due to error: ${error}`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, retries - 1, delay);
        }
        console.error(`Error in the url: ${url}: `, error);
        throw error;
    }
}

async function getAggregationData() {
    const apiUrls = [apiv1, apiv2, apiv3];
    const retries = 10;
    const delay = 1000;
    try {
        const outputElement = document.getElementById('output');
        outputElement.innerHTML = '<div>Loading data...</div>'; 

        const fetchPromises = apiUrls.map(url => fetchWithRetry(proxyUrl + url, retries, delay));
        const dataArray = await Promise.all(fetchPromises);

        console.log(`Original data from:`, dataArray); // Debug log

        const transformedDataArray = dataArray
            .filter(item => item !== null)
            .map(updateProperties)
            .map(adduser);

        console.log("Transformed data:", transformedDataArray); // Debug log

        const aggregatedData = transformedDataArray.reduce((acc, data) => acc.concat(data), []);

        // Crear tabla y encabezados
        const table = document.createElement('table');
        table.className = 'table';
        const thead = table.createTHead();
        const row = thead.insertRow();
        const headers = ["Family", "Name", "Path", "User", "Mass", "Mass Unit"];
        headers.forEach(headerText => {
            let header = document.createElement("th");
            header.textContent = headerText;
            row.appendChild(header);
        });

        // Add data to the table
        const tbody = table.createTBody();
        aggregatedData.forEach(item => {
            const row = tbody.insertRow();
            const cellFamily = row.insertCell();
            cellFamily.textContent = item.family;
            const cellName = row.insertCell();
            cellName.textContent = item.name;
            const cellPath = row.insertCell();
            cellPath.textContent = item.path;
            const cellUser = row.insertCell();
            cellUser.textContent = item.user;
            const cellWeight = row.insertCell();
            cellWeight.textContent = item.mass;
            const cellWeightUnit = row.insertCell();
            cellWeightUnit.textContent = item.mass_unit;
        });

        // Update DOM with the table
        outputElement.innerHTML = ''; // Clean bfore content
        outputElement.appendChild(table); 

        return aggregatedData;
    } catch (error) {
        console.error("Error aggregating data:", error);
        return []; // Return an empty array or appropriate error handling
    }
}
getAggregationData();