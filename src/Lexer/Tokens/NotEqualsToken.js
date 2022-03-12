const Token = require("./Token")

class NotEqualsToken {
    
    constructor() {
        this.value = '!='
    }
}

NotEqualsToken.prototype.getTokenValue = Token.getTokenValue


module.exports = NotEqualsToken;