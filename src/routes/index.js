const path = require('path')
const fs = require('fs')
const mime = require('mime-types')

module.exports = {
    listener: async function  (req, res) {
        let {url, method} = req

        let fullpath = __dirname + '/../public' + url

        try {
            if (fs.statSync(fullpath).isDirectory()) {
                fullpath += fullpath.endsWith('/') ? 'index.html' : '/index.html'
            }

            const s = fs.createReadStream(fullpath);
            const filename = path.basename(fullpath)
            s.on('open', () => {
                res.setHeader('Content-Type', mime.contentType(filename));
                s.pipe(res);
            })
            s.on('error', () => {
                res.writeHead('404', {'Content-Type': 'text/plain'})
                res.end('File not Found')
            })
        } catch (error) {
            res.writeHead('404', {'Content-Type': 'text/plain'})
            res.end('File not Found')
        }
    }
}