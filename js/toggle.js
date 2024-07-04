function toggleForm() {
    var formContainer = document.getElementById("formContainer");
    var outputContainer = document.getElementById("output");
    var loadingContainer = document.getElementById("loading_div");
    if (formContainer.style.display === "none") {
        formContainer.style.display = "block";
        outputContainer.style.display = "none"; 
        loadingContainer.style.display = "none"; 
    } else {
        formContainer.style.display = "none";
    }
}

function toggleOutput() {
    var outputContainer = document.getElementById("output");
    var formContainer = document.getElementById("formContainer");
    var loadingContainer = document.getElementById("loading_div");
    if (outputContainer.style.display === "none") {
        outputContainer.style.display = "block";
        formContainer.style.display = "none"; 
        loadingContainer.style.display = "none"; 
    } else {
        outputContainer.style.display = "none";
    }
}