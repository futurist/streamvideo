// Join splitted mp4 files into one stream and feed html5 video

var fs = require('fs')
var http = require('http')
var path = require('path')
var CombinedStream = require('combined-stream2')
var leftPad = require('left-pad')

http.createServer(function (req, res) {
  if (req.url != '/movie.mp4') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end('<video src="http://localhost:8888/movie.mp4" controls></video>')
  } else {
    var size = 19738853
    var range = req.headers.range
    if (!range) {
      // 416 Wrong range
      return res.sendStatus(416)
    }
    var positions = range.replace(/bytes=/, '').split('-')
    var start = parseInt(positions[0], 10)
    var total = size
    var end = positions[1] ? parseInt(positions[1], 10) : total - 1
    var chunksize = (end - start) + 1
    console.log(range, total, positions, start, end, chunksize)

    res.writeHead(206, {
      'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4'
    })

    var rs = CombinedStream.create()

    for (var i = 1; i <= 20; i++)
      rs.append(fs.createReadStream('data/A.' + leftPad(i, 3, 0)))

    rs.pipe(res)
  }
}).listen(8888)
