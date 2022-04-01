const Token = require("./Token")

class IntegerToken extends Token {
    
    constructor(value) {
        super(Token)
        this.value = value
    }
}

class TrueToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "true"
    }
}

class FalseToken extends Token {
    
    constructor() {
        super(Token)
        this.value = "false"
    }
}

class StringToken extends Token {

    constructor(value) {
        super(Token)
        this.value = value
    }
}

class VoidToken extends Token {

    constructor() {
        super(Token)
        this.value = "Void"
    }
}

class ClassNameToken extends Token {

    constructor(value) {
        super(Token)
        this.value = value
    }
}

class MethodNameToken extends Token {

    constructor(value) {
        super(Token)
        this.value = value
    }
}

class IntegerTypeToken extends Token {

    constructor() {
        super(Token)
        this.value = "Int"
    }

}

class StringTypeToken extends Token {

    constructor() {
        super(Token)
        this.value = "String"
    }
}

class BooleanTypeToken extends Token {

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