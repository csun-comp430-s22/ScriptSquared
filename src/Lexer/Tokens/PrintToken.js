const Token = require("./Token")

class PrintToken {
    
    constructor() {
        this.value = "print"
    }
}

PrintToken.prototype.getTokenValue = Token.getTokenValue


module.exports = PrintToken;