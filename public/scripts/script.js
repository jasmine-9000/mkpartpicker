var universal_shipping_cost = 0
var universal_tax_rate = 0.0925
var universal_promo = 0
window.onload = async () => {
    let partButtons = document.querySelectorAll('.add-part');
    [...partButtons].forEach(button => {
        button.addEventListener('click', (e) => {
            console.log(e.target.dataset);
            console.log(e.target.dataset.partClass);
            console.log(e.target.dataset['partClass']);
            console.log("you clicked me")
        })
    })
    // load chosen part data from cookie data
    const chassis_selection_id = getCookie('chassis_selection')
    if(chassis_selection_id !== null && chassis_selection_id !== undefined) {

        console.log(chassis_selection_id)
        const chassis_response = await fetch(`/data/${chassis_selection_id}`);
        const chassis_data = await chassis_response.json();
        console.log(chassis_data)
        loadDataIntoTableRow('chassis_container', chassis_data);
    } else {
        const add_button = document.createElement('td')
        add_button.innerHTML = `<a class='add_button' href='chassis_selection'>Add Chassis</a>`
        document.getElementById('chassis_container').appendChild(add_button);
    }
    // load chosen chassis data from cookie id.
    const switches_selection_id = getCookie('switches_selection'); // cookie has switch ID.
    if(switches_selection_id !== null && switches_selection_id !== undefined) {
        console.log('Switch ID: ' + switches_selection_id)
        // query db for switch data
        const switches_response = await fetch(`/data/switches/${switches_selection_id}`);
        const switches_data = await switches_response.json();
        console.log(switches_data)
        loadDataIntoTableRow('switches_container', switches_data);
    } else {
        const add_button = document.createElement('td')
        add_button.innerHTML = `<a class='add_button' href='switches_selection'>Add Switches</a>`
        document.getElementById('switches_container').appendChild(add_button);
    }
    // load chosen keycap data from cookie id
    const keycaps_selection_id = getCookie('keycaps_selection')
    if(keycaps_selection_id !== null && keycaps_selection_id !== undefined) {
        console.log();
        const keycaps_response = await fetch(`/data/keycaps/${keycaps_selection_id}`);
        if(keycaps_response.status !== 404) {
            const keycaps_data = await keycaps_response.json()
            loadDataIntoTableRow('keycaps_container', keycaps_data); 
        } else {
            alert('Could not find keycap data')
        }
        
    } else {
        const add_button = document.createElement('td');
        add_button.innerHTML = `<a class='add_button' href='keycaps_selection'>Add Key Caps</a>`
        document.getElementById('keycaps_container').appendChild(add_button);
    }
    
}

function setDummyCookie() {
    setCookie('meow', '123',0.000347222)
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date(); // default value is now
    d.setTime(d.getTime() + (exdays*24*60*60*1000))
    let expires = `expires=${d.toUTCString()}`
    document.cookie = `${cname}=${cvalue};${expires};path=/`
}

function getCookie(cname) {
    let match = document.cookie.match(new RegExp('(^| )' + cname + '=([^;]+)'));
    if (match) return match[2];

}
function clearCookies() {
    console.log("meowwww");
    document.cookie = 'chassis_selection=;Max-Age=0'
    document.cookie = 'switches_selection=;Max-Age=0'
    document.cookie = 'keycaps_selection=;Max-Age=0'
    console.log(document.cookie)
}

function loadDataIntoTableRow(tableRowIdString, dataDict) {
        const container = document.getElementById(tableRowIdString);
        const basePrice = Number(dataDict.price)
        const shippingPrice = Number(universal_shipping_cost);
        const tax = Math.round(basePrice * universal_tax_rate*100)/100;
        const promo = universal_promo
        const total = Math.round((basePrice+shippingPrice + tax - promo)*100)/100;
        // add chosen part data to DOM
        // const container = document.getElementById('switches_container')
        const td1 = document.createElement('td')
        const td2 = document.createElement('td')
        const td3 = document.createElement('td')
        const td4 = document.createElement('td')
        const td5 = document.createElement('td')
        const td6 = document.createElement('td')
        const td7 = document.createElement('td')
        td1.innerText = `${dataDict.brand_name} ${dataDict.component_name}`
        td2.innerText = String(basePrice);
        td3.innerText = String(promo);
        td4.innerText = String(shippingPrice);
        td5.innerText = String(tax);
        td6.innerText = String(total);
        td7.innerHTML = `<a href='${dataDict.hyperlink}'>${dataDict.vendor_name}</a>`
        container.appendChild(td1)
        container.appendChild(td2)
        container.appendChild(td3)
        container.appendChild(td4)
        container.appendChild(td5)
        container.appendChild(td6)
        container.appendChild(td7)
}