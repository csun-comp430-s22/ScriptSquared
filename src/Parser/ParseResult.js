const { instance_of } = require("../utils");

class ParseResult {

    constructor(result, position) {
        this.result = result
        this.position = position
    }

    equals(other) {
        return (instance_of(other, ParseResult)
            && this.result.equals(other.result)
            && this.position === other.position)
    }
}

module.exports = ParseResult;