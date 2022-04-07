 

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

class TypeToken {}

class VoidToken extends TypeToken {

    constructor() {
         
        this.value = "void"
    }
}

// TODO: finish
class ClassNameToken extends TypeToken {

    constructor(value) {
         
        this.value = value
    }
}

class IntegerTypeToken extends TypeToken {

    constructor() {
         
        this.value = "int"
    }

}

class StringTypeToken extends TypeToken {

    constructor() {
         
        this.value = "string"
    }
}

class BooleanTypeToken extends TypeToken {

    constructor() {
         
        this.value = "boolean"
    }
}



module.exports = {
    IntegerToken,
    TrueToken,
    FalseToken,
    StringToken,
    TypeToken,
    VoidToken,
    ClassNameToken,
    IntegerTypeToken,
    StringTypeToken,
    BooleanTypeToken
};