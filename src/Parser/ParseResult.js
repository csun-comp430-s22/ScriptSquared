
class ParseResult {

    constructor(result, position) {
        this.result = result
        this.position = position
    }

    equals(other) {
        return (other instanceof ParseResult
            && this.result.equals(other.result)
            && this.position === position)
    }
}

module.exports = ParseResult;