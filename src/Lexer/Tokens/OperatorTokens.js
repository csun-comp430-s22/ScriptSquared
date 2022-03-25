const Token = require("./Token")

class PlusToken {
    
    constructor() {
        this.value = '+'
    }
}

class MinusToken {
    
    constructor() {
        this.value = '-'
    }
}

class MultiplyToken {
    
    constructor() {
        this.value = '*'
    }
}

class DivideToken {
    
    constructor() {
        this.value = "/"
    }
}

class EqualsToken {
    
    constructor() {
        this.value = "=="
    }
}

class NotEqualsToken {
    
    constructor() {
        this.value = '!='
    }
}

class GreaterThanEqualToken {
    
    constructor() {
        this.value = ">="
    }
}

class GreaterThanToken {
    
    constructor() {
        this.value = ">"
    }
}

class LessThanEqualToken {
    
    constructor() {
        this.value = "<="
    }
}

class LessThanToken {
    
    constructor() {
        this.value = "<"
    }
}



PlusToken.prototype.getTokenValue = Token.getTokenValue
MinusToken.prototype.getTokenValue = Token.getTokenValue
MultiplyToken.prototype.getTokenValue = Token.getTokenValue
DivideToken.prototype.getTokenValue = Token.getTokenValue
EqualsToken.prototype.getTokenValue = Token.getTokenValue
NotEqualsToken.prototype.getTokenValue = Token.getTokenValue
GreaterThanEqualToken.prototype.getTokenValue = Token.getTokenValue
GreaterThanToken.prototype.getTokenValue = Token.getTokenValue
LessThanEqualToken.prototype.getTokenValue = Token.getTokenValue
LessThanToken.prototype.getTokenValue = Token.getTokenValue


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
    LessThanToken
};