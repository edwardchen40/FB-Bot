/* eslint-disable */
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const sleep = require('sleep');
const app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
    res.send('歡迎光臨超級小秘書')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// to post data
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            switch(text)    
            {
                case 'hello','Hello':
                    sendTextMessage(sender, "Hi! Winter 你好", token)
                    setTimeout(function() {
                        sendTextMessage(sender, "我們偵測到你所在地為 臺北市", token)
                    }, 3000);
                    setTimeout(function() {
                        sendTextMessage(sender, "以下是為你所提供的在地相關情報", token)
                    }, 5000);
                    setTimeout(function() {
                        sendGenericMessage(sender)
                    }, 8000);
                    break;
                case 'help', 'Help':
                    sendTextMessage(sender, "你可以輸入hello,", token)
                    break;
                default:
                    //sendGenericMessage(sender)
                    sendTextMessage(sender, "建議你可以輸入 hello", token)
            }
            //getUserProfile(sender)
            //sendGenericMessage(sender)
        }
        if (event.postback) {
            let text = JSON.stringify(event.postback)
            sendTextMessage(sender, "建議你可以輸入 hello", token)
            continue
        }
    }
    res.sendStatus(200)
})


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.PAGE_ACCESS_TOKEN
const token = "EAACYQ6O4bCkBADO2qGfxZAVJDHZAQcc0Eob7LqrLuitmqJEBaGNFA2AXMmQV1kyaNYDNBl8WZADZB0vpyeYNSAss7sC6PM7504rhMtEn4Uj2ZAoo3opGhClpQop5ZCvwzGQV2aeL1WGZBQcLqXLXaZCGsT7VRUOebgmqLgkaF214ZAgZDZD"

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    
    request({
        url: 'https://graph.facebook.com/v2.7/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
function getUserProfile(sender) {
    request({
        url: 'https://graph.facebook.com/v2.7/' + sender,
        qs: {access_token:token,fields:"first_name,last_name,profile_pic,locale,timezone,gender"},
        method: 'GET',
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "臺北市",
                    "subtitle": "目前天氣為 晴, 溫度：30度",
                    "image_url": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Taipei_City_montage.PNG",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://tw.news.yahoo.com/weather/",
                        "title": "天氣"
                    }, {
                        "type": "web_url",
                        "url": "http://tw.search.mall.yahoo.com/search/mall/product?p=臺北市",
                        "title": "商城"
                    }],
                }, {
                    "title": "美食",
                    "subtitle": "",
                    "image_url": "https://c1.staticflickr.com/9/8666/28194034332_116e5a0434_o.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://tw.search.mall.yahoo.com/search/mall/product?p=台北&qt=product&cid=794017821&clv=2",
                        "title": "美食",
                    }],
                }, 
        {
               "title": "服飾",
                    "subtitle": "", 
                    "image_url": "https://c1.staticflickr.com/9/8678/27682009324_05e41d13fe_o.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://tw.search.mall.yahoo.com/search/mall/product?p=台北服飾&qt=product&kw=台北服飾&cid=0&clv=0",
                        "title": "服飾",
                    }],     
            },  
        {
               "title": "居家",
                    "subtitle": "", 
                    "image_url": "https://c1.staticflickr.com/9/8607/27682401003_bc09ea6eb6_o.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://tw.search.mall.yahoo.com/search/mall/product?p=%E5%8F%B0%E5%8C%97&qt=product&cid=794017823&clv=2",
                        "title": "居家",
                    }],     
            },  
        {
               "title": "運動",
                    "subtitle": "", 
                    "image_url": "https://c1.staticflickr.com/9/8851/28016660710_38487c8cdc_o.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://tw.search.mall.yahoo.com/search/mall/product?p=台北運動&qt=product&kw=台北運動&cid=0&clv=0",
                        "title": "運動",
                    }],     
            }   
        ]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.7/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// spin spin sugar
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})