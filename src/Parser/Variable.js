class Variable {

    constructor(value) {

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