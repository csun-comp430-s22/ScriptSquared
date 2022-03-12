const Token = require("./Token")

class FalseToken {
    
    constructor() {
        this.value = "false"
    }
}

FalseToken.prototype.getTokenValue = Token.getTokenValue


module.exports = FalseToken;