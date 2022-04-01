const Token = require("./Token")

class LeftCurlyToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "{"
    }
}

class RightCurlyToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "}"
    }
}

class LeftParenToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "("
    }
}

class RightParenToken extends Token {
    
    constructor() {
        super(Token)
        this.value = ")"
    }
}

class SemiColonToken extends Token {
    
    constructor() {
        super(Token)
        this.value = ";"
    }
}

class PeriodToken extends Token {

    constructor() {
        super(Token)
        this.value = "."
    }
}

class CommaToken extends Token {

    constructor() {
        super(Token)
        this.value = ","
    }
}


module.exports = {
    LeftCurlyToken,
    RightCurlyToken,
    LeftParenToken,
    RightParenToken,
    SemiColonToken,
    PeriodToken,
    CommaToken
};