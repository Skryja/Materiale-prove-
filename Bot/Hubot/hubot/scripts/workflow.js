var Conversation = require('hubot-conversation');
var url = require('url');
var querystring = require('querystring');

module.exports = function (robot) {

    var missedMail = true;
    var greetings = true;
    var mail = "";
    var switchBoard = new Conversation(robot);

    robot.router.post("/hubot/ciao", function (req, res) {
        if (greetings) {
            res.send('Ciao, come va? \n Inserisci la tua email');
            greetings = false;
            missedMail = true;
        }
    });

   // robot.hear(/(.*)@(.*)/i, function (msg) {

    robot.router.post("hubot/(.*)@(.*)"), function(req, res) {

        console.log("sono l'hear");
        res.send("Sono l'hear");
        if (missedMail) {

            missedMail = false;
            mail = msg.match[0];
            console.log(missedMail);

            var dialog = switchBoard.startDialog(msg, 60000);
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (mail.match(re)) {
                msg.reply("Grazie. A quale newsletter vuoi iscrivere l'utente? \n 1) Nuovo di fabbrica \n 2) MultiUx newsletter \n 3) XuniPlay newsletter");

                console.log(missedMail);
                dialog.addChoice(/1|nuovo di fabbrica|fabbrica/i, function (msg2) {
                    var re2 = /(.*)@telecomitalia.it/;

                    if (mail.match(re2)) {
                        msg2.reply("Per gli utenti TIM (@telecomitalia.it) viene inviata una newsletter dedicata con contenuti specifici. Vi è una distinzione anche tra i destinatari TIM delle strutture centrali e quelle dei TERRITORI (vendite e progettazione)");
                        msg2.reply("\nIl destinatario lavora per una struttura centrale (marketing, Ingegneria) o una struttura territoriale (vendite, progettazione)?");

                        dialog.addChoice(/struttura centrale|centrale|marketing|ingegneria/i, function (msg3) {

                            if (robot.brain.get(mail) == null || robot.brain.get(mail) != '1c') {
                                // iscrizione a NL <Nuovo di fabbrica per TIM / CENTRALI>

                                robot.brain.set(mail, '1c');
                                robot.brain.on('save', function (mail) {

                                    //fs.writeFileSync brainPath, JSON.stringify(mail), 'utf-8'
                                });
                                msg3.reply(`Ok! Abbiamo iscritto ${mail} alla newsletter Nuovo di Fabbrica. \nHai bisogno di altro?`);
                                missedMail = true;

                                dialog.addChoice(/si|sì/i, function (msg4) {
                                    msg4.reply("Inserisci la tua email");
                                    missedMail = true;
                                });
                                dialog.addChoice(/no/i, function (msg4) {
                                    msg4.send("-fine conversazione-");
                                    missedMail = true;
                                });
                            }
                            else if (robot.brain.get(mail) == '1c') {
                                msg3.reply("L'utente è già iscritto. \nHai bisogno di altro?");

                                dialog.addChoice(/si|sì/i, function (msg4) {
                                    msg4.reply("Inserisci la tua email");
                                    missedMail = true;
                                });
                                dialog.addChoice(/no/i, function (msg4) {
                                    msg4.send("-fine conversazione-");
                                    missedMail = true;
                                });
                            }
                        });
                        dialog.addChoice(/struttura territoriale|territoriale|vendite|progettazione/i, function (msg3) {

                            if (robot.brain.get(mail) == null || robot.brain.get(mail) != '1t') {
                                // iscrizione a NL <Nuovo di fabbrica per TIM>

                                robot.brain.set(mail, '1t');
                                robot.brain.on('save', function (mail) {

                                    //fs.writeFileSync brainPath, JSON.stringify(mail), 'utf-8'
                                });
                                msg3.reply(`Ok! Abbiamo iscritto ${mail} alla newsletter Nuovo di Fabbrica. \nHai bisogno di altro?`);
                                missedMail = true;

                                dialog.addChoice(/si|sì/i, function (msg4) {
                                    msg4.reply("Inserisci la tua email");
                                    missedMail = true;
                                });
                                dialog.addChoice(/no/i, function (msg4) {
                                    msg4.send("-fine conversazione-");
                                    missedMail = true;
                                });
                            }
                            else if (robot.brain.get(mail) == '1t') {
                                msg3.reply("L'utente è già iscritto. \nHai bisogno di altro?");

                                dialog.addChoice(/si|sì/i, function (msg4) {
                                    msg4.reply("Inserisci la tua email");
                                    missedMail = true;
                                });
                                dialog.addChoice(/no/i, function (msg4) {
                                    msg4.send("-fine conversazione-");
                                    missedMail = true;
                                });
                            }
                        });
                    }
                    else {
                        msg2.reply("Non è telecomitalia.\nPrego inserire nuova email.");
                        missedMail = true;
                    }
                });
                dialog.addChoice(/2|multiux newsletter|multiux/i, function (msg2) {

                    if (robot.brain.get(mail) === null || robot.brain.get(mail) !== '2') {
                        // iscrizione a NL <MultiUx>

                        robot.brain.set(mail, '2');
                        robot.brain.on('save', function (mail) {

                            //fs.writeFileSync brainPath, JSON.stringify(mail), 'utf-8' 
                        });
                        msg2.reply(`Ok! Abbiamo iscritto ${mail} alla newsletter MultiUx. \nHai bisogno di altro?`);
                        missedMail = true;

                        dialog.addChoice(/si|sì/i, function (msg3) {
                            msg3.reply("Inserisci la tua email");
                            missedMail = true;
                        });
                        dialog.addChoice(/no/i, function (msg3) {
                            msg3.send("-fine conversazione-");
                            missedMail = true;
                        });
                    }
                    else if (robot.brain.get(mail) == '2') {
                        msg2.reply("L'utente è già iscritto. \nHai bisogno di altro?");

                        dialog.addChoice(/si|sì/i, function (msg3) {
                            msg3.reply("Inserisci la tua email");
                            missedMail = true;
                        });
                        dialog.addChoice(/no/i, function (msg3) {
                            msg3.send("-fine conversazione-");
                            missedMail = true;
                        });
                    }
                });
                dialog.addChoice(/3|xuniplay newsletter|xuniplay/i, function (msg2) {

                    if (robot.brain.get(mail) == null || robot.brain.get(mail) != '3') {
                        // iscrizione a NL <XuniPlay>

                        robot.brain.set(mail, '3');
                        robot.brain.on('save', function (mail) {

                            //fs.writeFileSync brainPath, JSON.stringify(mail), 'utf-8'
                        });
                        msg2.reply(`Ok! Abbiamo iscritto ${mail} alla newsletter Xuniplay. \nHai bisogno di altro?`);
                        missedMail = true;

                        dialog.addChoice(/si|sì/i, function (msg3) {
                            msg3.reply("Inserisci la tua email");
                            missedMail = true;
                        });
                        dialog.addChoice(/no/i, function (msg3) {
                            msg3.send("-fine conversazione-");
                            missedMail = true;
                        });
                    }
                    else if (robot.brain.get(mail) == '3') {
                        msg2.reply("L'utente è già iscritto. \nHai bisogno di altro?");

                        dialog.addChoice(/si|sì/i, function (msg3) {
                            msg3.reply("Inserisci la tua email");
                            missedMail = true;
                        });
                        dialog.addChoice(/no/i, function (msg3) {
                            msg3.send("-fine conversazione-");
                            missedMail = true;
                        });
                    }
                });
            }
            else {
                res.send("Email non valida. Riprovare");
                missedMail = true;
            }
        }
    }
}