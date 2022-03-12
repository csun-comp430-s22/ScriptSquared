const Token = require("./Token")

class DivideToken {
    
    constructor() {
        this.value = '/'
    }
}

DivideToken.prototype.getTokenValue = Token.getTokenValue


module.exports = DivideToken;