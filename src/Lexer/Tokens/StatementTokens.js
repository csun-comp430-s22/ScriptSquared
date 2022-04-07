 

class ReturnToken  {
    
    constructor() {
         
        this.value = "return"
    }
}

class IfToken  {
    
    constructor() {
         
        this.value = "if"
    }
}

class ElseToken  {
    
    constructor() {
         
        this.value = "else"
    }
}

class WhileToken  {
    
    constructor() {
         
        this.value = "while"
    }
}

class BreakToken  {
    
    constructor() {
         
        this.value = "break"
    }
}

class PrintToken  {
    
    constructor() {
         
        this.value = "print"
    }
}

class ThisToken  {

    constructor() {
         
        this.value = "this"
    }
}



module.exports = {
    ReturnToken,
    IfToken,
    ElseToken,
    WhileToken,
    BreakToken,
    PrintToken,
    ThisToken
};