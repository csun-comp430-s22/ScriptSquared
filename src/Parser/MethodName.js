
class MethodName {
	
	constructor(value)
	{
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