const mongoose = require('mongoose');
const chassis_model = mongoose.model('chassis_options', 
    {
        brand_name: String, 
        component_name: String,
        model_number: String,
        number_of_keys: Number,
        keyboard_layout: String,
        keyboard_size: String,
        price:Number,
        vendor_name: String,
        hyperlink:String,
        star_rating:Number
    })
module.exports = chassis_model