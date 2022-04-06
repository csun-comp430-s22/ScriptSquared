const { Type } = require("./Type")
const { arrayMatchType } = require("../utils")
const { Stmt } = require("./Statements")

class ClassDec {
    constructor(className, stmtList, superClassName = null,) {

        if (className instanceof Type 
                && className.value !== "int" 
                && className.value !== "string" 
                && className.value !== "boolean" 
                && className.value !== "void"
                && arrayMatchType(stmtList, Stmt)) {
                    
            throw new EvalError("Incorrect type passed to ClassDec")
        }


        this.className = className
        
        this.superClassName = superClassName
    }
}


//TODO Think about the nonsense of instanceDec, Program, and how to incorparate instanceDecList*, constructor, and methDecList*
//TODO Look at profs function definitions in type checker repo

module.exports = ClassDec