/*
  CONGRATULATIONS on creating your first Botpress bot!

  This is the programmatic entry point of your bot.
  Your bot's logic resides here.
  
  Here's the next steps for you:
  1. Read this file to understand how this simple bot works
  2. Read the `content.yml` file to understand how messages are sent
  3. Install a connector module (Facebook Messenger and/or Slack)
  4. Customize your bot!

  Happy bot building!

  The Botpress Team
  ----
  Getting Started (Youtube Video): https://www.youtube.com/watch?v=HTpUmDz9kRY
  Documentation: https://botpress.io/docs
  Our Slack Community: https://slack.botpress.io
*/
var http = require('http');
var request = require('request');
var subscription = require('botpress-subscription');


var data = { "filterParameters": { "IDSupportGroup": 0, "Name": null } };

module.exports = function (bp) {
  // Listens for a first message (this is a Regex)
  // GET_STARTED is the first message you get on Facebook Messenger

  /*  bp.hear(/ciao|hello|hi|hey/i, (event, next) => {
      event.reply('#welcome') // See the file `content.yml` to see the block
    })
  
    // You can also pass a matcher object to better filter events
    bp.hear({
      type: /message|text/i,
      text: /exit|bye|goodbye|quit|done|leave|stop/i
    }, (event, next) => {
      event.reply('#goodbye', {
        // You can pass data to the UMM bloc!
        reason: 'unknown'
      })
    })
  */
  var greetings = false;

  bp.hear(/ciao|hey|buongiorno|buon giorno/i, (event, next) => {

    if (!greetings) {

      greetings = true;

      bp.convo.start(event, convo => {

        convo.say('#welcome');
        //doRequest(convo);   test POST command
        convo.threads['default'].addQuestion('#askUserEmail', [

          {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            callback: (response) => {
              convo.set('email', response.text);
              convo.say('#askUserEmail_reply', { email: response.text });
              convo.next();
            }
          },
          {
            default: true,
            callback: () => {
              convo.say('#wrongEmail');
              convo.repeat();
            }
          }

        ]);

        convo.threads['default'].addQuestion('#choiceNewsletter', [

          {
            pattern: /1|nuovo di fabbrica|fabbrica/i,
            callback: () => {
              convo.say('#fabbricaResponse', { email: convo.get('email') });
              greetings = false;
              convo.next();
            }
          },
          {
            pattern: /2|multiux/i,
            callback: () => {
              registerMultiux(convo.get('email'));
              convo.say('#multiuxResponse', { email: convo.get('email') });
              greetings = false;
              convo.next();
            }
          },
          {
            pattern: /3|xuniplay/i,
            callback: () => {
              convo.say('#xuniplayResponse', { email: convo.get('email') });
              greetings = false;
              convo.next();
            }
          },
          {
            default: true,
            callback: () => {
              convo.say('#wrongChoice');
              convo.repeat();
            }
          }
        ]);

      });
    }

  });

}

function doRequest(convo) {

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
    convo.say('#request', { req: response.body });
    return;
  });

}

function registerMultiux(email) {
  
  // check if category Multiux exists
  var a;
  var list = subscription.bp.getRouter('botpress-subscription').get();
  console.log("Questa è la lista " + list + " e questo non definito " + a);

}