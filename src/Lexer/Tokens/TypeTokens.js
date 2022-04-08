 

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

class VoidTypeToken extends TypeToken {

    constructor() {
        super()
        this.value = "void"
    }
}

// TODO: finish
class ClassNameTypeToken extends TypeToken {

    constructor(value) {
        super()
        this.value = value
    }
}

class IntegerTypeToken extends TypeToken {

    constructor() {
        super()
        this.value = "int"
    }

}

class StringTypeToken extends TypeToken {

    constructor() {
        super()
        this.value = "string"
    }
}

class BooleanTypeToken extends TypeToken {

    constructor() {
        super()
        this.value = "boolean"
    }
}



module.exports = {
    IntegerToken,
    TrueToken,
    FalseToken,
    StringToken,
    TypeToken,
    VoidTypeToken,
    ClassNameTypeToken,
    IntegerTypeToken,
    StringTypeToken,
    BooleanTypeToken
};