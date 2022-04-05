
class Op {}

class PlusOp extends Op {

    equals(other) {
        return other instanceof PlusOp;
    }
}

class MinusOp extends Op {

    equals(other) {
        return other instanceof MinusOp;
    }
}

class MultiplyOp extends Op {

    equals(other) {
        return other instanceof MultiplyOp;
    }
}

class DivideOp extends Op {

    equals(other) {
        return other instanceof DivideOp;
    }
}

class GreaterThanOp extends Op {

    equals(other) {
        return other instanceof GreaterThanOp;
    }
}

class LessThanOp extends Op {

    equals(other) {
        return other instanceof LessThanOp;
    }
}

class GreaterThanEqualOp extends Op {

    equals(other) {
        return other instanceof GreaterThanEqualOp;
    }
}

class LessThanEqualOp extends Op {

    equals(other) {
        return other instanceof LessThanEqualOp; 
    }
}

class EqualOp extends Op {

    equals(other) {
        return other instanceof EqualsOp;
    }
}

class NotEqualOp extends Op {

    equals(other) {
        return other instanceof NotEqualOp;
    }
}

class DotOp extends Op {

    equals(other) {
        return other instanceof DotOp;
    }
}


module.exports = {
    Op,
    PlusOp,
    MinusOp,
    MultiplyOp,
    DivideOp,
    GreaterThanOp,
    LessThanOp,
    GreaterThanEqualOp,
    LessThanEqualOp,
    EqualOp,
    NotEqualOp,
    DotOp
}