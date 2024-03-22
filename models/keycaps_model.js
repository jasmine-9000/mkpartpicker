const mongoose = require('mongoose');
const keycaps_model = mongoose.model('keycaps_options', 
    {
        brand_name: String, 
        component_name: String,
        style_of_switch: String,
        quantity: Number,
        price:Number,
        vendor_name: String,
        hyperlink:String,
        star_rating:Number
    })
module.exports = keycaps_model