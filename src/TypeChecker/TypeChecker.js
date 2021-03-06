const { PrivateModifier, ProtecModifier } = require("../Parser/AccessModifier");
const { BooleanExp, Exp, ExpMethodExp, IntegerExp, NewClassExp, OpExp, StringExp, ThisExp, VariableExp } = require("../Parser/Expressions");
const { DivideOp, DotOp, EqualOp, GreaterThanEqualOp, GreaterThanOp, LessThanEqualOp, LessThanOp, MinusOp, MultiplyOp, NotEqualOp, PlusOp } = require("../Parser/Operations");
const { IfStmt, WhileStmt, ReturnExpStmt, ReturnStmt, PrintExpStmt, BreakStmt, BlockStmt, ExpMethodExpStmt, VarEqualsExpStmt, VarDecEqualsExpStmt } = require("../Parser/Statements");
const { BooleanType, ClassNameType, IntType, StringType, Type, VoidType } = require("../Parser/Type");
const { instance_of } = require("../utils");
const { TypeError } = require("./TypeError")

class TypeChecker {

    // Things to track:
    // 1. Variables in scope, and their types
    // 2. Classes available, parameters constructors take, methods they have, what their parent class is

    // Sorts of queries we want to make to calss information: 
    // 1. Is this a valid class?
    // 2. For this class, what ar ethe argument types fo rthe constructor? 
    // 3. Does this class support a given method? If so, what are the parameter
    //    types for the method?
    //      - Need to take inheritance into account
    // 4. Is this given class a subclass of another class?
    // 5. Does our class hierarchy form a tree (aka no cycles)?

    constructor(program) {
        this.program = program
        const classList = program.classDecList;
        
        // className: { methodName: array of param types in order }
        this.classMethodMap = {
            "Object": {}
        }

        // className: array of param types
        this.classConstructorTypes = {
            "Object": []
        }

        // className: { methodName: return type }
        this.methodReturnType = {
            "Object": {}
        }

        // className: { methodName: accessModifier }
        this.methodAccessMod = {
            "Object": {}
        }

        // className: { variableName: type }
        this.classInstanceVariables = {
            "Object": {}
        }

        // className: { variableName: accessModifier }
        this.instanceVariableAccessMod = {
            "Object": {}
        }

        // type: array of subtypes
        this.typeTree = {
            "Object": []
        }

        // Fill type tree
        const dupMap = {}
        classList.forEach(classDec => {
            const className = classDec.classNameType.value 

            if (dupMap[className])
                throw new TypeError("Duplicate class: " + className)
            
            dupMap[className] = true
            this.insertIntoTypeTree(classDec, this.typeTree)
        })

        // Check for Cycles in type tree
        this.checkForCycles(this.typeTree, classList)

        // Fill classMethodMap, methodReturnType, classConstructorTypes, and methodAccessMod
        classList.forEach(classDec => {
            const className = classDec.classNameType.value
            const [instanceDecsArray, methodsArray] = this.extractMethodsAndInstanceDecsFromClass(className, classList)

            this.classConstructorTypes[className] = classDec.constructor.vardecList.map(varDec => varDec.type)
            
            this.methodReturnType[className] = {}
            this.methodAccessMod[className] = {}
            this.classMethodMap[className] = this.iterateMethodArrayAndExtractData(className, methodsArray, this.methodReturnType, this.methodAccessMod)
            
            this.instanceVariableAccessMod[className] = {}
            this.classInstanceVariables[className] = this.iterateInstanceDecArrayAndExtractData(className, instanceDecsArray, this.instanceVariableAccessMod)
        })

    }

    /**
     * 
     * @param {String} className name of class to extract methods from
     * @param {Array} classList array of all classDecs
     * @returns array of instanceDecs and methodDecs in specified class (as array)
     */
    extractMethodsAndInstanceDecsFromClass(className, classList) {
        const classDec = classList.find(classDec => classDec.classNameType.value === className)
        if (classDec === undefined) {
            throw new TypeError("Class '" + className + "' is not defined")
        }

        let classInstanceDecs = [...classDec.instanceDecList]
        let classMethods = [...classDec.methodDecList]

        // Check for instance variable dups
        this.checkForDupInstanceDecs(className, classInstanceDecs)

        // Check for method dups
        this.checkForDupMethods(className, classMethods)
        
        // Extract super class methods
        if (classDec.superClassName.value !== "Object") {
            const [superClassInstanceDecs, superClassMethods] = this.extractMethodsAndInstanceDecsFromClass(classDec.superClassName.value, classList)

            // Delete Private Methods
            for (let i = 0; i < superClassMethods.length; i++) {
                const accessMod = superClassMethods[i].accessModifier

                if (instance_of(accessMod, PrivateModifier)) {
                    superClassMethods.splice(i,1)
                }
            }

            // Delete Private Instance Variables
            for (let i = 0; i < superClassInstanceDecs.length; i++) {
                const accessMod = superClassInstanceDecs[i].accessModifier

                if (instance_of(accessMod, PrivateModifier)) {
                    superClassInstanceDecs.splice(i,1)
                }
            }

            classInstanceDecs = classInstanceDecs.concat(superClassInstanceDecs)
            classMethods = classMethods.concat(superClassMethods)
        }

        return [classInstanceDecs, classMethods];
    }

    checkForDupMethods(className, methodDecArray) {
        const dupMap = {}
        methodDecArray.forEach(methodDec => {
            const methodName = methodDec.methodName.value

            if (dupMap[methodName])
                throw new TypeError("Cannot have two methods '" + methodName + "' in class '" + className + "'");
            else 
                dupMap[methodName] = true
        })
    }

    checkForDupInstanceDecs(className, instanceDecArray) {
        const dupMap = {}
        instanceDecArray.forEach(instanceDec => {
            const variableName = instanceDec.vardec.variable.value

            if (dupMap[variableName])
                throw new TypeError("Cannot have two variables '" + variableName + "' in class '" + className + "'");
            else 
                dupMap[variableName] = true
        })
    }

    iterateMethodArrayAndExtractData(className, methodArray, methodReturnType, methodAccessMod) {
        const methodMap = {}

        methodArray.forEach(methodDec => {
            const methodName = methodDec.methodName.value

            // if method is in the map already then it has been overriden and you don't need the super's method
            if ( methodMap[methodName] === undefined ) {
                methodMap[methodName] = methodDec.varDecList.map(vardec => vardec.type)
                methodReturnType[className][methodName] = methodDec.type
                methodAccessMod[className][methodName] = methodDec.accessModifier
            }  

        })

        return methodMap;
    }

    iterateInstanceDecArrayAndExtractData(className, instanceDecsArray, instanceVariableAccessMod) {

        const variableTypeMap = {}

        instanceDecsArray.forEach(instanceDec => {
            const variableName = instanceDec.vardec.variable.value

            // if variable is in the map already then it has been overriden and you don't need the super's variable
            if ( variableTypeMap[variableName] === undefined ) {
                variableTypeMap[variableName] = instanceDec.vardec.type
                instanceVariableAccessMod[className][variableName] = instanceDec.accessModifier
            }
        })

        return variableTypeMap;
    }

    insertIntoTypeTree(classDec, typeTree) {
        const classType = classDec.classNameType.value
        const parentType = classDec.superClassName.value 
        
        if (parentType in typeTree) {
            typeTree[parentType].push(classType)
        } else {
            typeTree[parentType] = []
            typeTree[parentType].push(classType)
        }

        // Make class subtype of everything its parent is a subtype of 
        Object.keys(typeTree).forEach(key => {
            if (typeTree[key].includes(parentType))
                typeTree[key].push(classType)
        })

        if (!(classType in typeTree)) {
            typeTree[classType] = [] 
        }
    }

    checkForCycles(typeTree, classList) {

        if (typeTree["Object"].length !== classList.length)
            throw new TypeError("There is a cycle in the class hierarchy");

        classList.forEach(classDec => {
            const isIncluded = typeTree["Object"].includes(classDec.classNameType.value)

            if (!isIncluded)
                throw new TypeError("There is a cycle in the class hierarchy");
        })
    }

    /**
     * @param {Exp} exp An Expression variable
     * @param {Object} typeEnvironment An object that maps key:"Variable" to value:"Type"
     * @param {String} classWeAreIn The current class that is in scope (string); Is "null" if in entry point
     * @returns The type of an expression
     */
    expTypeof(exp, typeEnvironment = {}, classWeAreIn) {
        if (instance_of(exp, IntegerExp)) {
            return new IntType();
        } 
        else if (instance_of(exp, StringExp)) {
            return new StringType();
        }
        else if (instance_of(exp, BooleanExp)) {
            return new BooleanType();
        }
        else if (instance_of(exp, VariableExp)) {
            return this.typeofVariable(exp, typeEnvironment);
        }
        else if (instance_of(exp, ThisExp)) {
           return this.typeofThis(classWeAreIn);
        }
        else if (instance_of(exp, OpExp)) {
            return this.typeofOpExp(exp, typeEnvironment, classWeAreIn);
        }
        else if (instance_of(exp, ExpMethodExp)) {
            return this.typeofExpMethodExp(exp, typeEnvironment, classWeAreIn);
        }
        else if (instance_of(exp, NewClassExp)) {
            return this.typeofNewClassExp(exp, typeEnvironment, classWeAreIn)
        }
        else {
            throw new TypeError("Unrecognized expression: " + exp);
        }
    }

    typeofVariable(variableExp, typeEnvironment) {
        const variable = variableExp.value
        if (variable in typeEnvironment) {
            return typeEnvironment[variable];
        }

        throw new TypeError("Used variable not in scope: " + variable);
    }

    typeofThis(classWeAreIn) {
        if (classWeAreIn === null) 
            throw new TypeError("'this' used in the entry point");
        else 
            return new ClassNameType(classWeAreIn);
    }

    // exp op exp
    typeofOpExp(OpExp, typeEnvironment, classWeAreIn) {
        const leftType = this.expTypeof(OpExp.leftExp, typeEnvironment, classWeAreIn)
        const rightType = this.expTypeof(OpExp.rightExp, typeEnvironment, classWeAreIn)
        const op = OpExp.op

        if (instance_of(op, PlusOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new IntType();
            else 
                throw new TypeError("Operand type mismatch for: +")
        }
        else if (instance_of(op, MinusOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new IntType();
            else 
                throw new TypeError("Operand type mismatch for: -")
        }
        else if (instance_of(op, MultiplyOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new IntType();
            else 
                throw new TypeError("Operand type mismatch for: *")           
        }
        else if (instance_of(op, DivideOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new IntType();
            else 
                throw new TypeError("Operand type mismatch for: /")           
        }
        else if (instance_of(op, GreaterThanOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: >")           
        }
        else if (instance_of(op, LessThanOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: <")           
        }
        else if (instance_of(op, GreaterThanEqualOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: >=")           
        }
        else if (instance_of(op, LessThanEqualOp)) {
            if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: <=")           
        }
        else if (instance_of(op, EqualOp)) {
            if (instance_of(leftType, BooleanType) && instance_of(rightType, BooleanType))
                return new BooleanType();
            else if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else if (instance_of(leftType, StringType) && instance_of(rightType, StringType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: ==")           
        }
        else if (instance_of(op, NotEqualOp)) {
            if (instance_of(leftType, BooleanType) && instance_of(rightType, BooleanType))
                return new BooleanType();
            else if (instance_of(leftType, IntType) && instance_of(rightType, IntType))
                return new BooleanType();
            else if (instance_of(leftType, StringType) && instance_of(rightType, StringType))
                return new BooleanType();
            else 
                throw new TypeError("Operand type mismatch for: !=")           
        }
        else {
            throw new TypeError("Unsupported operation: " + op);
        }
    }

    // exp.methodname(exp*)
    typeofExpMethodExp(ExpMethodExp, typeEnvironment, classWeAreIn) {
        const parentExpType = this.expTypeof(ExpMethodExp.parentExp, typeEnvironment, classWeAreIn)
        const parameterExpsTypeArray = ExpMethodExp.parameterExpsArray.map(exp => this.expTypeof(exp, typeEnvironment, classWeAreIn))
        const methodName = ExpMethodExp.methodName.value

        if (!instance_of(parentExpType, ClassNameType))
            throw new TypeError("Called method '" + methodName + "' on non-class type: " + parentExpType);

        const className = parentExpType.value

        // Check if method is accessable in current scope
        const accessMod = this.methodAccessMod[className][methodName]
        this.checkAccessMod(className, methodName, accessMod, classWeAreIn)
    
        const expectedMethodParamsTypes = this.expectedParamTypesForClassAndMethod(className, methodName)

        // Will throw error if something fails
        this.compareTypesInArray(parameterExpsTypeArray, expectedMethodParamsTypes)
        return this.methodReturnType[className][methodName];
    }

    // new classname(exp*)
    typeofNewClassExp(NewClassExp, typeEnvironment, classWeAreIn) {

        const className = NewClassExp.className.value

        // Makes sure parameters are correct type
        
            // Get params of user created exp
            const testParams = NewClassExp.parameterExpsArray
            const testParamsTypes = testParams.map(exp => this.expTypeof(exp, typeEnvironment, classWeAreIn))
            
            // Get params of defined class
            const expectedParamsTypes = this.classConstructorTypes[className]

        if (expectedParamsTypes === undefined) 
            throw new TypeError("Class '" + className + "' doesn't exist");

        if (testParamsTypes.length !== expectedParamsTypes.length)
            throw new TypeError("Inncorrect number of constructor parameters for: " + className);

        // Throws error if there is a mismatch
        this.compareTypesInArray(testParamsTypes, expectedParamsTypes)

        return new ClassNameType(NewClassExp.className.value);
    }

    /**
     * 
     * @param {String} className name of class method is being called on
     * @param {String} methodName name of method being called
     * @param {AccessModifier} accessMod access modifier of the method being called
     * @param {String} classWeAreIn the current class the method is being called in
     * @returns true if everything is okay; throws error otherwise
     */
    checkAccessMod(className, methodName, accessMod, classWeAreIn) {

        // if method is private, then you can only call it inside the class of the method
        if ( instance_of(accessMod, PrivateModifier) && className !== classWeAreIn ) 
            throw new TypeError("Method '" + methodName + "' is not accessible in class '" + classWeAreIn + "'");
            
        // if method is protec, then you can only call it inside the class or subclass of the class of the method
        if ( instance_of(accessMod, ProtecModifier) && !this.isLeftTypeofRight(new ClassNameType(classWeAreIn), new ClassNameType(className)) )
            throw new TypeError("Method '" + methodName + "' is not accessible in class '" + classWeAreIn + "'");

        return true;
    }

    /** 
     * 
     * @param {String} className 
     * @param {String} methodName 
     * @returns Array containing types for method parameters; throws error if method not in class
     */
    expectedParamTypesForClassAndMethod(className, methodName) {
        const classMethods = this.classMethodMap[className]
        if (classMethods === undefined) 
            throw new TypeError("No such class '" + className + "' exists")

        const expectedMethodParams = classMethods[methodName]
        if (expectedMethodParams === undefined) 
            throw new TypeError("No such method '" + methodName + "' exists for class '" + className + "'");
        
        return expectedMethodParams;
    }

    /**
     * 
     * @param {Type[]} testArray 
     * @param {Type[]} expectedArray 
     * @returns True if have same types in same order; throws error otherwise
     */
    compareTypesInArray(testArray, expectedArray) {

        if (testArray.length !== expectedArray.length)
            throw new TypeError("Inncorrect number of parameters for call. Recieved: " + testArray.map(e => e.value) + ". Expected: " + expectedArray.map(e => e.value) );

        for (let i = 0; i < testArray.length; i++) {
           this.isLeftTypeofRight(testArray[i], expectedArray[i])
        }      

        return true;
    }

    /**
     * 
     * @param {Type} testType 
     * @param {Type} expectedType 
     * @returns true if test type is equal or subtype of expected type; throws error otherwise
     */
    isLeftTypeofRight(testType, expectedType) {

        if (testType.equals(expectedType))
            return true;
    
        if (this.typeTree[expectedType.value] === undefined)
            throw new TypeError("Type: " + testType.value + " doesn't match type: " + expectedType.value);
            
        if (this.typeTree[expectedType.value].includes(testType.value))
            return true;
        else 
            throw new TypeError("Type: " + testType.value + " doesn't match type: " + expectedType.value);
    }

    // STATEMENTS
    isWellTyped(stmt, typeEnvironment, classWeAreIn, functionReturnType) {

        if (instance_of(stmt, IfStmt)) {
            return this.isWellTypedIf(stmt, typeEnvironment, classWeAreIn, functionReturnType);
        } 
        else if (instance_of(stmt, WhileStmt)) {
            return this.isWellTypedWhile(stmt, typeEnvironment, classWeAreIn, functionReturnType);
        } 
        else if (instance_of(stmt, ReturnExpStmt)) {
            return this.isWellTypedReturnExp(stmt, typeEnvironment, classWeAreIn, functionReturnType);
        } 
        else if (instance_of(stmt, ReturnStmt)) {
            return this.isWellTypedReturn(typeEnvironment, functionReturnType);
        } 
        else if (instance_of(stmt, PrintExpStmt)) {
            return this.isWellTypedPrint(stmt, typeEnvironment, classWeAreIn);
        } 
        else if (instance_of(stmt, BreakStmt)) {
            return typeEnvironment;
        } 
        else if (instance_of(stmt, BlockStmt)) {
            return this.isWellTypedBlock(stmt, typeEnvironment, classWeAreIn, functionReturnType);
        } 
        else if (instance_of(stmt, ExpMethodExpStmt)) {
            return this.isWellTypedExpMethodExp(stmt, typeEnvironment, classWeAreIn);
        } 
        else if (instance_of(stmt, VarEqualsExpStmt)) {
            return this.isWellTypedVarEqualsExp(stmt, typeEnvironment, classWeAreIn);
        } 
        else if (instance_of(stmt, VarDecEqualsExpStmt)) {
            return this.isWellTypedVarDecEqualsExp(stmt, typeEnvironment, classWeAreIn);
        } 
        else {
            throw new TypeError("Unsupported statement: " + stmt);
        }
    }

    // if (exp) stmt else stmt
    isWellTypedIf (ifStmt, typeEnvironment, classWeAreIn, functionReturnType) {
        const guardType = this.expTypeof(ifStmt.guardExp, typeEnvironment, classWeAreIn)

        if (instance_of(guardType, BooleanType)) {
            this.isWellTyped(ifStmt.trueBranch, typeEnvironment, classWeAreIn, functionReturnType)
            this.isWellTyped(ifStmt.falseBranch, typeEnvironment, classWeAreIn, functionReturnType)
            return typeEnvironment;

        } else {
            throw new TypeError("Guard of 'if' expects an expression of type Boolean but recieved a type of : " + guardType.value);
        }
    }

    // while (exp) stmt
    isWellTypedWhile (whileStmt, typeEnvironment, classWeAreIn, functionReturnType) {
        const guardType = this.expTypeof(whileStmt.guardExp, typeEnvironment, classWeAreIn)

        if (instance_of(guardType, BooleanType)) {
            this.isWellTyped(whileStmt.loopStmt, typeEnvironment, classWeAreIn, functionReturnType)
            return typeEnvironment;
            
        } else {
            throw new TypeError("Guard of 'while' expects an expression of type Boolean but recieved a type of : " + guardType.value);
        }
        
    }

    // return exp;
    isWellTypedReturnExp (returnExp, typeEnvironment, classWeAreIn, functionReturnType) {
        
        if (functionReturnType === null) 
            throw new TypeError("returning in program entry point");
        
        const expType = this.expTypeof(returnExp.returnExp, typeEnvironment, classWeAreIn)
        this.isLeftTypeofRight(expType, functionReturnType)
        return typeEnvironment;
    }

    // return;
    isWellTypedReturn (typeEnvironment, functionReturnType) {
        if (functionReturnType === null) 
            throw new TypeError("returning in program entry point");
        
        if (instance_of(functionReturnType, VoidType))
            return typeEnvironment;
        else 
            throw new TypeError("Function expects return type of '" + functionReturnType + "' but recieved Void");
    }

    // print(exp);
    isWellTypedPrint (printStmt, typeEnvironment, classWeAreIn) {
        const expType = this.expTypeof(printStmt.printExp, typeEnvironment, classWeAreIn)
        return typeEnvironment;
    }

    // { stmt* }
    isWellTypedBlock (blockStmt, typeEnvironment, classWeAreIn, functionReturnType) {

        const stmtList = blockStmt.stmtList
        let newTypeEnvironment = {...typeEnvironment}

        for (let i = 0; i < stmtList.length; i++) {
            newTypeEnvironment = this.isWellTyped(stmtList[i], newTypeEnvironment, classWeAreIn, functionReturnType)
        }

        return newTypeEnvironment;
    }

    // exp.methodname(exp*);
    isWellTypedExpMethodExp (expMethodExp, typeEnvironment, classWeAreIn) {
        this.typeofExpMethodExp(expMethodExp, typeEnvironment, classWeAreIn)
        return typeEnvironment;
    }

    // var = exp;
    isWellTypedVarEqualsExp (varEqualsExpStmt, typeEnvironment, classWeAreIn) {
        const expType = this.expTypeof(varEqualsExpStmt.exp, typeEnvironment, classWeAreIn)
        const variableName = varEqualsExpStmt.variable.value
        const variableDeclaredType = typeEnvironment[variableName] 

        if (variableDeclaredType === undefined) {
            throw new TypeError("Variable '" + variableName + "' does not exist")
        }

        this.isLeftTypeofRight(expType, variableDeclaredType)
        return typeEnvironment;
    }

    // vardec = exp; 
    isWellTypedVarDecEqualsExp (varDecEqualsExpStmt, typeEnvironment, classWeAreIn) {
        const expType = this.expTypeof(varDecEqualsExpStmt.exp, typeEnvironment, classWeAreIn)
        const varDecType = varDecEqualsExpStmt.vardec.type

        this.isLeftTypeofRight(expType, varDecType)
        return this.addToMap(typeEnvironment, varDecEqualsExpStmt.vardec.variable, varDecType);
    }

    /**
     * 
     * @param {Object} map typeEnvironment you want to add variable to
     * @param {Variable} variable Variable object to be added
     * @param {Type} type Type of the variable object
     * @returns new typeEnvironment with added variable
     */
    addToMap(map, variable, type) {
        let newMap = {...map}
        newMap[variable.value] = type
        return newMap;
    }


    // OTHER STRUCTURES

    // methoddec ::= access type methodname(vardec*) stmt
    isWellTypedMethodDec (methodDec, typeEnvironment, classWeAreIn) {

        let newTypeEnvironment = {...typeEnvironment}

        const methodParamsList = methodDec.varDecList 
        for (let i = 0; i < methodParamsList.length; i++) {
            newTypeEnvironment = this.addToMap(newTypeEnvironment, methodParamsList[i].variable, methodParamsList[i].type)
        }

        this.isWellTyped(methodDec.stmt, newTypeEnvironment, classWeAreIn, methodDec.type)
    }

    // instancedec ::= access vardec = exp;
    isWellTypedInstanceDec (instanceDec, typeEnvironment, classWeAreIn) {
        this.isWellTypedVarDecEqualsExp(new VarDecEqualsExpStmt(instanceDec.vardec, instanceDec.expression),
                                        typeEnvironment,
                                        classWeAreIn)
    }

    /* 
    classdec ::= class classname super classname {
                    instancedec*
                    construc(vardec*) { super(exp*); stmt* } 
                    methoddec*
                }
                |
                class classname {
                    instancedec*;
                    construc(vardec*) stmt	
                    methoddec*
                }
    */
    isWellTypedClassDec (classDec) {
        const className = classDec.classNameType.value
        let typeEnvironment = this.classInstanceVariables[className]

        // Check if instance variables are well typed
        classDec.instanceDecList.forEach(instanceDec => {
            this.isWellTypedInstanceDec(instanceDec, typeEnvironment, className)
        })        

        // Check if constructor is well typed
        let constructorTypeEnvironment = {...typeEnvironment}

            // Update constructor type environment
            classDec.constructor.vardecList.forEach(vardec => {
                constructorTypeEnvironment[vardec.variable.value] = vardec.type
            })

            // get super object's constructor params and compare to params passed to 'super()'
            const superClassName = classDec.superClassName.value
            const superParamTypes = classDec.constructor.superExpList.map(exp => this.expTypeof(exp, constructorTypeEnvironment, className))
            const superClassParamTypes = this.classConstructorTypes[superClassName]
            this.compareTypesInArray(superParamTypes, superClassParamTypes)

            // check if statements are well typed in constructor
            classDec.constructor.stmtList.forEach(stmt => {
                constructorTypeEnvironment = this.isWellTyped(stmt, constructorTypeEnvironment, className, new VoidType())
            })
        
        // Check if methodDecs are well typed
        classDec.methodDecList.forEach(methodDec => {
            this.isWellTypedMethodDec(methodDec, typeEnvironment, className)
        })
    }

    // program ::= classdec* `thyEntryPoint` stmt 
    isWellTypedProgram () {
        const classDecList = this.program.classDecList
        const programStmt = this.program.stmt

        classDecList.forEach(classDec => {
            this.isWellTypedClassDec(classDec)
        })

        this.isWellTyped(programStmt, {}, null, null)
    }
}

module.exports = TypeChecker;