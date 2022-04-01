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

// exp op exp
class OpExp extends Exp {

    constructor(left, op, right) {
        this.left = left
        this.op = op
        this.right = right
    }
    
    equals(other) {

        return ( (other instanceof OpExp) && (left.equals(other.left)) && (op.equals(other.op)) && (right.equals(other.right)) );
    }
}

// 
class VariableExp extends Exp {

    constructor(name) {
        this.name = name
    }

    equals(other) {
        return ( (other instanceof VariableExp) && name.equals(other.name) )
    }
}

class ThisExp extends Exp {
    
    constructor(value) {
        this.value = value
    }

    equals(other) {
        return((other instanceof ThisExp) && (other.value === this.value))
    }
}

// 
// class ExpMethodExp extends Exp {

//     constructor(parentExp, methodName, otherExp) {
//         if( !(parentExp instanceof Exp) && !(methodName))
//     }
// }