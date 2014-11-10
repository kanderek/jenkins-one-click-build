define(function (require) {
	'use strict';

	var mocha = require('mocha');
	var should = require('chai').should();

	var contentScript = require('content');

	function LocalStorage() {
		this.localStorage = {};
	}

	LocalStorage.prototype.setItem = function(key, value) {
		this.localStorage[key] = value;
	};

	LocalStorage.prototype.getItem = function(key) {
		return this.localStorage[key];
	};

	LocalStorage.prototype.empty = function() {
		this.localStorage = {};
	};

	var localStorage = new LocalStorage();

	describe('Content Script', function () {

		describe('addNameSpace', function () {

			before(function () {

			});

			it('should place the object as the value and the name of the extension as the key', function() {
				var object = {'name': 'bob'};
				var namespacedObject = contentScript.addNameSpace('people', object);

				namespacedObject['people'].should.be.equal(object);
			});
		});

		describe('sortSubmissionsBy', function () {

			var submissions = [
				{submission: "some key 1", metadata: {count: 18, dateTime: 110000100}},
				{submission: "some key 2", metadata: {count: 50, dateTime: 120000100}},
				{submission: "some key 3", metadata: {count: 2, dateTime: 10000100}},
				{submission: "some key 4", metadata: {count: 54, dateTime: 310000100}},
				{submission: "some key 5", metadata: {count: 22, dateTime: 1103300100}},
				{submission: "some key 6", metadata: {count: 19, dateTime: 710000100}},
				{submission: "some key 7", metadata: {count: 7, dateTime: 100000100}},
			];

			it('should sort submissions in order of count', function () {
				contentScript.sortSubmissionsBy(submissions, 'count');
				submissions[0].metadata.count.should.be.equal(54);
				submissions[0].submission.should.be.equal("some key 4");

			});
		});

		describe('storeSubmission', function () {

			var formValues;

			before(function () {
				// contentScript.getFormValues('develop', 'dkan');
				//"{"jenkins-one-click":{"branch":"branch","endPoint":"endPoint","minify":false,"isDefault":false,"releaseNotes":false}}"

			});

			it('should store a new submission if the key is not in localStorage', function () {
				
				var submission = contentScript.storeSubmission();
				// console.log(localStorage);
				var result = localStorage.getItem(submission);
				// result.count.should.be.equal("1");

			});

			after(function () {
				localStorage.empty();
			});
		});

	});
});