document.addEventListener("DOMContentLoaded", function () {
    fields.firstName = document.getElementById("firstName");
    fields.lastName = document.getElementById("lastName");
    fields.email = document.getElementById("email");
    fields.message = document.getElementById("question");
});

function isNotEmpty(value) {
    if (value == null || typeof calue == "undefined") return false;

    return value.length > 0;
}

function isNumber(num) {
    return num.length > 0 && !isNaN(num);
}

function isEmail(email) {
    let regex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(String(email).toLowerCase());
}

//field.className to change classes

class User {
    constructor(firstName, lastName, email, question) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.question = question;
    }
}

function sendContact() {
    if (isValid()) {
        let usr = new User(
            firstName.value,
            lastName.value,
            email.value,
            question.value
        );
    }
}

/*function scrollPosition() {
    var navBar = getElementById("nav-bar");
    var scrollPosition = this.window.scrollY;

    if (scrollPosition > 100) {
        navBar.style.backgroundColor = "black";
    } else {
        navBar.style.backgroundColor = "red";
    }
}*/
