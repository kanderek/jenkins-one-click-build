// define(function (require) {
(function () {
    'use strict';
    
    // var $ = require('jquery');

    var EXTENSION_NAME = 'jenkins-one-click';
    var selectedBuild = {};

    $.get(chrome.extension.getURL('src/html/content.html'), function (injectedHtml) {
        $('body').append(injectedHtml);
        Jenkins.updateView();

    }).then(function () {

        $('#' + EXTENSION_NAME).on('click', '> div', function (event) {
            var target = event.currentTarget;
            var clickedElement = event.target;
            var buildIndex;

            if (target.id.indexOf('top-build-') !== -1) {
                buildIndex = target.id.match(/-(\d*)$/)[1];
                selectedBuild = Jenkins.selectExistingBuild(buildIndex);

                if (clickedElement.classList.contains('trashbin')) {
                    Jenkins.removeBuildFromList(selectedBuild);
                } else {
                    Jenkins.storeSubmission(selectedBuild);
                }
                console.log(Jenkins.getAllFromStorage());
                Jenkins.updateView();
            }
        });

    });

    var Jenkins = {

        selectExistingBuild: function (buildIndex) {
            var values = {
                    branch: $('#branch-' + buildIndex).html(),
                    endPoint: $('#end-point-' + buildIndex).html(),
                    minify: $('#minified-' + buildIndex).html() === 'x' ? true : false,
                    isDefault: $('#default-' + buildIndex).html() === 'x' ? true : false,
                    releaseNotes: $('#release-notes-' + buildIndex).html() === 'x' ? true : false
                };

            return values;
        },

        getFormValues: function () {
            var values = {
                    branch: 'branch',
                    endPoint: 'endPoint',
                    minify: false,
                    isDefault: false,
                    releaseNotes: false,
                };

            return values;
        },

        removeBuildFromList: function (selectedBuild) {

            try {
                var buildKey = JSON.stringify(this.addNameSpace(EXTENSION_NAME, selectedBuild));

                localStorage.removeItem(buildKey);
            } catch (error) {
                throw new Error("Error while trying to remove build from list. Build not removed.");
            }
        },

        writeValuesToDom: function (buildIndex, buildInfo, totalCount) {
            var x;
            var width;
            var relativeBuildTime = moment(buildInfo.metadata.lastBuild).fromNow();

            $('#last-build-' + buildIndex).html(relativeBuildTime);

            $('#branch-' + buildIndex).html(buildInfo.submission.branch);
            $('#end-point-' + buildIndex).html(buildInfo.submission.endPoint);
            
            x = buildInfo.submission.minify ? 'x' : '';
            $('#minified-' + buildIndex).html(x);

            x = buildInfo.submission.isDefault ? 'x' : '';
            $('#default-' + buildIndex).html(x);

            x = buildInfo.submission.releaseNotes ? 'x' : '';
            $('#release-notes-' + buildIndex).html(x);

            width = $('#top-build-' + buildIndex + ' div.total-count').width();
            $('#top-build-' + buildIndex + ' div.percent-count').width(width*buildInfo.metadata.count/totalCount);
        },

        updateView: function () {
            var allBuilds = this.getAllFromStorage();
            var totalBuilds = allBuilds.length;
            var buildIndex;
            var totalCount = 0;
            var tops = 3;

            this.sortSubmissionsBy(allBuilds, 'dateTime');
            
            for (var i=0; i < totalBuilds; i++) {
                totalCount += allBuilds[i].metadata.count;
            }
            

            for (i=0; i < tops; i++) {
                buildIndex = i+1;
                if (i < totalBuilds) {
                    $('#top-build-' + buildIndex).removeClass('hide');
                    this.writeValuesToDom(buildIndex, allBuilds[i], totalCount);
                } else {
                    $('#top-build-' + buildIndex).addClass('hide');
                }
            }
        },

        addNameSpace: function (namespace, valuesObj) {
            var namespacedObject = {};

            namespacedObject[namespace] = valuesObj;

            return namespacedObject;
        },

        stripNameSpace: function (stringObject) {
            var submission;

            if (this.isInNamespace(stringObject)) {
                submission = JSON.parse(stringObject);
                return submission[EXTENSION_NAME];
            } else {
                return {};
            }
        },

        storeSubmission: function (submissionToStore) {
            var submission = JSON.stringify(this.addNameSpace(EXTENSION_NAME, submissionToStore));
            var fetchedSubmission = JSON.parse(localStorage.getItem(submission));
            var dateTime = Date.now();
            var count;

            if (fetchedSubmission) {
                count = fetchedSubmission.count + 1;
                localStorage.setItem(submission, JSON.stringify({count: count, lastBuild: dateTime}));
            } else {
                localStorage.setItem(submission, JSON.stringify({count: 1, lastBuild: dateTime}));
            }

            return submission;
        },

        getAllFromStorage: function () {
            var submissions = localStorage;
            var submissionsAndMetadata = [];

            for (var submission in submissions) {
                if (this.isInNamespace(submission)) {
                    submissionsAndMetadata.push({
                        submission: this.stripNameSpace(submission),
                        metadata: JSON.parse(submissions[submission])
                    });
                }
            }

            return submissionsAndMetadata;
        },

        removeAllFromStorage: function () {
            var submissions = localStorage;

            for (var submission in submissions) {
                if (this.isInNamespace(submission)) {
                    localStorage.removeItem(submission);
                }
            }
        },

        compareDateTime: function (a, b) {
            return b.metadata.dateTime - a.metadata.dateTime;
        },

        compareCount: function (a, b) {
            return b.metadata.count - a.metadata.count;
        },

        sortSubmissionsBy: function (submissions, type) {
            if (type === 'dateTime') {
                submissions.sort(this.compareDateTime);
            } else if (type === 'count') {
                submissions.sort(this.compareCount);
            }

            return submissions;
        },

        isInNamespace: function (submission) {
            return submission.indexOf(EXTENSION_NAME) !== -1 ? true : false;
        },

        generateDummyValues: function () {

        }
    };

    return Jenkins;
})();






