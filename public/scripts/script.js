// constants
var universal_shipping_cost = 0
var universal_tax_rate = 0.0925
var universal_promo = 0

var isAdmin = false;

// make interactions happen only after window loads
window.onload = async () => {
    // document elements
    /* w3 schools modal interpretation */
    const modal = document.getElementById('myModal');
    const btn = document.getElementById('custom_part_button')
    const spans = document.querySelectorAll('span.close, button.close')
    // add event listener for modal close 'close' button
    btn.addEventListener('click', function() {
        modal.style.display="block"
    });
    [...spans].forEach(span => {
        span.addEventListener('click', function() {
            modal.style.display="none"
        })
    })
    
    window.onclick = function(event) {
        if(event.target == modal) {
            modal.style.display = 'none'
        }
    }

    // load chosen part data from local storage data
    let chassis_data, switches_data, keycaps_data, custom_part_data;
    const chassis_selection_id = localStorage.getItem('chassis_selection')
    if(chassis_selection_id !== null && chassis_selection_id !== undefined) {
        // fetch chassis data
        const chassis_response = await fetch(`/data/${chassis_selection_id}`);
        chassis_data = await chassis_response.json();
        chassis_data.component_type = 'chassis'
        loadDataIntoTableRow('chassis_container', chassis_data);
    } else {
        // load add button into the row
        loadAddButtonIntoTableRow('chassis_container', 'Add Chassis');
    }

    const switches_selection_id = localStorage.getItem('switches_selection');
    if(switches_selection_id !== null && switches_selection_id !== undefined) {
        // query db for switch data
        const switches_response = await fetch(`/data/switches/${switches_selection_id}`);
        switches_data = await switches_response.json();
        let keyswitch_packs_needed_to_build;

        // only switches need quantities. Switchb quantity depends on how many keys your chassis has.
        if(chassis_data) {
            keyswitch_packs_needed_to_build = Math.ceil(chassis_data.number_of_keys / switches_data.quantity)
        } else {
            keyswitch_packs_needed_to_build = 1
        }
        switches_data.component_type = 'switches'
        switches_data.quantity_needed = keyswitch_packs_needed_to_build;
        loadDataIntoTableRow('switches_container', switches_data, Math.ceil(keyswitch_packs_needed_to_build));
    } else {
        loadAddButtonIntoTableRow('switches_container', 'Add Switches');
    }
    // load chosen keycap data from local storage keycaps id
    const keycaps_selection_id = localStorage.getItem('keycaps_selection')
    if(keycaps_selection_id !== null && keycaps_selection_id !== undefined) {
        console.log();
        const keycaps_response = await fetch(`/data/keycaps/${keycaps_selection_id}`);
        if(keycaps_response.status !== 404) {
            keycaps_data = await keycaps_response.json()
            keycaps_data.component_type = 'keycaps'
            loadDataIntoTableRow('keycaps_container', keycaps_data); 
        } else {
            alert('Could not find keycap data')
        }
        
    } else {
        loadAddButtonIntoTableRow('keycaps_container', 'Add Key Caps')
    }
    // get custom parts
    custom_part_data = JSON.parse(localStorage.getItem('custom_parts'));
    if(custom_part_data !== null) {
        console.log('Part data found. Loading now...')
        console.log(custom_part_data);
        let idx = 0
        for(let part of custom_part_data) {
            // const first_item = custom_part_data[0];
            console.log(part);        
            const new_row = document.createElement('tr');
            new_row.id = 'custom-part-'+String(idx) // ('id', 'custom-part');
            // custom_part_container.appendChild(new_row);
            part.price = Number(part.custom_part_price);
            document.querySelector('#builder-table-rows').insertBefore(new_row, document.querySelector('#custom_part_form_container'));
            loadDataIntoCustomTableRow('custom-part-'+String(idx), part)
            idx += 1
        }
        
    }



    // add event listener for custom part add form
    const custom_part_form = document.getElementById('add-custom-part-form');
    custom_part_form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let kvpairs = []
        const custom_form_elements = custom_part_form.elements
        console.log(custom_form_elements);
        [...custom_form_elements].forEach(element => {
            if(element instanceof HTMLSelectElement ||
                element instanceof HTMLInputElement) {

                    kvpairs.push(encodeURIComponent(element.name)+'='+encodeURIComponent(element.value))
            }
        })
        // console.log(kvpairs.join('&'));
        fetch('/client/add-part', {

            method: 'POST',
            redirect: 'follow',
            body: new URLSearchParams(kvpairs.join('&'))
        }).then(response => {
            // HTTP 301 response
            // setCookie('custom_part', '', 14)
        }).catch(err => {
            console.info(err + " url: " + '/client/add-part')
        })
        // retreive local custom parts
        let prevCustomParts = JSON.parse(localStorage.getItem('custom_parts'))
        // create new custom part data
        let y = new FormData(custom_part_form);
        let yentries = [...y.entries()]
        let newEntry = {}
        for(const pair of yentries) {
            newEntry[pair[0]] = pair[1];
        }
        newEntry._id = uid(); // generate a somewhat unique id for this custom part. Hopefully it doesn't collide with other IDs. 
        // if there were no previous custom parts, create new array with this as its only entry. otherwise, append to it. . 
        if(prevCustomParts === null) {
            
            prevCustomParts = [
                newEntry
            ]
        } else {
            prevCustomParts.push(newEntry);
        }
        localStorage.setItem('custom_parts', JSON.stringify(prevCustomParts))
        window.location.href = '/'; // refresh page

    })

    const totals = getTotal([chassis_data, switches_data, keycaps_data].concat(custom_part_data))
    document.querySelector('#base_total').innerText = totals[0].toFixed(2)
    document.querySelector('#tax_total').innerText = totals[1].toFixed(2);
    document.querySelector('#grand_total').innerText = totals[4].toFixed(2);

    const admin_box = document.getElementById('admin-container')
    if(isAdmin) {
        admin_box.classList.remove('hidden')
    } else {
        admin_box.classList.add('hidden');
    }
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
function loadDataIntoCustomTableRow(tableRowIdString, dataDict, quantity=1) {
    console.log(tableRowIdString);
    const container = document.getElementById(tableRowIdString);
    console.log(container);
    const basePrice = Number(dataDict.price)
    const shippingPrice = Number(universal_shipping_cost);
    const tax = Math.round(basePrice*quantity * universal_tax_rate*100)/100;
    const promo = universal_promo
    const total = Math.round((dataDict.custom_part_price)*100)/100;
    // add chosen part data to DOM
    // const container = document.getElementById('switches_container')
    const td1 = document.createElement('td')
    const td2 = document.createElement('td')
    const td3 = document.createElement('td')
    const td4 = document.createElement('td')
    const td5 = document.createElement('td')
    const td6 = document.createElement('td')
    const td7 = document.createElement('td')
    const td8 = document.createElement('td')
    const td9 = document.createElement('td')
    const td10 = document.createElement('td')
    td1.innerText = `${dataDict.custom_part_type}`
    td2.innerText = String(dataDict.custom_part_name);
    td3.innerText = ''
    td4.innerText = ''
    td5.innerText = '';
    td6.innerText = ''
    td8.innerText = Number(dataDict.custom_part_price).toFixed(2);
    const maxDisplayLength = 20;
    let urlconstructed;
    try {
        urlconstructed = new URL(dataDict.custom_part_hyperlink)
    } catch {
        urlconstructed = null;
    }
    const hostname = urlconstructed ? urlconstructed.hostname : 'Custom Link'
    const displayString = hostname.substring(0, Math.min(maxDisplayLength, hostname.length));


    td9.innerHTML = `<a href='${dataDict.custom_part_hyperlink}'>${displayString}</a>`
    td10.innerHTML = `<span class='close' onclick='removeSelf("custom", "${dataDict._id}")' >&times;</span>`
    container.appendChild(td1)
    container.appendChild(td2)
    container.appendChild(td3)
    container.appendChild(td4)
    container.appendChild(td5)
    container.appendChild(td6)
    container.appendChild(td7)
    container.appendChild(td8)
    container.appendChild(td9)
    container.appendChild(td10);
}
function loadDataIntoTableRow(tableRowIdString, dataDict, quantity=1) {
        console.log(tableRowIdString);
        console.log(dataDict);
        const container = document.getElementById(tableRowIdString);
        console.log(container);
        const basePrice = Number(dataDict.price)
        const shippingPrice = Number(universal_shipping_cost);
        const tax = Math.round(basePrice*quantity * universal_tax_rate*100)/100;
        const promo = universal_promo
        const total = Math.round((basePrice*quantity+shippingPrice + tax - promo)*100)/100;
        // add chosen part data to DOM
        // const container = document.getElementById('switches_container')
        const td1 = document.createElement('td')
        const td2 = document.createElement('td')
        const td3 = document.createElement('td')
        const td4 = document.createElement('td')
        const td5 = document.createElement('td')
        const td6 = document.createElement('td')
        const td7 = document.createElement('td')
        const td8 = document.createElement('td')
        const td9 = document.createElement('td');
        td1.innerText = `${dataDict.brand_name} ${dataDict.component_name}${dataDict.quantity ? ' (' + dataDict.quantity + ' pack)' : ''}`
        td2.innerText = String(basePrice);
        td3.innerText = quantity
        td4.innerText = promo.toFixed(2);
        td5.innerText = shippingPrice.toFixed(2);
        td6.innerText = tax.toFixed(2);
        td7.innerText = total.toFixed(2);
        td8.innerHTML = `<a href='${dataDict.hyperlink}'>${dataDict.vendor_name}</a>`
        td9.innerHTML = `<span class='close' onclick="removeSelf('${dataDict.component_type}','${dataDict._id}')">&times;</span>`
        container.appendChild(td1)
        container.appendChild(td2)
        container.appendChild(td3)
        container.appendChild(td4)
        container.appendChild(td5)
        container.appendChild(td6)
        container.appendChild(td7)
        container.appendChild(td8)
        container.appendChild(td9);
}

function loadAddButtonIntoTableRow(tableRowIdString, displaymessage) {
    const add_button = document.createElement('td')
    let href = '';
    switch(tableRowIdString) {
        case 'chassis_container':
            href='chassis_selection';
            break;
        case 'switches_container':
            href= 'switches_selection';
            break;
        case 'keycaps_container':
            href='keycaps_selection';
            break;
        case 'custom_part_form_container':
        default:
            href='/'
            break;
    }
    add_button.innerHTML = `<a class='add_button' href='${href}'>${displaymessage}</a>`
    const rowElement = document.getElementById(tableRowIdString)
    rowElement.appendChild(add_button);
    // get the number of elements in the head row of the table. 
    const parentTable = rowElement.parentElement

    const numberOfElementsNecessary = 10// rowElement.parentElement.querySelector('thead').querySelector('tr').children.length; 
    for(let i = 2; i < numberOfElementsNecessary; i++) {
        const dummyElement = document.createElement('td');
        rowElement.appendChild(dummyElement);
    }
}


function getTotal(arr){
    let basetotal = 0
    let taxtotal = 0
    let shippingtotal = 0
    let promototal = 0
    arr.forEach(dataset => {
        
        // if(dataset.quantity) {
        //     qty = dataset.quantity;
        // }
        if(dataset !== undefined && dataset !== null) {
            console.log(dataset);
            let qty = 1;
            if(dataset.quantity_needed) {
                qty = dataset.quantity_needed;
            }
            basetotal += dataset.price * qty
            taxtotal += dataset.price * qty * universal_tax_rate
            // shippingtotal += universal_shipping_cost
            // promototal += universal_promo;
        }
    })
    let grandtotal = basetotal + taxtotal + shippingtotal + promototal
    console.log(basetotal);
    console.log(taxtotal);
    console.log(grandtotal);
    return [basetotal, taxtotal, shippingtotal,promototal, grandtotal]
}

function flashCustomPartModal() {
    
}

function clearCart() {
    localStorage.removeItem('chassis_selection')
    localStorage.removeItem('switches_selection')
    localStorage.removeItem('keycaps_selection')
    localStorage.removeItem('custom_parts')
}

function removeSelf(component_type,id) {
    console.log(component_type, id);
    switch(component_type) {
        case 'custom':
            console.log('Removing custom part...');
            let prevCustomParts = JSON.parse(localStorage.getItem('custom_parts'))
            if(prevCustomParts.length > 1) {

                prevCustomParts = prevCustomParts.filter(part => part._id !== id);
                localStorage.setItem('custom_parts', JSON.stringify(prevCustomParts))
            } else {
                localStorage.removeItem('custom_parts');
            }
            break;
        case 'chassis':
            console.log('Removing chassis selection...')
            localStorage.removeItem('chassis_selection');
            break;
        case 'switches':
            console.log('Removing switches selection...');
            localStorage.removeItem('switches_selection');
            break;
        case 'keycaps':
            console.log('Removing keycaps selection...');
            localStorage.removeItem('keycaps_selection');
            break;
        default:
            alert('Error occurred.')
            break;
    }
    // refresh page .
    window.location.href = '/';
}

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}