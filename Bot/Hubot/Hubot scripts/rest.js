var Adapter, RestAdapter, Robot, TextMessage, request, sendMessageUrl,
    extend = function (child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

Robot = require('hubot').Robot;

Adapter = require('hubot').Adapter;

TextMessage = require('hubot').TextMessage;

request = require('request');

sendMessageUrl = process.env.HUBOT_REST_SEND_URL;

RestAdapter = (function (superClass) {
    extend(RestAdapter, superClass);

    function RestAdapter() {
        return RestAdapter.__super__.constructor.apply(this, arguments);
    }

    RestAdapter.prototype.createUser = function (username, room) {
        var id, user;
        user = this.userForName(username);
        if (user == null) {
            id = new Date().getTime().toString();
            user = this.userForId(id);
            user.name = username;
        }
        user.room = room;
        return user;
    };

    RestAdapter.prototype.send = function () {
        var strings, user;
        user = arguments[0], strings = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        if (strings.length > 0) {
            request.post(sendMessageUrl + user.room).form({
                message: strings.shift(),
                from: 'atlas'
            });
            return this.send.apply(this, [user].concat(slice.call(strings)));
        }
    };

    RestAdapter.prototype.reply = function () {
        var strings, user;
        user = arguments[0], strings = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        return this.send.apply(this, [user].concat(slice.call(strings.map(function (str) {
            return user.user + ": " + str;
        }))));
    };

    RestAdapter.prototype.run = function () {
        var options, self;
        self = this;
        options = {};
        this.robot.router.post('/receive/:room', function (req, res) {
            var user;
            user = self.createUser(req.body.from, req.params.room);
            res.setHeader('content-type', 'text/html');
            self.receive(new TextMessage(user, req.body.message));
            return res.end('received');
        });
        return self.emit("connected");
    };

    return RestAdapter;

})(Adapter);

exports.use = function (robot) {
    return new RestAdapter(robot);
};