const Token = require("./Token")

class PublicToken {
    
    constructor() {
        this.value = "public"
    }
}

class PrivateToken {
    
    constructor() {
        this.value = "private"
    }
}

class ProtecToken {
    
    constructor() {
        this.value = "protec"
    }
}


PublicToken.prototype.getTokenValue = Token.getTokenValue
PrivateToken.prototype.getTokenValue = Token.getTokenValue
ProtecToken.prototype.getTokenValue = Token.getTokenValue


module.exports = {
    PublicToken,
    PrivateToken,
    ProtecToken
};