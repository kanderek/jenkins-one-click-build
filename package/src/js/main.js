(function () {
    'use strict';
    
    var selectedBuild = {};
    var pollForSubmitButton;

    $.get(chrome.extension.getURL('src/html/content2.html'), function (injectedHtml) {
        $('body').append(injectedHtml);

    }).then(function () {
 
        pollForSubmitButton = setInterval(function () {
            submitButton = document.getElementById('yui-gen1-button');

            if (submitButton !== null) {
                clearInterval(pollForSubmitButton);
                setupListeners();
            }

        }, 200);

    });

    var setupListeners = function () {
        // enable build-card listeners here...

        submitButton.addEventListener('click', function (event) {
            selectedBuild = Jenkins.getFormValues();
            Jenkins.storeSubmission(selectedBuild);

        }, false);
    };

})();






