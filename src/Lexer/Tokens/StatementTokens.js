 

class ReturnToken  {
    
    constructor() {
        super(Token)
        this.value = "return"
    }
}

class IfToken  {
    
    constructor() {
        super(Token)
        this.value = "if"
    }
}

class ElseToken  {
    
    constructor() {
        super(Token)
        this.value = "else"
    }
}

class WhileToken  {
    
    constructor() {
        super(Token)
        this.value = "while"
    }
}

class BreakToken  {
    
    constructor() {
        super(Token)
        this.value = "break"
    }
}

class PrintToken  {
    
    constructor() {
        super(Token)
        this.value = "print"
    }
}

class ThisToken  {

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