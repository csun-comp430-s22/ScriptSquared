// TODO: import types
const { Type } = require("./Type")
const { Variable } = require("./Variable")

// vardec ::= type var = exp;
class Vardec {

    constructor(type, variable) {

        if ( !(type instanceof Type && variable instanceof Variable) )
            throw new EvalError("Incorrect type passed to Vardec")

        this.type = type
        this.variable = variable
    }

    equals(other) {
        return (other instanceof Vardec
            && this.type.equals(other.type)
            && this.variable.equals(other.variable))
    }
}

module.exports = {
    Vardec
}