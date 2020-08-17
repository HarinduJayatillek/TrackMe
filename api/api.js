const mongoose = require('mongoose');

mongoose.connect( "mongodb+srv://hjayatilleke:hjayatilleke@cluster0.vecfq.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true 
});

const port = process.env.PORT || 5000;
const User = require('./models/user');
const Device = require('./models/device');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/test', (req, res) => {

    res.send('The API is working!');

});

app.get('/api/devices/:deviceId/device-history', (req, res) => {
    const { deviceId } = req.params;
        Device.findOne({"_id": deviceId }, (err, devices) => {
        const { sensorData } = devices;
        return err
        ? res.send(err)
        : res.send(sensorData);
    });
});

app.post('/api/authenticate', (req, res) => { 

    // console.log(req.body);
    const { username, password } = req.body;

    User.findOne({name:username}, (err, users) => {

        if(err){
            res.send(err)
            res.send('Unsuccessfull');
        }
        else{

            if(users == undefined){
                res.send('user does not found');
            }else{

                if(users.password == password){
                    //Password match
                    return res.json({

                                success: true,
                                message: 'Authenticated successfully',
                                isAdmin: users.isAdmin
                            });
                }else{
                    //password do not match
                    res.send('Password is not valid');
                }
    
            }

            
        }
    });

});

app.post('/api/registration', (req, res) => {
    
    const { username, password, isAdmin } = req.body;

    console.log(username+" \n"+password);

    User.findOne({name:username}, (err, users) => {

        if(err){
            res.send(err)
            res.send('Unsuccessfull');
        }
        else{

            if(users == undefined){
                //User does not exist , can register 
 
                const newUser = new User({
                    "name": username,
                    "password": password,
                    "isAdmin" : isAdmin
                });

                newUser.save(err => {
                        return err
                        ? res.send(err)
                        : res.json({
                            success: true,
                            message: 'Created new user'
                        });
                });

            }
            else{
                //User already exists , cannot register
                res.send('User is already exists');
            }

        }
        
    });

});

app.post('/api/send-command', (req, res) => {
    console.log(req.body);
    const { name, user, sensorData } = req.body;
    const newDevice = new Device({
        name,
        user,
        sensorData
    });
    newDevice.save(err => {
        return err
            ? res.send(err)
            : res.send('successfully added device and data');
    });
});

app.get('/api/users/:user/devices', (req, res) => {
        const { user } = req.params;
        
        // console.log("Username: "+user);        
        
        Device.find({ "user": user}, (err, devices) => {
            return err
            ? res.send(err)
            : res.send(devices);
    });

});

app.use(express.static(`${__dirname}/public/generated-docs`));

app.get('/docs', (req, res) => {
    res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
* [
*   {
*       "_id": "dsohsdohsdofhsofhosfhsofh",
*       "name": "Mary's iPhone",
*       "user": "mary",
*       "sensorData": [
*           {
*              "ts": "1529542230",
*              "temp": 12,
*              "loc": {
*                  "lat": -37.84674,
*                  "lon": 145.115113
*              }
*          },
*          {
*             "ts": "1529572230",
*              "temp": 17,
*              "loc": {
*                 "lat": -37.850026,
*                 "lon": 145.117683
*               }
*           }
*       ]
*    }
* ]
* @apiErrorExample {json} Error-Response:
* {
*   "User does not exist"
* }
*/

app.get('/api/devices', (req, res) => {

    Device.find({}, (err, devices) => {

    console.log(devices);

    return err
        ? res.send(err)
        : res.send(devices);
    });

});

app.post('/api/devices', (req, res) => {
   
    const { name, user, sensorData } = req.body;
    
    const newDevice = new Device({
        name,
        user,
        sensorData
    });

    newDevice.save(err => {
        return err
            ? res.send(err)
            : res.send('successfully added device and data');
    });

});


app.listen(port, () => {

    console.log(`listening on port ${port}`);

});