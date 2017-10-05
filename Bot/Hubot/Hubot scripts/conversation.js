var DynamicConversation, dynamic;

DynamicConversation = require('hubot-dynamic-conversation');

module.exports = function (robot) {

    var missedMail = true;
    var mail = "";
    dynamic = new DynamicConversation(robot);

    robot.respond(/ciao/i, function (msg) {

        msg.reply("Ciao, come va? \n Inserisci la tua email");
        missedMail = true;
    });

    robot.hear(/(.*)@(.*)/i, function (msg) {

        if (missedMail) {

            missedMail = false;
            mail = msg.match[0];

            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (mail.match(re)) {
                var dialog, maintenanceRequestModel;
                robot.logger.info('hello');

                maintenanceRequestModel = {
                    abortKeyword: 'quit',
                    onAbortMessage: 'You cancelled the conversation.',
                    //onCompleteMessage: 'Thanks for reporting this. I\'ll notify someone immediately.',
                    //skipKeyword: /\bskip\b$/i,
                    //skipMessage: say('skip'),
                    conversation: [
                        {
                            question: "Grazie. A quale newsletter vuoi iscrivere l'utente? \n 1) Nuovo di fabbrica \n 2) MultiUx newsletter \n 3) XuniPlay newsletter",
                            answer: {
                                type: "choice",
                                options: [
                                    {
                                        match: "1",
                                        valid: true,
                                        response: ""
                                    }, {
                                        match: "2",
                                        valid: true,
                                        response: ""
                                    }, {
                                        match: "3",
                                        valid: true,
                                        response: ""
                                    }
                                ]
                            },
                            required: true,
                            error: "Sorry, I didn't understand your response. Please repeat."
                        }, {
                            question: "Please describe the issue.",
                            answer: {
                                type: "text"
                            },
                            required: true,
                            error: "Sorry your response didn't contain any text, please describe the issue."
                        }, {
                            question: "Please attach a photo of the issue if you have one.",
                            answer: {
                                type: "attachment"
                            },
                            required: false,
                            error: "Sorry the message didn't contain an attachment, please try again."
                        }
                    ]
                };
                return dialog = dynamic.start(msg, maintenanceRequestModel, function (err, msg, dialog) {
                    var data;
                    if (err) {
                        return robot.logger.error(err);
                    } else {
                        data = dialog.fetch();
                        return robot.logger.info(data);
                    }
                });
            }
        }
    });
}
