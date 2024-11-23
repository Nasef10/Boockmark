var SiteNameInput = document.getElementById("SiteName");
var SiteUrlInput = document.getElementById("SiteUrl");
var searchSiteInput = document.getElementById("searchSite");

var siteList;

// Initialize siteList from localStorage
if (localStorage.getItem("sites") == null) {
    siteList = [];
} else {
    siteList = JSON.parse(localStorage.getItem("sites"));
}

// Add site function
function addSite() {
    // Validate inputs
    var siteNameValid = validationInputs(SiteNameInput, "msgName");
    var siteUrlValid = validationInputs(SiteUrlInput, "msgUrl");

    if (siteNameValid && siteUrlValid) {
        // Check for duplicate entries
        var isDuplicate = siteList.some(site => 
            site.name.toLowerCase() === SiteNameInput.value.toLowerCase() || 
            site.url.toLowerCase() === SiteUrlInput.value.toLowerCase()
        );

        if (isDuplicate) {
            Swal.fire({
                icon: "error",
                title: "Duplicate Entry",
                text: "This site name or URL already exists!",
            });
            return; // Stop further execution
        }

        var sites = {
            name: SiteNameInput.value,
            url: SiteUrlInput.value,
        };

        siteList.push(sites);
        localStorage.setItem("sites", JSON.stringify(siteList));

        // Display the sites and clear inputs
        displaySites();
        clear();

        Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Site added successfully.",
        });
    } else {
        Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Please fix the errors before submitting.",
        });
    }
}

// Clear inputs after adding site
function clear() {
    SiteNameInput.value = "";
    SiteUrlInput.value = "";
    document.getElementById("msgName").classList.add("d-none");
    document.getElementById("msgUrl").classList.add("d-none");
    SiteNameInput.classList.remove("is-valid", "is-invalid");
    SiteUrlInput.classList.remove("is-valid", "is-invalid");
}

// Validation function for inputs
function validationInputs(element, msgId) {
    var text = element.value;

    var regex = {
        SiteName: /^[A-Za-z0-9\s]{3,15}$/,  // 3-15 characters, letters, numbers, spaces
        SiteUrl: /^(https?|ftp):\/\/[^\s$.?#].[^\s]*\.(com|org|edu|net|info|gov|eg)$/i, // URL pattern
    };

    var msg = document.getElementById(msgId);

    if (regex[element.id]) {
        if (regex[element.id].test(text)) {
            element.classList.add("is-valid");
            element.classList.remove("is-invalid");
            msg.classList.add("d-none");
            return true;
        } else {
            element.classList.add("is-invalid");
            element.classList.remove("is-valid");
            msg.classList.remove("d-none");
            return false;
        }
    } else {
        console.error("No regex pattern found for element ID:", element.id);
        return false;
    }
}

// Display sites
function displaySites() {
    var cartona = "";

    for (var i = 0; i < siteList.length; i++) {
        cartona += createCartona(i);
    }

    document.getElementById("myRow").innerHTML = cartona;
}

// Create table rows
function createCartona(i) {
    var regex = new RegExp(searchSiteInput.value, "gi");

    return `
    <tr>
        <th scope="row">${i + 1}</th>
        <td>${siteList[i].name.replace(regex, (match) => `<span class="bg-info">${match}</span>`)}</td>
        <td><a href="${siteList[i].url}" target="_blank"><button class="btn-visit"><i class="fa-solid fa-eye pe-2"></i>Visit</button></a></td>
        <td><button onclick="deleteSite(${i})" class="btn-delete"><i class="fa-solid fa-trash-can pe-2"></i>Delete</button></td>
    </tr>`;
}

// Delete site
function deleteSite(index) {
    siteList.splice(index, 1);
    localStorage.setItem("sites", JSON.stringify(siteList));
    displaySites();

    Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Site has been deleted.",
    });
}

// Search site
function searchSite() {
    var query = searchSiteInput.value.toLowerCase();
    var cartona = "";

    for (var i = 0; i < siteList.length; i++) {
        if (siteList[i].name.toLowerCase().includes(query)) {
            cartona += createCartona(i);
        }
    }

    document.getElementById("myRow").innerHTML = cartona;
}
