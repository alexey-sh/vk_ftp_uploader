function save(theValue, cb) {
    chrome.storage.sync.set({'serverUrl': theValue}, function() {
        cb();
    });
}

function check(theValue, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', theValue + '/test', true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return;
        if (xhr.status !== 200) {
            cb(true);
        } else {
            cb();
        }
    }
}
function checkAndToggleIcon(serverUrl, cb) {
    check(serverUrl, function (err) {
        if (cb) cb(err);
        statusIcon.classList.remove('hidden');
        if (err) {
            statusIcon.classList.add('error');
        }
        else {
            statusIcon.classList.remove('error');
        }
    })
}
var urlInput = document.getElementById('server-url');
var statusIcon = document.querySelector('.checkmark');
chrome.storage.sync.get('serverUrl', function(data) {
    urlInput.value = data.serverUrl;
    checkAndToggleIcon(data.serverUrl)
});
var timer;
urlInput.addEventListener('keyup', function () {
    if (timer) {
        return;
    }
    timer = setTimeout(function () {
        var value = urlInput.value;
        if (!value) return;
        checkAndToggleIcon(value, function (err) {
            if (!err) {
                save(value, function () {
                    timer = void 0;
                });
            }
            else {
                timer = void 0;
            }
        });
    }, 100)
});