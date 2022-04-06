const { Type } = require("./Type")
const { Variable } = require("./Variable")

// vardec ::= type var = exp;
class VarDec {

    constructor(type, variable) {

        if ( !(type instanceof Type && variable instanceof Variable) )
            throw new EvalError("Incorrect type passed to VarDec")

        this.type = type
        this.variable = variable
    }

    equals(other) {
        return (other instanceof VarDec
            && this.type.equals(other.type)
            && this.variable.equals(other.variable))
    }
}

module.exports = {
    VarDec
}