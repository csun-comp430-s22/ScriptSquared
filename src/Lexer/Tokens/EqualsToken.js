const Token = require("./Token")

class EqualsToken {
    
    constructor() {
        this.value = "=="
    }
}

EqualsToken.prototype.getTokenValue = Token.getTokenValue


module.exports = EqualsToken;