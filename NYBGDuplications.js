/**
 * Created by allan on 20/09/15.
 */
var BotanicalDuplication = require("./BotanicalDuplication.js")
var DatasetUtility = require("./DatasetUtility.js")

var utility = new DatasetUtility()

utility.inputFile = "nybg.csv"
utility.outputFile = "output.csv"

utility.map = function (line){
    var record = {}
    record.id = line[0]
    record.institutionCode = line[1]
    record.recordedBy = line[7]
    record.eventDate = line[9]
    record.year = line[9].split("-")[0]
    return record
}
utility.eligible = function(record){
    return record.id != '' &&
        record.institutionCode != '' &&
        record.recordedBy != '' &&
        record.eventDate != '' &&
        record.year != ''
}

utility.getDatasetFromDwCA(callback)
function callback(result) {
    var dataset = result

    var bd = new BotanicalDuplication()
    bd.config = {
        input: dataset,                                         // JSON list
        id: "id",                                               // Name of field that is an unique identifier for each item in list
        clusters: [                                             // Define fields for being grouped
            {field: "year", similarity: sameYear},               // Each item should the name of the field and an function which return true if the value of the field is considered similar
            {field: "recordedBy", similarity: sameRecordedBy},
            {field: "eventDate", similarity: sameEventDate},
            {field: "institutionCode", similarity: differentInstitutionCode}
        ]
    }
    function sameRecordedBy(record, record_) {
        return record.recordedBy == record_.recordedBy
    }
    function sameYear(record, record_) {
        return record.year == record_.year
    }
    function sameEventDate(record, record_) {
        return record.eventDate== record_.eventDate
    }

    function differentInstitutionCode(record, record_) {
        return record.institutionCode != record_.institutionCode
    }

    var possibleDuplications = bd.run()
    var groups = 0, records = 0
    possibleDuplications.forEach(function(group){
        groups++
        group.forEach(function (record) {
            records++
        })
    })

    console.log("Groups:",groups)
    console.log("Records:",records)
    console.log("Average records per Group:",records/groups)
// Write in file
}