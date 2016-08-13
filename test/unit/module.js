var rewire = require('rewire'),
    sinon = require('sinon');

describe('karma-yakbak-preprocessor', () => {

    var http,
        httpServer,
        karmaYakbakPreprocessor,
        path,
        resolvedPath,
        yakbak,
        yakbakServer;

    beforeEach(() => {
        karmaYakbakPreprocessor = rewire('../../src/module.js');

        http = { createServer: sinon.stub() };
        httpServer = { listen: sinon.stub(), on: sinon.spy() };

        http.createServer.returns(httpServer);
        httpServer.listen.returnsThis();

        path = { resolve: sinon.stub() };
        resolvedPath = 'a fake resolved path';

        path.resolve.returns(resolvedPath);

        yakbak = sinon.stub();
        yakbakServer = 'a fake yakbak server';

        yakbak.returns(yakbakServer);

        karmaYakbakPreprocessor.__set__('http', http);
        karmaYakbakPreprocessor.__set__('path', path);
        karmaYakbakPreprocessor.__set__('yakbak', yakbak);
    });

    describe('createYakbakPreprocessor()', () => {

        var createYakbakPreprocessor,
            log,
            logger;

        beforeEach(() => {
            createYakbakPreprocessor = karmaYakbakPreprocessor['preprocessor:yakbak'][1];

            logger = { create: sinon.stub() };
            log = { debug: sinon.spy(), error: sinon.spy() };

            logger.create.returns(log);
        });

        it('should create a log', () => {
            createYakbakPreprocessor({}, logger);

            expect(logger.create).to.have.been.calledOnce;
            expect(logger.create).to.have.been.calledWithExactly('preprocessor.yakbak');
        });

        describe('with empty autoStart and replace options', () => {

            it('should not create any server', () => {
                createYakbakPreprocessor({}, logger);

                expect(http.createServer).to.have.not.been.called;
            });

        });

        describe('with an autoStart option and an empty replace option', () => {

            it('should create a server right away', () => {
                var url = 'a://fake.url';

                createYakbakPreprocessor({ autoStart: [ url ] }, logger);

                expect(log.debug).to.have.been.calledOnce;
                expect(log.debug).to.have.been.calledWithExactly('Starting a proxy server for "%s".', url);

                expect(path.resolve).to.have.been.calledOnce;
                expect(path.resolve).to.have.been.calledWithExactly('tapes');

                expect(yakbak).to.have.been.calledOnce;
                expect(yakbak).to.have.been.calledWithExactly(url, { dirname: resolvedPath });

                expect(http.createServer).to.have.been.calledOnce;
                expect(http.createServer).to.have.been.calledWithExactly(yakbakServer);

                expect(httpServer.listen).to.have.been.calledOnce;
                expect(httpServer.listen).to.have.been.calledWithExactly(3000);
            });

        });

        describe('with an empty autoStart option and a replace option', () => {

            var url;

            beforeEach(() => url = 'a://fake.url');

            it('should not create any server right away', () => {
                createYakbakPreprocessor({ replace: [ url ] }, logger);

                expect(log.debug).to.have.not.been.called;
                expect(path.resolve).to.have.not.been.called;
                expect(yakbak).to.have.not.been.called;
                expect(http.createServer).to.have.not.been.called;
                expect(httpServer.listen).to.have.not.been.called;
            });

            it('should not create a server when preprocessing', () => {
                var content = `some random content which contains the ${ url } and not much more`,
                    done = sinon.stub(),
                    originalPath = 'a fake originalPath',
                    preprocessor = createYakbakPreprocessor({ replace: [ url ] }, logger);

                preprocessor(content, { originalPath }, done)

                expect(log.debug).to.have.been.calledTwice;
                expect(log.debug).to.have.been.calledWithExactly('Replacing all occurrences of "%s" in "%s".', url, originalPath);
                expect(log.debug).to.have.been.calledWithExactly('Starting a proxy server for "%s".', url);

                expect(path.resolve).to.have.been.calledOnce;
                expect(path.resolve).to.have.been.calledWithExactly('tapes');

                expect(yakbak).to.have.been.calledOnce;
                expect(yakbak).to.have.been.calledWithExactly(url, { dirname: resolvedPath });

                expect(http.createServer).to.have.been.calledOnce;
                expect(http.createServer).to.have.been.calledWithExactly(yakbakServer);

                expect(httpServer.listen).to.have.been.calledOnce;
                expect(httpServer.listen).to.have.been.calledWithExactly(3000);

                expect(done).to.have.been.calledOnce;
                expect(done).to.have.been.calledWithExactly('some random content which contains the http://localhost:3000 and not much more');
            });

        });

    });

});
