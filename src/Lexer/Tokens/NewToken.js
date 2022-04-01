const Token = require("./Token")

class NewToken extends Token {
    
    constructor() {
        super(Token)
        this.value = 'new'
    }
}

module.exports = NewToken