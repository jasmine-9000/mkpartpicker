var tax_rate = 0.0925
var shipping_for_all_vendors = 0
var l = 0
class ChassisOption {
    constructor(textRepresentation) {
        this.txt = textRepresentation
        let l = this.txt.split(',')
        this.brandname = l[0]
        this.fullname = l[1]
        this.numberofkeys = l[2]
        this.keyboardlayout = l[3]
        this.price = l[4]
        this.vendorname = l[5]
        this.hyperlink = l[6]
    }

}
// let sampleChassisOptions = [
//     new ChassisOption('Monsgeek,M5,108,Full Size,false,129.99'),
//     new ChassisOption('Monsgeek,M3,87,TKL,false,109.99'),
//     new ChassisOption('Monsgeek,M2,98,1800 compact,false,109.99'),
//     new ChassisOption('idobao,IDOBAO ID80 V2 MX Mechanical Keyboard Barebone Kit,84,75%,false,179.00')
// ]
window.onload = async () => {
    let mt = document.getElementById('main-table')
    let chassisOptions = []
    let chassisOptionsFetchRequest = await fetch('/data')
    let response = await chassisOptionsFetchRequest.json();
    console.log(response)
    // response.split('\r\n').forEach(item => {
    //     chassisOptions.push(new ChassisOption(item))
    // })
    chassisOptions = response
    l = response
    chassisOptions.forEach(c => {
        let tr = document.createElement('tr')
        let td1 = document.createElement('td')
        let td2 = document.createElement('td')
        let td3 = document.createElement('td')
        let td4 = document.createElement('td')
        let td5 = document.createElement('td')
        let td6 = document.createElement('td')
        let td7 = document.createElement('td')
        let td8 = document.createElement('td')
        let td9 = document.createElement('td')
        let td10 = document.createElement('td')
        td1.innerText = c.brand_name
        td2.innerText = c.component_name
        td3.innerText = c.number_of_keys
        td4.innerText = c.keyboard_layout
        td5.innerText = c.price
        td6.innerText = (Math.round(Number(c.price) * tax_rate*100)/100).toFixed(2)
        td7.innerText = String(shipping_for_all_vendors.toFixed(2))
        td8.innerText = (c.price*(1+0.0925)+shipping_for_all_vendors).toFixed(2)
        td9.innerHTML = `<a href='${c.hyperlink}'>${c.vendor_name}</a>`
        td10.innerHTML = `<a class='add_button' data-part-uuid='${c._id}' href='#'>Add</a>`
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        tr.appendChild(td5)
        tr.appendChild(td6)
        tr.appendChild(td7)
        tr.appendChild(td8)
        tr.appendChild(td9)
        tr.appendChild(td10)
        mt.appendChild(tr)

    })
    const add_buttons = document.querySelectorAll('.add_button')
    add_buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault()
            console.log(e.target.dataset.partUuid);
            setCookie('chassis_selection', e.target.dataset.partUuid,14);
            window.location.href='/'
        })
    })
}