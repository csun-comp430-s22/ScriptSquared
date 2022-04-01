 
class LeftCurlyToken  {
    
    constructor() {
        super(Token)
        this.value = "{"
    }
}

class RightCurlyToken  {
    
    constructor() {
        super(Token)
        this.value = "}"
    }
}

class LeftParenToken  {
    
    constructor() {
        super(Token)
        this.value = "("
    }
}

class RightParenToken  {
    
    constructor() {
        super(Token)
        this.value = ")"
    }
}

class SemiColonToken  {
    
    constructor() {
        super(Token)
        this.value = ";"
    }
}

class PeriodToken  {

    constructor() {
        super(Token)
        this.value = "."
    }
}

class CommaToken  {

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