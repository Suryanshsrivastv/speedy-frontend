document.getElementById("downloadBtn").addEventListener("click", testDownloadSpeed);
document.getElementById("uploadBtn").addEventListener("click", triggerFileInput);
document.getElementById("pingBtn").addEventListener("click", testPing);
document.getElementById("jitterBtn").addEventListener("click", testJitter);
document.getElementById("fileInput").addEventListener("change", testUploadSpeed);

function testDownloadSpeed() {
    fetch('http://localhost:8080/api/speed/download')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById("downloadResult").innerText = `${data.value}: ${data.speed} ${data.unit}`;
        })
        .catch(error => {
            document.getElementById("downloadResult").innerText = `Error: ${error}`;
        });
}

function triggerFileInput() {
    document.getElementById("fileInput").click();
}

function testUploadSpeed(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    fetch('http://localhost:8080/api/speed/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById("uploadResult").innerText = `${data.value}: ${data.speed} ${data.unit}`;
    })
    .catch(error => {
        document.getElementById("uploadResult").innerText = `Error: ${error}`;
    });
}

function testPing() {
    fetch('http://localhost:8080/api/speed/ping')
        .then(response => response.text())
        .then(data => {
            console.log(data);            
            document.getElementById("pingResult").innerText = data;
        })
        .catch(error => {
            document.getElementById("pingResult").innerText = `Error: ${error}`;
        });
}

function testJitter() {
    fetch('http://localhost:8080/api/speed/jitter')
        .then(response => response.text())
        .then(data => {
            console.log(data);            
            document.getElementById("jitterResult").innerText = data;
        })
        .catch(error => {
            document.getElementById("jitterResult").innerText = `Error: ${error}`;
        });
}
