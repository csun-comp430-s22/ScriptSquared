const IntegerToken = require()

class Tokenizer {

    constructor(input) {
        this.input = input
        this.offset = 0
        this.inputLength = input.length
    }
    

    skipWhiteSpace () {
        while ( (this.offset < this.inputLength) && (this.input.charAt(this.offset) === ' ') ) {
            this.offset++;
        }
    }

    tryTokenizeInteger () {
        this.skipWhiteSpace()

        let number = ""

        while ( (this.offset < this.inputLength) && (parseInt(this.input.charAt(this.offset)) ) ) {
            number += this.input.charAt(this.offset)
            this.offset++
        }

        if (number !== "")
            return new IntegerToken(parseInt(number))
        else
            return null;
    }
}

module.exports = Tokenizer;