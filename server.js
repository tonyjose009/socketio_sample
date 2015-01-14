var httpd = require('http').createServer(handler);
var io = require('socket.io').listen(httpd);
var fs = require('fs');
username = '';
httpd.listen(3000);
function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
        function(err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        }
        );
}
io.sockets.on('connection', function (socket) {
    socket.on('clientMessage', function(content) {
        socket.emit('serverMessage', 'You: ' + content.message);
            socket.broadcast.emit('serverMessage', 'User '+content.username+ ': '+content.message);
    });
    socket.on('login', function(username) {
            socket.emit('serverMessage', 'Currently logged in as ' + username);
            socket.broadcast.emit('serverMessage', 'User ' + username +
                ' logged in');
    });
    
    socket.on('disconnect', function() {
            socket.broadcast.emit('serverMessage', 'User ' + username +
                ' disconnected');
    });
    socket.emit('login');
});


