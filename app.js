var http = require('http'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server, { log: false });

require('dotenv').config();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/play.html');
});

app.get('/board', function(req, res) {
    res.sendFile(__dirname + '/board.html');
});

app.get('/test', function(req, res) {
    res.sendFile(__dirname + '/test.html');
});

server.listen(process.env.PORT);
console.log('Server started on Port', process.env.PORT);

var games = [];
var cities = [
    { name: "Amsterdam, Netherlands", lat: 52.22, lng: 4.53 },
    { name: "Ankara, Turkey", lat: 39.55, lng: 32.55 },
    { name: "Athens, Greece", lat: 37.58, lng: 23.43 },
    { name: "Bangkok, Thailand", lat: 13.45, lng: 100.30 },
    { name: "Barcelona, Spain", lat: 41.23, lng: 2.9 },
    { name: "Beijing, China", lat: 39.55, lng: 116.25 },
    { name: "Belgrade, Serbia", lat: 44.52, lng: 20.32 },
    { name: "Berlin, Germany", lat: 52.30, lng: 13.25 },
    { name: "Bombay, India", lat: 19.0, lng: 72.48 },
    { name: "Brussels, Belgium", lat: 50.52, lng: 4.22 },
    { name: "Bucharest, Romania", lat: 44.25, lng: 26.7 },
    { name: "Budapest, Hungary", lat: 47.30, lng: 19.5 },
    { name: "Cairo, Egypt", lat: 30.2, lng: 31.21 },
    { name: "Calcutta, India", lat: 22.34, lng: 88.24 },
    { name: "Chongqing, China", lat: 29.46, lng: 106.34 },
    { name: "Copenhagen, Denmark", lat: 55.40, lng: 12.34 },
    { name: "Djibouti, Djibouti", lat: 11.30, lng: 43.3 },
    { name: "Hammerfest, Norway", lat: 70.38, lng: 23.38 },
    { name: "Helsinki, Finland", lat: 60.10, lng: 25.0 },
    { name: "Hong Kong, China", lat: 22.20, lng: 114.11 },
    { name: "Irkutsk, Russia", lat: 52.30, lng: 104.20 },
    { name: "Kuala Lumpur, Malaysia", lat: 3.8, lng: 101.42 },
    { name: "Manila, Philippines", lat: 14.35, lng: 120.57 },
    { name: "Mecca, Saudi Arabia", lat: 21.29, lng: 39.45 },
    { name: "Moscow, Russia", lat: 55.45, lng: 37.36 },
    { name: "Nagasaki, Japan", lat: 32.48, lng: 129.57 },
    { name: "New Delhi, India", lat: 28.35, lng: 77.12 },
    { name: "Odessa, Ukraine", lat: 46.27, lng: 30.48 },
    { name: "Osaka, Japan", lat: 34.32, lng: 135.30 },
    { name: "Oslo, Norway", lat: 59.57, lng: 10.42 },
    { name: "Paris, France", lat: 48.48, lng: 2.20 },
    { name: "Prague, Czech Republic", lat: 50.5, lng: 14.26 },
    { name: "Rangoon, Myanmar", lat: 16.50, lng: 96.0 },
    { name: "Rome, Italy", lat: 41.54, lng: 12.27 },
    { name: "St. Petersburg, Russia", lat: 59.56, lng: 30.18 },
    { name: "Shanghai, China", lat: 31.10, lng: 121.28 },
    { name: "Singapore, Singapore", lat: 1.14, lng: 103.55 },
    { name: "Sofia, Bulgaria", lat: 42.40, lng: 23.20 },
    { name: "Stockholm, Sweden", lat: 59.17, lng: 18.3 },
    { name: "Teheran, Iran", lat: 35.45, lng: 51.45 },
    { name: "Tokyo, Japan", lat: 35.40, lng: 139.45 },
    { name: "Tripoli, Libya", lat: 32.57, lng: 13.12 },
    { name: "Vienna, Austria", lat: 48.14, lng: 16.20 },
    { name: "Vladivostok, Russia", lat: 43.10, lng: 132.0 },
    { name: "Warsaw, Poland", lat: 52.14, lng: 21.0 },
    { name: "Zürich, Switzerland", lat: 47.21, lng: 8.31 },
    { name: "Bogotá, Colombia", lat: 4.32, lng: -74.15 },
    { name: "Caracas, Venezuela", lat: 10.28, lng: -67.2 },
    { name: "Cayenne, French Guiana", lat: 4.49, lng: -52.18 },
    { name: "Chihuahua, Mexico", lat: 28.37, lng: -106.5 },
    { name: "Dakar, Senegal", lat: 14.40, lng: -17.28 },
    { name: "Georgetown, Guyana", lat: 6.45, lng: -58.15 },
    { name: "Guatemala City, Guatemala", lat: 14.37, lng: -90.31 },
    { name: "Havana, Cuba", lat: 23.8, lng: -82.23 },
    { name: "Kingston, Jamaica", lat: 17.59, lng: -76.49 },
    { name: "Lisbon, Portugal", lat: 38.44, lng: -9.9 },
    { name: "London, England", lat: 51.32, lng: -0.5 },
    { name: "Madrid, Spain", lat: 40.26, lng: -3.42 },
    { name: "Mexico City, Mexico", lat: 19.26, lng: -99.7 },
    { name: "Panama City, Panama", lat: 8.58, lng: -79.32 },
    { name: "Paramaribo, Suriname", lat: 5.45, lng: -55.15 },
    { name: "Reykjavík, Iceland", lat: 64.4, lng: -21.58 },
    { name: "Veracruz, Mexico", lat: 19.10, lng: -96.1 },
    { name: "Adelaide, Australia", lat: -34.55, lng: 138.36 },
    { name: "Auckland, New Zealand", lat: -36.52, lng: 174.45 },
    { name: "Cape Town, South Africa", lat: -33.55, lng: 18.22 },
    { name: "Durban, South Africa", lat: -29.53, lng: 30.53 },
    { name: "Hobart, Tasmania", lat: -42.52, lng: 147.19 },
    { name: "Jakarta, Indonesia", lat: -6.16, lng: 106.48 },
    { name: "Johannesburg, South Africa", lat: -26.12, lng: 28.4 },
    { name: "Kinshasa, Congo", lat: -4.18, lng: 15.17 },
    { name: "Melbourne, Australia", lat: -37.47, lng: 144.58 },
    { name: "Nairobi, Kenya", lat: -1.25, lng: 36.55 },
    { name: "Port Moresby, Papua New Guinea", lat: -9.25, lng: 147.8 },
    { name: "Tananarive, Madagascar", lat: -18.5, lng: 47.33 },
    { name: "Wellington, New Zealand", lat: -41.17, lng: 174.47 },
    { name: "Asunción, Paraguay", lat: -25.15, lng: -57.4 },
    { name: "Belém, Brazil", lat: -1.28, lng: -48.29 },
    { name: "Buenos Aires, Argentina", lat: -34.35, lng: -58.22 },
    { name: "Córdoba, Argentina", lat: -31.28, lng: -64.1 },
    { name: "Guayaquil, Ecuador", lat: -2.1, lng: -79.56 },
    { name: "Iquique, Chile", lat: -20.1, lng: -70.7 },
    { name: "La Paz, Bolivia", lat: -16.27, lng: -68.22 },
    { name: "Lima, Peru", lat: -12, lng: -77.2 },
    { name: "Montevideo, Uruguay", lat: -34.53, lng: -56.1 },
    { name: "Rio de Janeiro, Brazil", lat: -22.57, lng: -43.12 },
    { name: "Santiago, Chile", lat: -33.28, lng: -70.45 },
    { name: "São Paulo, Brazil", lat: -23.31, lng: -46.31 },
    { name: "Austin, USA", lat: 30.16, lng: -97.44 },
    { name: "Boston, USA", lat: 42.21, lng: -71.5 },
    { name: "Honolulu, USA", lat: 21.18, lng: -157.5 },
    { name: "Las Vegas, USA", lat: 36.1, lng: -115.12 },
    { name: "Los Angeles, USA", lat: 34.3, lng: -118.15 },
    { name: "Miami, USA", lat: 25.46, lng: -80.12 },
    { name: "New York, USA", lat: 40.47, lng: -73.58 },
    { name: "Quebec, Canada", lat: 46.49, lng: -71.11 },
    { name: "Washington D.C., USA", lat: 38.53, lng: -77.02 }
];

io.sockets.on('connection', function (socket) {

    socket.on('disconnect', function () {
        console.log(socket.id + ' disconnected');

        if (socket.player === true) {
            if (socket.game === undefined) {
                console.log('Game not found');
            } else {
                if (socket.game.players[socket.id] === undefined) {
                    console.log('Player not found');
                } else {
                    var player = socket.game.players[socket.id];
                    player.disconnect();
                }
            }
        }
    });

    ///////////
    // BOARD //
    ///////////

    socket.on('bJoin', function () {
        socket.player = false;

        // TODO: multiple games
        socket.game = new Game(socket, 1);
        games[1] = socket.game;
    });

    socket.on('bRestart', function () {
        if (socket.game === undefined) {
            console.log('Game not found');
        } else {
            socket.game.restart();
        }
    });

    ////////////
    // CLIENT //
    ////////////

    socket.on('pJoin', function (data) {
        socket.player = true;

        if (games[data.gid] === undefined) {
            console.log('Game not found');
        } else {
            socket.game = games[data.gid];
            socket.game.players[socket.id] = new Player(socket, data.name, socket.game);
            socket.game.start();
        }
    });

    socket.on('pFire', function (targetId) {
        if (socket.game === undefined) {
            console.log('Game not found');
        } else {
            if (socket.game.players[socket.id] === undefined) {
                console.log('Player not found');
            } else {
                if (socket.game.players[targetId] === undefined) {
                    console.log('Target not found');
                } else {
                    var player = socket.game.players[socket.id];
                    player.fire(targetId);
                }
            }
        }
    });
});

function Game(socket, id) {
    var startDelay = 30 * 1000;

    this.s = socket;
    this.id = id;
    this.players = [];
    this.leaderboard = [];
    this.state = 'waiting';
    this.cities = cities;

    console.log('New game with id #' + id);

    this.start = function () {
        var playerCount = 0;
        for (var i in this.players) {
            playerCount++;
        }

        if (this.state === 'waiting' && playerCount > 1) {
            this.reset();
        }
    };

    this.reset = function () {
        this.leaderboard = [];
        this.cities = cities;
        this.s.emit('startCountdown', startDelay);
        this.state = 'starting';

        var game = this;
        setTimeout(function () {
            console.log('Game #' + game.id + ' is starting a new round');

            for (var i in game.players) {
                game.players[i].reset();
            }

            game.updateTargets();
            game.state = 'active';
        }, startDelay);
    };

    this.updateTargets = function () {
        var targets = {};
        var survivors = [];

        for (var i in this.players)
            if (this.players[i].lives > 0) {
                targets[this.players[i].id] = this.players[i].name;
                survivors.push(this.players[i].id);
            }

        if (survivors.length <= 1 && this.state === 'active') {
            this.endgame(survivors[0]);
        } else {
            for (var i in this.players) {
                this.players[i].s.emit('pUpdateTargets', targets);
            }
        }
    };

    this.disconnect = function () {
        console.log('Game ' + this.id + ' has disconnected');
    };

    this.endgame = function (winnerId) {
        var winner = this.players[winnerId];

        if (winner) {
            winner.s.emit('pWin');
        }

        this.state = 'ended';
        this.leaderboard.unshift(winner.id);
        this.s.emit('endgame', { leaderboard: this.leaderboard });

        var game = this;
        setTimeout(function () {
            game.state = 'waiting';
            game.start();
        }, 10000);

        console.log(winner.name + ' won game with id #' + this.id);
        console.log(this.leaderboard);
    };
}

function Player(socket, name, game) {
    this.s = socket;
    this.id = socket.id;
    this.name = name;
    this.game = game;
    this.lives = 0;
    this.city = null;

    this.game.s.emit('message', "<strong>" + this.name + "</strong> has joined the game");
    console.log(name + ' has joined game #' + game.id + ' with ID ' + socket.id);

    this.getCity = function () {
        var r = Math.floor(Math.random() * this.game.cities.length);
        return this.game.cities.splice(r, 1)[0];
    };

    this.reset = function () {
        this.lives = 3;
        this.city = this.getCity();
        this.s.emit('pReset', { id:this.id, city:this.city });
        
        console.log(name + ' joined the round');
        
        this.game.s.emit('playerJoined', { id:this.id, name:this.name, city:this.city });
    };

    this.fire = function (targetId) {
        var player = this;
        var target = this.game.players[targetId];
        console.log(player.name + ' has fired at ' + target.name);

        var distance = getDistance(player.city.lat, player.city.lng, target.city.lat, target.city.lng);
        var duration = Math.floor(distance * 3);

        this.game.s.emit('launch', {
            targetCity:target.city,
            targetId:target.id,
            startCity:player.city,
            duration:duration
        });

        target.s.emit('pIncoming', { attacker:player.name });

        setTimeout(function () {
            player.game.s.emit('message', "<strong>" + player.name + "</strong> hit " + target.name);
            target.s.emit('pHit');
            target.lives--;

            if (target.lives === 0) {
                target.die(player);
            }

        }, duration);
    };

    this.die = function (killer) {
        console.log(killer.name + ' has killed ' + this.name);
        if (killer.id == this.id) {
            this.game.s.emit('message', "<strong>" + this.name + "</strong> killed themself!");
        } else {
            this.game.s.emit('message', "<strong>" + killer.name + "</strong> killed <strong>" + this.name + "</strong>");
        }

        this.game.leaderboard.unshift(this.id);
        this.game.updateTargets();

        this.s.emit('kill', { killer:killer.name });
        this.game.s.emit('kill', { player: this.id });
    };

    this.disconnect = function() {
        console.log(this.name + ' has left the game');

        delete this.game.players[this.id];

        this.game.updateTargets();
        this.game.s.emit('playerLeft', { player:socket.id });
        this.game.s.emit('message', "<strong>" + this.name + "</strong> has left the game");
    };
}

function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = deg2rad(lat2-lat1);
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}
