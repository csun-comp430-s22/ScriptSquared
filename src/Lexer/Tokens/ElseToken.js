const Token = require("./Token")

class ElseToken {
    
    constructor() {
        this.value = "else"
    }
}

IntegerToken.prototype.getTokenValue = Token.getTokenValue


module.exports = ElseToken;