const { instance_of } = require("../utils");

class Op {}

class PlusOp extends Op {

    equals(other) {
        return instance_of(other, PlusOp);
    }
}

class MinusOp extends Op {

    equals(other) {
        return instance_of(other, MinusOp);
    }
}

class MultiplyOp extends Op {

    equals(other) {
        return instance_of(other, MultiplyOp);
    }
}

class DivideOp extends Op {

    equals(other) {
        return instance_of(other, DivideOp);
    }
}

class GreaterThanOp extends Op {

    equals(other) {
        return instance_of(other, GreaterThanOp);
    }
}

class LessThanOp extends Op {

    equals(other) {
        return instance_of(other, LessThanOp);
    }
}

class GreaterThanEqualOp extends Op {

    equals(other) {
        return instance_of(other, GreaterThanEqualOp);
    }
}

class LessThanEqualOp extends Op {

    equals(other) {
        return instance_of(other, LessThanEqualOp); 
    }
}

class EqualOp extends Op {

    equals(other) {
        return instance_of(other, EqualOp);
    }
}

class NotEqualOp extends Op {

    equals(other) {
        return instance_of(other, NotEqualOp);
    }
}

class DotOp extends Op {

    equals(other) {
        return instance_of(other, DotOp);
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