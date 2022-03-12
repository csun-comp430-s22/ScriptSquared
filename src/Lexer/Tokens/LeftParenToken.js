const Token = require("./Token")

class LeftParenToken {
    
    constructor() {
        this.value = "("
    }
}

LeftParenToken.prototype.getTokenValue = Token.getTokenValue


module.exports = LeftParenToken;