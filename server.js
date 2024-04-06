const express = require('express');
const app = express()
const PORT = 3000
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/mkpartpicker')

const chassis_model = require('./models/chassis_model');
const switches_model = require('./models/switches_model');
const keycaps_model = require('./models/keycaps_model');
const custom_part_model = require('./models/custom_part_model');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.set('views', path.join(__dirname,'/views'))
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress())

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index');
})
app.get('/chassis_selection', (req, res) => {
    res.render('chassis_select');
    // const fp = path.join(path.join(__dirname, 'public/chassis_selection.html'))
    // res.sendFile(fp)
})
app.get('/switches_selection', (req, res) => {
    res.render('switches_select');
    // const fp = path.join(path.join(__dirname, 'public/switches_selection.html'))
    // res.sendFile(fp)
})
app.get('/keycaps_selection', (req, res) => {
    res.render('keycaps_select');
    // const fp = path.join(path.join(__dirname, 'public/keycap_selection.html'))
    // res.sendFile(fp)
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
    console.log(doc);
    res.json(doc);
})
app.get('/data/keycaps', async (req, res) => {
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
    res.sendFile(path.join(__dirname, '/public/rigging_sites/admin-add-part.html'))
})
app.post('/admin/add-part', async (req,res) => {
    res.cookie
    console.log("submitted request")
    console.log(req.body)
    const c = req.body['type-of-part']

    switch(c) {
        case 'chassis':
            console.log('meow')
            const chassis_doc = new chassis_model({
                brand_name: req.body['brand-name'], 
                component_name: req.body['component-name'],
                model_number: req.body['model_number'],
                number_of_keys: Number(req.body['number-of-keys']),
                keyboard_layout: req.body['keyboard_layout'],
                keyboard_size: req.body['keyboard_size_name'],
                price:Number(req.body['price']),
                vendor_name: req.body['vendor_name'],
                hyperlink:req.body['hyperlink'],
                star_rating:5
            })
            const c_response = await chassis_doc.save()
            if(c_response === chassis_doc){ 
                res.status(200).send('Successful')
            } else {
                res.status(400).send('HTTP 400 Bad Form Request')
            }
            break;
        case 'switches':
            const doc = new switches_model({
                brand_name: req.body['brand-name'], 
                component_name: req.body['component-name'],
                model_number: req.body['model_number'],
                style_of_switch: req.body['switch_type'],
                body_color: req.body['switch_body_color'],
                stem_color: req.body['switch_stem_color'],
                rgb_see_through: Boolean(req.body['see_through']),
                pinout: req.body['switch_pin_layout'],
                quantity: Number(req.body['quantity']),
                price:Number(req.body['price']),
                vendor_name: req.body['vendor_name'],
                hyperlink:req.body['hyperlink'],
                star_rating:5
            })
            const response = await doc.save();
            console.log('Mongoose response: ')
            console.log(response);
            if(response === doc) {
                res.status(200).send('Successful')
            } else {
                res.status(400).send('Internal Server Error: Bad Form Request');
            }
            break;
        case 'lube':
            res.status(503).send('Internal Server Error: Not implemented');
            break;
        case 'keycaps':
            const compatibility_array = [];
            const compatibility_names = ['tkl', 'fullsize', '75','70', '65','60','40', '1800', 'ortho', 'alice', 'macropad', 'numpad', 'ansi', 'iso']
            const compatibility_dict = {
                'tkl':'Tenkeyless',
                'fullsize': 'Full Size', 
                '75': '75%',
                '70': '70%', 
                '65': '65%',
                '60': 'Compact (60%)',
                '40': 'Compact (40%)', 
                '1800': '1800 Layout', 
                'ortho': 'Ortho layout',
                'alice': 'Alice Split Layout', 
                'macropad': 'Macropad', 
                'numpad': 'Numpad', 
                'ansi': 'ANSI - USA', 
                'iso': 'ISO'
            }
            compatibility_names.forEach(name => {
                const isCompatibible = req.body['keycap_compatibility_' + name] ? true : false
                if(isCompatibible) {
                    compatibility_array.push(compatibility_dict[name]);
                }
            })
            // console.log(`
            // <label for="keycap_compatibility_tkl">TKL</label>
            // <input type="checkbox" name="keycap_compatibility_tkl">`)
            const keycaps_doc = new keycaps_model({
                brand_name: req.body['brand-name'], 
                component_name: req.body['component-name'],
                model_number: req.body['model_number'],
                keycap_profile: req.body['keycap_profile'],
                material_type: req.body['keycap_material_type'],
                printing_details: req.body['printing_details'],
                layouts_supported: compatibility_array,
                price:Number(req.body['price']),
                vendor_name: req.body['vendor_name'],
                hyperlink:req.body['hyperlink'],
                star_rating:5
            })
            const keycaps_response = await keycaps_doc.save();
            if(keycaps_response === keycaps_doc) {
                res.status(200).send('Successful')
            } else {

                res.status(400).send('Internal Server Error: Bad Form Request');
            }
            break;
        case 'other':
            res.status(503).send('Internal Server Error: Not implemented');
            break;
        default:
            console.log(c);
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

app.get('/chassis/:id', async (req, res) => {
    const retrievedPart = await chassis_model.findById(req.params.id);
    res.render('chassis_view', {
        data: retrievedPart}
    )
    // res.json(retrievedPart);
    // res.send('meow');
})
app.get('/keycaps/:id', async (req, res) => {
    const retrievedPart = await keycaps_model.findById(req.params.id);
    res.render('keycaps_view', {
        data: retrievedPart
    } )
})


app.listen(PORT, () => {
    console.log(`Website is running on port ${PORT}... better go catch it!`)
})
