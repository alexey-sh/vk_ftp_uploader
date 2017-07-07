function loadAudioData(ids, cb) {
    var http = new XMLHttpRequest();
    var url = "https://vk.com/al_audio.php";
    var params = "act=reload_audio&al=1&ids=" + ids;
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() {
        if(http.readyState === 4 && http.status === 200) {
            var json = http.responseText.substring(http.responseText.indexOf('<!json>') + 7, http.responseText.indexOf('<!><!bool>'));
            cb(JSON.parse(json));
        }
    };
    http.send(params);
}
function attachDownloadIcon(node) {
    var el = document.createElement('div');
    el.classList.add('download-ftp-icon');
    el.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        loadAudioData(node.getAttribute('data-full-id'), function (data) {
            console.log(data);
            loadAudio({url: data[0][2], audioName : data[0][3], bandName: data[0][4]});
        });
    }, true);
    node.appendChild(el);
}
function observe() {
    var el = document.querySelector('.audio_page__audio_rows_list');
    var observer = new MutationObserver(function(mutations) {
        console.log('mutations');
        mutations.forEach(function(mutation) {
            console.log('mutation', mutation.type);
            if (mutation.type === 'childList' && mutation.addedNodes[0]) {
                attachDownloadIcon(mutation.addedNodes[0]);
            }
        });
    });
    var config = { attributes: true, childList: true, characterData: false };
    observer.observe(el, config);
}

function loadAudio(data, cb) {
    chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        data: data
    }, function(responseText) {
        console.log(responseText);
    });
}

setTimeout(observe, 0);

[].forEach.call(document.querySelectorAll('[data-full-id]'), function (el) {
    attachDownloadIcon(el);
});