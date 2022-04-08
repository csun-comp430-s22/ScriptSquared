//Checks if two arrays have the same elements, and returns True if so.
function arraysEqual(arrayOne, arrayTwo) {

    if (arrayOne.length !== arrayTwo.length)
        return false;
    
    for (let i = 0; i < arrayOne.length; i++) {
        if ( arrayOne[i].equals(arrayTwo[i]) === false ) {
            return false;
        }
    }
    
    return true;
}

//Takens an array and a type, and returns True if every item in the array matches that type.
function arrayMatchType(array, arrayType) {
    for (let i = 0; i < array.length; i++) {
        if(!(array[i] instanceof arrayType)){
            return false;
        }
    }

    return true;
}

// Parse a series of the same things using a provided function 
// ex) instanceDec*  -  the only thing seperating the things is whitespace
function parseList(position, parseFunction) {
    const list = []
    let shouldRun = true

    while (shouldRun === true) {
        try {
            const result = parseFunction(position)
            list.push(result.result)
            position = result.position
        } catch (e) {
            shouldRun = false
        }
    }

    return { list, position };
}


module.exports = {
    arraysEqual,
    arrayMatchType,
    parseList
}