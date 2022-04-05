class Variable {

    constructor(value) {

        if (!(value instanceof String)) {
            throw new EvalError("Incorrect type passed to Variable")
        }

        this.value = value
    }

    equals(other) {
        return (other instanceof Variable
                    && this.value === other.value)
    }
}

module.exports = {
    Variable
}