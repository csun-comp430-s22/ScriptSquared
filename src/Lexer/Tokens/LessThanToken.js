const Token = require("./Token")

class LessThanToken {
    
    constructor() {
        this.value = '<'
    }
}

LessThanToken.prototype.getTokenValue = Token.getTokenValue


module.exports = LessThanToken;