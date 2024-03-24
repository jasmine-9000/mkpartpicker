const mongoose = require('mongoose');
const switches_model = mongoose.model('submitted_custom_parts', 
    {
        part_name_description: String, 
        part_type: String,
        price:Number,
        part_hyperlink:String,
    })
module.exports = switches_model