 
class IntegerToken  {
    
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

class VoidToken  {

    constructor() {
         
        this.value = "void"
    }
}

// TODO: finsih
class ClassNameToken  {

    constructor(value) {
         
        this.value = value
    }
}

// TODO: finish
class MethodNameToken  {

    constructor(value) {
         
        this.value = value
    }
}

class IntegerTypeToken  {

    constructor() {
         
        this.value = "int"
    }

}

class StringTypeToken  {

    constructor() {
         
        this.value = "string"
    }
}

class BooleanTypeToken  {

    constructor() {
         
        this.value = "boolean"
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