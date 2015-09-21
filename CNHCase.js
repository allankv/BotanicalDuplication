/**
 * Created by allan on 20/09/15.
 */
var BotanicalDuplication = require("./BotanicalDuplication.js")
var DatasetUtility = require("./DatasetUtility.js")

var utility = new DatasetUtility()

utility.inputFile = "cnh.tab"
utility.outputFile = "output.csv"
utility.limit = 100000

utility.map = function (line,headers){
    var record = {}
    record.id = line[headers.indexOf("id")]
    record.collection = line[headers.indexOf("institutionCode")]+":"+line[headers.indexOf("collectionCode")]
    record.recordedBy = line[headers.indexOf("recordedBy")]
    record.eventDate = line[headers.indexOf("eventDate")]
    record.year = line[headers.indexOf("year")]
    record.latitude = line[headers.indexOf("decimalLatitude")]
    record.longitude = line[headers.indexOf("decimalLongitude")]
    record.scientificName = line[headers.indexOf("scientificName")]
    record.locality = line[headers.indexOf("locality")]
    return record
}
utility.eligible = function(record){
    return record.id != '' &&
        record.collection!= '' &&
        record.recordedBy != '' && record.recordedBy.trim() != ';' &&
        record.eventDate != '' &&
        record.year != '' &&
        ((record.latitude != '' && record.longitude) || record.locality != '')
}

utility.getDatasetFromDwCA(identifyDuplications)

function identifyDuplications(dataset) {
    console.log("Count:", utility.count)

    var bd = new BotanicalDuplication()
    bd.config = {
        input: dataset,                                         // JSON list
        id: "id",                                               // Name of field that is an unique identifier for each item in list
        clusters: [                                             // Define fields for being grouped
            {field: "year", similarity: sameYear},               // Each item should the name of the field and an function which return true if the value of the field is considered similar
            {field: "recordedBy", similarity: sameRecordedBy},
            {field: "location", similarity: similarLocation},
            {field: "eventDate", similarity: sameEventDate},
            {field: "scientificName", similarity: sameScientificName},
            {field: "collection", similarity: differentCollection}
        ]
    }
    function sameRecordedBy(record, record_) {
        return record.recordedBy == record_.recordedBy
    }
    function sameScientificName(record, record_) {
        return record.scientificName == record_.scientificName
    }
    function similarLocation(record, record_) {
        var distance = 0.01
        return (record.locality == record_.locality) ||
            (Math.abs(record.latitude - record_.latitude) < distance && Math.abs(record.longitude- record_.longitude) < distance)
    }
    function sameYear(record, record_) {
        return record.year == record_.year
    }
    function sameEventDate(record, record_) {
        return record.eventDate== record_.eventDate
    }

    function differentCollection(record, record_) {
        return record.collection != record_.collection
    }

    var possibleDuplications = bd.run()
    utility.writeDuplicated(possibleDuplications)
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
}