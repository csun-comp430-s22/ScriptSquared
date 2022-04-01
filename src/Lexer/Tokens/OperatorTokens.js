const Token = require("./Token")

class PlusToken extends Token {
    
    constructor() {
        super(Token)
        this.value = '+'
    }
}

class MinusToken extends Token {
    
    constructor() {
        super(Token)
        this.value = '-'
    }
}

class MultiplyToken extends Token {
    
    constructor() {
        super(Token)
        this.value = '*'
    }
}

class DivideToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "/"
    }
}

class EqualsToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "=="
    }
}

class NotEqualsToken extends Token {
    
    constructor() {
        super(Token)
        this.value = '!='
    }
}

class GreaterThanEqualToken extends Token {
    
    constructor() {
        super(Token)
        this.value = ">="
    }
}

class GreaterThanToken extends Token {
    
    constructor() {
        super(Token)
        this.value = ">"
    }
}

class LessThanEqualToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "<="
    }
}

class LessThanToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "<"
    }
}

class AssignmentToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "="
    }
}



module.exports = {
    PlusToken,
    MinusToken,
    MultiplyToken,
    DivideToken,
    EqualsToken,
    NotEqualsToken,
    GreaterThanEqualToken,
    GreaterThanToken,
    LessThanEqualToken,
    LessThanToken,
    AssignmentToken
};