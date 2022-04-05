//Checks if two arrays have the same entities, and returns True if so.
function arraysEqual(arrayOne, arrayTwo) {

    if (arrayOne.length !== arrayTwo.length)
        return false;
    
    for (let i = 0; i < arrayOne.length; i++) {
        if ( arrayOne[i].constructor !== arrayTwo[i].constructor ) {
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


module.exports = {
    arraysEqual,
    arrayMatchType
}