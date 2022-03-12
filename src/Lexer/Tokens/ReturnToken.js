const Token = require("./Token")

class ReturnToken {
    
    constructor() {
        this.value = "return"
    }
}

ReturnToken.prototype.getTokenValue = Token.getTokenValue


module.exports = ReturnToken;