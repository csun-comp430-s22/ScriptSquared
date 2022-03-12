const Token = require("./Token")

class MinusToken {
    
    constructor() {
        this.value = '-'
    }
}

MinusToken.prototype.getTokenValue = Token.getTokenValue


module.exports = MinusToken;