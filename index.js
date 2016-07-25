/* eslint-disable */

'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const sleep = require('sleep')
const app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
    res.send('Welcome iCHEF Customer Success Manager')
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
            switch (text) {
                case 'help':
                    sendTextMessage(sender, "請撥客服電話 0800-889-055", token)
                    break;
                case 'hello':
                    sendTextMessage(sender, "Hi! 你好", token)
                    sendTextMessage(sender, "有什麼需要服務的地方嗎？", token)
                    break;
                case '閃退':
                    sendTextMessage(sender, "請看以下解決方案", token)
                    setTimeout(function() {
                        sendGenericMessage(sender)
                    }, 8000);
                    break;
                default:
                    //sendGenericMessage(sender)
                    sendTextMessage(sender, "建議你輸入欲解決問題的關鍵字，例如：help or 閃退", token)
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
        url: 'https://graph.facebook.com/v2.6/me/messages',
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
        url: 'https://graph.facebook.com/v2.6/' + sender,
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
                    "title":"How-To: Fix Crashing iCHEF Apps on iPad",
                    "image_url":"http://54.64.214.255/images/_igp1443.jpg",
                    "subtitle":"We\'ve got the right answer for you.",
                    "buttons": [{
                        "type":"web_url",
                        "url":"http://www.ichef.tw/serviceandsupport.html",
                        "title:":"View Website"
                    }, {
                        "type":"postback",
                        "title":"Start Chatting",
                        "payload":"USER_DEFINED_PAYLOAD"
                    }],
                }, {
                    "title": "iCHEF 天氣站",
                    "subtitle": "目前天氣為 晴, 推薦商品: 黑糖剉冰",
                    "image_url": "https://pic.gomaji.com/uploads/stores/056/52056/33080/DSC_0703.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.ichef.tw/club/",
                        "title": "推薦商家",
                    }],
                }, 
        {
               "title": "贊助廣告",
                    "subtitle": "",
                    "image_url": "https://c1.staticflickr.com/9/8666/28194034332_116e5a0434_o.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.google.com.tw/maps/place/好初早餐(一店)/@25.0277894,121.4699933,15z/data=!4m5!3m4!1s0x0:0xbea9006e45fad5c!8m2!3d25.0277894!4d121.4699933",
                        "title": "好初早餐",
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
        url: 'https://graph.facebook.com/v2.6/me/messages',
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
