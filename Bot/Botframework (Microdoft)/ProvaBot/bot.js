// require the Restify, HTTP and BotBuilder modules

var request = require('request');
var restify = require('restify');
var builder = require('botbuilder');
var http = require('http');

// make the Restify server listen for incoming messages on port 3978

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {

    console.log('listen to %s', server.url);

});

// create a connection between my bot and the Bot Framework API

var connector = new builder.ChatConnector({

    appId: '86abf838-0f6f-4ad2-9a35-a589c15fa127',
    appPassword: 'ddoBtr3YfDttiySgUMcn1W7'

});

// add connector.listen() to catch messages on the /api/messages route

server.post('/api/messages', connector.listen());

// the bot will capture all incoming messages

var data = { "filterParameters": { "IDSupportGroup": 0, "Name": null } };

var bot = new builder.UniversalBot(connector, [

    function (session) {
        session.send("Benvenuto!");
        builder.Prompts.email(session, "Inserisci la tua email");
    },
    function (session, results) {
        session.userData.email = results.response;
        console.log("Ciao " + session.userData.email);
        session.send("Grazie.");
        session.beginDialog('selectNewsletter');
    },
    function (session) {
        session.beginDialog('startAgain');
    }

]);

bot.dialog('startAgain', [

    function (session) {
        builder.Prompts.choice(session, "Hai bisogno di altro?", "si|no", builder.ListStyle.list);
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.reset();
                break;
            case 1:
                session.send("Grazie. Arrivederci!");
                session.endConversation();
                break;
        }
    }

]);

bot.dialog('selectNewsletter', [

    function (session) {
        builder.Prompts.choice(session, "A quale newsletter vuoi iscrivere l'utente?", "Nuovo di fabbrica|MultiUx|XuniPlay", builder.ListStyle.list);
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('telecomitalia');
                break;
            case 1:
                session.beginDialog('multiUX');
                break;
            case 2:
                session.beginDialog('xuniplay');
                break;
            default:
                console.log("Nessun dialog");
        }
    }

]);

bot.dialog('telecomitalia', [

    function (session) {

        var re = /(.*)@telecomitalia.it/;

        if ((session.userData.email).match(re)) {
            builder.Prompts.choice(session, "Il destinatario lavora per una struttura: ", "centrale (marketing, ingegneria)|territoriale (vendite, progettazione)", builder.ListStyle.list);
        } else {
            session.send("Non è un utente telecomitalia");
            session.replaceDialog('selectNewsletter');
        }

    },
    function (session, results) {

        switch (results.response.index) {
            case 0:
                if (!checkRegistration(session.userData.email)) {
                    session.send(`Ok! Abbiamo iscritto ${session.userData.email} alla newsletter Nuovo di Fabbrica per TIM / CENTRALI`);
                    session.endDialog();
                } else {
                    session.send("L'utente è già iscritto");
                    session.endDialog();
                }
                break;
            case 1:
                if (!checkRegistration(session.userData.email)) {
                    session.send(`Ok! Abbiamo iscritto ${session.userData.email} alla newsletter Nuovo di Fabbrica per TIM`);
                    session.endDialog();
                } else {
                    session.send("L'utente è già iscritto");
                    session.endDialog();
                }
                break;
        }
    }

]);

bot.dialog('multiUX',

    function (session) {

        if (!checkRegistration()) {
            session.send(`Ok! Abbiamo iscritto ${session.userData.email} alla newsletter MultiUX`);
            session.endDialog();
        } else {
            session.send("L'utente è già iscritto");
            session.endDialog();
        }
    }

);

bot.dialog('xuniplay',

    function (session) {

        if (!checkRegistration()) {
            session.send(`Ok! Abbiamo iscritto ${session.userData.email} alla newsletter XuniPlay`);
            session.endDialog();
        } else {
            session.send("L'utente è già iscritto");
            session.endDialog();
        }
    }

);

function doRequest(session) {

    var clientServerOptions = {
        url: 'https://multiux.isp.ipergy.com/CompanyGateWCF/SupportGroupServices.svc/jsonhttps/GetSupportGroupList',
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    request(clientServerOptions, function (error, response) {
        console.log(error, response.body);
        session.send(response.body);
        return;
    });

}

function checkRegistration(email) {
/*
    if (/*email è registrata){
        return true;
    }
    else
        return false;
*/
}

function getEmail(session) {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    email = session.message.text;
    if (re.test(email)) {
        session.userData.email = email;
        session.send("Grazie. A quale newsletter vuoi iscrivere l'utente? \n 1) Nuovo di fabbrica \n 2) MultiUx newsletter \n 3) XuniPlay newsletter");
    } else {
        session.send("Please type a valid email address. For example: test@hotmail.com");
    }

}

function getPassword(session) {

    var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/;
    password = session.message.text;
    if (re.test(password)) {
        session.userData.password = password;
        var data = session.userData;
        sendData(data, function (msg) {
            session.send(msg);
            session.userData = null;
        });
    } else {
        session.send("Password must contain at least 8 characters, including at least 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character. For example: Mybot@123");
    }

}

function sendData(data, cb) {

    http.get("http://local.dev/bot/saveData.php?name=" + data.name + "&email=" + data.email + "&password=" + data.password, function (res) {
        var msg = 'Thank you " + data.name + ". You are now signed up! Please check your inbox further details.';
        res.on("data", function (chunk) {
            msg += chunk;
        });

        res.on('end', function () {
            cb(msg);
        });

    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    });

}