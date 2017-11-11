const http = require('http');
const path = require('path');
const yakbak = require('yakbak');

// eslint-disable-next-line padding-line-between-statements
const createYakbakPreprocessor = ({ autoStart = [], tapes = 'tapes', replace = [] }, logger) => {
    const log = logger.create('preprocessor.yakbak');
    const ports = new Map();
    const startServer = (url, port) => {
        if (ports.has(url)) {
            return ports.get(url);
        }

        log.debug('Starting a proxy server for "%s".', url);

        ports.set(url, port);

        http
            .createServer(yakbak(url, { dirname: path.resolve(tapes) }))
            .listen(port)
            .on('error', () => log.error('Starting the server for "%s" failed.', url));

        return port;
    };

    // Start all proxy servers which should start automatically.
    for (const [ index, url ] of autoStart.entries()) {
        startServer(url, 3000 + index);
    }

    return (content, file, done) => {
        let replacedContent = content;

        for (const [ index, url ] of replace.entries()) {
            const regex = new RegExp(url
                .replace(/\//g, '\\/')
                .replace(/\./g, '\\.'), 'g');

            if (regex.test(content)) {
                let port = 3000 + autoStart.length + index;

                log.debug('Replacing all occurrences of "%s" in "%s".', url, file.originalPath);

                port = startServer(url, port);

                replacedContent = replacedContent.replace(regex, `http://localhost:${ port }`);
            }
        }

        done(replacedContent);
    };
};

createYakbakPreprocessor.$inject = [ 'config.yakbak', 'logger' ];

module.exports = { 'preprocessor:yakbak': [ 'factory', createYakbakPreprocessor ] };
