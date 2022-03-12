const Token = require("./Token")

class TrueToken {
    
    constructor() {
        this.value = "true"
    }
}

TrueToken.prototype.getTokenValue = Token.getTokenValue


module.exports = TrueToken;