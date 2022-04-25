const { arraysEqual, instance_of } = require("../utils");
const { MethodName } = require("./MethodName");
const { Op } = require("./Operations");
const { ClassNameType } = require("./Type");
const { Variable } = require("./Variable");

class Exp {}

// 1, 2
class IntegerExp extends Exp { 

    constructor(value) {
        super()
        this.value = value
    }

    equals(other) {
        return ( (instance_of(other, IntegerExp)) && (this.value === other.value) );
    }
} 

// "hello"
class StringExp extends Exp {

    constructor(value) {
        super()
        this.value = value
    }

    equals(other) {
        return ( (instance_of(other, StringExp)) && (this.value === other.value) );
    }
}


// true, false
class BooleanExp extends Exp {

    constructor(value) {
        super()
        this.value = value
    }

    equals(other) {
        return ( (instance_of(other, BooleanExp)) && (this.value === other.value) );
    }
}

// variable
class VariableExp extends Exp {

    constructor(variable) {
        super()

        if (!(instance_of(variable, Variable))) {
            throw new EvalError("Incorrect type passed to VariableExp")
        }

        // changing this to see how it works with tester, currently it is VarExp -> Var -> value 
        //this.variable = variable
        this.value = variable.value // <<<- this fixed it!
    }

    equals(other) {
        return ( (instance_of(other, VariableExp)) && (this.variable === other.variable) )
    }
}

class ThisExp extends Exp {
    
    constructor(value) {
        super()
        this.value = value
    }

    equals(other) {
        return((instance_of(other, ThisExp)) && (this.value === other.value))
    }
}

// exp op exp
class OpExp extends Exp {

    constructor(leftExp, op, rightExp) {
        super()

        if ( !instance_of(leftExp, Exp) || !instance_of(op, Op) || !instance_of(rightExp, Exp) )
            throw new EvalError("Incorrect type passed to OpExp")

        this.leftExp = leftExp
        this.op = op
        this.rightExp = rightExp
    }
    
    equals(other) {

        return ( (instance_of(other, OpExp)) && (this.leftExp.equals(other.leftExp)) && (this.op.equals(other.op)) && (this.rightExp.equals(other.rightExp)) );
    }
}

// exp.methodname(exp*)
class ExpMethodExp extends Exp {

    constructor(parentExp, methodName, parameterExpsArray) {
        super()

        if ( !instance_of(parentExp, Exp) || !instance_of(methodName, MethodName) || !arraysEqual(parameterExpsArray, Exp) ) 
            throw new EvalError("Incorrect type passed to ExpMethodExp")

        this.parentExp = parentExp
        this.methodName = methodName
        this.parameterExpsArray = parameterExpsArray 
    }

    equals(other) {
        return ( (instance_of(other.parentExp, Exp) &&
             this.methodName.equals(other.methodName) && 
             arraysEqual(this.parameterExpsArray, other.parameterExpsArray)) )
    }
}

// new classname(exp*)
class NewClassExp extends Exp {

    constructor(className, parameterExpsArray) {
        super()
        if ( !(instance_of(className, ClassNameType)) && !(instance_of(parameterExpsArray, Array)) )
            throw new EvalError("Incorrect type passed to NewClassExp")

        this.className = className
        this.parameterExpsArray = parameterExpsArray
    }

    equals(other) {
        return ( (this.className.equals(other.className) && arraysEqual(this.parameterExpsArray, other.parameterExpsArray)) )
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