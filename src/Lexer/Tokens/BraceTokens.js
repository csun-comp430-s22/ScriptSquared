const Token = require("./Token")

class LeftCurlyToken {
    
    constructor() {
        this.value = "{"
    }
}

class RightCurlyToken {
    
    constructor() {
        this.value = "}"
    }
}

class LeftParenToken {
    
    constructor() {
        this.value = "("
    }
}

class RightParenToken {
    
    constructor() {
        this.value = ")"
    }
}



LeftCurlyToken.prototype.getTokenValue = Token.getTokenValue
RightCurlyToken.prototype.getTokenValue = Token.getTokenValue
LeftParenToken.prototype.getTokenValue = Token.getTokenValue
RightParenToken.prototype.getTokenValue = Token.getTokenValue


module.exports = {
    LeftCurlyToken,
    RightCurlyToken,
    LeftParenToken,
    RightParenToken
};