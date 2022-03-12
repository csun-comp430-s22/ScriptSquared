const Token = require("./Token")

class BreakToken {
    
    constructor() {
        this.value = "break"
    }
}

BreakToken.prototype.getTokenValue = Token.getTokenValue


module.exports = BreakToken;