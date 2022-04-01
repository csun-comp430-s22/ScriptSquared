const Token = require("./Token")

class VariableToken extends Token {
    
    constructor(value) {
        super(Token)
        this.value = value
    }
}

module.exports = VariableToken;