var Jenkins = {

    setFormValues: function (submission) {

        textInputs[0].value = submission.branch;
        textInputs[1].value = submission.endPoint;
        checkboxInputs[0].checked = submission.minify;
        checkboxInputs[1].checked = submission.isDefault;
        checkboxInputs[2].checked = submission.releaseNotes;
    },

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
                branch: textInputs[0].value,
                endPoint: textInputs[1].value,
                minify: checkboxInputs[0].checked,
                isDefault: checkboxInputs[1].checked,
                releaseNotes: checkboxInputs[2].checked,
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
        $('#branch-' + buildIndex).attr('href', githubBranchUrl + buildInfo.submission.branch);
        $('#end-point-' + buildIndex).html(buildInfo.submission.endPoint);
        $('#end-point-' + buildIndex).attr('href', hammerheadEndpointUrl + buildInfo.submission.endPoint + '/');

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
        var buildIndex;
        var tops = 3;
        var totalCount = 0;

        this.sortSubmissionsBy(allBuilds, 'dateTime');
        
        totalCount = this.getTotalBuildCount(allBuilds);

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

    getTotalBuildCount: function (allBuilds) {
        var totalBuilds = allBuilds.length;
        var totalCount = 0;

        for (var i=0; i < totalBuilds; i++) {
            totalCount += allBuilds[i].metadata.count;
        }

        return totalCount;
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
        return b.metadata.lastBuild - a.metadata.lastBuild;
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

    sortSubmissionsByTime: function (submissions) {
        submissions.sort(this.compareDateTime);
        return submissions;
    },

    sortSubmissionsByCount: function (submissions) {
        submissions.sort(this.compareCount);
        return submissions;
    },

    isInNamespace: function (submission) {
        return submission.indexOf(EXTENSION_NAME) !== -1 ? true : false;
    }
};