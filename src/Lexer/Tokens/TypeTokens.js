 
class IntegerToken  {
    
    constructor(value) {
        super(Token)
        this.value = value
    }
}

class TrueToken  {
    
    constructor() {
        super(Token)
        this.value = "true"
    }
}

class FalseToken  {
    
    constructor() {
        super(Token)
        this.value = "false"
    }
}

class StringToken  {

    constructor(value) {
        super(Token)
        this.value = value
    }
}

class VoidToken  {

    constructor() {
        super(Token)
        this.value = "Void"
    }
}

class ClassNameToken  {

    constructor(value) {
        super(Token)
        this.value = value
    }
}

class MethodNameToken  {

    constructor(value) {
        super(Token)
        this.value = value
    }
}

class IntegerTypeToken  {

    constructor() {
        super(Token)
        this.value = "Int"
    }

}

class StringTypeToken  {

    constructor() {
        super(Token)
        this.value = "String"
    }
}

class BooleanTypeToken  {

    constructor() {
        super(Token)
        this.value = "Boolean"
    }
}



module.exports = {
    IntegerToken,
    TrueToken,
    FalseToken,
    StringToken,
    VoidToken,
    MethodNameToken,
    ClassNameToken,
    IntegerTypeToken,
    StringTypeToken,
    BooleanTypeToken
};