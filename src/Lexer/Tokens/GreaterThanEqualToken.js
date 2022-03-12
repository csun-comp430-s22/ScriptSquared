const Token = require("./Token")

class GreaterThanEqualToken {
    
    constructor() {
        this.value = ">="
    }
}

GreaterThanEqualToken.prototype.getTokenValue = Token.getTokenValue


module.exports = GreaterThanEqualToken;