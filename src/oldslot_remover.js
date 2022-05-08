// ==UserScript==
// @name         Old slot remover
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description This script removes the old/expired slots that you can see if you want to register a time slot for [MEDT,NWTK,SYT,ITSI,SEW]
// @author       @officialbishowb
// @match        https://elearning.tgm.ac.at/mod/scheduler/view.php?id=219076
// @match        https://elearning.tgm.ac.at/mod/scheduler/view.php?id=219078
// @match        https://elearning.tgm.ac.at/mod/scheduler/view.php?id=219079
// @match        https://elearning.tgm.ac.at/mod/scheduler/view.php?id=225390
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.at
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let getTable = document.getElementsByTagName("table");
    // As per my understanding there max 3 tables in one register slot course
    if (getTable.length == 3) {
        main_func(getTable[1]);
    } else if (getTable.length == 2) {
        main_func(getTable[0]);
    } else {
        console.log("There is either only 1 table or more than 3 tables in the page!");
    }





})();

function main_func(main_table) {

    let mainTable = main_table;

    let getRows = mainTable.getElementsByTagName("tr");

    let currentDate = new Date().setHours(0, 0, 0, 0) / 1000;


    var removed = 0;
    var totalCounts = getRows.length - 1;
    for (let i = 0; i < getRows.length; i++) {
        let currentData = getRows[i].getElementsByTagName("td")[0];
        if (currentData.className == "header c5 lastcol") continue;

        let date = currentData.firstChild.innerText;

        // Since some of the date values are not valid and therefore cannot be converted to a Date object, why not create one?
        // Beside that the format for Date is same for every subject
        date = getValidDate(date).getTime() / 1000;

        if (date < currentDate) {
            getRows[i].style.display = "none";
            removed++;
        }

        if (removed >= totalCounts) {

            mainTable.style.display = "none";
            for (let i = 0; i < document.getElementsByTagName("h3").length; i++) {
                if (document.getElementsByTagName("h3")[i].innerText == "Aktuelle Zeitfenster") {
                    document.getElementsByTagName("h3")[i].style.display = "none";
                }
            }
        }


    }

}

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