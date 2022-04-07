const { Exp } = require("./Expressions");
const { MethodName } = require("./MethodName")
const { arraysEqual, arrayMatchType } = require("../utils");
const { VarDec } = require("./VarDec");
const { Variable } = require("./Variable");

class Stmt {}

class IfStmt extends Stmt {

    constructor(guardExp, trueBranch, falseBranch) {

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


class WhileStmt extends Stmt {

    constructor(guardExp, loopStmt) {

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

class ReturnExpStmt extends Stmt {

    constructor(returnExp)
    {
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

class ReturnStmt extends Stmt {
    
    equals(otherReturnStmt) {
        return (otherReturnStmt instanceof ReturnStmt);
    }
}

class PrintExpStmt extends Stmt {
    constructor(exp) {
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

class BreakStmt extends Stmt {
    
    equals(otherBreakStmt) {
        return (otherBreakStmt instanceof BreakStmt);
    }
}

class BlockStmt extends Stmt {
    
    constructor(stmtList) {

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

// class ExpMethodExpStmt extends Stmt {
//     constructor(parentExp, methodName, expList) {
        
//         if ( !(parentExp instanceof Exp) || !(methodName instanceof MethodName) || !(arrayMatchType(expList, Exp)) ) {
//             throw new EvalError("Incorrect type passed to ExpMethodExpStmt")
//         }

//         this.parentExp = parentExp
//         this.methodName = methodName
//         this.expList = expList
//     } 

//     equals(otherExpMethodExpStmt) {
//         return (otherExpMethodExpStmt instanceof ExpMethodExpStmt
//                     && this.parentExp.equals(otherExpMethodExpStmt.parentExp)
//                     && arraysEqual(this.expList, otherExpMethodExpStmt.expList));
//     }
// }

// TODO: double check this is correct; check in parser
class ExpMethodExpStmt extends Stmt {
    constructor(expMethodExp) {

        this.parentExp = expMethodExp.parentExp
        this.methodName = expMethodExp.methodName
        this.parameterExpsArray = expMethodExp.parameterExpsArray
    } 

    equals(otherExpMethodExpStmt) {
        return (otherExpMethodExpStmt instanceof ExpMethodExpStmt
                    && this.parentExp.equals(otherExpMethodExpStmt.parentExp)
                    && this.methodName.equals(otherExpMethodExpStmt.methodName)
                    && arraysEqual(this.parameterExpsArray, otherExpMethodExpStmt.parameterExpsArray));
    }
}

class VarEqualsExpStmt extends Stmt {
    constructor(variable, exp){
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

class VarDecEqualsExpStmt extends Stmt {
    constructor(vardec, exp){
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