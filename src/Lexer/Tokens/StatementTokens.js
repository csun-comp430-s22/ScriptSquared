const Token = require("./Token")


class ReturnToken {
    
    constructor() {
        this.value = "return"
    }
}

class IfToken {
    
    constructor() {
        this.value = "if"
    }
}

class ElseToken {
    
    constructor() {
        this.value = "else"
    }
}

class WhileToken {
    
    constructor() {
        this.value = "while"
    }
}

class BreakToken {
    
    constructor() {
        this.value = "break"
    }
}

class PrintToken {
    
    constructor() {
        this.value = "print"
    }
}



ReturnToken.prototype.getTokenValue = Token.getTokenValue
IfToken.prototype.getTokenValue = Token.getTokenValue
ElseToken.prototype.getTokenValue = Token.getTokenValue
WhileToken.prototype.getTokenValue = Token.getTokenValue
BreakToken.prototype.getTokenValue = Token.getTokenValue
PrintToken.prototype.getTokenValue = Token.getTokenValue


module.exports = {
    ReturnToken,
    IfToken,
    ElseToken,
    WhileToken,
    BreakToken,
    PrintToken
};