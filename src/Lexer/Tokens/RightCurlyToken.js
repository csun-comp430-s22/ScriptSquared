const Token = require("./Token")

class RightCurlyToken {
    
    constructor() {
        this.value = "}"
    }
}

RightCurlyToken.prototype.getTokenValue = Token.getTokenValue


module.exports = RightCurlyToken;