/**
 * Created by allan on 20/09/15.
 */
var BotanicalDuplication = require("./BotanicalDuplication.js")

var dataset = [
    {id:1, year: 1995, startDayOfYear: 129, collector: "Allan"},
    {id:2, year: 2004, startDayOfYear: 27, collector: "Allan"},
    {id:3, year: 1995, startDayOfYear: 128, collector: "Bob"},
    {id:4, year: 2004, startDayOfYear: 27, collector: "Bob"},
    {id:5, year: 2007, startDayOfYear: 89, collector: "Paul"},
    {id:6, year: 1995, startDayOfYear: 129, collector: "Paul"},
    {id:7, year: 2007, startDayOfYear: 78, collector: "James"},
    {id:8, year: 2001, startDayOfYear: 129, collector: "James"},
    {id:9, year: 1995, startDayOfYear: 129, collector: "Allan"},
]

var bd = new BotanicalDuplication()

bd.config = {
    input: dataset,                                         // JSON list
    id: "id",                                               // Name of field that is an unique identifier for each item in list
    clusters: [                                             // Define fields for being grouped
        {field:"year", similarity: sameYear},               // Each item should the name of the field and an function which return true if the value of the field is considered similar
        {field:"startDayOfYear", similarity: similarDay},
        {field:"collector", similarity: sameCollector}
    ]
}
function sameYear(record,record_){
    return record.year == record_.year
}
function similarDay(record,record_){
    return record.startDayOfYear  == record_.startDayOfYear || record.startDayOfYear  == record_.startDayOfYear+1 || record.startDayOfYear  == record_.startDayOfYear-1
}
function sameCollector(record,record_){
    return record.collector == record_.collector
}

console.log(bd.run())

