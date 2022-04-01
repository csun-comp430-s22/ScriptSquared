
class PlusToken  {
    
    constructor() {
        super(Token)
        this.value = '+'
    }
}

class MinusToken  {
    
    constructor() {
        super(Token)
        this.value = '-'
    }
}

class MultiplyToken  {
    
    constructor() {
        super(Token)
        this.value = '*'
    }
}

class DivideToken  {
    
    constructor() {
        super(Token)
        this.value = "/"
    }
}

class EqualsToken  {
    
    constructor() {
        super(Token)
        this.value = "=="
    }
}

class NotEqualsToken  {
    
    constructor() {
        super(Token)
        this.value = '!='
    }
}

class GreaterThanEqualToken  {
    
    constructor() {
        super(Token)
        this.value = ">="
    }
}

class GreaterThanToken  {
    
    constructor() {
        super(Token)
        this.value = ">"
    }
}

class LessThanEqualToken  {
    
    constructor() {
        super(Token)
        this.value = "<="
    }
}

class LessThanToken  {
    
    constructor() {
        super(Token)
        this.value = "<"
    }
}

class AssignmentToken  {
    
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