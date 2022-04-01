const Token = require("./Token")


class ReturnToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "return"
    }
}

class IfToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "if"
    }
}

class ElseToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "else"
    }
}

class WhileToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "while"
    }
}

class BreakToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "break"
    }
}

class PrintToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "print"
    }
}

class ThisToken extends Token {

    constructor() {
        super(Token)
        this.value = "this"
    }
}



module.exports = {
    ReturnToken,
    IfToken,
    ElseToken,
    WhileToken,
    BreakToken,
    PrintToken
};