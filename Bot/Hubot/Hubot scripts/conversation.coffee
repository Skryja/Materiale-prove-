DynamicConversation = require 'hubot-dynamic-conversation'
dynamic = new DynamicConversation robot

  robot.respond /problem/i, (msg) ->
    robot.logger.info 'hello'
    msg.reply "OK, I can make a maintenance report for you, just answer some questions..."
    maintenanceRequestModel = {
      abortKeyword: 'quit',
      onAbortMessage: 'You cancelled the conversation.',
      onCompleteMessage: 'Thanks for reporting this. I\'ll notify someone immediately.',
      skipKeyword: /\bskip\b$/i,
      skipMessage: (say 'skip'),
      conversation: [ 
        {
          question: "Is it in a public or private area?",
          answer: {
            type: "choice",
            options: [
              {
                match: "public",
                valid: true,
                response: "OK you said *public*, next step...",
              },
              {
                match: "private",
                valid: false,
                response: "Sorry, you will have to find a contractor for private maintenance"
              }
            ]
          },
          required: true,
          error: "Sorry, I didn't understand your response. Please say private or public to proceed."
        },
        {
          question: "Please describe the issue.",
          answer: {
            type: "text"
          },
          required: true,
          error: "Sorry your response didn't contain any text, please describe the issue."
        },
        {
          question: "Please attach a photo of the issue if you have one."
          answer: {
            type: "attachment"
          },
          required: false,
          error: "Sorry the message didn't contain an attachment, please try again."
        } 
      ]
    }

    dialog = dynamic.start msg, maintenanceRequestModel, (err, msg, dialog) ->
      if err
        robot.logger.error err
      else
        data = dialog.fetch()
        robot.logger.info data
# dialog is an instance of an EventEmitter
# It emits an `end` event when the dialog with the user is done