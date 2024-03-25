const mongoose = require('mongoose');
const switches_model = mongoose.model('switches_options', 
    {
        brand_name: String, 
        component_name: String,
        style_of_switch: String,
        quantity: Number,
        style_of_switch: String,
        price:Number,
        vendor_name: String,
        hyperlink:String,
        star_rating:Number
    })
module.exports = switches_model