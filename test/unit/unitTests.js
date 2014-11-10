define(function (require) {
	'use strict';

	console.log('unitTests should run here');
	var mocha = require('mocha');

	// mocha.setup('bdd');
	
	var contentTest = require('contentTest');
	var backgroundTest = require('backgroundTest');

    if (window.mochaPhantomJS) {
      mochaPhantomJS.run();
    }
    else {
      mocha.run();
    }
});