const Token = require("./Token")

class PublicToken {
    
    constructor() {
        this.value = "public"
    }
}

PublicToken.prototype.getTokenValue = Token.getTokenValue


module.exports = PublicToken;