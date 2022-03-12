const IntegerToken = require("./Tokens/IntegerToken")

class Tokenizer {

    constructor(input) {
        this.input = input
        this.offset = 0
        this.inputLength = input.length
    }
    
    test() {
        let test = new IntegerToken(123)
        return test.equals(new IntegerToken(456));
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

        if (number !== "") {
            return new IntegerToken(number);
        }
        else {
            return null;
        }
    }
}

module.exports = Tokenizer;