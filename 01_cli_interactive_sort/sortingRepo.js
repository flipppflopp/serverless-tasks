const type = {
    number: "number",
    string: "string"
}

function getValues(type,data){

    let isNum

    if(type === "number"){
        isNum = true
    }
    else if(type === "string"){
        isNum = false
    }

    let result = []

    data.map( item => {
        let parsed = parseInt(item)

        if(isNaN(parsed) === !isNum){
            if(isNum){
                result.push(parsed)
                return
            }

            result.push(item)
        }
    })

    return result
}

function sortAlphabetically(data)
{
    let words = getValues(type.string,data)
    return words.sort()
}

function sortNumsAsc(data)
{
    let words = getValues(type.number,data)

    words.map(item => {
        return parseFloat(item)
    })

    words.sort(function(a, b) {
        return a - b;
    })
    return words
}

function sortNumsDesc(data)
{
    let words = getValues(type.number,data)

    words.map(item => {
        return parseFloat(item)
    })

    words.sort(function(a, b) {
        return b - a;
    })
    return words
}

function sortWordsAsc(data)
{
    let words = getValues(type.string,data)

    words.sort(function(a, b) {
        return a.length - b.length;
    })
    return words
}

function UniqueWords(data)
{
    let words = getValues(type.string,data)

    let set = new Set(words)

    return Array.from(set)
}

function UniqueValues(data)
{
    let set = new Set(data)

    return Array.from(set)
}

module.exports = {
    sortAlphabetically,
    sortNumsAsc,
    sortNumsDesc,
    sortWordsAsc,
    UniqueWords,
    UniqueValues
}