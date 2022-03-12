const Token = require("./Token")

class RightParenToken {
    
    constructor() {
        this.value = "rightParen"
    }
}

RightParenToken.prototype.getTokenValue = Token.getTokenValue


module.exports = RightParenToken;