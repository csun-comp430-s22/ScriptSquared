const Token = require("./Token")

class RightParenToken {
    
    constructor() {
        this.value = "("
    }
}

RightParenToken.prototype.getTokenValue = Token.getTokenValue


module.exports = RightParenToken;