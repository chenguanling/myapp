var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');
app.set('views', __dirname);
app.set( 'view engine', 'html' );
app.engine( '.html', require( 'ejs' ).__express );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var data = {
    "message": "操作完成！",
    "responseCode": "0",
    "result": {
    "timeOutInfos": [
        "同一号码办理多项业务",
        "沟通服务不顺畅",
        "营销系统运行速度慢",
        "电脑、打印机、复印件设备故障"
    ],
        "soundMode": {
        "mandarin": true,
            "cantonese": false,
            "english": false
    },
    "singleTracer": false,
        "appraiseTimeout": 2,
        "appraise": false,
        "appraiseRate": 3
}
}

var systemUsers = {
    "message": "操作完成！",
    "responseCode": "0",
    "result": [
        {
            "stuffName": "0001",
            "stuffId": "0001"
        },
        {
            "stuffName": "0002",
            "stuffId": "0002"
        },
        {
            "stuffName": "0003",
            "stuffId": "0003"
        },
        {
            "stuffName": "0004",
            "stuffId": "0004"
        },
        {
            "stuffName": "0005",
            "stuffId": "0005"
        },
        {
            "stuffName": "0006",
            "stuffId": "0006"
        },
        {
            "stuffName": "0007",
            "stuffId": "0007"
        },
        {
            "stuffName": "0008",
            "stuffId": "0008"
        },
        {
            "stuffName": "0009",
            "stuffId": "0009"
        }
    ]
}

var buzzTypes = {
    "message":"操作完成！",
    "responseCode":"0",
    "result":[
        {"timeSpans":{},"alertTime":0,"finishTimeOut":0,"buzzType":"A","enable":false,"buzzName":"公司业务","subBuzzNames":["Aa:电费及发票业务","Ab:对公划账业务","Ac:预付费业务","Ad:用电变更业务","Ae:电表业务"]},
        {"timeSpans":{},"alertTime":0,"finishTimeOut":0,"buzzType":"B","enable":true,"buzzName":"个人业务","subBuzzNames":["Ba:更名过户业务","Bb:银行划扣电费业务","Bc:电费及发票业务","Bd:低保免费电业务","Be:用电变更业务","Bf:电表业务"]},
        {"timeSpans":{},"alertTime":0,"finishTimeOut":0,"buzzType":"C","enable":true,"buzzName":"新装及增容","subBuzzNames":["Ca:居民新装业务","Cb:居民增容业务","Cc:100kVA以下公司新装业务","Cd:100kVA以下公司增容业务","Ce:100kVA以上大客户业务"]},
        {"timeSpans":{3: [{to: 165348, from: 165300}]},"alertTime":0,"finishTimeOut":0,"buzzType":"D","enable":true,"buzzName":"综合能源业务","subBuzzNames":["Da:居民业务","Db:100kVA以下公司业务","Dc:100kkVA以上大客户业务"]},
        {"timeSpans":{},"alertTime":0,"finishTimeOut":0,"buzzType":"S","enable":true,"buzzName":"特殊叫号","subBuzzNames":[]},
        {"timeSpans":{},"alertTime":0,"finishTimeOut":0,"buzzType":"V","enable":true,"buzzName":"VIP业务","subBuzzNames":[]}
        ]
}

var counters = {
    "message":"操作完成！",
    "responseCode":"0",
    "result":[
        {"counterNum":"0001","status":0,"counterName":"0001","buzzTypes":[["A","B","C"]]},
        {"counterNum":"0002","status":0,"counterName":"0002","buzzTypes":[["A","B","C","S"]]},
        {"counterNum":"0003","status":0,"counterName":"0003","buzzTypes":[["A","B","C"]]},
        {"counterNum":"0004","status":0,"counterName":"0004","buzzTypes":[["A","B","C"]]},
        {"counterNum":"0005","status":0,"counterName":"0005","buzzTypes":[["A","B","C"]]},
        {"counterNum":"0006","status":0,"counterName":"0006","buzzTypes":[["A","B","C"]]},
        {"counterNum":"0007","status":0,"counterName":"0007","buzzTypes":[["A","B","C"]]},
        {"counterNum":"0008","status":0,"counterName":"0008","buzzTypes":[["A","B","C"]]},
        {"counterNum":"0009","status":0,"counterName":"0009","buzzTypes":[["A","B","C"]]}
        ]

}
var query = {
    "message":"操作完成！",
    "responseCode":"0",
    "result":[
        {"timeOutReason":"","createTime":"2017-12-08 10:48:35","counterNum":"0006","buzzType":"A","callTime":"2017-12-08 10:49:06","buzzName":"公司业务","ticketNum":"A001","startServiceTime":"2017-12-08 10:49:09","serviceRate":4,"stuffId":null,"subBuzzName":"对公划账业务","callTimes":1,"endServiceTime":"2017-12-08 10:49:40"},
        {"timeOutReason":"","createTime":"2017-12-08 10:49:33","counterNum":"0006","buzzType":"C","callTime":"2017-12-08 10:49:44","buzzName":"新装及增容","ticketNum":"C001","startServiceTime":"2017-12-08 10:49:48","serviceRate":4,"stuffId":null,"subBuzzName":"居民增容业务","callTimes":1,"endServiceTime":"2017-12-08 10:49:54"},
        {"timeOutReason":"","createTime":"2017-12-12 14:31:20","counterNum":"0001","buzzType":"C","callTime":"2017-12-12 14:55:57","buzzName":"新装及增容","ticketNum":"C001","startServiceTime":"2017-12-12 14:56:27","serviceRate":4,"stuffId":"0007","subBuzzName":"居民增容业务","callTimes":1,"endServiceTime":"2017-12-12 14:56:57"},
        {"timeOutReason":"","createTime":"2017-12-12 14:31:20","counterNum":"0001","buzzType":"C","callTime":"2017-12-12 14:55:57","buzzName":"新装及增容","ticketNum":"C001","startServiceTime":"2017-12-12 14:56:27","serviceRate":4,"stuffId":"0007","subBuzzName":"居民增容业务","callTimes":1,"endServiceTime":"2017-12-12 14:56:57"},
        {"timeOutReason":"","createTime":"2017-12-12 14:31:20","counterNum":"0001","buzzType":"C","callTime":"2017-12-12 14:55:57","buzzName":"新装及增容","ticketNum":"C001","startServiceTime":"2017-12-12 14:56:27","serviceRate":4,"stuffId":"0007","subBuzzName":"居民增容业务","callTimes":1,"endServiceTime":"2017-12-12 14:56:57"},
        {"timeOutReason":"","createTime":"2017-12-12 14:31:20","counterNum":"0001","buzzType":"C","callTime":"2017-12-12 14:55:57","buzzName":"新装及增容","ticketNum":"C001","startServiceTime":"2017-12-12 14:56:27","serviceRate":4,"stuffId":"0007","subBuzzName":"居民增容业务","callTimes":1,"endServiceTime":"2017-12-12 14:56:57"},
        {"timeOutReason":"","createTime":"2017-12-12 14:31:20","counterNum":"0001","buzzType":"C","callTime":"2017-12-12 14:55:57","buzzName":"新装及增容","ticketNum":"C001","startServiceTime":"2017-12-12 14:56:27","serviceRate":4,"stuffId":"0007","subBuzzName":"居民增容业务","callTimes":1,"endServiceTime":"2017-12-12 14:56:57"},
        {"timeOutReason":"","createTime":"2017-12-12 14:31:20","counterNum":"0001","buzzType":"C","callTime":"2017-12-12 14:55:57","buzzName":"新装及增容","ticketNum":"C001","startServiceTime":"2017-12-12 14:56:27","serviceRate":4,"stuffId":"0007","subBuzzName":"居民增容业务","callTimes":1,"endServiceTime":"2017-12-12 14:56:57"},
        {"timeOutReason":"","createTime":"2017-12-12 14:31:20","counterNum":"0001","buzzType":"C","callTime":"2017-12-12 14:55:57","buzzName":"新装及增容","ticketNum":"C001","startServiceTime":"2017-12-12 14:56:27","serviceRate":4,"stuffId":"0007","subBuzzName":"居民增容业务","callTimes":1,"endServiceTime":"2017-12-12 14:56:57"},
        {"timeOutReason":"","createTime":"2017-12-12 14:31:20","counterNum":"0001","buzzType":"C","callTime":"2017-12-12 14:55:57","buzzName":"新装及增容","ticketNum":"C001","startServiceTime":"2017-12-12 14:56:27","serviceRate":4,"stuffId":"0007","subBuzzName":"居民增容业务","callTimes":1,"endServiceTime":"2017-12-12 14:56:57"},
        {"timeOutReason":"","createTime":"2017-12-12 14:31:20","counterNum":"0001","buzzType":"C","callTime":"2017-12-12 14:55:57","buzzName":"新装及增容","ticketNum":"C001","startServiceTime":"2017-12-12 14:56:27","serviceRate":4,"stuffId":"0007","subBuzzName":"居民增容业务","callTimes":1,"endServiceTime":"2017-12-12 14:56:57"},
        {"timeOutReason":"","createTime":"2017-12-12 14:31:20","counterNum":"0001","buzzType":"C","callTime":"2017-12-12 14:55:57","buzzName":"新装及增容","ticketNum":"C001","startServiceTime":"2017-12-12 14:56:27","serviceRate":4,"stuffId":"0007","subBuzzName":"居民增容业务","callTimes":1,"endServiceTime":"2017-12-12 14:56:57"},
        {"timeOutReason":"","createTime":"2017-12-12 14:31:20","counterNum":"0001","buzzType":"C","callTime":"2017-12-12 14:55:57","buzzName":"新装及增容","ticketNum":"C001","startServiceTime":"2017-12-12 14:56:27","serviceRate":4,"stuffId":"0007","subBuzzName":"居民增容业务","callTimes":1,"endServiceTime":"2017-12-12 14:56:57"},
        {"timeOutReason":"","createTime":"2017-12-12 14:31:20","counterNum":"0001","buzzType":"C","callTime":"2017-12-12 14:55:57","buzzName":"新装及增容","ticketNum":"C001","startServiceTime":"2017-12-12 14:56:27","serviceRate":4,"stuffId":"0007","subBuzzName":"居民增容业务","callTimes":1,"endServiceTime":"2017-12-12 14:56:57"},
        {"timeOutReason":"","createTime":"2017-12-12 14:31:20","counterNum":"0001","buzzType":"C","callTime":"2017-12-12 14:55:57","buzzName":"新装及增容","ticketNum":"C001","startServiceTime":"2017-12-12 14:56:27","serviceRate":4,"stuffId":"0007","subBuzzName":"居民增容业务","callTimes":1,"endServiceTime":"2017-12-12 14:56:57"},
        {"timeOutReason":"","createTime":"2017-12-12 14:31:20","counterNum":"0001","buzzType":"C","callTime":"2017-12-12 14:55:57","buzzName":"新装及增容","ticketNum":"C001","startServiceTime":"2017-12-12 14:56:27","serviceRate":4,"stuffId":"0007","subBuzzName":"居民增容业务","callTimes":1,"endServiceTime":"2017-12-12 14:56:57"},
        {"timeOutReason":"","createTime":"2017-12-12 14:31:20","counterNum":"0001","buzzType":"C","callTime":"2017-12-12 14:55:57","buzzName":"新装及增容","ticketNum":"C001","startServiceTime":"2017-12-12 14:56:27","serviceRate":4,"stuffId":"0007","subBuzzName":"居民增容业务","callTimes":1,"endServiceTime":"2017-12-12 14:56:57"},

    ]
}
var reportStat = {
    "message":"操作完成！",
    "responseCode":"0",
    "result":[
        {"avService":"0","total":"1","buzzType":"A","buzzName":"公司业务","avWait":"0"},
        {"avService":"0","total":"1","buzzType":"C","buzzName":"新装及增容","avWait":"0"}
        ]}
app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/api/systemConfig', function (req, res) {
    res.json(data);
});

app.post('/api/systemUsers', function (req, res) {
    res.json(systemUsers);
});

app.post('/api/buzzTypes', function (req, res) {
    res.json(buzzTypes);
});

app.post('/api/counters', function (req, res) {
    res.json(counters);
});
app.post('/api/query', function (req, res) {
    res.json(query);
});
app.post('/api/reportStat', function (req, res) {
    res.json(reportStat);
});

app.post('/api/updateBuzzType', function (req, res) {
    res.json({"message":"操作完成！","responseCode":"0"});
});
app.post('/api/updateCounter', function (req, res) {
    res.json({"message":"操作完成！","responseCode":"0"});
});

app.get('/logout', function(req, res){
    req.session.user = null;
    req.session.error = null;
    res.redirect('index');
});
app.get('/api/login',function(req,res){
    res.render('login');
});
app.post('/api/login',function(req,res){
    var user={
        username:'507507',
        password:'507507'
    }
    if(req.body.username==user.username&&req.body.password==user.password) {
        res.send(200);
        res.json({"ret_code": 0, "ret_msg": '登录成功'});
    }else{
        res.json({"ret_code": 1, "ret_msg": '账号或密码错误'});
        res.send( 404 );
    }
});


var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});