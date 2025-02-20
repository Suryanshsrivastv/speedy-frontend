// Grabbing DOM elements
const downloadSpeedEl = document.getElementById("downloadSpeed");
const uploadSpeedEl = document.getElementById("uploadSpeed");
const pingResultEl = document.getElementById("pingResult");
const jitterResultEl = document.getElementById("jitterResult");

const startTestBtn = document.getElementById("startTest");
const toggleInfoBtn = document.getElementById("toggleInfoBtn");
const detailsSection = document.getElementById("detailsSection");
const fileInput = document.getElementById("fileInput");
const loaderModal = document.getElementById("loaderModal");


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
    console.log("speed test started");
    loaderModal.classList.remove("hidden");
    
    // Add fetching animation class
    document.getElementById("uploadSpeed").classList.add("fetching");
    document.getElementById("pingResult").classList.add("fetching");
    document.getElementById("jitterResult").classList.add("fetching");

    Promise.all([
        testDownloadSpeed(),
        testUploadSpeed(),
        testPing(),
        testJitter()
    ])
    .then(() => {
        // Remove fetching animations when all tests complete
        document.getElementById("uploadSpeed").classList.remove("fetching");
        document.getElementById("pingResult").classList.remove("fetching");
        document.getElementById("jitterResult").classList.remove("fetching");
        loaderModal.classList.add("hidden");
    })
    .catch(err => {
        console.error("Test error:", err);
        // Remove fetching animations and show error state
        document.getElementById("uploadSpeed").classList.remove("fetching");
        document.getElementById("pingResult").classList.remove("fetching");
        document.getElementById("jitterResult").classList.remove("fetching");
        loaderModal.classList.add("hidden");
    });
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
        })
        .finally(() => {
            loaderModal.classList.add("hidden");
        });
}

function testUploadSpeed() {
    console.log("upload speed test started");
    const fileSize = 39 * 1024 * 1024;
    const blob = new Blob([new ArrayBuffer(fileSize)], { type: 'application/octet-stream' });
    
    const formData = new FormData();
    formData.append("file", blob, "test.bin");

    const requestOptions = {
        method: "POST",
        body: formData
    };

    return fetch(uploadUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById("uploadSpeed").innerText = Number(data.value).toFixed(2);
        })
        .catch(error => {
            document.getElementById("uploadSpeed").innerText = "Error";
            console.error("Upload test error:", error);
        })
        .finally(() => {
            loaderModal.classList.add("hidden");
        });
}

// Ping Test
function testPing() {
    console.log("ping test started");
    fetch(pingUrl)
        .then(response => response.text())
        .then(data => {
            // Extract only the numbers from the response
            const pingValue = data.match(/\d+\.?\d*/)[0];
            pingResultEl.textContent = pingValue;
        })
        .catch(error => {
            pingResultEl.textContent = "Error";
            console.error("Ping test error:", error);
        })
        .finally(() => {
            loaderModal.classList.add("hidden");
        });
}

// Jitter Test
function testJitter() {
    console.log("jitter test started");
    fetch(jitterUrl)
        .then(response => response.text())
        .then(data => {
            // Extract only the numbers from the response
            const jitterValue = data.match(/\d+\.?\d*/)[0];
            jitterResultEl.textContent = jitterValue;
        })
        .catch(error => {
            jitterResultEl.textContent = "Error";
            console.error("Jitter test error:", error);
        })
        .finally(() => {
            loaderModal.classList.add("hidden");
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
