// Create web server
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var server = http.createServer(function (req, res) {
  var pathname = url.parse(req.url).pathname;
  var filepath = path.join(__dirname, pathname);
  fs.stat(filepath, function (err, stats) {
    if (err) {
      res.writeHead(404, 'Not Found', { 'Content-Type': 'text/plain' });
      res.end('This request URL ' + pathname + ' was not found on this server.');
    } else {
      if (stats.isFile()) {
        res.writeHead(200, 'OK');
        fs.createReadStream(filepath).pipe(res);
      } else if (stats.isDirectory()) {
        fs.readdir(filepath, function (err, files) {
          res.writeHead(200, 'OK', { 'Content-Type': 'text/html' });
          var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + pathname + '</title></head><body><ul>';
          files.forEach(function (item) {
            var link = path.join(pathname, item);
            html += '<li><a href="' + link + '">' + item + '</a></li>';
          });
          html += '</ul></body></html>';
          res.end(html);
        });
      }
    }
  });
});

server.listen(3000, '');