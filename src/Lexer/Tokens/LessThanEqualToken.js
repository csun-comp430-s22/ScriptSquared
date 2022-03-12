const Token = require("./Token")

class LessThanEqualToken {
    
    constructor() {
        this.value = '<='
    }
}

LessThanEqualToken.prototype.getTokenValue = Token.getTokenValue


module.exports = LessThanEqualToken;