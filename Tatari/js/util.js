/**
 * this function converts a csv string to a json array
 * @param csv
 * @returns {Array}
 */
function csvToJsonArray(csv) {
    csv = csv.replace(/["]/g, ""); // csv is a string here, so we should get rid of double quotes
    let jsonArray = [];
    csv = csv.split("\n"); // split csv string using return TODO: file might have empty lines at the end => fix
    let headers = csv[0].split(',');
    for (let i = 1, length = csv.length; i < length; i++) {
        let row = csv[i].split(',');
        let temp = {};
        for (let x = 0; x < row.length; x++) {
            temp[headers[x]] = row[x];
        }
        jsonArray.push(temp);
    }
    return jsonArray;
}

/**
 * this function reads a human readable time string am/pm format and sets it in a date object
 * this will help us to find if spots fall in a rotation
 * @param date
 * @param timeString
 */
function setTimeToDate(date, timeString) {
    // if time is pm I am adding 12 hours
    if (timeString.includes("PM")) {
        let time = timeString.replace("PM",""); // remove pm from string
        time = time.trim(); // remove white space
        date.setHours(Number(time.split(":")[0]) % 12 + 12); // get hour
        date.setMinutes(Number(time.split(":")[1])); // get min
    } else if (timeString.includes("AM")) {
        let time = timeString.replace("AM","");
        time = time.trim();
        date.setHours(Number(time.split(":")[0]));
        date.setMinutes(Number(time.split(":")[1]));
    } else {
        console.log("File format error!");
    }
}

/**
 * this will help us to find if spots fall in a rotation
 * @param rotations
 */
function buildRotationMap(rotations) {
    let map = {};
    $.each(rotations, function (ind, row) {
        let name = row["Name"];
        map[name] = {};
        map[name]["start"] = new Date();
        map[name]["end"] = new Date();
        setTimeToDate(map[name]["start"], row["Start"]);
        setTimeToDate(map[name]["end"], row["End"]);
    });
    return map;
}

/**
 *
 * @param rotationTable
 * @param time
 * @returns {Array}
 */
function getMatchedRotations(rotationTable, time) {
    let date = new Date();
    setTimeToDate(date, time);
    let matchedRotations = [];
    $.each(rotationTable, function (key, rotation) {
        if (date >= rotation['start'] && date <= rotation['end']) {
            matchedRotations.push(key);
        }
    });
    return matchedRotations;
}

/**
 * dynamically generates a table out of a object
 * @param object
 * @param where
 * @param header
 */
function buildTableFromObject(object, where, header) {
    var table = "<table>";
    table += "<tr>";
    $.each(header, function (idx, item) {
        table += "<th>";
        table += item;
        table += "</th>";
    });
    table += "</tr>";
    $.each(object, function (key, value) {
        table += "<tr><td>";
        table += key + "</td>";
        $.each(value, function (k, v) {
            table += "<td>";
            table += v;
            table += "</td>";
        });
        table += "</tr>";
    });
    table += "</tr>";
    table += "</table>";
    $(where).html(table);
}

/**
 * adds col value of all rows in json array
 * @param jsonArray
 * @param colName
 * @returns {number}
 */
function addCols(jsonArray, colName) {
    let sum = 0;
    $.each(jsonArray, function (ind, value) {
        sum += Number(value[colName]);
    });
    return sum;
}
