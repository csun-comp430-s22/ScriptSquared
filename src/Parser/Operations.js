
class Op {}

class PlusOp extends Op {

    equals(other) {
        return other instanceof PlusOp;
    }
}

class MinusOp extends Op {

    equals() {
        return other instanceof MinusOp;
    }
}

class MultiplyOp extends Op {

    equals() {
        return other instanceof MultiplyOp;
    }
}

class DivideOp extends Op {

    equals() {
        return other instanceof DivideOp;
    }
}

class GreaterThanOp extends Op {

    equals() {
        return other instanceof GreaterThanOp;
    }
}

class LessThanOp extends Op {

    equals() {
        return other instanceof LessThanOp;
    }
}

class GreaterThanEqualOp extends Op {

    equals() {
        return other instanceof GreaterThanEqualOp;
    }
}

class LessThanEqualOp extends Op {

    equals() {
        return other instanceof LessThanEqualOp; 
    }
}

class EqualOp extends Op {

    equals() {
        return other instanceof EqualsOp;
    }
}

class NotEqualOp extends Op {

    equals() {
        return other instanceof NotEqualOp;
    }
}


module.exports = {
    PlusOp,
    MinusOp,
    MultiplyOp,
    DivideOp,
    GreaterThanOp,
    LessThanOp,
    GreaterThanEqualOp,
    LessThanEqualOp,
    EqualOp,
    NotEqualOp
}