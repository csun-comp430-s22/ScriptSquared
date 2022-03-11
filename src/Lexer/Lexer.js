class Tokenizer {

    constructor(input) {
        this.input = input
        this.offset = 0
    }
    

    skipWhiteSpace () {
        while ( (this.offset < this.input.length) && (this.input.charAt(this.offset) === ' ') ) {
            this.offset++;
        }
    }
}

module.exports = Tokenizer;