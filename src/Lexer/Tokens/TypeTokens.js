class TypeToken {}

class VoidTypeToken extends TypeToken {

    constructor() {
        super()
        this.value = "void"
    }
}

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
    TypeToken,
    VoidTypeToken,
    ClassNameTypeToken,
    IntegerTypeToken,
    StringTypeToken,
    BooleanTypeToken
};