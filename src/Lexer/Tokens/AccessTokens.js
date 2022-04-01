const Token = require("./Token")

class PublicToken  extends Token {
    
    constructor() {
        super(Token)
        this.value = "public"
    }
}

class PrivateToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "private"
    }
}

class ProtecToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "protec"
    }
}


module.exports = {
    PublicToken,
    PrivateToken,
    ProtecToken
};