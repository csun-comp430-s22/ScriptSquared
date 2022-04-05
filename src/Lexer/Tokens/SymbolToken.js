 
class LeftCurlyToken  {
    
    constructor() {
         
        this.value = "{"
    }
}

class RightCurlyToken  {
    
    constructor() {
         
        this.value = "}"
    }
}

class LeftParenToken  {
    
    constructor() {
         
        this.value = "("
    }
}

class RightParenToken  {
    
    constructor() {
         
        this.value = ")"
    }
}

class SemiColonToken  {
    
    constructor() {
         
        this.value = ";"
    }
}

class DotToken  {

    constructor() {
         
        this.value = "."
    }
}

class CommaToken  {

    constructor() {
         
        this.value = ","
    }
}


module.exports = {
    LeftCurlyToken,
    RightCurlyToken,
    LeftParenToken,
    RightParenToken,
    SemiColonToken,
    DotToken,
    CommaToken
};