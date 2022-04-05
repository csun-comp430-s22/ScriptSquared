
class MethodName {
	
	constructor(value)
	{
        if (!(value instanceof String)) {
            throw new EvalError("Incorrect type passed to MethodName.Parser")
        }

        this.value = value
	}

    equals(other) {
        return (other instanceof MethodName
            && this.value === other.value)
    }

}

module.exports = {
	MethodName,
}