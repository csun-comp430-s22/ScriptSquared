const Token = require("./Token")

class IfToken {
    
    constructor() {
        this.value = "If"
    }
}

IfToken.prototype.getTokenValue = Token.getTokenValue


module.exports = IfToken;