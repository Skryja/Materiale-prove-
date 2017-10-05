# Description:
#   Example scripts for you to examine and try out.
#
# Notes:
#   They are commented out by default, because most of them are pretty silly and
#   wouldn't be useful and amusing enough for day to day huboting.
#   Uncomment the ones you want to try and experiment with.
#
#   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

fs = require 'fs'
path = require 'path'

module.exports = (robot) ->

  brainPath = process.env.FILE_BRAIN_PATH or '/home/utente/hubot'
  brainPath = path.join brainPath, 'brain-dump.txt'

  mail = ""

  robot.hear /buongiorno|ciao|hey/i, (res) ->

    res.send "Ciao, come va? \n Inserisci la tua mail"


  robot.hear /(.*)@(.*)/i, (res) ->
    
    mail = res.match[0]
    re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if mail.match(re)

      res.send "Grazie. A quale newsletter vuoi iscrivere l'utente? \n 1) Nuovo di fabbrica \n 2) MultiUx newsletter \n 3) XuniPlay newsletter"

    else
    
      res.send "Email non valida. Riprovare"  

  robot.hear /1|fabbrica/i, (res) ->

    # check if is @telecomitalia.it
    re = /(.*)@telecomitalia.it/
    
    if mail.match(re)

      res.send "Per gli utenti TIM (@telecomitalia.it) viene inviata una newsletter dedicata con contenuti specifici, Vi è una distinzione anche tra i destinatari TIM delle strutture centrali e quelle dei TERRITORI (vendite e progettazione)"
      res.send "\nIl destinatario lavora per una struttura centrale (marketing, Ingegneria) o una struttura territoriale (vendite, progettazione)?"
    
    else

      res.send "Non è telecomitalia"

  robot.hear /struttura centrale|centrale|marketing|ingegneria/i, (res) ->

    #if non è iscritto 
    if robot.brain.get(mail) == null 
    
      # iscrizione a NL <Nuovo di fabbrica per TIM / CENTRALI>

      robot.brain.set mail, 1
      robot.brain.on 'save', (mail) ->

        fs.writeFileSync brainPath, JSON.stringify(mail), 'utf-8'

      res.send "Ok! Abbiamo iscritto #{mail} alla newsletter Nuovo di Fabbrica."  
      blabla = robot.brain.get(mail)
      res.send "#{blabla}"

    else res.send "L'utente è già iscritto. \n Hai bisogno di altro?"


  robot.hear /struttura territoriale|territoriale|vendite|progettazione/i, (res) ->

    #if non è iscritto
    if robot.brain.get(mail) == null
  
      # iscrizione a NL <Nuovo di fabbrica per TIM>

      robot.brain.set mail, 1
      robot.brain.on 'save', (mail) ->

        fs.writeFileSync brainPath, JSON.stringify(mail), 'utf-8'

      res.send "Ok! Abbiamo iscritto #{mail} alla newsletter Nuovo di Fabbrica."
     
    else res.send "L'utente è già iscritto. \n Hai bisogno di altro?"

  robot.hear /sì|si/i, (res) ->

    res.send "Inserisci la tua mail"
  
  robot.respond /cercami mail/i, (res) ->

    data = fs.readFileSync(brainPath).toString()

    if data
      robot.brain.mergeData data
      res.send "#{data}"
    else
      console.log("è vuoto")
  
