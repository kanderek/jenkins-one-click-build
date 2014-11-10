define( function() {

    requirejs.config({
        baseUrl: '/',
        paths: {
            'mocha': 'test/lib/mocha',
            'chai': 'test/lib/chai',
            'jquery': 'src/js/lib/jquery-1.11.1',
            'content': 'src/js/content',
            'contentTest': 'test/unit/contentTest',
            'background': 'src/js/background',
            'backgroundTest': 'test/unit/backgroundTest',
            'unitTests': 'test/unit/unitTests'
        },
        waitSecond: 15,

        shim: {
            'mocha': {
                init: function () {
                    this.mocha.setup('bdd');
                    return this.mocha;
                },
                exports: 'mocha'
            },
            'chai': {
                exports: 'chai'
            }
        }
    });

});

