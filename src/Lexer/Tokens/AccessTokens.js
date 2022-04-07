 
class PublicToken   {
    
    constructor() {
         
        this.value = "public"
    }
    
}

class PrivateToken  {
    
    constructor() {
         
        this.value = "private"
    }
}

class ProtecToken  {
    
    constructor() {
         
        this.value = "protec"
    }
}


module.exports = {
    PublicToken,
    PrivateToken,
    ProtecToken
};