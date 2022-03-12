const Token = require("./Token")

class WhileToken {
    
    constructor() {
        this.value = "while"
    }
}

WhileToken.prototype.getTokenValue = Token.getTokenValue

module.exports = WhileToken;