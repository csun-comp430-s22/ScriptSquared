
class Type {}

class IntType extends Type {
    constructor(value) {
        if (value !== "int") {
            throw new EvalError("Incorrect type passed to IntType.Parser")
        }

        this.value = value
    }

    equals(other) {
        return (other instanceof IntType
                    && this.value === other.value)
    }
}

class StringType extends Type {
    constructor(value) {
        if (value !== "string") {
            throw new EvalError("Incorrect type passed to StringType.Parser")
        }

        this.value = value
    }

    equals(other) {
        return (other instanceof StringType
                    && this.value === other.value)
    }
}

class BooleanType extends Type {
    constructor(value) {
        if (value !== "boolean") {
            throw new EvalError("Incorrect type passed to BooleanType.Parser")
        }

        this.value = value
    }

    equals(other) {
        return (other instanceof BooleanType
                    && this.value === other.value)
    }
}

class VoidType extends Type {
    constructor(value) {
        if (value !== "void") {
            throw new EvalError("Incorrect type passed to VoidType.Parser")
        }

        this.value = value
    }

    equals(other) {
        return (other instanceof VoidType
                    && this.value === other.value)
    }
}

class ClassNameType extends Type {
    constructor(value) {
        if (!(value instanceof String)) {
            throw new EvalError("Incorrect type passed to ClassNameType.Parser")
        }

        this.value = value
    }

    equals(other) {
        return (other instanceof ClassNameType
                    && this.value === other.value)
    }
}

module.exports = { 
    Type,
    IntType,
    StringType,
    BooleanType,
    VoidType,
    ClassNameType
}