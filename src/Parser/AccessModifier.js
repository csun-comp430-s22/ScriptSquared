
class AccessModifier {

    constructor(value) {
        
        if (!(value instanceof String)) {
            throw new EvalError("Incorrect type passed to AccessModifier.Parser")
        }

        this.value = value
    }

    equals(other) {
        return (other instanceof AccessModifier
            && this.value === other.value)
    }
}


module.exports = {
	AccessModifier
}