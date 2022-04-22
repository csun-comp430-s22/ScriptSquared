 

class IntegerToken {
    
    constructor(value) {
         
        this.value = value
    }
}

class TrueToken  {
    
    constructor() {
         
        this.value = "true"
    }
}

class FalseToken  {
    
    constructor() {
         
        this.value = "false"
    }
}

class StringToken  {

    constructor(value) {
         
        this.value = value
    }
}


module.exports = {
    IntegerToken,
    TrueToken,
    FalseToken,
    StringToken,
}