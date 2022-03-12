const Token = require("./Token")

class ElseToken {
    
    constructor() {
        this.value = "else"
    }
}

ElseToken.prototype.getTokenValue = Token.getTokenValue


module.exports = ElseToken;