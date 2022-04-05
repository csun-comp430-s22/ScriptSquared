
class Type {

    constructor(value) {

        if (!(value instanceof String)) {
            throw new EvalError("Incorrect type passed to Type.Parser")
        }

        this.value = value
    }

    equals(other) {
        return (other instanceof Type
                    && this.value === other.value)
    }
}

module.exports = { 
    Type
}