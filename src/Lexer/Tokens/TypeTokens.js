const Token = require("./Token")

class IntegerToken {
    
    constructor(value) {
        this.value = value
    }
}

class TrueToken {
    
    constructor() {
        this.value = "true"
    }
}

class FalseToken {
    
    constructor() {
        this.value = "false"
    }
}

class StringToken {

    constructor(value) {
        this.value = value
    }
}

class VoidToken {

    constructor() {
        
    }
}


IntegerToken.prototype.getTokenValue = Token.getTokenValue
TrueToken.prototype.getTokenValue = Token.getTokenValue
FalseToken.prototype.getTokenValue = Token.getTokenValue
StringToken.prototype.getTokenValue = Token.getTokenValue
VoidToken.prototype.getTokenValue = Token.getTokenValue


module.exports = {
    IntegerToken,
    TrueToken,
    FalseToken,
    StringToken,
    VoidToken
};