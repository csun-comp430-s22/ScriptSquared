const Token = require("./Token")

class LeftCurlyToken {
    
    constructor() {
        this.value = "{"
    }
}

LeftCurlyToken.prototype.getTokenValue = Token.getTokenValue


module.exports = LeftCurlyToken;