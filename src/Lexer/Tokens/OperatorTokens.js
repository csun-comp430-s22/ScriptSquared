
class PlusToken  {
    
    constructor() {
         
        this.value = '+'
    }
}

class MinusToken  {
    
    constructor() {
         
        this.value = '-'
    }
}

class MultiplyToken  {
    
    constructor() {
         
        this.value = '*'
    }
}

class DivideToken  {
    
    constructor() {
         
        this.value = "/"
    }
}

class EqualsToken  {
    
    constructor() {
         
        this.value = "=="
    }
}

class NotEqualsToken  {
    
    constructor() {
         
        this.value = '!='
    }
}

class GreaterThanEqualToken  {
    
    constructor() {
         
        this.value = ">="
    }
}

class GreaterThanToken  {
    
    constructor() {
         
        this.value = ">"
    }
}

class LessThanEqualToken  {
    
    constructor() {
         
        this.value = "<="
    }
}

class LessThanToken  {
    
    constructor() {
         
        this.value = "<"
    }
}

class AssignmentToken  {
    
    constructor() {
         
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