// ==UserScript==
// @name         Old slot remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description This script removes the old/expired slots that you can see if you want to register a time slot for [MEDT,NWTK,SYT,ITSI,SEW]
// @author       @officialbishowb[github.com/officialbishowb]
// @match        https://elearning.tgm.ac.at/mod/scheduler/view.php?id=219076
// @match        https://elearning.tgm.ac.at/mod/scheduler/view.php?id=219078
// @match        https://elearning.tgm.ac.at/mod/scheduler/view.php?id=219079
// @match        https://elearning.tgm.ac.at/mod/scheduler/view.php?id=225390
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.at
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let getTable = document.getElementsByTagName("table")[0];
    let getRows = getTable.getElementsByTagName("tr");

    let currentDate = new Date().setHours(0, 0, 0, 0) / 1000;


    var toRemove = 0;
    var totalCounts = getRows.length - 1;
    for (let i = 0; i < getRows.length; i++) {
        let currentData = getRows[i].getElementsByTagName("td")[0];
        if (currentData.className == "header c5 lastcol") continue;

        let date = currentData.firstChild.innerText;

        // Since some of the date values are not valid and therefore cannot be converted to a Date object, why not create one?
        // Beside that the format for Date is same for every subject
        date = getValidDate(date).getTime() / 1000;

        if (date < currentDate) toRemove++;



    }

    if (toRemove >= totalCounts) {
        // remove the whole table as it contains only expired slots
        getTable.innerHTML = "";
    } else {
        // Remove the table rows from the top
        for (let i = 0; i < totalCounts; i++) {
            getRows[i].innerHTML = "";
        }
    }



})();


function getValidDate(string_date) {
    const months = {
        "MAR": "März",
        "MAY": "Mai",
        "JUN": "Juni",
        "JUL": "Juli",
        "OCT": "Oktober",
        "DEC": "Dezember"
    };
    let dates = string_date.split(",")[1].split(" ");
    let day = dates[1].split(".")[0].replace(" ", "");
    let realMonth = dates[2].replace(" ", "");
    let year = dates[3].replace(" ", "");
    // get valid month from the const months

    let newDate = new Date(realMonth + " " + day + " " + year)

    if (newDate != "Invalid Date") return newDate;

    // If it is Invalid Date then probably month is not convertable

    for (let m in months) {
        if (months[m] == realMonth) realMonth = m;
    }

    // If the error still occurs then I dont know the fix :(
    return new Date(realMonth + " " + day + " " + year);
}