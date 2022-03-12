const Token = require("./Token")

class GreaterThanToken {
    
    constructor() {
        this.value = '>'
    }
}

GreaterThanToken.prototype.getTokenValue = Token.getTokenValue


module.exports = GreaterThanToken;