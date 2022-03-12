const Token = require("./Token")

class PrivateToken {
    
    constructor() {
        this.value = "private"
    }
}

PrivateToken.prototype.getTokenValue = Token.getTokenValue


module.exports = PrivateToken;