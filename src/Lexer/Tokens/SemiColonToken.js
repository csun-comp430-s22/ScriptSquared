const Token = require("./Token")

class SemiColonToken {
    
    constructor() {
        this.value = "semiColon"
    }
}

SemiColonToken.prototype.getTokenValue = Token.getTokenValue


module.exports = SemiColonToken;