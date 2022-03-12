const Token = require("./Token")

class SemiColonToken {
    
    constructor() {
        this.value = ";"
    }
}

SemiColonToken.prototype.getTokenValue = Token.getTokenValue


module.exports = SemiColonToken;