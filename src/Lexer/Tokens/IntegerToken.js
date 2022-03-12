const Token = require("./Token")

class IntegerToken {
    
    constructor(value) {
        this.value = value
    }
}

IntegerToken.prototype.getTokenValue = Token.getTokenValue
IntegerToken.prototype.equals = Token.equals


module.exports = IntegerToken;