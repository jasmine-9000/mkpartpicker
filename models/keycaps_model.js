const mongoose = require('mongoose');
const keycaps_model = mongoose.model('keycaps_options', 
    {
        brand_name: String, 
        component_name: String,
        price:Number,
        keycap_profile:String,
        material_type: String,
        printing_details: String,
        layouts_supported:Array,
        vendor_name: String,
        hyperlink:String,
        star_rating:Number,
    })
module.exports = keycaps_model