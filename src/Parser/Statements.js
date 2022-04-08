const { Exp } = require("./Expressions");
const { MethodName } = require("./MethodName")
const { arraysEqual, arrayMatchType } = require("../utils");
const { VarDec } = require("./VarDec");
const { Variable } = require("./Variable");

class Stmt {}

// if (exp) stmt else stmt
class IfStmt extends Stmt {

    constructor(guardExp, trueBranch, falseBranch) {
        super()

        if (!(guardExp instanceof Exp) || !(trueBranch instanceof Stmt) || !(falseBranch instanceof Stmt) ) {
            throw new EvalError("Incorrect type passed to IfStmt")
        }

        this.guardExp = guardExp
        this.trueBranch = trueBranch
        this.falseBranch = falseBranch
    }

    equals(otherIfStmt) {
        return(otherIfStmt instanceof IfStmt
                    && this.guardExp.equals(otherIfStmt.trueBranch) 
                    && this.trueBranch.equals(otherIfStmt.trueBranch) 
                    && this.falseBranch.equal(otherIfStmt.falseBranch));
    }
}

// while (exp) stmt
class WhileStmt extends Stmt {

    constructor(guardExp, loopStmt) {
        super()

        if ( !(guardExp instanceof Exp) || !(loopStmt instanceof Stmt) ) {
            throw new EvalError("Incorrect type passed to WhileStmt")
        }

        this.guardExp = guardExp
        this.loopStmt = loopStmt
    }

    equals(otherWhileStmt) {
        return (otherWhileStmt instanceof WhileStmt
                    && this.guardExp.equals(otherWhileStmt.guardExp)
                    && this.loopStmt.equals(otherWhileStmt.loopStmt));
    }
}

// return exp;
class ReturnExpStmt extends Stmt {

    constructor(returnExp) {
        super()

        if( !(returnExp instanceof Exp))
        {
            throw new EvalError("Incorrect type passed to ReturnExpStmt")
        }
        
        this.returnExp = returnExp
    }

    equals(otherReturnExpStmt)
    {
        return (otherReturnExpStmt instanceof ReturnExpStmt
            && this.returnExp.equals(otherReturnExpStmt.returnExp));
    }
}

// return;
class ReturnStmt extends Stmt {
    
    equals(otherReturnStmt) {
        return (otherReturnStmt instanceof ReturnStmt);
    }
}

// print(exp);
class PrintExpStmt extends Stmt {
    constructor(exp) {
        super()

        if( !(exp instanceof Exp)) {
            throw new EvalError("Incorrect type passed to PrintExpStmt")
        }
        this.printExp = exp
    }

    equals(otherPrintExpStmt) {
        return (otherPrintExpStmt instanceof PrintExpStmt
            && this.printExp.equal(otherPrintExpStmt.printExp))
    }
}

// break;
class BreakStmt extends Stmt {
    
    equals(otherBreakStmt) {
        return (otherBreakStmt instanceof BreakStmt);
    }
}

// { stmt* }
class BlockStmt extends Stmt {
    
    constructor(stmtList) {
        super()

        if (!(arrayMatchType(stmtList, Stmt))) {
            throw new EvalError("Incorrect type passed to BlockStmt")
        }
        
        this.stmtList = stmtList
    }

    equals(otherBlockStmt) {
        return (otherBlockStmt instanceof BlockStmt 
                    && arraysEqual(this.stmtList, otherBlockStmt.stmtList));
    }
}

// exp.methodname(exp*);
class ExpMethodExpStmt extends Stmt {
    constructor(parentExp, methodName, parameterExpsArray) {
        super()
        
        if ( !(parentExp instanceof Exp) || !(methodName instanceof MethodName) || !(arrayMatchType(parameterExpsArray, Exp)) ) {
            throw new EvalError("Incorrect type passed to ExpMethodExpStmt")
        }

        this.parentExp = parentExp
        this.methodName = methodName
        this.parameterExpsArray = parameterExpsArray
    } 

    equals(otherExpMethodExpStmt) {
        return (otherExpMethodExpStmt instanceof ExpMethodExpStmt
                    && this.parentExp.equals(otherExpMethodExpStmt.parentExp)
                    && arraysEqual(this.parameterExpsArray, otherExpMethodExpStmt.parameterExpsArray));
    }
}

// var = exp;
class VarEqualsExpStmt extends Stmt {
    constructor(variable, exp){
        super()

        if(!(variable instanceof Variable) || !(exp instanceof Exp)) {
            throw new EvalError("Incorrect type passed to VarEqualsExpStmt")
        }
        
        this.variable = variable
        this.exp = exp
    }

    equals(otherVarEqualsExpStmt) {
        return (otherVarEqualsExpStmt instanceof VarEqualsExpStmt
                    && this.variable.equals(otherVarEqualsExpStmt.variable)
                    && this.exp.equals(otherVarEqualsExpStmt.exp));
    }
}

// vardec = exp; 
class VarDecEqualsExpStmt extends Stmt {
    constructor(vardec, exp){
        super()

        if(!(vardec instanceof VarDec) || !(exp instanceof Exp)) {
            throw new EvalError("Incorrect type passed to VarDecEqualsExpStmt")
        }
        
        this.vardec = vardec
        this.exp = exp
    }

    equals(otherVarDecEqualsExpStmt) {
        return (otherVarDecEqualsExpStmt instanceof VarDecEqualsExpStmt
                    && this.vardec.equals(otherVarDecEqualsExpStmt.vardec)
                    && this.exp.equals(otherVarDecEqualsExpStmt.exp));
    }
}



module.exports = {
    Stmt,
    IfStmt,
    WhileStmt,
    ReturnExpStmt,
    ReturnStmt,
    PrintExpStmt,
    BreakStmt,
    BlockStmt,
    ExpMethodExpStmt,
    VarEqualsExpStmt,
    VarDecEqualsExpStmt
}