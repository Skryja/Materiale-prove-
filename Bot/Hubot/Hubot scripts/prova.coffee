url = require('url')
querystring = require('querystring')

module.exports = (robot) ->

  robot.router.get "/hubot/message", (req, res) ->
    query = querystring.parse(url.parse(req.url).query)

    user = {}
    user.room = query.room if query.room

    try
       robot.send user, "INCOMING MESSAGE: " + query.message

       res.end "message sent: #{query.message}"

    catch error
      console.log "message-listner error: #{error}."


  robot.router.post "/hubot/say", (req, res) ->
    body = req.body
    room = body.room
    message = body.message

    robot.logger.info "Message '#{message}' received for room #{room}"

    envelope = robot.brain.userForId 'broadcast'
    envelope.user = {}
    envelope.user.room = envelope.room = room if room
    envelope.user.type = body.type or 'groupchat'

    if message
      robot.send envelope, message

    res.writeHead 200, {'Content-Type': 'text/plain'}
    res.end 'Thanks\n'