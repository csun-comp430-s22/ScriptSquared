const Token = require("./Token")

class MultiplyToken {
    
    constructor() {
        this.value = '*'
    }
}

MultiplyToken.prototype.getTokenValue = Token.getTokenValue


module.exports = MultiplyToken;