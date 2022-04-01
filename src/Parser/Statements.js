
class Stmt {}

class IfStmt extends Stmt {

    constructor(guardExp, trueBranch, falseBranch) {

        if (!(guardExp instanceof Exp) && !(trueBranch instanceof Stmt) && !(falseBranch instanceof Stmt) ) {
            throw new EvalError("Incorrect type passed to IfStmt")
        }

        this.guardExp = guardExp
        this.trueBranch = trueBranch
        this.falseBranch = falseBranch
    }

    equals(otherIfStmt) {
        if (otherIfStmt instanceof IfStmt) {
            return(this.guardExp.equals(otherIfStmt.trueBranch) 
                    && this.trueBranch.equals(otherIfStmt.trueBranch) 
                    && this.falseBranch.equal(otherIfStmt.falseBranch));
        } else {
            return false;
        }
    }
}

