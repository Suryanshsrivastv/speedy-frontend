// Grabbing DOM elements
const downloadSpeedEl = document.getElementById("downloadSpeed");
const uploadSpeedEl = document.getElementById("uploadSpeed");
const pingResultEl = document.getElementById("pingResult");
const jitterResultEl = document.getElementById("jitterResult");

const startTestBtn = document.getElementById("startTest");
const toggleInfoBtn = document.getElementById("toggleInfoBtn");
const detailsSection = document.getElementById("detailsSection");
const fileInput = document.getElementById("fileInput");


const downloadUrl = "https://speedy-backend-yzmp.onrender.com/api/speed/download";
const uploadUrl = "https://speedy-backend-yzmp.onrender.com/api/speed/upload";
const pingUrl = "https://speedy-backend-yzmp.onrender.com/api/speed/ping";
const jitterUrl = "https://speedy-backend-yzmp.onrender.com/api/speed/jitter";

// Event listeners
startTestBtn.addEventListener("click", startSpeedTest);
toggleInfoBtn.addEventListener("click", toggleInfo);
fileInput.addEventListener("change", testUploadSpeed);

// Auto-start speed test when page loads
document.addEventListener('DOMContentLoaded', () => {
    startSpeedTest();
});

// Main speed test flow
function startSpeedTest() {
    // 1) Download speed test
    // console.log("speed test started");

    // Promise.all([
    //     testDownloadSpeed(),
    //     testUploadSpeed(),
    //     testPing(),
    //     testJitter()
    // ])
    //     .then(() => {
    //         console.log("All tests completed");
    //     })
    //     .catch(err => {
    //         console.error("Test error:", err);
    //     });
}

// Download Speed
function testDownloadSpeed() {
    console.log("download speed test started");
    return fetch(downloadUrl)
        .then(response => response.json())
        .then(data => {
            // Calculate the average download speed
            const totalSpeed = data.reduce((sum, item) => sum + item.value, 0);
            const averageSpeed = totalSpeed / data.length;

            console.log("Download speed data:", data); // Debugging line
            downloadSpeedEl.textContent = averageSpeed.toFixed(2) || 0;
        })
        .catch(error => {
            downloadSpeedEl.textContent = "Error";
            throw error;
        });
}

function testUploadSpeed() {
    console.log("upload speed test started");
    fetch('50MB_file.bin')
        .then(response => response.blob())
        .then(blob => {
            const formdata = new FormData();
            formdata.append("file", blob, "50MB_file.bin");

            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };

            return fetch(uploadUrl, requestOptions);
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById("uploadSpeed").innerText = Number(data.value).toFixed(2);
        })
        .catch(error => {
            document.getElementById("uploadSpeed").innerText = `Error: ${error}`;
            console.error("Upload test error:", error);
        });
}

// Ping Test
function testPing() {
    console.log("ping test started");
    fetch(pingUrl)
        .then(response => response.text())
        .then(data => {
            pingResultEl.textContent = data;
        })
        .catch(error => {
            pingResultEl.textContent = "Error";
            console.error("Ping test error:", error);
        });
}

// Jitter Test
function testJitter() {
    console.log("jitter test started");
    fetch(jitterUrl)
        .then(response => response.text())
        .then(data => {
            jitterResultEl.textContent = data;
        })
        .catch(error => {
            jitterResultEl.textContent = "Error";
            console.error("Jitter test error:", error);
        });
}

// Toggle more info section
function toggleInfo() {
    console.log("toggle info started");
    if (detailsSection.classList.contains("hidden")) {
        detailsSection.classList.remove("hidden");
        toggleInfoBtn.textContent = "Hide info";
    } else {
        detailsSection.classList.add("hidden");
        toggleInfoBtn.textContent = "Show more info";
    }
}
