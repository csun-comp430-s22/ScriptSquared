const { arraysEqual } = require("../utils");
const { MethodName } = require("./MethodName");
const { Variable } = require("./Variable");

class Exp {}

// 1, 2
class IntegerExp extends Exp { 

    constructor(value) {
        this.value = value
    }

    equals(other) {
        return ( (other instanceof IntegerExp) && (value === other.value) );
    }
} 

// "hello"
class StringExp extends Exp {

    constructor(value) {
        this.value = value
    }

    equals(other) {
        return ( (other instanceof StringExp) && (value === other.value) );
    }
}


// true, false
class BooleanExp extends Exp {

    constructor(value) {
        this.value = value
    }

    equals(other) {
        return ( (other instanceof BooleanExp) && (value === other.value) );
    }
}

// variable
class VariableExp extends Exp {

    constructor(variable) {

        if (!(variable instanceof Variable)) {
            throw new EvalError("Incorrect type passed to VariableExp")
        }

        this.variable = variable
    }

    equals(other) {
        return ( (other instanceof VariableExp) && (this.variable === other.variable) )
    }
}

class ThisExp extends Exp {
    
    constructor(value) {
        this.value = value
    }

    equals(other) {
        return((other instanceof ThisExp) && (this.value === other.value))
    }
}

// exp op exp
class OpExp extends Exp {

    constructor(leftExp, op, rightExp) {

        if ( !(leftExp instanceof Exp && op instanceof Op && rightExp instanceof Exp) )
            throw new EvalError("Incorrect type passed to OpExp")

        this.leftExp = leftExp
        this.op = op
        this.rightExp = rightExp
    }
    
    equals(other) {

        return ( (other instanceof OpExp) && (leftExp.equals(other.leftExp)) && (op.equals(other.op)) && (rightExp.equals(other.rightExp)) );
    }
}

// exp.methodname(exp*)
class ExpMethodExp extends Exp {

    constructor(parentExp, methodName, parameterExpsArray) {
        
        if ( !(parentExp instanceof Exp && methodName instanceof MethodName && arrayMatchType(parameterExpsArray, Exp)) ) 
            throw new EvalError("Incorrect type passed to ExpMethodExp")

        this.parentExp = parentExp
        this.methodName = methodName
        this.parameterExpsArray = parameterExpsArray 
    }

    equals(other) {
        return ( (other.parentExp instanceof Exp &&
             this.methodName === other.methodName && 
             arraysEqual(this.parameterExpsArray, other.parameterExpsArray)) )
    }
}

// new classname(exp*)
class NewClassExp extends Exp {

    constructor(className, parameterExpsArray) {
        if ( !(className instanceof String) && !(parameterExpsArray instanceof Array) )
            throw new EvalError("Incorrect type passed to NewClassExp")

        this.className = className
        this.parameterExpsArray = parameterExpsArray
    }

    equals(other) {
        return ( (other.className === this.className && arraysEqual(this.parameterExpsArray, other.parameterExpsArray)) )
    }
}


module.exports = {
    Exp,
    IntegerExp,
    StringExp,
    BooleanExp,
    VariableExp,
    ThisExp,
    OpExp,
    ExpMethodExp,
    NewClassExp,
}