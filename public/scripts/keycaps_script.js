var universal_shipping_cost = 0
var universal_tax_rate = 0.0925
var universal_promo = 0
window.onload = async () => {
    // console.log("not implemented")
    const response = await fetch('/data/keycaps');
    const data  = await response.json();
    console.log(data);
    const table = document.getElementById('keycap-table')
    data.forEach(dKey => {
        const newRow = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');
        const td5 = document.createElement('td');
        const td6 = document.createElement('td');
        const td7 = document.createElement('td');
        const td8 = document.createElement('td');
        const td9 = document.createElement('td');
        const td10 = document.createElement('td');
        const td11 = document.createElement('td');
        const td12 = document.createElement('td');
        const td13 = document.createElement('td');

        const baseTotal = dKey.price
        // const pricePerSwitch = Math.round(Number(baseTotal) / Number(dKey.quantity) * 100) / 100
        const tax = Math.round(Number(baseTotal) * universal_tax_rate*100) / 100;
        const shipping = universal_shipping_cost;
        const promo = universal_promo;
        
        td1.innerHTML = dKey.brand_name;
        td2.innerText = dKey.component_name;
        td3.innerText = String(dKey.price);
        td4.innerText = String(tax)
        td5.innerText = String(shipping);
        td6.innerText = String(promo);
        td7.innerText = String(Math.round((tax + baseTotal + shipping - promo)*100)/100);
        td8.innerHTML= `<a href='${dKey.hyperlink}'>${dKey.vendor_name}</a>`
        let starDisplay = ''
        for(let i = 0; i < 5; i++) {
            starDisplay += '&#11088;'
        }
        td9.innerHTML = starDisplay;
        td10.innerHTML = `<a class='add_button' data-part-uuid='${dKey._id}' href='#'>Add</a>`
        newRow.appendChild(td1);
        newRow.appendChild(td2);
        newRow.appendChild(td3);
        newRow.appendChild(td4);
        newRow.appendChild(td5);
        newRow.appendChild(td6);
        newRow.appendChild(td7);
        newRow.appendChild(td8);
        newRow.appendChild(td9);
        newRow.appendChild(td10);
        newRow.appendChild(td11);
        newRow.appendChild(td12);
        newRow.appendChild(td13);
        table.appendChild(newRow);

    })
    // make add buttons work
    const add_buttons = document.querySelectorAll('.add_button')
    add_buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault()
            // console.log(e.target.dataset.partUuid);
            setCookie('keycaps_selection', e.target.dataset.partUuid,14);
            window.location.href='/'
        })
    })

}