const Token = require("./Token")

class ProtecToken {
    
    constructor() {
        this.value = "protec"
    }
}

ProtecToken.prototype.getTokenValue = Token.getTokenValue


module.exports = ProtecToken;