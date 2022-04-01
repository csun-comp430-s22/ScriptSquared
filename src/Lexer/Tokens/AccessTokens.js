 
class PublicToken   {
    
    constructor() {
        super(Token)
        this.value = "public"
    }
}

class PrivateToken  {
    
    constructor() {
        super(Token)
        this.value = "private"
    }
}

class ProtecToken  {
    
    constructor() {
        super(Token)
        this.value = "protec"
    }
}


module.exports = {
    PublicToken,
    PrivateToken,
    ProtecToken
};