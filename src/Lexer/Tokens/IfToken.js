const Token = require("./Token")

class IfToken {
    
    constructor() {
        this.value = "if"
    }
}

IfToken.prototype.getTokenValue = Token.getTokenValue


module.exports = IfToken;