const express = require('express');
const app = express()
const PORT = 3000
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/mkpartpicker')
const chassis_model = require('./models/chassis_model');
const switches_model = require('./models/switches_model');
const keycaps_model = require('./models/keycaps_model');
const custom_part_model = require('./models/custom_part_model');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.get('/chassis_selection', (req, res) => {
    const fp = path.join(path.join(__dirname, 'public/chassis_selection.html'))
    res.sendFile(fp)
})
app.get('/switches_selection', (req, res) => {
    const fp = path.join(path.join(__dirname, 'public/switches_selection.html'))
    res.sendFile(fp)
})
app.get('/keycaps_selection', (req, res) => {
    const fp = path.join(path.join(__dirname, 'public/keycap_selection.html'))
    res.sendFile(fp)
})
app.get('/completed-builds', (req, res) => {
    const fp = path.join(path.join(__dirname, 'public/completed_builds.html'))
    res.sendFile(fp)
})
app.get('/guides', (req, res) => {
    const fp = path.join(path.join(__dirname, 'public/mechanical_keyboard_guides.html'))
    res.sendFile(fp)
})
app.get('/products', (req, res) => {
    const fp = path.join(path.join(__dirname, 'public/list_of_products.html'))
    res.sendFile(fp)
})
app.use(express.static('public'))

app.get('/data', async (req, res) => {
    const doc = await chassis_model.find()
    console.log(doc)
    res.json(doc)
    // fs.readFile(path.join(__dirname, 'data.txt'), 'utf-8', function(err, data) {
    //     if(err) {
    //         switch(err.code) {
    //             case 'ENOENT':
    //                 res.json("404 error");
    //                 break;
    //             default: 
    //                 res.json(err);
    //                 break;
    //         } 
    //         return;
    //     }
    //     console.log(typeof data)
    //     res.json(data);
    //     console.log(data);
    // })
})


app.get('/data/mongoose', async (req, res) => {
    // find all chassis models
    const doc = await chassis_model.find();
    console.log(doc)
    res.json(doc);
})
app.get('/data/switches', async (req, res) => {
    const doc = await switches_model.find();
    res.json(doc)
})
app.get('/data/keycaps', async (req, res) => {
    // const dummyData = {
    //     [
    //         {
    //             brand_name: 'Monsgeek'
    //         }
    //     ]
    // }
    // const dummyData = [
    //     {
    //         _id: 'ABCD',
    //         brand_name: 'Monsgeek',
    //         component_name: 'Panda Keycap set',
    //         hyperlink: 'https://google.com',
    //         layouts_supported: [
    //             'a',
    //             'b',
    //             'c'
    //         ],
    //         price: 39.99,
    //         vendor_name: 'Monsgeek'
    //     }
    // ]
    const doc = await keycaps_model.find()
    res.json(doc)
})

app.get('/data/mongoose/postnewdata/:name/:price', async(req, res) => {
    const name = req.params.name
    const price = req.params.price
    // const chassis_model = mongoose.model('chassis_options', {brand_name:String, component_name:String, price:Number})
    const newModel = new chassis_model({
        brand_name: '100Devs',
        price:Number(price),
        component_name: name
    })
    const result = await newModel.save()
    res.json(result) 
})
app.get('/data/:chassis_id/', async (req, res) => {
    const doc = await chassis_model.findById(req.params.chassis_id);
    res.json(doc);
})
app.get('/data/switches/:switch_id', async (req, res) => {
    const doc = await switches_model.findById(req.params.switch_id);
    res.json(doc);
})
app.get('/data/keycaps/:keycap_id', async (req, res) => {
    const doc = await keycaps_model.findById(req.params.keycap_id);
    res.json(doc);
})

// send the administor the form to add a part
app.get('/admin/add-part', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/admin-add-part.html'))
})
app.post('/admin/add-part', async (req,res) => {
    res.cookie
    console.log("submitted request")
    console.log(req.body)
    const c = req.body['type_of_part']

    switch(c) {
        case 'chassis':
            console.log('meow')
            break;
        case 'switches':
            res.status(503).send('Internal Server Error: Not implemented');
            break;
        case 'lube':
            res.status(503).send('Internal Server Error: Not implemented');
            break;
        case 'keycaps':
            res.status(503).send('Internal Server Error: Not implemented');
            break;
        case 'other':
            res.status(503).send('Internal Server Error: Not implemented');
            break;
        default:
            res.status(503).send('Internal Server Error: Not implemented');
            break;
    }
    
})

app.post('/client/add-part', async (req, res) => {
    console.log(`Received request: `)
    console.log(req.body)
    const submittedPart = new custom_part_model({
        part_name_description: req.body.custom_part_name, 
        part_type: req.body.custom_part_type,
        price:req.body.custom_part_price,
        part_hyperlink:req.body.custom_part_hyperlink,
    
    })
    const response = await submittedPart.save()
    res.send('Successfully saved custom submission')
})


app.listen(PORT, () => {
    console.log(`Website is running on port ${PORT}... better go catch it!`)
})
