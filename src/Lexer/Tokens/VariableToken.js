const Token = require("./Token")

class VariableToken {
    
    constructor(value) {
        this.value = value
    }
}

VariableToken.prototype.getTokenValue = Token.getTokenValue


module.exports = VariableToken;