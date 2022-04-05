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

    constructor(name) {
        this.name = name
    }

    equals(other) {
        return ( (other instanceof VariableExp) && (this.value === other.name) )
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

function arraysEqual(arrayOne, arrayTwo) {

    if (arrayOne.length !== arrayTwo.length)
        return false;
    
    for (let i = 0; i < arrayOne.length; i++) {
        if ( arrayOne[i].constructor !== arrayTwo[i].constructor ) {
            return false;
        }
    }
    
    return true;
}

// exp.methodname(exp*)
class ExpMethodExp extends Exp {

    constructor(parentExp, methodName, parameterExpsArray) {
        
        if ( !(parentExp instanceof Exp && parameterExpsArray instanceof Array) )
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
class ClassExp extends Exp {

    constructor(className, parameterExpsArray) {
        if ( !(parameterExpsArray instanceof Array) )
            throw new EvalError("Incorrect type passed to ClassExp")

        this.className = className
        this.parameterExpsArray = parameterExpsArray
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
    ClassExp,
}