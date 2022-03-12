const Token = require("./Token")

class PlusToken {
    
    constructor() {
        this.value = '+'
    }
}

PlusToken.prototype.getTokenValue = Token.getTokenValue


module.exports = PlusToken;