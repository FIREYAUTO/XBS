// {{-=~}} Variables {{~=-}} \\

const TokenTypes = {
	"Keyword":["TK_IF","TK_SET","TK_FOR","TK_FOREACH","TK_WHILE","TK_OF","TK_IN","TK_FUNC","TK_SEND","TK_ELIF","TK_ELSE","TK_DEL","TK_STOP","TK_NEW","TK_WITH","TK_CLASS","TK_EXTENDS","TK_DESTRUCT","TK_UNSET","TK_AS","TK_ISA","TK_USING","TK_SWAP","TK_SWITCH","TK_DEFAULT","TK_CASE","TK_CONST","TK_REPEAT"],
    "String":["TK_STRING1","TK_STRING2"],
    "Whitespace":["TK_RETCHAR","TK_SPACE","TK_TAB"],
    "Compare":["TK_EQS","TK_LT","TK_GT","TK_GEQ","TK_LEQ","TK_NEQ"],
    "Operator":["TK_ADD","TK_SUB","TK_MUL","TK_DIV","TK_MOD","TK_POW","TK_ROUND"],
    "Assignment":["TK_EQ","TK_ADDEQ","TK_SUBEQ","TK_DIVEQ","TK_MULEQ","TK_MODEQ","TK_POWEQ"],
    "Incremental":["TK_INC","TK_DEINC"],
    "Conditional":["TK_AND","TK_OR","TK_NOT"],
    "Paren":["TK_POPEN","TK_PCLOSE"],
    "Bracket":["TK_BOPEN","TK_BCLOSE"],
    "Brace":["TK_IOPEN","TK_ICLOSE"],
    "Bool":["TK_TRUE","TK_FALSE"],
    "Null":["TK_NULL"],
    "None":["TK_DOT","TK_BACKSLASH","TK_COMMA","TK_NONE","TK_LINEEND","TK_SELFCALL","TK_COLON","TK_PROPCALL","TK_LEN","TK_AT"],
    "Comment":["TK_COMMENT","TK_COMMENTLONGOPEN","TK_COMMENTLONGCLOSE"],
    "End":["TK_EOS"],
    "Bitwise":["TK_BITAND","TK_BITOR","TK_BITXOR","TK_BITNOT","TK_BITZLSHIFT","TK_BITZRSHIFT",,"TK_BITRSHIFT"],
};

const RawTokens = {
	"TK_STRING1":"\"",
    "TK_STRING2":"\'",
    "TK_SET":"set",
    "TK_RETCHAR":String.fromCharCode(10),
    "TK_TAB":String.fromCharCode(9),
    "TK_SPACE":" ",
    "TK_CLASS":"class",
    "TK_EXTENDS":"extends",
    "TK_DESTRUCT":"destruct",
    "TK_ISA":"isa",
    "TK_NEW":"new",
    "TK_FOR":"for",
    "TK_FOREACH":"foreach",
    "TK_USING":"using",
    "TK_WHILE":"while",
    "TK_IF":"if",
    "TK_IN":"in",
    "TK_AS":"as",
    "TK_ELSE":"else",
    "TK_ELIF":"elif",
    "TK_OF":"of",
    "TK_FUNC":"func",
    "TK_SEND":"send",
    "TK_POPEN":"(",
    "TK_PCLOSE":")",
    "TK_BOPEN":"{",
    "TK_BCLOSE":"}",
    "TK_IOPEN":"[",
    "TK_ICLOSE":"]",
    "TK_LINEEND":";",
    "TK_EQ":"=",
    "TK_EQS":"==",
    "TK_LT":"<",
    "TK_GT":">",
    "TK_LEQ":"<=",
    "TK_GEQ":">=",
    "TK_NEQ":"!=",
    "TK_NOT":"!",
    "TK_OR":"|",
    "TK_AT":"@",
    "TK_AND":"&",
    "TK_ADDEQ":"+=",
    "TK_SUBEQ":"-=",
    "TK_MULEQ":"*=",
    "TK_DIVEQ":"/=",
    "TK_MODEQ":"%=",
    "TK_POWEQ":"^=",
    "TK_ADD":"+",
    "TK_SUB":"-",
    "TK_MUL":"*",
    "TK_DIV":"/",
    "TK_MOD":"%",
    "TK_POW":"^",
    "TK_DEINC":"--",
    "TK_INC":"++",
    "TK_ROUND":"~",
    "TK_COMMENT":"#",
    "TK_COMMENTLONGOPEN":"#>",
    "TK_COMMENTLONGCLOSE":"<#",
    "TK_COMMA":",",
    "TK_COLON":":",
    "TK_SELFCALL":"::",
    "TK_DOT":".",
    "TK_NULL":"null",
    "TK_TRUE":"true",
    "TK_FALSE":"false",
    "TK_NONE":"",
    "TK_EOS":"&lt;eos&gt;",
    "TK_BACKSLASH":"\\",
    "TK_PROPCALL":"->",
    "TK_DEL":"del",
    "TK_LEN":"?",
    "TK_STOP":"stop",
    "TK_WITH":"with",
    "TK_UNSET":"unset",
    "TK_SWAP":"swap",
    "TK_SWITCH":"switch",
    "TK_DEFAULT":"def",
    "TK_CASE":"case",
    "TK_CONST":"const",
    "TK_BITAND":"&&",
    "TK_BITOR":"||",
    "TK_BITXOR":"^^",
    "TK_BITNOT":"~~",
    "TK_BITZLSHIFT":"<<",
    "TK_BITZRSHIFT":">>",
    "TK_BITRSHIFT":"&>",
};

// {{-=~}} Token Classes {{~=-}} \\

class TokenBase {
	Type="None";
    Value="TK_NONE";
    Position=0;
    constructor(Type,Value,Position){
    	this.Type=Type;
        this.Value=Value;
        this.Position=Position;
    }
    toString(){
    	return `${this.Type}:${this.Value}:${this.Position}`
    }
}

// {{-=~}} Error Classes {{~=-}} \\

class InternalError extends Error {
	constructor(Message){
    	super(Message).name = this.constructor.name;
    }
}

class LexError extends Error {
	constructor(Message){
    	super(Message).name = this.constructor.name;
    }
}

class CodeError extends Error {
	constructor(Message){
    	super(Message).name = this.constructor.name;
    }
}

// {{-=~}} Token Functions {{~=-}} \\

function ToToken(x){
	for (let k in RawTokens){
    	if (RawTokens[k] == x){
        	return k;
        }
    }
    return x;
}

function FromToken(x){
	for (let k in RawTokens){
    	if (k == x){
        	return RawTokens[k];
        }
    }
    return x;
}

function IsLiteralToken(x){
	if (!x.startsWith("(")){return false}
    if (!x.endsWith(")")){return false}
    x = x.slice(1);
    x = x.slice(0,x.length-1);
    return RawTokens.hasOwnProperty(x);
}

function GetTokenType(Token){
	for (let k in TokenTypes){
    	let v = TokenTypes[k];
        if (v.includes(Token)){
        	return new TokenBase(k,Token,0);
        }
    }
    return new TokenBase("Identifier",Token,0);
}

// {{-=~}} Tokenizer {{~=-}} \\

const Lex = Object.freeze({
	Tokenize:function(Code){
    	const Tokens = [];
        let Letters=0,PToken="TK_NONE";
        const CL = Code.length;
        const Append = function(n,x){
        	Tokens[(Tokens.length-1)+n]=x;
            if (n == 0){
            	PToken=x;
            }
        }
        for (let k=0;k<=CL-1;k++){
        	let Raw = Code.substr(k,1);
            let Token = ToToken(Raw);
            if (Raw.length == 1 && Token != Raw){
            	if (Letters > 0){
                	let Behind = Code.substring(k-Letters,k);
                    if (RawTokens.hasOwnProperty(Behind)){
                    	Behind = `(${Behind})`;
                    }
                    Append(1,ToToken(Behind));
            		Letters=0;
                }
                if (Token == "TK_EQ"){
                	if (PToken == "TK_EQ"){
                    	Append(0,"TK_EQS");continue
                    } else if (PToken == "TK_LT"){
                    	Append(0,"TK_LEQ");continue
                    } else if (PToken == "TK_GT"){
                    	Append(0,"TK_GEQ");continue
                    } else if (PToken == "TK_NOT"){
                    	Append(0,"TK_NEQ");continue
                    } else if (PToken == "TK_ADD"){
                    	Append(0,"TK_ADDEQ");continue
                    } else if (PToken == "TK_SUB"){
                    	Append(0,"TK_SUBEQ");continue
                    } else if (PToken == "TK_MUL"){
                    	Append(0,"TK_MULEQ");continue
                    } else if (PToken == "TK_DIV"){
                    	Append(0,"TK_DIVEQ");continue
                    } else if (PToken == "TK_MOD"){
                    	Append(0,"TK_MODEQ");continue
                    } else if (PToken == "TK_POW"){
                    	Append(0,"TK_POWEQ");continue
                    } else {
                    	Append(1,Token);
                    }
                } else if (Token == "TK_GT"){
                	if (PToken == "TK_COMMENT"){
                    	Append(0,"TK_COMMENTLONGOPEN");continue
                    } else if (PToken == "TK_SUB"){
                    	Append(0,"TK_PROPCALL");continue
                    } else if (PToken == "TK_GT"){
                        Append(0,"TK_BITZRSHIFT");continue
                    } else if (PToken == "TK_AND"){
                        Append(0,"TK_BITRSHIFT");continue
                    } else {
                    	Append(1,Token);
                    }
                } else if (Token == "TK_COMMENT"){
                	if (PToken == "TK_LT"){
                    	Append(0,"TK_COMMENTLONGCLOSE");continue
                    } else {
                    	Append(1,Token);
                    }
                } else if (Token == "TK_ADD"){
                	if (PToken == "TK_ADD"){
                    	Append(0,"TK_INC");continue;
                    } else {
                    	Append(1,Token);
                    }
                } else if (Token == "TK_COLON"){
                	if (PToken == "TK_COLON"){
                    	Append(0,"TK_SELFCALL");continue;
                    } else {
                    	Append(1,Token);
                    }
				} else if (Token == "TK_SUB"){
                	if (PToken == "TK_SUB"){
                    	Append(0,"TK_DEINC");continue;
                    } else {
                    	Append(1,Token);
                    }
				} else if (Token=="TK_AND"){
				    if (PToken=="TK_AND"){
				        Append(0,"TK_BITAND");continue;
				    } else {
				        Append(1,Token);
				    }
				} else if (Token=="TK_OR"){
				    if (PToken=="TK_OR"){
				        Append(0,"TK_BITOR");continue;
				    } else {
				        Append(1,Token);
				    }
				} else if (Token=="TK_POW"){
				    if (PToken=="TK_POW"){
				        Append(0,"TK_BITXOR");continue;
				    } else {
				        Append(1,Token);
				    }
				} else if (Token=="TK_ROUND"){
				    if (PToken=="TK_ROUND"){
				        Append(0,"TK_BITNOT");continue;
				    } else {
				        Append(1,Token);
				    }
				} else if (Token=="TK_LT"){
				    if (PToken == "TK_LT"){
				        Append(0,"TK_BITZLSHIFT");continue;
				    } else {
				        Append(1,Token);
				    }
                } else {
                	Append(1,Token);
                }
            } else {
            	if (k >= CL-1){
                	let Behind = Code.substring(k-Letters,k+1);
                    if (RawTokens.hasOwnProperty(Behind)){
                    	Behind = `(${Behind})`;
                    }
            		Append(1,ToToken(Behind));
            		Letters=0;
                    break;
                } else {
                	Letters++;
                }
            }
			PToken = Token;
        }
        Tokens.push("TK_EOS");
        return this.RemoveWhitespace(this.RemoveComments(this.GetTokenTypes(Tokens)));
    },
    RemoveComments:function(Tokens){
        return Tokens;
        /*
    	let NewTokens = [];
        let Skip = [];
        for (let k in Tokens){
        	k=+k;
            if (Skip.includes(k)){continue}
            let v = Tokens[k];
            if (!v){continue}
            if (v.Value == "TK_COMMENT"){ //Short comment removal
            	let kk = k+1;
            	if (Tokens[kk]){
                	while (Tokens[kk].Value != "TK_RETCHAR"){ //Skip to the next retchar token
                    	if (kk > Tokens.length-1){break}
                    	Skip.push(kk);
                        kk++;
                    }
                    Skip.push(kk);
            	}
                continue;
            } else if (v.Value == "TK_COMMENTLONGOPEN"){ //Long comment removal
            	let kk = k+1;
                let Broken = false;
                while (Tokens[kk].Value != "TK_COMMENTLONGCLOSE"){ //Skip to the closing comment token
                	if (kk > Tokens.length-1 || (Tokens[kk]&&Tokens[kk].Value=="TK_EOS")){Broken=true;break}
                    Skip.push(kk);
                    kk++;
                }
                if (Broken){ //No closing long comment token? Throw an error
                	this.NoStackError("UnclosedLongComment",[Tokens[kk].Value,"TK_COMMENTLONGCLOSE"]);
                }
                Skip.push(kk);
                continue;
            } else if (v.Value == "TK_COMMENTLONGCLOSE"){ //No opening long comment token? Throw an error
            	this.NoStackError("ClosedLongComment",["TK_COMMENTLONGCLOSE","TK_COMMENTLONGOPEN"]);
            }
            NewTokens.push(v);
        }
        return NewTokens;
        */
    },
    GetTokenTypes:function(Tokens){
    	let NewTokens = [];
        let Line = 1;
        let Skip = [];
        for (let k in Tokens){
        	k=+k;
            if (Skip.includes(k)){continue}
        	let v = Tokens[k];
            if (v == "TK_RETCHAR"){Line++}
            let Class = GetTokenType(v);
            Class.Position = k;
            Class.Line = Line;
            if (Class.Type == "String" && Tokens[k-1].Value!="TK_BACKSLASH"){
            	let kk=k+1;
                let pt=v;
                let st = Class.Value=="TK_STRING1"?0:1;
                let os = 1;
                let comp = "";
                while (kk <= Tokens.length-1){
                    let t = Tokens[kk];
                    Skip.push(kk);
                    if (t=="TK_BACKSLASH"){
                        kk++;Skip.push(kk);t=Tokens[kk];
                        comp+=FromToken(t);
                        pt=t;
                        kk++;
                        continue;
                    }
                    if (t=="TK_STRING1"||t=="TK_STRING2"){
                    	let ct = t=="TK_STRING1"?0:1;
                        if (ct==st){
                        	break;
                        }
                    }
                    comp+=FromToken(t);
                    pt = t; 
                    kk++;
                }
                for (let i=kk;i<=Tokens.length-1;i++){
                	
                }
                Class.Type = "Constant";
                Class.CType = "String";
                Class.Value = comp;
            } else if (Class.Type == "Identifier"){
            	if (!isNaN(+v)){
                	let nx = Tokens[k+1];
                    let num = v;
                    if (nx == "TK_DOT"){
                    	let nxx = Tokens[k+2];
                        if (!isNaN(+nxx)){
                        	Skip.push(k+1);Skip.push(k+2);
                        	num+="."+nxx;
                        }
                    }
                    Class.Type="Constant";
                    Class.CType="Number";
                    Class.Value=+num;
                }
            } else if (Class.Type == "Bool"){
            	Class.Type = "Constant";
                Class.CType = "Bool";
                Class.Value = Class.Value=="TK_TRUE"?true:false;
            } else if (Class.Type == "Null"){
            	Class.Type = "Constant";
                Class.CType = "Null";
                Class.Value = null;
            } else if (Class.Type == "Comment"){
                if (v == "TK_COMMENT"){ //Short comment removal
                	let kk = k+1;
                	if (Tokens[kk]){
                    	while (Tokens[kk] != "TK_RETCHAR"){ //Skip to the next retchar token
                        	if (kk > Tokens.length-1){break}
                        	Skip.push(kk);
                            kk++;
                        }
                        Skip.push(kk);
                	}
                    continue;
                } else if (v == "TK_COMMENTLONGOPEN"){ //Long comment removal
                	let kk = k+1;
                    let Broken = false;
                    while (Tokens[kk] != "TK_COMMENTLONGCLOSE"){ //Skip to the closing comment token
                    	if (kk > Tokens.length-1 || (Tokens[kk]=="TK_EOS")){Broken=true;break}
                        Skip.push(kk);
                        kk++;
                    }
                    if (Broken){ //No closing long comment token? Throw an error
                    	throw new CodeError(`Expected closing long comment to close comment`)//this.NoStackError("UnclosedLongComment",[Tokens[kk],"TK_COMMENTLONGCLOSE"]);
                    }
                    Skip.push(kk);
                    continue;
                } else if (v == "TK_COMMENTLONGCLOSE"){ //No opening long comment token? Throw an error
                	throw new CodeError(`Unexpected closing long comment`)//this.NoStackError("ClosedLongComment",["TK_COMMENTLONGCLOSE","TK_COMMENTLONGOPEN"]);
                }
            }
            NewTokens.push(Class);
        }
        return NewTokens;
    },
    RemoveWhitespace:function(Tokens){
        let LastTokens = [];
        for (let k in Tokens){
        	let v = Tokens[k];
        	if (!v){continue}
            if (v.Type != "Whitespace"){
            	LastTokens.push(v);
            }
        }
        return LastTokens;  
    },
    ThrowError:function(Class,Message,Stack){
        let Result = Message;
        if (Stack){
            Result=`[Line ${Stack.CurrentLine}]: `+Result;
        }
        throw new (Class)(Result);
    },
});

// {{-=~}} AST Class {{~=-}} \\

const AST = Object.freeze({
	NewStack:function(Options={}){
    	let Stack = {
        	Token:"TK_NONE",
            PToken:"TK_NONE",
            Current:-1,
            OpenChunks:[],
            CurrentLine:1,
           	Chunk:[],
            Result:[],
        };
        for (let k in Options){
        	if (!Stack.hasOwnProperty(k)){
            	Stack[k] = Options[k];
            }
        }
        return Stack
    },
    CloseChunk:function(Stack){
    	if (Stack.OpenChunks.length > 1){
        	Stack.OpenChunks[Stack.OpenChunks.length-1].push(Stack.Chunk);
            Stack.Chunk = Stack.OpenChunks[Stack.OpenChunks.length-1];
            Stack.OpenChunks.pop();
        } else {
        	if (Stack.Chunk){
            	Stack.Result.push(Stack.Chunk);
            }
            if (Stack.OpenChunks.length == 1){
            	Stack.Chunk = Stack.OpenChunks[0];
                Stack.OpenChunks.pop();
            } else {
            	Stack.Chunk = null;
            }
        }
    },
    OpenChunk:function(Stack){
    	if (Stack.Chunk){
        	Stack.OpenChunks.push(Stack.Chunk);
        }
        Stack.Chunk = [];
    },
    IsPreciseToken:function(Token,Type,Value){
    	if (!Token){return false}
    	return Token.Type==Type&&Token.Value==Value;
    },
    IsTokenType:function(Token,Type){
    	if (!Token){return false}
    	return Token.Type==Type;
    },
    ErrorIfTokenNotType:function(Stack,Type){
    	if (Stack.Token.Type!=Type){
    	    Lex.ThrowError(CodeError,`Expected ${Type}, got ${Stack.Token.Type} instead`,Stack);
        }
    },
    ChunkWrite:function(Stack,Value,Place){
    	if (Place===undefined){
        	Stack.Chunk.push(Value);
        } else {
        	Stack.Chunk[Place] = Value;
        }
    },
    //{{ Next }}\\
    Next:function(Stack){
    	Stack.Current++;
        Stack.PToken=Stack.Token;
        Stack.Token=Stack.Tokens[Stack.Current];
        Stack.CurrentLine = Stack.Token?.Line;
        return Stack.Token;
    },
    JumpBack:function(Stack,Amount=1){
    	for (let i=1;i<=Amount;i++){
        	Stack.Current--;
            Stack.PToken=Stack.Tokens[Stack.Current-1];
            Stack.Token=Stack.Tokens[Stack.Current];
        }
        return Stack.Token;
    },
    //{{ Chunk Editing }}\\
    NewChunk:function(Type){
    	return [Type];
    },
    ChunkAdd:function(Chunk,Value){
    	Chunk.push(Value);
    },
    ChunkEdit:function(Chunk,Value,Place){
    	Chunk[Place]=Value;
    },
    //{{ CheckNext }}\\
    CheckNext:function(Stack,Type,Value){
    	let Token = this.Next(Stack);
        this.JumpBack(Stack);
        return this.IsPreciseToken(Token,Type,Value);
    },
    TypeCheckNext:function(Stack,Type){
    	let Token = this.Next(Stack);
        this.JumpBack(Stack);
        return this.IsTokenType(Token,Type);
    },
    TestNext:function(Stack,Type,Value){
    	if (!this.CheckNext(Stack,Type,Value)){
    	    Lex.ThrowError(CodeError,`Expected ${FromToken(Value)}, got ${FromToken(this.Next(Stack).Value)} instead`,Stack);
        }
    },
    TypeTestNext:function(Stack,Type){
        if (!this.TypeCheckNext(Stack,Type)){
            Lex.ThrowError(CodeError,`Expected type "${Type}"", got type "${this.Next(Stack).Type}"`,Stack);
        }
    },
    //{{ AssignmentGet }}\\
    AssignmentGet:function(Stack,Value){
        this.TypeTestNext(Stack,"Assignment");
        this.Next(Stack);
        let TValue = Stack.Token.Value;
        if (TValue=="TK_EQ"){
            this.ChunkAdd(Value,"eq");
        }else if (TValue=="TK_ADDEQ"){
            this.ChunkAdd(Value,"addeq");
        }else if (TValue=="TK_SUBEQ"){
            this.ChunkAdd(Value,"subeq");
        }else if (TValue=="TK_MULEQ"){
            this.ChunkAdd(Value,"muleq");
        }else if (TValue=="TK_DIVEQ"){
            this.ChunkAdd(Value,"diveq");
        }else if (TValue=="TK_POWEQ"){
            this.ChunkAdd(Value,"poweq");
        }else if (TValue=="TK_MODEQ"){
            this.ChunkAdd(Value,"modeq");
        }
    },
    FinishComplexExpression:function(Stack,Value,NoCond){
        if (NoCond){
            return Value;
        }
        //Conditional
            let And = this.CheckNext(Stack,"Conditional","TK_AND") || this.IsPreciseToken(Stack.Token,"Conditional","TK_AND");
            let Or = this.CheckNext(Stack,"Conditional","TK_OR") || this.IsPreciseToken(Stack.Token,"Conditional","TK_OR");
            
            let IsA = this.CheckNext(Stack,"Keyword","TK_ISA") || this.IsPreciseToken(Stack.Token,"Keyword","TK_ISA");
            
            let Eq = this.CheckNext(Stack,"Compare","TK_EQS") || this.IsPreciseToken(Stack.Token,"Compare","TK_EQS");
            let GEq = this.CheckNext(Stack,"Compare","TK_GEQ") || this.IsPreciseToken(Stack.Token,"Compare","TK_GEQ");
            let LEq = this.CheckNext(Stack,"Compare","TK_LEQ") || this.IsPreciseToken(Stack.Token,"Compare","TK_LEQ");
            let NEq = this.CheckNext(Stack,"Compare","TK_NEQ") || this.IsPreciseToken(Stack.Token,"Compare","TK_NEQ");
            let Gt = this.CheckNext(Stack,"Compare","TK_GT") || this.IsPreciseToken(Stack.Token,"Compare","TK_GT");
            let Lt = this.CheckNext(Stack,"Compare","TK_LT") || this.IsPreciseToken(Stack.Token,"Compare","TK_LT");
            
            //Bitwise
            let BitAnd = this.CheckNext(Stack,"Bitwise","TK_BITAND") || this.IsPreciseToken(Stack.Token,"Bitwise","TK_BITAND");
            let BitOr = this.CheckNext(Stack,"Bitwise","TK_BITOR") || this.IsPreciseToken(Stack.Token,"Bitwise","TK_BITOR");
            let BitXor = this.CheckNext(Stack,"Bitwise","TK_BITXOR") || this.IsPreciseToken(Stack.Token,"Bitwise","TK_BITXOR");
            
            let BitZLShift = this.CheckNext(Stack,"Bitwise","TK_BITZLSHIFT") || this.IsPreciseToken(Stack.Token,"Bitwise","TK_BITZLSHIFT");
            let BitZRShift = this.CheckNext(Stack,"Bitwise","TK_BITZRSHIFT") || this.IsPreciseToken(Stack.Token,"Bitwise","TK_BITZRSHIFT");
            let BitRShift = this.CheckNext(Stack,"Bitwise","TK_BITRSHIFT") || this.IsPreciseToken(Stack.Token,"Bitwise","TK_BITRSHIFT");
            if (And){
            	let Chunk = this.NewChunk("IN_AND");
            	this.ChunkAdd(Chunk,Value);
                if (!this.IsPreciseToken(Stack.Token,"Conditional","TK_AND")){
                	this.Next(Stack);
                }
            	this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            	Value = this.FinishExpression(Stack,Chunk);
            } else if (Or){
            	let Chunk = this.NewChunk("IN_OR");
            	this.ChunkAdd(Chunk,Value);
                if (!this.IsPreciseToken(Stack.Token,"Conditional","TK_OR")){
                	this.Next(Stack);
                }
            	this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            	Value = this.FinishExpression(Stack,Chunk);
            } else if (IsA){
            	let Chunk = this.NewChunk("IN_ISA");
            	this.ChunkAdd(Chunk,Value);
                if (!this.IsPreciseToken(Stack.Token,"Conditional","TK_ISA")){
                	this.Next(Stack);
                }
            	this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            	Value = this.FinishExpression(Stack,Chunk);
            } else if (Eq){
            	let Chunk = this.NewChunk("IN_EQ");
            	this.ChunkAdd(Chunk,Value);
                if (!this.IsPreciseToken(Stack.Token,"Compare","TK_EQS")){
                	this.Next(Stack);
                }
            	this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            	Value = this.FinishExpression(Stack,Chunk);
            } else if (GEq){
            	let Chunk = this.NewChunk("IN_GEQ");
            	this.ChunkAdd(Chunk,Value);
                if (!this.IsPreciseToken(Stack.Token,"Compare","TK_GEQ")){
                	this.Next(Stack);
                }
            	this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            	Value = this.FinishExpression(Stack,Chunk);
            } else if (LEq){
            	let Chunk = this.NewChunk("IN_LEQ");
            	this.ChunkAdd(Chunk,Value);
                if (!this.IsPreciseToken(Stack.Token,"Compare","TK_LEQ")){
                	this.Next(Stack);
                }
            	this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            	Value = this.FinishExpression(Stack,Chunk);
            } else if (NEq){
            	let Chunk = this.NewChunk("IN_NEQ");
            	this.ChunkAdd(Chunk,Value);
                if (!this.IsPreciseToken(Stack.Token,"Compare","TK_NEQ")){
                	this.Next(Stack);
                }
            	this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            	Value = this.FinishExpression(Stack,Chunk);
            } else if (Gt){
            	let Chunk = this.NewChunk("IN_GT");
            	this.ChunkAdd(Chunk,Value);
                if (!this.IsPreciseToken(Stack.Token,"Compare","TK_GT")){
                	this.Next(Stack);
                }
            	this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            	Value = this.FinishExpression(Stack,Chunk);
            } else if (Lt){
            	let Chunk = this.NewChunk("IN_LT");
            	this.ChunkAdd(Chunk,Value);
                if (!this.IsPreciseToken(Stack.Token,"Compare","TK_LT")){
                	this.Next(Stack);
                }
            	this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            	Value = this.FinishExpression(Stack,Chunk);
            } else if (BitAnd){
            	let Chunk = this.NewChunk("IN_BITAND");
            	this.ChunkAdd(Chunk,Value);
                if (!this.IsPreciseToken(Stack.Token,"Bitwise","TK_BITAND")){
                	this.Next(Stack);
                }
            	this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            	Value = this.FinishExpression(Stack,Chunk);
            } else if (BitOr){
            	let Chunk = this.NewChunk("IN_BITOR");
            	this.ChunkAdd(Chunk,Value);
                if (!this.IsPreciseToken(Stack.Token,"Bitwise","TK_BITOR")){
                	this.Next(Stack);
                }
            	this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            	Value = this.FinishExpression(Stack,Chunk);
            } else if (BitXor){
            	let Chunk = this.NewChunk("IN_BITXOR");
            	this.ChunkAdd(Chunk,Value);
                if (!this.IsPreciseToken(Stack.Token,"Bitwise","TK_BITXOR")){
                	this.Next(Stack);
                }
            	this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            	Value = this.FinishExpression(Stack,Chunk);
            } else if (BitZLShift){
            	let Chunk = this.NewChunk("IN_BITZLSHIFT");
            	this.ChunkAdd(Chunk,Value);
                if (!this.IsPreciseToken(Stack.Token,"Bitwise","TK_BITZLSHIFT")){
                	this.Next(Stack);
                }
            	this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            	Value = this.FinishExpression(Stack,Chunk);
            } else if (BitZRShift){
            	let Chunk = this.NewChunk("IN_BITZRSHIFT");
            	this.ChunkAdd(Chunk,Value);
                if (!this.IsPreciseToken(Stack.Token,"Bitwise","TK_BITZRSHIFT")){
                	this.Next(Stack);
                }
            	this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            	Value = this.FinishExpression(Stack,Chunk);
            } else if (BitRShift){
            	let Chunk = this.NewChunk("IN_BITRSHIFT");
            	this.ChunkAdd(Chunk,Value);
                if (!this.IsPreciseToken(Stack.Token,"Bitwise","TK_BITRSHIFT")){
                	this.Next(Stack);
                }
            	this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            	Value = this.FinishExpression(Stack,Chunk);
            }
            return Value;
    },
    //{{ ParseExpression }}\\
    FinishExpression:function(Stack,Value,NoMath,NoCond){
    	if (this.CheckNext(Stack,"None","TK_LINEEND")||this.CheckNext(Stack,"None","TK_COMMA")){
        	this.Next(Stack);
            return Value;
        }
    	let Indexing = this.CheckNext(Stack,"Brace","TK_IOPEN");
        let AddInc = this.CheckNext(Stack,"Incremental","TK_INC");
        let SubInc = this.CheckNext(Stack,"Incremental","TK_DEINC");
        let DotIndexing = this.CheckNext(Stack,"None","TK_DOT");
        let Calling = this.CheckNext(Stack,"Paren","TK_POPEN");
        let SelfCalling = this.CheckNext(Stack,"None","TK_SELFCALL");
        let PropCalling = this.CheckNext(Stack,"None","TK_PROPCALL");
        let SetIndex = this.CheckNext(Stack,"None","TK_COLON");
        let Add = this.CheckNext(Stack,"Operator","TK_ADD") || this.IsPreciseToken(Stack.Token,"Operator","TK_ADD");
        let Sub = this.CheckNext(Stack,"Operator","TK_SUB") || this.IsPreciseToken(Stack.Token,"Operator","TK_SUB");
        let Mul = this.CheckNext(Stack,"Operator","TK_MUL") || this.IsPreciseToken(Stack.Token,"Operator","TK_MUL");
        let Div = this.CheckNext(Stack,"Operator","TK_DIV") || this.IsPreciseToken(Stack.Token,"Operator","TK_DIV");
        let Pow = this.CheckNext(Stack,"Operator","TK_POW") || this.IsPreciseToken(Stack.Token,"Operator","TK_POW");
        let Mod = this.CheckNext(Stack,"Operator","TK_MOD") || this.IsPreciseToken(Stack.Token,"Operator","TK_MOD");
        
        let In = this.CheckNext(Stack,"Keyword","TK_IN") || this.IsPreciseToken(Stack.Token,"Keyword","TK_IN");
        if (Indexing){
        	let Chunk = this.NewChunk("IN_INDEX");
            this.ChunkAdd(Chunk,Value);
            this.Next(Stack);
            this.Next(Stack);
            this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            this.Next(Stack);
            Value = this.FinishExpression(Stack,Chunk);
            Value = this.FinishComplexExpression(Stack,Value);
            return Value;
        } else if (SetIndex){
        	let Chunk = this.NewChunk("IN_SETINDEX");
            this.ChunkAdd(Chunk,Value);
            this.Next(Stack);
            this.Next(Stack);
            let Token = Stack.Token;
            if (this.IsPreciseToken(Token,"Brace","TK_IOPEN")){
            	this.Next(Stack);
                this.ChunkAdd(Chunk,this.ParseExpression(Stack));
                this.TestNext(Stack,"Brace","TK_ICLOSE");
                this.Next(Stack);
                this.AssignmentGet(Stack,Chunk);
                this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            } else if (Token.Type == "Constant" || Token.Type == "Identifier"){
                this.ChunkAdd(Chunk,Token.Value);
                this.AssignmentGet(Stack,Chunk);
                this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            } else {
                Lex.ThrowError(CodeError,`"${FromToken(Token.Value)}" is not a valid index name`,Stack);
            }
            Value = Chunk
            return Value;
        } else if (AddInc){
        	let Chunk = this.NewChunk("IN_INC");
            this.ChunkAdd(Chunk,Value);
            this.Next(Stack);
            Value = this.FinishExpression(Stack,Chunk);
            Value = this.FinishComplexExpression(Stack,Value);
            return Value;
		} else if (SubInc){
        	let Chunk = this.NewChunk("IN_DEINC");
            this.ChunkAdd(Chunk,Value);
            this.Next(Stack);
            Value = this.FinishExpression(Stack,Chunk);
            Value = this.FinishComplexExpression(Stack,Value);
            return Value;
        } else if (DotIndexing){
        	let Chunk = this.NewChunk("IN_INDEX");
            this.ChunkAdd(Chunk,Value);
            this.Next(Stack);
            this.Next(Stack);
            this.ChunkAdd(Chunk,Stack.Token.Value);
            Value = this.FinishExpression(Stack,Chunk);
            Value = this.FinishComplexExpression(Stack,Value);
            return Value;
        } else if (SelfCalling){
        	let Chunk = this.NewChunk("IN_SELFCALL");
            this.ChunkAdd(Chunk,Value);
            this.Next(Stack);
            this.Next(Stack);
            if (this.IsPreciseToken(Stack.Token,"Brace","TK_IOPEN")){
            	this.Next(Stack);
                this.ChunkAdd(Chunk,this.ParseExpression(Stack));
                this.TestNext(Stack,"Brace","TK_ICLOSE");
                this.Next(Stack);
            } else if (Stack.Token.Type == "Constant" || Stack.Token.Type == "Identifier" || Stack.Token.Type == "Keyword"){
            	if (Stack.Token.Type == "Keyword"){
                	this.ChunkAdd(Chunk,FromToken(Stack.Token.Value));	
                } else {
                	this.ChunkAdd(Chunk,Stack.Token.Value);
                }
            } else {
                Lex.ThrowError(CodeError,`"${FromToken(Stack.Token.Value)}" is not a valid index name`,Stack);
            }
            this.TestNext(Stack,"Paren","TK_POPEN");
            this.Next(Stack);
            this.Next(Stack);
            let Params = [];
            let i=0;
            if (!this.IsPreciseToken(Stack.Token,"Paren","TK_PCLOSE")){
            	while(!this.IsPreciseToken(Stack.Token,"Paren","TK_PCLOSE")){
            		i++;
                	if (i>100){break}
                	Params.push(this.ParseExpression(Stack));
                	this.Next(Stack);
            	};
            }
            this.ChunkAdd(Chunk,Params);
            Value = this.FinishExpression(Stack,Chunk);
            Value = this.FinishComplexExpression(Stack,Value);
            return Value;
       	} else if (PropCalling){
        	let Chunk = this.NewChunk("IN_PROPCALL");
            this.ChunkAdd(Chunk,Value);
            this.Next(Stack);
            this.Next(Stack);
            if (this.IsPreciseToken(Stack.Token,"Brace","TK_IOPEN")){
            	this.Next(Stack);
                this.ChunkAdd(Chunk,this.ParseExpression(Stack));
                this.TestNext(Stack,"Brace","TK_ICLOSE");
                this.Next(Stack);
            } else if (Stack.Token.Type == "Constant" || Stack.Token.Type == "Identifier" || Stack.Token.Type == "Keyword"){
            	if (Stack.Token.Type == "Keyword"){
                	this.ChunkAdd(Chunk,FromToken(Stack.Token.Value));	
                } else {
                	this.ChunkAdd(Chunk,Stack.Token.Value);
                }
            } else {
            	Lex.ThrowError(CodeError,`"${FromToken(Stack.Token.Value)}" is not a valid index name`,Stack);
            }
            this.TestNext(Stack,"Paren","TK_POPEN");
            this.Next(Stack);
            this.Next(Stack);
            let Params = [];
            let i=0;
            if (!this.IsPreciseToken(Stack.Token,"Paren","TK_PCLOSE")){
            	while(!this.IsPreciseToken(Stack.Token,"Paren","TK_PCLOSE")){
            		i++;
                	if (i>100){break}
                	Params.push(this.ParseExpression(Stack));
                	this.Next(Stack);
            	};
            }
            this.ChunkAdd(Chunk,Params);
            Value = this.FinishExpression(Stack,Chunk);
            Value = this.FinishComplexExpression(Stack,Value);
            return Value;
        } else if (Calling){
            if (!this.IsPreciseToken(Stack.Token,"None","TK_COMMA")){
            	let Chunk = this.NewChunk("IN_CALL");
                this.ChunkAdd(Chunk,Value);
                this.Next(Stack);
                this.Next(Stack);
                let Params = [];
                let i=0;
                if (!this.IsPreciseToken(Stack.Token,"Paren","TK_PCLOSE")){
                	while(!this.IsPreciseToken(Stack.Token,"Paren","TK_PCLOSE")){
                		i++;
                    	if (i>100){break}
                    	Params.push(this.ParseExpression(Stack));
                    	this.Next(Stack);
                	};
                }
                this.ChunkAdd(Chunk,Params);
                Value = this.FinishExpression(Stack,Chunk);
                Value = this.FinishComplexExpression(Stack,Value);
                return Value;
            }
        } else if (In){
            let Chunk = this.NewChunk("IN_IN");
            this.ChunkAdd(Chunk,Value);
            if (!this.IsPreciseToken(Stack.Token,"Keyword","TK_IN")){
                this.Next(Stack);
            }
            this.Next(Stack);
            this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            Value = this.FinishExpression(Stack,Chunk);
            Value = this.FinishComplexExpression(Stack,Value);
            return Value;
        }else{
            if(NoMath==true){return Value}
            if (Add){
                	let Chunk = this.NewChunk("IN_ADD");
            		this.ChunkAdd(Chunk,Value);
                	if (!this.IsPreciseToken(Stack.Token,"Operator","TK_ADD")){
                		this.Next(Stack);
                	}
            		this.Next(Stack);
            		this.ChunkAdd(Chunk,this.ParseExpression(Stack,undefined,true));
            		Value = this.FinishExpression(Stack,Chunk);
            		Value = this.FinishComplexExpression(Stack,Value);
            		return Value;
                } else if (Sub){
                	let Chunk = this.NewChunk("IN_SUB");
            		this.ChunkAdd(Chunk,Value);
                	if (!this.IsPreciseToken(Stack.Token,"Operator","TK_SUB")){
                		this.Next(Stack);
                	}
            		this.Next(Stack);
            		this.ChunkAdd(Chunk,this.ParseExpression(Stack,undefined,true));
            		Value = this.FinishExpression(Stack,Chunk);
            		Value = this.FinishComplexExpression(Stack,Value);
            		return Value;
                } else if (Mul){
                	let Chunk = this.NewChunk("IN_MUL");
            		this.ChunkAdd(Chunk,Value);
                	if (!this.IsPreciseToken(Stack.Token,"Operator","TK_MUL")){
                		this.Next(Stack);
                	}
            		this.Next(Stack);
            		this.ChunkAdd(Chunk,this.ParseExpression(Stack,undefined,true));
            		Value = this.FinishExpression(Stack,Chunk);
            		Value = this.FinishComplexExpression(Stack,Value);
            		return Value;
                } else if (Div){
                	let Chunk = this.NewChunk("IN_DIV");
            		this.ChunkAdd(Chunk,Value);
                	if (!this.IsPreciseToken(Stack.Token,"Operator","TK_DIV")){
                		this.Next(Stack);
                	}
            		this.Next(Stack);
            		this.ChunkAdd(Chunk,this.ParseExpression(Stack,undefined,true));
            		Value = this.FinishExpression(Stack,Chunk);
            		Value = this.FinishComplexExpression(Stack,Value);
            		return Value;
                } else if (Pow){
                	let Chunk = this.NewChunk("IN_POW");
            		this.ChunkAdd(Chunk,Value);
                	if (!this.IsPreciseToken(Stack.Token,"Operator","TK_POW")){
                		this.Next(Stack);
                	}
            		this.Next(Stack);
            		this.ChunkAdd(Chunk,this.ParseExpression(Stack,undefined,true));
            		Value = this.FinishExpression(Stack,Chunk);
            		Value = this.FinishComplexExpression(Stack,Value);
            		return Value;
                } else if (Mod){
                	let Chunk = this.NewChunk("IN_MOD");
            		this.ChunkAdd(Chunk,Value);
                	if (!this.IsPreciseToken(Stack.Token,"Operator","TK_MOD")){
                		this.Next(Stack);
                	}
            		this.Next(Stack);
            		this.ChunkAdd(Chunk,this.ParseExpression(Stack,undefined,true));
            		Value = this.FinishExpression(Stack,Chunk);
            		Value = this.FinishComplexExpression(Stack,Value);
            		return Value;
                }
        }
        if (this.TypeCheckNext(Stack,"Identifier") && Stack.Token.Type == "Identifier"){
            Lex.ThrowError(CodeError,`Unexpected Identifier "${Stack.Token.Value}"`,Stack);
        }
        Value = this.FinishComplexExpression(Stack,Value,NoCond);
        return Value;
    },
    ParseExpression:function(Stack,NoMath,NoCond){
    	let Token = Stack.Token;
        let Result = null;
        if (Token.Type == "Constant"){
        	Result = Token.Value;
        } else if (Token.Type == "Identifier"){
        	Result = ["IN_GET",Token.Value];
        } else if (this.IsPreciseToken(Token,"Conditional","TK_NOT")){
        	this.Next(Stack);
           	Result = ["IN_NOT",this.ParseExpression(Stack,NoMath,NoCond)]
        } else if (this.IsPreciseToken(Token,"Paren","TK_POPEN")){
        	this.Next(Stack);
        	Result = this.ParseExpression(Stack,NoMath,NoCond);
            this.TestNext(Stack,"Paren","TK_PCLOSE");
            this.Next(Stack);
            if (!this.CheckNext(Stack,"None","TK_COMMA")){
                return this.FinishExpression(Stack,Result);
            }
            return Result;
        } else if (this.IsPreciseToken(Token,"Bracket","TK_BOPEN")){
        	let Arr = {};
        	let ArrTypes = {};
            this.Next(Stack);
            while (!this.IsPreciseToken(Stack.Token,"Bracket","TK_BCLOSE")){
            	let Var = Stack.Token;
                let Inner = null;
                if (this.IsPreciseToken(Var,"Brace","TK_IOPEN")){
                	this.Next(Stack);
                    Inner = this.ParseExpression(Stack);
                    this.TestNext(Stack,"Brace","TK_ICLOSE");
                    this.Next(Stack);
                } else if (Var.Type == "Constant" || Var.Type == "Identifier"){
                	Inner = Var.Value
                }
                if (this.CheckNext(Stack,"None","TK_COLON")){
                  this.Next(Stack);
                  this.Next(Stack);
                    if ((Stack.Token.Type == "Constant" && Stack.Token.Value != null)&&(Stack.Token.Type != "Identifier")){
                        throw new CodeError(`Invalid type "${Stack.Token.Value}"`);
                    }
                  //this.Next(Stack);
                  ArrTypes[Inner] = String(Stack.Token.Value);
                }
                this.TestNext(Stack,"Assignment","TK_EQ");
                this.Next(Stack);
                this.Next(Stack);
                let Value = this.ParseExpression(Stack);
                Arr[Inner]=Value;
                this.Next(Stack);
            }
            Result = ["IN_ARRAY",Arr,ArrTypes];
        } else if (this.IsPreciseToken(Token,"Brace","TK_IOPEN")){
        	let Arr = [];
            this.Next(Stack);
            while (!this.IsPreciseToken(Stack.Token,"Brace","TK_ICLOSE")){
            	let Value = this.ParseExpression(Stack,NoMath,NoCond);
                Arr.push(Value);
                this.Next(Stack);
                if (this.IsPreciseToken(Stack.Token,"None","TK_COMMA")){
                    this.Next(Stack);
                }
            }
            Result = ["IN_ARRAY",Arr];
        } else if (this.IsPreciseToken(Token,"Keyword","TK_FUNC")){
        	let Chunk = this.NewChunk("IN_FASTFUNC");
        	this.TestNext(Stack,"Paren","TK_POPEN");
        	this.Next(Stack);
        	this.Next(Stack);
       		let Params = [];
       		let ParamTypes = {};
       		let Defaults = {};
        	let i=0;
        	if (!this.IsPreciseToken(Stack.Token,"Paren","TK_PCLOSE")){
            	while(!this.IsPreciseToken(Stack.Token,"Paren","TK_PCLOSE")){
            		i++;
                	if (i>100){break}
                	this.ErrorIfTokenNotType(Stack,"Identifier");
                	Params.push(Stack.Token.Value);
                	let Name = Stack.Token.Value;
                	this.Next(Stack);
                  if (this.IsPreciseToken(Stack.Token,"None","TK_COLON")){
                        this.Next(Stack);
                        if ((Stack.Token.Type == "Constant" && Stack.Token.Value != null)&&(Stack.Token.Type != "Identifier")){
                            throw new CodeError(`Invalid type "${Stack.Token.Value}"`);
                        }
                    ParamTypes[Name]=String(Stack.Token.Value);
                    this.Next(Stack);
                  }
                  if (this.IsPreciseToken(Stack.Token,"Assignment","TK_EQ")){
                    this.Next(Stack);
                    Defaults[Name] = this.ParseExpression(Stack);
                    this.Next(Stack);
                }
                	if (this.IsPreciseToken(Stack.Token,"None","TK_COMMA")){
                    this.Next(Stack);
                  }
            	}
        	}
        	this.ChunkAdd(Chunk,Params);
        	this.Next(Stack);
        	let ReturnType = null;
            if(this.IsPreciseToken(Stack.Token,"None","TK_COLON")){
                this.Next(Stack);
                if ((Stack.Token.Type == "Constant" && Stack.Token.Value != null)&&(Stack.Token.Type != "Identifier")){
                    throw new CodeError(`Invalid type "${Stack.Token.Value}"`);
                }
                ReturnType=String(Stack.Token.Value);
                this.TestNext(Stack,"Bracket","TK_BOPEN");
            }
        	this.Next(Stack);
        	let CodeBlock = [];
            this.OpenChunk(Stack);
        	while (!this.IsPreciseToken(Stack.Token,"Bracket","TK_BCLOSE")){
        		this.ParseChunk(Stack);
            	this.Next(Stack);
        	}
        	if (this.IsPreciseToken(Stack.Token,"Bracket","TK_BCLOSE")){
        		this.Next(Stack);
        	}
            CodeBlock = Stack.Chunk;
            Stack.Chunk = Stack.OpenChunks[Stack.OpenChunks.length-1];
            Stack.OpenChunks.pop();
        	this.ChunkAdd(Chunk,CodeBlock);
            Result = Chunk;
            this.JumpBack(Stack);
            if (Object.getOwnPropertyNames(Defaults).length > 0){ //Default parameters
                this.ChunkAdd(Chunk,Defaults);
            }
            Chunk[10] = ParamTypes;
            Chunk[11] = ReturnType;
        } else if (this.IsPreciseToken(Token,"None","TK_LEN")){
        	let Chunk = this.NewChunk("IN_LEN");
            this.Next(Stack);
            this.ChunkAdd(Chunk,this.ParseExpression(Stack,true,true));
            Result = Chunk;
        } else if (this.IsPreciseToken(Token,"Bitwise","TK_BITNOT")){
        	let Chunk = this.NewChunk("IN_BITNOT");
            this.Next(Stack);
            this.ChunkAdd(Chunk,this.ParseExpression(Stack,true,true));
            Result = Chunk;
        } else if (this.IsPreciseToken(Token,"Operator","TK_ROUND")){
        	let Chunk = this.NewChunk("IN_ROUND");
            this.Next(Stack);
            this.ChunkAdd(Chunk,this.ParseExpression(Stack,true,true));
            Result = Chunk;
        } else if (this.IsPreciseToken(Token,"Operator","TK_SUB")){
        	let Chunk = this.NewChunk("IN_UNM");
            this.Next(Stack);
            this.ChunkAdd(Chunk,this.ParseExpression(Stack,true,NoCond));
            Result = Chunk;
            if (this.IsPreciseToken(Stack.Token,"None","TK_COMMA")){
                return Result;
            }
        } else if (this.IsPreciseToken(Token,"Keyword","TK_NEW")){
        	let Chunk = this.NewChunk("IN_MAKENEW");
            this.Next(Stack);
            let Expression = this.ParseExpression(Stack);
            this.ChunkAdd(Chunk,Expression);
            if (this.CheckNext(Stack,"Keyword","TK_WITH")){
            	this.Next(Stack);
                this.Next(Stack);
            	this.ChunkAdd(Chunk,this.ParseExpression(Stack));
            } else {
                if (Expression[0]=="IN_CALL"){
                    Chunk[1] = Expression[1];
                    this.ChunkAdd(Chunk,Expression[2]);
                }
            }
            Result = Chunk;
        }
        Result = this.FinishExpression(Stack,Result,NoMath,NoCond);
        return Result;
    },
    //{{ SetState }}\\
    SetState:function(Stack){
        let Name = this.Next(Stack);
        this.ErrorIfTokenNotType(Stack,"Identifier");
        this.ChunkWrite(Stack,Name.Value);
        this.AssignmentGet(Stack,Stack.Chunk);
        this.Next(Stack);
        this.ChunkWrite(Stack,this.ParseExpression(Stack));
        this.CloseChunk(Stack);
    },
    //{{ NewState }}\\
    NewState:function(Stack){
        let Name = this.Next(Stack);
        this.ErrorIfTokenNotType(Stack,"Identifier");
        this.ChunkWrite(Stack,Name.Value);
        let Type = null;
        if (this.CheckNext(Stack,"None","TK_COLON")){
          this.Next(Stack);
          this.Next(Stack);
          if ((Stack.Token.Type == "Constant" && Stack.Token.Value != null)&&(Stack.Token.Type != "Identifier")){
                document.write(Stack.Token.Type,": ",Stack.Token.Value,"<br>")
              throw new CodeError(`Invalid type "${Stack.Token.Value}"`);
          }
          Type = String(Stack.Token.Value);
        }
        let Result = this.CheckNext(Stack,"Assignment","TK_EQ");
        if (Result){
        	this.Next(Stack);
            this.Next(Stack);
        	this.ChunkWrite(Stack,this.ParseExpression(Stack));
       	} else {
        	this.ChunkWrite(Stack,null);
        }
        if (Type){
          this.ChunkWrite(Stack,Type)
        }
        this.CloseChunk(Stack);
    },
    //{{ CodeBlock }}\\
    CodeBlock:function(Stack){
    	this.OpenChunk(Stack);
        while (!this.IsPreciseToken(Stack.Token,"Bracket","TK_BCLOSE")){
        	this.ParseChunk(Stack);
            this.Next(Stack);
        }
        if (this.IsPreciseToken(Stack.Token,"Bracket","TK_BCLOSE")){
        	this.Next(Stack);
        }
        this.CloseChunk(Stack);
    },
    //{{ IfState }}\\
    IfState:function(Stack){
    	this.TestNext(Stack,"Paren","TK_POPEN")
        this.Next(Stack);
        this.Next(Stack);
        this.ChunkWrite(Stack,this.ParseExpression(Stack));
        this.TestNext(Stack,"Paren","TK_PCLOSE");
        this.Next(Stack);
        this.TestNext(Stack,"Bracket","TK_BOPEN");
        this.Next(Stack);
        this.Next(Stack);
        this.CodeBlock(Stack);
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    //{{ ElseState }}\\
    ElseState:function(Stack){
        this.TestNext(Stack,"Bracket","TK_BOPEN");
        this.Next(Stack);
        this.Next(Stack);
        this.CodeBlock(Stack);
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    //{{ ForEachState }}\\
    ForEachState:function(Stack){
    	this.TestNext(Stack,"Paren","TK_POPEN")
        this.Next(Stack);
        this.Next(Stack);
        this.ErrorIfTokenNotType(Stack,"Identifier");
        this.ChunkWrite(Stack,Stack.Token.Value);
        this.Next(Stack);
        if (this.IsPreciseToken(Stack.Token,"None","TK_COMMA")){
        	this.Next(Stack);
            this.ErrorIfTokenNotType(Stack,"Identifier");
            this.ChunkWrite(Stack,Stack.Token.Value);
            if (this.CheckNext(Stack,"Keyword","TK_AS")){
                this.Next(Stack);
            }
            Stack.Chunk[0]="IN_FORALL";
        } else {
        	this.ErrorIfTokenNotType(Stack,"Keyword");
        	let Token = Stack.Token;
        	if (Token.Value == "TK_OF" || Token.Value == "TK_IN"){
        		this.ChunkWrite(Stack,FromToken(Token.Value));
        	} else {
        	    Lex.ThrowError(CodeError,`Unexpected keyword ${FromToken(Token.Value)}`,Stack);
        	}
        }
        this.Next(Stack);
        let Arr = this.ParseExpression(Stack);
        this.ChunkWrite(Stack,Arr);
        this.TestNext(Stack,"Paren","TK_PCLOSE");
       	this.Next(Stack);
        this.TestNext(Stack,"Bracket","TK_BOPEN");
        this.Next(Stack);
        this.Next(Stack);
        this.CodeBlock(Stack);
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    //{{ ForState }}\\
    ForState:function(Stack){
    	this.TestNext(Stack,"Paren","TK_POPEN")
        this.Next(Stack);
        this.Next(Stack);
        this.ErrorIfTokenNotType(Stack,"Identifier");
        this.ChunkWrite(Stack,Stack.Token.Value);
       	this.TestNext(Stack,"Assignment","TK_EQ");
        this.Next(Stack);
        this.Next(Stack);
        this.ChunkWrite(Stack,this.ParseExpression(Stack));
        this.Next(Stack);
        this.ChunkWrite(Stack,this.ParseExpression(Stack));
        this.Next(Stack);
        this.ChunkWrite(Stack,this.ParseExpression(Stack));
        this.TestNext(Stack,"Paren","TK_PCLOSE");
        this.Next(Stack);
        this.CodeBlock(Stack);
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    // {{ FuncState }}\\
    FuncState:function(Stack){
    	this.Next(Stack);
    	this.ErrorIfTokenNotType(Stack,"Identifier");
        this.ChunkWrite(Stack,Stack.Token.Value);
        this.TestNext(Stack,"Paren","TK_POPEN");
        this.Next(Stack);
        this.Next(Stack);
       	let Params = [];
       	let ParamTypes = {};
       	let Defaults = {};
        let i=0;
        if (!this.IsPreciseToken(Stack.Token,"Paren","TK_PCLOSE")){
            while(!this.IsPreciseToken(Stack.Token,"Paren","TK_PCLOSE")){
            	i++;
                if (i>100){break}
                this.ErrorIfTokenNotType(Stack,"Identifier");
                let Name = Stack.Token.Value;
                Params.push(Stack.Token.Value);
                this.Next(Stack);
                if (this.IsPreciseToken(Stack.Token,"None","TK_COLON")){
                  this.Next(Stack);
                    if ((Stack.Token.Type == "Constant" && Stack.Token.Value != null)&&(Stack.Token.Type != "Identifier")){
                        throw new CodeError(`Invalid type "${Stack.Token.Value}"`);
                    }
                  ParamTypes[Name]=String(Stack.Token.Value);
                  this.Next(Stack);
                }
                if (this.IsPreciseToken(Stack.Token,"Assignment","TK_EQ")){
                    this.Next(Stack);
                    Defaults[Name] = this.ParseExpression(Stack);
                    this.Next(Stack);
                }
                if (this.IsPreciseToken(Stack.Token,"None","TK_COMMA")){
                    this.Next(Stack);
                }
            }
        }
        this.ChunkWrite(Stack,Params);
        this.Next(Stack);
        let ReturnType = null;
        if(this.IsPreciseToken(Stack.Token,"None","TK_COLON")){
            this.Next(Stack);
            if ((Stack.Token.Type == "Constant" && Stack.Token.Value != null)&&(Stack.Token.Type != "Identifier")){
                throw new CodeError(`Invalid type "${Stack.Token.Value}"`);
            }
            ReturnType=String(Stack.Token.Value);
            this.TestNext(Stack,"Bracket","TK_BOPEN");
        }
        this.Next(Stack);
        this.CodeBlock(Stack);
        this.JumpBack(Stack);
        if (Object.getOwnPropertyNames(Defaults).length > 0){ //Default parameters
            this.ChunkWrite(Stack,Defaults)
        }
        Stack.Chunk[10]=ParamTypes;
        if (ReturnType){
            Stack.Chunk[11]=ReturnType;
        }
        this.CloseChunk(Stack);
    },
    //{{ DelState }}\\
    DelState:function(Stack){
    	this.Next(Stack);
        this.ErrorIfTokenNotType(Stack,"Identifier");
        this.ChunkWrite(Stack,Stack.Token.Value);
        this.CloseChunk(Stack)
    },
    //{{ RetState }}\\
    RetState:function(Stack){
    	this.Next(Stack);
    	this.ChunkWrite(Stack,this.ParseExpression(Stack));
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    //{{ ClassState }}\\
    ClassState:function(Stack){
    	this.TypeTestNext(Stack,"Identifier");
    	this.Next(Stack);
    	this.ChunkWrite(Stack,Stack.Token.Value);
    	if (this.CheckNext(Stack,"Keyword","TK_EXTENDS")){
    		this.Next(Stack);
    		this.Next(Stack);
    		let Value = this.ParseExpression(Stack);
    		let HasSuper = false;
    		if (this.CheckNext(Stack,"Keyword","TK_WITH")){
    			this.Next(Stack);
    			this.TestNext(Stack,"Identifier","super");
    			HasSuper = true;
    			this.Next(Stack);
    		}
    		this.Next(Stack);
    		this.ChunkWrite(Stack,this.ParseExpression(Stack));
    		this.ChunkWrite(Stack,Value);
    		this.ChunkWrite(Stack,HasSuper);
    	} else {
    		this.Next(Stack);
    		this.ChunkWrite(Stack,this.ParseExpression(Stack));
    	}
    	this.CloseChunk(Stack);
    },
    //{{ DestructState }}\\
    DestructState:function(Stack){
        this.TestNext(Stack,"Brace","TK_IOPEN");
    	this.Next(Stack);
    	this.Next(Stack);
    	let Args = [];
    	if (!this.IsPreciseToken(Stack.Token,"Brace","TK_ICLOSE")){
            while(!this.IsPreciseToken(Stack.Token,"Brace","TK_ICLOSE")){
                this.ErrorIfTokenNotType(Stack,"Identifier");
                Args.push(Stack.Token.Value);
                this.Next(Stack);
                if (this.IsPreciseToken(Stack.Token,"None","TK_COMMA")){
                    this.Next(Stack);
                }
            }
        }
        this.ChunkWrite(Stack,["IN_ARRAY",Args]);
    	this.Next(Stack);
    	this.ChunkWrite(Stack,this.ParseExpression(Stack));
    	this.CloseChunk(Stack);
    },
    //{{ UnsetState }}\\
    UnsetState:function(Stack){
        this.Next(Stack);
        let Value = this.ParseExpression(Stack);
        Value[0]="IN_UNSET";
        Stack.Chunk = Value;
        this.CloseChunk(Stack);
    },
    //{{ UsingState }}\\
    UsingState:function(Stack){
        this.Next(Stack);
        this.ChunkWrite(Stack,this.ParseExpression(Stack));
        this.TestNext(Stack,"Bracket","TK_BOPEN");
        this.Next(Stack);
        this.Next(Stack);
        this.CodeBlock(Stack);
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    //{{ SwapState }}\\
    SwapState:function(Stack){
        this.TypeTestNext(Stack,"Identifier");
        this.Next(Stack);
        this.ChunkWrite(Stack,Stack.Token.Value);
        this.TypeTestNext(Stack,"Identifier");
        this.Next(Stack);
        this.ChunkWrite(Stack,Stack.Token.Value);
        this.CloseChunk(Stack);
    },
    //{{ SwitchState }}\\
    SwitchState:function(Stack){
    	this.TestNext(Stack,"Paren","TK_POPEN");
    	this.Next(Stack);
    	this.Next(Stack);
    	let Expression = this.ParseExpression(Stack);
    	if (!this.IsPreciseToken(Stack.Token,"Paren","TK_PCLOSE")){
    		this.TestNext(Stack,"Paren","TK_PCLOSE");
    		this.Next(Stack);
    	}
    	let Cases = [];
    	let Default = null;
    	this.TestNext(Stack,"Bracket","TK_BOPEN");
    	this.Next(Stack);
    	this.Next(Stack);
    	while (!this.IsPreciseToken(Stack.Token,"Bracket","TK_BCLOSE")){
    		if (this.IsPreciseToken(Stack.Token,"Keyword","TK_CASE")){
    			this.TestNext(Stack,"Paren","TK_POPEN");
		    	this.Next(Stack);
		    	this.Next(Stack);
		    	let CaseExp = this.ParseExpression(Stack);
		    	if (!this.IsPreciseToken(Stack.Token,"Paren","TK_PCLOSE")){
		    		this.TestNext(Stack,"Paren","TK_PCLOSE");
		    		this.Next(Stack);
		    	}
		    	this.TestNext(Stack,"Bracket","TK_BOPEN");
		    	this.Next(Stack);
		    	this.Next(Stack);
		    	this.OpenChunk(Stack);
		    	let CodeBlock = [];
		        while (!this.IsPreciseToken(Stack.Token,"Bracket","TK_BCLOSE")){
		        	this.ParseChunk(Stack);
		            this.Next(Stack);
		        }
		        if (this.IsPreciseToken(Stack.Token,"Bracket","TK_BCLOSE")){
		        	this.Next(Stack);
		        }
		        CodeBlock = Stack.Chunk;
	            Stack.Chunk = Stack.OpenChunks[Stack.OpenChunks.length-1];
	            Stack.OpenChunks.pop();
	            Cases.push({
	            	Expression:CaseExp,
	            	Block:CodeBlock,
	            });
    		} else if (this.IsPreciseToken(Stack.Token,"Keyword","TK_DEFAULT")){
    			this.TestNext(Stack,"Bracket","TK_BOPEN");
		    	this.Next(Stack);
		    	this.Next(Stack);
		    	this.OpenChunk(Stack);
		    	let CodeBlock = [];
		        while (!this.IsPreciseToken(Stack.Token,"Bracket","TK_BCLOSE")){
		        	this.ParseChunk(Stack);
		            this.Next(Stack);
		        }
		        if (this.IsPreciseToken(Stack.Token,"Bracket","TK_BCLOSE")){
		        	this.Next(Stack);
		        }
		        CodeBlock = Stack.Chunk;
	            Stack.Chunk = Stack.OpenChunks[Stack.OpenChunks.length-1];
	            Stack.OpenChunks.pop();
	            Default = CodeBlock;
    		} else {
    			throw new CodeError(`Unexpected token "${FromToken(Stack.Token.Value)}" of type "${Stack.Token.Type.toLowerCase()}"`)
    		}
    	}
    	this.ChunkWrite(Stack,Expression);
    	this.ChunkWrite(Stack,Cases);
    	this.ChunkWrite(Stack,Default);
    	this.CloseChunk(Stack);
    },
    //{{ RepeatState }}\\
    RepeatState:function(Stack){
        this.Next(Stack);
        let VarName = undefined;
        this.ChunkWrite(Stack,this.ParseExpression(Stack));
        if (this.CheckNext(Stack,"Keyword","TK_AS")){
            this.Next(Stack);
            this.TypeTestNext(Stack,"Identifier");
            VarName = this.Next(Stack).Value;
        }
        this.TestNext(Stack,"Bracket","TK_BOPEN");
        this.Next(Stack);
        this.Next(Stack);
        this.CodeBlock(Stack);
        if (VarName){
            this.ChunkWrite(Stack,VarName);
        }
        this.CloseChunk(Stack);
        this.JumpBack(Stack);
    },
    //{{ ParseChunk }}\\
    ParseChunk:function(Stack){
        let Token = Stack.Token;
        if (Token.Type == "Keyword"){
        	if (Token.Value == "TK_SET"){
            	this.OpenChunk(Stack);
            	this.ChunkWrite(Stack,"IN_NEW");
            	this.NewState(Stack);
        	} else if (Token.Value == "TK_CONST"){
            	this.OpenChunk(Stack);
            	this.ChunkWrite(Stack,"IN_CONST");
            	this.NewState(Stack);
            } else if (Token.Value == "TK_IF"){
            	this.OpenChunk(Stack);
            	this.ChunkWrite(Stack,"IN_IF");
                this.IfState(Stack);
            } else if (Token.Value == "TK_ELIF"){
            	this.OpenChunk(Stack);
            	this.ChunkWrite(Stack,"IN_ELIF");
                this.IfState(Stack);
            } else if (Token.Value == "TK_ELSE"){
            	this.OpenChunk(Stack);
            	this.ChunkWrite(Stack,"IN_ELSE");
                this.ElseState(Stack);
            } else if (Token.Value == "TK_WHILE"){
            	this.OpenChunk(Stack);
                this.ChunkWrite(Stack,"IN_WHILE");
                this.IfState(Stack);
            } else if (Token.Value == "TK_FOREACH"){
            	this.OpenChunk(Stack);
                this.ChunkWrite(Stack,"IN_FOREACH");
                this.ForEachState(Stack);
            } else if (Token.Value == "TK_FOR"){
            	this.OpenChunk(Stack);
                this.ChunkWrite(Stack,"IN_FOR");
                this.ForState(Stack);
            } else if (Token.Value == "TK_FUNC"){
            	this.OpenChunk(Stack);
                this.ChunkWrite(Stack,"IN_FUNC");
                this.FuncState(Stack);
            } else if (Token.Value == "TK_SEND"){
            	this.OpenChunk(Stack);
                this.ChunkWrite(Stack,"IN_RETURN");
                this.RetState(Stack);
            } else if (Token.Value == "TK_DEL"){
            	this.OpenChunk(Stack);
                this.ChunkWrite(Stack,"IN_DEL");
                this.DelState(Stack);
            } else if (Token.Value == "TK_STOP"){
            	this.OpenChunk(Stack);
                this.ChunkWrite(Stack,"IN_STOP");
                this.CloseChunk(Stack);
            } else if (Token.Value == "TK_CLASS"){
            	this.OpenChunk(Stack);
            	this.ChunkWrite(Stack,"IN_CLASS");
            	this.ClassState(Stack);
            } else if (Token.Value == "TK_DESTRUCT"){
            	this.OpenChunk(Stack);
            	this.ChunkWrite(Stack,"IN_DESTRUCT");
            	this.DestructState(Stack);
            } else if (Token.Value == "TK_UNSET"){
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack,"IN_UNSET");
                this.UnsetState(Stack);
            } else if (Token.Value == "TK_USING"){
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack,"IN_USING");
                this.UsingState(Stack);
            } else if (Token.Value == "TK_SWAP"){
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack,"IN_SWAP");
                this.SwapState(Stack);
            } else if (Token.Value == "TK_SWITCH"){
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack,"IN_SWITCH");
                this.SwitchState(Stack);
            } else if (Token.Value == "TK_REPEAT"){
                this.OpenChunk(Stack);
                this.ChunkWrite(Stack,"IN_REPEAT");
                this.RepeatState(Stack);
            } else {
                Lex.ThrowError(CodeError,`Unexpected ${String(Token.Type).toLowerCase()} "${Token.Value}"`,Stack);
            }
        } else if (Token.Type == "Identifier"){
        	if (this.TypeCheckNext(Stack,"Assignment")){
            	this.OpenChunk(Stack);
            	this.ChunkWrite(Stack,"IN_SET");
                this.JumpBack(Stack);
                this.SetState(Stack);
            } else {
            	this.OpenChunk(Stack);
            	this.ChunkWrite(Stack,"IN_GET");
            	this.ChunkWrite(Stack,Token.Value);
        		Stack.Chunk = this.FinishExpression(Stack,Stack.Chunk);
        		this.CloseChunk(Stack);
            }
        } else if (this.IsPreciseToken(Token,"None","TK_AT")){
            this.OpenChunk(Stack);
            this.ChunkWrite(Stack,"IN_GLOBALASSIGN");
            this.TypeTestNext(Stack,"Identifier");
            this.Next(Stack);
            this.ChunkWrite(Stack,Stack.Token.Value);
            this.TestNext(Stack,"Assignment","TK_EQ");
            this.Next(Stack);
            this.Next(Stack);
            this.ChunkWrite(Stack,this.ParseExpression(Stack));
            this.CloseChunk(Stack);
        } else {
            let NoChecks={
                "None":["TK_LINEEND","TK_COMMA"],
                "Bracket":["TK_BOPEN","TK_BCLOSE"],
                "Paren":["TK_PCLOSE"],
            }
            let Pass = true;
            for (let k in NoChecks){
                let v = NoChecks[k];
                for (let vv of v){
                    if (this.IsPreciseToken(Token,k,vv)){
                        Pass=false;
                        break;
                    }
                }
            }
            if (Pass){
                this.OpenChunk(Stack);
                Stack.Chunk = this.ParseExpression(Stack);
                this.CloseChunk(Stack);    
            }
        }
    },
    StartParser:function(Code){
    	let Stack = this.NewStack({
        	Tokens:Lex.Tokenize(Code),
            Code:Code,
        });
        while (Stack.Current <= Stack.Tokens.length-1 && !this.IsPreciseToken(Stack.Token,"End","TK_EOS")){
            this.Next(Stack);
            if (Stack.Current >= Stack.Tokens.length-1 || this.IsPreciseToken(Stack.Token,"End","TK_EOS")){break}
            this.ParseChunk(Stack);
        }
        return Stack.Result;
    },
});

// {{-=~}} Interpreter {{~=-}} \\\


const DeepCopy = (inObject) => {
  let outObject, value, key

  if (typeof inObject !== "object" || inObject === null) {
    return inObject // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {}

  for (key in inObject) {
    value = inObject[key]

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = DeepCopy(value)
  }

  return outObject
}

const Interpreter = Object.freeze({
	NewStack:function(AST,Tokens){
    	const NewStack = {
        	Current:-1,
            PToken:"",
            Token:"",
            CloneTokens:DeepCopy(Tokens),
            Tokens:Tokens,
            Upper:this.GetStack(AST,AST.CStack),
            VariableReference:new Proxy({},{
                get:function(self,Name){
                    let Value = self[Name];
                    if (!Value){
                        let Current = AST.Variables[Name];
                        if (Current){
                            return Current.Value
                        } else {
                            if (NewStack.Upper){
                                return NewStack.Upper.VariableReference[Name];
                            }
                        }
                    }
                    return Value;
                },
                set:function(self,Name,Value){
                    self[Name] = Value;  
                },
            }),
        };
        AST.Stacks.push({
        	Tokens:Tokens,
        	Stack:NewStack,
        });
    	return NewStack;
    },
    GetStack:function(AST,Tokens){
    	for (let v of AST.Stacks){
        	if (v.Tokens == Tokens){
            	return v.Stack;
            }
        }
    },
    RemoveStack:function(AST,Tokens){
    	for (let k in AST.Stacks){
        	k=+k;
            let v = AST.Stacks[k];
        	if (v.Tokens == Tokens){
            	AST.Stacks.splice(k,1);
                return;
            }
        }
    },
    Next:function(AST,Stack){
        if (!this.GetStack(AST,Stack)){
        	this.NewStack(AST,Stack);
        }
    	let ParseStack = this.GetStack(AST,Stack);
        ParseStack.Current++;
        ParseStack.PToken=ParseStack.Token;
        ParseStack.Token=ParseStack.Tokens[ParseStack.Current];
        AST.CStack = Stack
        if (ParseStack){
        	AST.StackCurrent = ParseStack
        }
    },
    GetCurrentVariables:function(AST){
    	let Variables = [];
        for (let v of AST.Variables){
        	if (v.Block <= AST.Block){
            	Variables.push(v);
            }
        }
        return Variables;
    },
    GetHighestVariable:function(AST,Name){
    	let Variables = this.GetCurrentVariables(AST);
        let Variable = null;
        for (let v of Variables){
        	if (v.Name == Name && v.Block <= AST.Block){
            	if (!Variable){
                	Variable = v
                } else if (v.Block > Variable.Block){
                	Variable = v;
                }
            }
        }
        return Variable;
    },
    NewVariable:function(Name,Value,Block){
    	return {
        	Name:Name,
            Value:Value,
            Block:Block,
        };
    },
    SetVariable:function(AST,Name,Value,Type){
    	let Variable = this.GetHighestVariable(AST,Name);
    	let CStack = this.GetStack(AST,AST.CStack);
    	let Set = false;
    	if (!Variable && CStack){
    	    let v = CStack.VariableReference[Name];
    	    if (v){
    	        Variable = this.NewVariable(Name,v,AST.Block);
    	        Set = true;
    	    }
    	}
    	if (Variable && Variable.Const == true){
    	    throw new CodeError(`Attempt to set the const variable "${Name}"`);
    	}
        if (Variable){
            if (!Type || Type=="eq"){
        	    Variable.Value = Value;
            }else if(Type=="addeq"){
                Variable.Value+=Value;
            }else if(Type=="subeq"){
                Variable.Value-=Value;
            }else if(Type=="muleq"){
                Variable.Value*=Value;
            }else if(Type=="diveq"){
                Variable.Value/=Value;
            }else if(Type=="poweq"){
                Variable.Value**=Value;
            }else if(Type=="modeq"){
                Variable.Value%=Value;
            }
        } else {
        	this.MakeVariable(AST,Name,Value);
        }
        if (Set){
            CStack.VariableReference[Name]=Variable.Value;
            if (CStack.Upper){
                CStack.Upper.VariableReference[Name]=Variable.Value;
            }
        }
    },
    GetType:function(x){
        let ty = typeof x;
        if (ty=="object"){
            if (x===null||x===undefined){
                return "null";
            }
        	return x instanceof Array?"array":"object";
        }
        if (String(ty)=="undefined"){
            ty="null";
        }
        return String(ty);
    },
    MakeVariable:function(AST,Name,Value,Extra,ForceBlock){
    	let Variable = this.GetHighestVariable(AST,Name);
        if (Variable && Variable.Block == AST.Block && ForceBlock==undefined){return}
        Variable = this.NewVariable(Name,Value,AST.Block);
        if (ForceBlock!=undefined){
        	Variable.Block = ForceBlock;
        }
        if (Extra && typeof Extra == "object"){
        	for (let k in Extra){
            	Variable[k] = Extra[k];
            }
        }
        AST.Variables.push(Variable);
    },
    RemoveVariable:function(AST,Name){
    	let Variable = this.GetHighestVariable(AST,Name);
        if (Variable){
        	AST.Variables.splice(AST.Variables.indexOf(Variable),1);
        }
    },
    ParseInnerToken:function(AST,Token){
    	return this.Parse(AST,Token)
    },
    ParseToken:function(AST,Token){
    	if (Token.length == 0){return}
    	for (let k in Token){
        	k=+k;
        	let v = Token[k];
            if (v instanceof Array){
            	let R = [this.Parse(AST,v)];
                if (R.length > 1){
                	Token[k]=R[0];
                    for (let kk in R){
                    	kk=+kk;
                    	let vv = R[kk];
                        if (+kk > 0){
                        	Token.splice((+k)+((+kk-1)),0,vv);
                        }
                    }
                } else {
                	Token[k] = R[0];
                }
            } else if (v instanceof Object){
            	this.ParseToken(AST,v);
            	for (let kk in v){
                   	let vv = v[kk];
                	v[kk] = this.Parse(AST,v[kk]);
                }
            }
        }
    },
    OpenBlock:function(AST){
    	AST.Block++;
    },
    CloseBlock:function(AST){
    	let Variables = this.GetCurrentVariables(AST);
        let New = [];
        for (let v of Variables){
        	if (v.Block < AST.Block){
            	New.push(v);
            } else {
                //Save variables to Stack VariableReference
                let CStack = AST.CStack;
                let Stack = this.GetStack(AST,CStack);
                if (Stack){
                    Stack.VariableReference[v.Name]=v.Value;
                }
            }
        }
        AST.Variables = New;
        AST.Block--;
    },
    GetExtendingClasses:function(Class){
        if (!Class){return []}
    	let Extensions = [];
        Extensions.push(Class);
        let Proto = Object.prototype.hasOwnProperty.call(Class,"Extends")?Class.Extends:Object.getPrototypeOf(Class);
        while (Proto){
            if (Extensions.includes(Proto)){
            	Extensions.pop();
            	break;
            }
        	Extensions.push(Proto);
            Proto = Object.prototype.hasOwnProperty.call(Proto,"Extends")?Proto.Extends:Object.getPrototypeOf(Proto.constructor);
        }
        return Extensions;
    },
    SetState:function(AST,Token){
      let Var = this.GetHighestVariable(AST,Token[1]);
      if (Var){
        if (Var.hasOwnProperty("Type")){
          if (this.GetType(Token[2]) != Var.Type){
            throw new CodeError(`Type "${this.GetType(Token[2])}" does not match type "${Var.Type}"`);
          }
        }
      }
    	this.SetVariable(AST,Token[1],Token[3],Token[2]);
    },
    NewState:function(AST,Token){
      let Extra = {};
      if (Token[3]){
        Extra.Type = Token[3];
        if (this.GetType(Token[2]) != Extra.Type){
          throw new CodeError(`Type "${this.GetType(Token[2])}" does not match type "${Extra.Type}"`);
        }
      }
    	this.MakeVariable(AST,Token[1],Token[2],Extra);
    },
    ConstState:function(AST,Token){
      let Extra = {
          Const:true,
      };
      if (Token[3]){
        Extra.Type = Token[3];
        if (this.GetType(Token[2]) != Extra.Type){
          throw new CodeError(`Type "${this.GetType(Token[2])}" does not match type "${Extra.Type}"`);
        }
      }
    	this.MakeVariable(AST,Token[1],Token[2],Extra);
    },
    GetIndexFromType:function(AST,Type,Name){
        let Global = AST.LibGlobals[Type];
        if (!Global){return}
        return Global[Name];
    },
    IndexState:function(AST,Token){
        let Value = Token[1];
        let Idx = Token[2];
        let Res = Value[Idx];
        let ty = this.GetType(Value);
        if (ty == "object"){
            return Res;
        }
        let Ind = this.GetIndexFromType(AST,ty,Idx);
        if (Ind){return Ind}
        return Res;
    },
    CallState:function(AST,Token){
    	let Check = Token[1];
    	if (typeof Check !="function"){
        	throw new CodeError(`Attempt to call a(n) ${typeof Check} value "${String(Check)}"`);
        }
    	return Token[1](...(Token[2]||[]));
    },
    SelfCallState:function(AST,Token){
    	let Check = this.IndexState(AST,Token);
    	if (typeof Check !="function"){
        	throw new CodeError(`Attempt to call a(n) ${typeof Check} value "${String(Check)}"`);
        }
    	return Check(Token[1],...Token[3]);
    },
    PropCallState:function(AST,Token){
    	let Check = this.IndexState(AST,Token);
    	if (typeof Check !="function"){
        	throw new CodeError(`Attempt to call a(n) ${typeof Check} value "${String(Check)}"`);
        }
    	return Check.call(Token[1],...Token[3]);
    },
    FastFuncState:function(AST,Args,Tokens,DefaultParams={},ParamTypes={},ReturnType=null){
        let Block = AST.Block;
        this.NewStack(AST,Tokens);
        DefaultParams = this.Parse(AST,DefaultParams);
        ParamTypes = ParamTypes;
        const Callback = function(...Params){
        	Interpreter.OpenBlock(AST);
            let Stack = Interpreter.GetStack(AST,Tokens);
            for (let k in Args){
            	k=+k;
            	let v = Args[k];
            	let Param = Params[k];
            	if (Param==null||Param==undefined){
            	    if (DefaultParams.hasOwnProperty(v)){
            	        let P = DeepCopy(DefaultParams[v])
            	        Param = P;
            	    }
            	}
            	if (ParamTypes.hasOwnProperty(v)){
            	  if (Interpreter.GetType(Param) != ParamTypes[v]){
                  throw new CodeError(`Type "${Interpreter.GetType(Param)}" does not match type "${ParamTypes[v]}"`);
                }
            	}
            	Interpreter.MakeVariable(AST,v,Param);
            }
            let Result = undefined;
            let CStack = AST.CStack;
            let PreBlock = AST.InBlock;
            AST.InBlock = true;
            //Make sure the function can call itself
            let CloneTokens = DeepCopy(Stack.CloneTokens);
            Tokens = CloneTokens;
            Interpreter.NewStack(AST,CloneTokens);
            let CS = Interpreter.GetStack(AST,CloneTokens);
            //CS.VariableReference = Stack.VariableReference;
            CS.Upper = Stack.Upper;
            if (Stack.Tokens.length > 0){
                do {
                	Interpreter.Next(AST,Stack.Tokens);
                    if (Stack.Token[0]=="IN_RETURN"){
                    	Result = Interpreter.Parse(AST,Stack.Token);
                        Stack.Result = null;
                        break;
                    }
                    Interpreter.Parse(AST,Stack.Token);
                    if (AST.Returned==true){
                    	Result = AST.Result;
                        AST.Result = null;
                        break;
                    }
                }while(Stack.Current < Stack.Tokens.length-1);
            }
            Interpreter.CloseBlock(AST);
            Interpreter.RemoveStack(AST,Stack.Tokens);
            Interpreter.RemoveStack(AST,CloneTokens);
            let NewTokens = DeepCopy(Stack.CloneTokens);
            Tokens = NewTokens;
            AST.CStack = CStack;
            AST.Result = null;
            Interpreter.NewStack(AST,NewTokens);
            CS = Interpreter.GetStack(AST,NewTokens);
            //CS.VariableReference = Stack.VariableReference;
            CS.Upper = Stack.Upper;
            AST.InBlock = PreBlock;
            AST.Returned = false;
            if (ReturnType && Interpreter.GetType(Result) != ReturnType){
                throw new CodeError(`Return Type "${Interpreter.GetType(Result)}" does not match type "${ReturnType}"`);
            }
            return Result;
        }
        return Callback;
    },
    FuncState:function(AST,Token){
    	let Name = Token[1];
        let Args = Token[2];
        let Tokens = Token[3];
        let Block = AST.Block;
        const Callback = this.FastFuncState(AST,Args,Tokens,Token[4],Token[10],Token[11]);
        this.SetVariable(AST,Name,Callback,Block);
    },
    SkipIfState:function(AST,Token){
    	if ((AST.Returned&&AST.InBlock)||(AST.Broken)){return}
      let Stack = this.GetStack(AST,Token);
      if (!Stack.Token){
      	return
      }
      if (Stack.Token[0]!="IN_ELIF"&&Stack.Token[0]!="IN_ELSE"){
        return this.Parse(AST,Stack.Token);
      }
      do{
        this.Next(AST,Token);
        if (Stack.Current >= Stack.Tokens.length-1){
        	if (!Stack.Token){return}
          if (Stack.Token[0]=="IN_ELIF"||Stack.Token[0]=="IN_ELSE"){
            this.Next(AST,Token);
          }
          break;
        }
      }while(Stack.Token[0]=="IN_ELIF"||Stack.Token[0]=="IN_ELSE");
      if (!Stack.Token){return}
      if (Stack.Token[0]=="IN_ELIF"||Stack.Token[0]=="IN_ELSE"){
        this.Next(AST,Token);
      }
      return this.Parse(AST,Stack.Token);
    },
    CondState:function(AST,Token){
        this.OpenBlock(AST);
        this.NewStack(AST,Token);
        let Stack = this.GetStack(AST,Token);
        do{
            this.Next(AST,Stack.Tokens);
            if (!Stack.Token){break}
            if (Stack.Token[0]=="IN_RETURN"&&AST.InBlock){
                AST.Result = this.Parse(AST,Stack.Token);
                AST.Returned = true;
                break;
            } else if (Stack.Token[0]=="IN_STOP"&&AST.InLoop){
                AST.InLoop=false;
                AST.Broken=true;
                break;
            }
            this.Parse(AST,Stack.Token);
        }while(Stack.Current<Stack.Tokens.length-1);
        this.CloseBlock(AST);
        this.RemoveStack(AST,Token);
    },
    IfState:function(AST,Token){
    	let Comp = this.Parse(AST,Token[1]);
        let CStack = AST.CStack;
        let Stack = Token[2];
        if (Comp){
          this.CondState(AST,Stack);
          this.Next(AST,CStack);
          this.SkipIfState(AST,CStack);
          return;
        } else {
          this.Next(AST,CStack);
          let NStack = this.GetStack(AST,CStack);
          if (!NStack.Token){return}
          if (NStack.Token[0]=="IN_ELIF"){
            return this.IfState(AST,NStack.Token);
          } else if (NStack.Token[0]=="IN_ELSE"){
            return this.CondState(AST,NStack.Token);
          }
          return this.Parse(AST,NStack.Token);
        }
    },
    WhileState:function(AST,Token){
      let Comp = Token[1];
      let Stack = Token[2];
      let NewComp = DeepCopy(Comp);
      let PreLoop = AST.InLoop;
      AST.InLoop = true;
      while(this.Parse(AST,NewComp)){
        let NewStack = DeepCopy(Stack);
        this.CondState(AST,NewStack);
        NewComp=DeepCopy(Comp);
        if (!AST.InLoop||AST.Returned){break}
      }
      AST.Broken=false;
      AST.InLoop = PreLoop;
    },
    ForEachState:function(AST,Token){
    	let VName = Token[1];
    	let Type = Token[2];
    	let Arr = this.Parse(AST,Token[3]);
    	let Stack = Token[4];
    	let PreLoop = AST.InLoop
    	AST.InLoop = true
    	for (let k in Arr){
    		let v = Arr[k];
    		this.MakeVariable(AST,VName,Type=="in"?k:v,undefined,AST.Block+1);
    		let NewStack = DeepCopy(Stack);
    		this.CondState(AST,NewStack);
    		if (!AST.InLoop||AST.Returned){break}
    	}
        AST.Broken=false;
    	AST.InLoop = PreLoop;
    },
    ForAllState:function(AST,Token){
    	let VName1 = Token[1];
    	let VName2 = Token[2];
    	let Arr = this.Parse(AST,Token[3]);
    	let Stack = Token[4];
    	let PreLoop = AST.InLoop
    	AST.InLoop = true
    	for (let k in Arr){
    		let v = Arr[k];
    		this.MakeVariable(AST,VName1,k,undefined,AST.Block+1);
            this.MakeVariable(AST,VName2,v,undefined,AST.Block+1);
    		let NewStack = DeepCopy(Stack);
    		this.CondState(AST,NewStack);
    		if (!AST.InLoop||AST.Returned){break}
    	}
        AST.Broken=false;
    	AST.InLoop = PreLoop;
    },
    ForState:function(AST,Token){
    	let VName = Token[1];
    	let Start = this.Parse(AST,Token[2]);
    	let End = this.Parse(AST,Token[3]);
    	let Inc = this.Parse(AST,Token[4]);
    	let Stack = Token[5];
    	let PreLoop = AST.InLoop;
    	AST.InLoop = true;
    	for(let i=Start;;i+=Inc){
    		if (Start<End && i>End){break}
    		if (Start>End&&i<End){break}
    		this.MakeVariable(AST,VName,i,undefined,AST.Block+1);
    		let NewStack = DeepCopy(Stack);
    		this.CondState(AST,NewStack);
    		if (!AST.InLoop||AST.Returned){break}
    	}
        AST.Broken=false;
    	AST.InLoop = PreLoop;
    },
    ArrayState:function(AST,Token){
    	let Arr = Token[1];
    	let ArrTypes = Token[2]||{};
    	for (let k in Arr){
    	  let Result = this.Parse(AST,Arr[k]);
    	  if (ArrTypes.hasOwnProperty(k)){
    	    if (this.GetType(Result) != ArrTypes[k]){
            throw new CodeError(`Type "${this.GetType(Result)}" does not match type "${ArrTypes[k]}"`);
          }
    	  }
        Arr[k]=Result;
      }
      return Arr;
    },
    ClassState:function(AST,Token){
    	const Obj = Token[2];
    	if (!Obj.construct){throw new CodeError(`Invalid class ${Token[1]}`)}
    	const Extends = Token[3];
    	const HasSuper = Token[4];
    	const RClass = function(...a){
    		let New = this;
    		if (Extends && !HasSuper){
    			let Result = new Extends(...a);
    			for (k in Result){
    				New[k]=Result[k];
    			}
    		}
    		for (k in Obj){
    			if (k!="construct"){
    				New[k]=DeepCopy(Obj[k]);
    			}
    		}
    		let Super = function(...ar){
    			if (Extends && HasSuper){
    				let Result = new Extends(...ar);
    				for (k in Result){
    					New[k]=Result[k];
    				}
    			}
    		}
    		Interpreter.MakeVariable(AST,"super",Super,null,AST.Block+1);
    		let Sent = Obj.construct(New,...a);
    		if (Sent!=null&&Sent!=undefined){
    			New=Sent;
    		}
    		return New;
    	}
    	if (Extends!=undefined){
    	    RClass.Extends = Extends;    
    	}
    	this.SetVariable(AST,Token[1],RClass);
    },
    DestructState:function(AST,Token){
    	let Arr = Token[1];
    	let Obj = Token[2];
    	let Default = Obj.default;
    	for (let v of Arr){
    		if (Obj.hasOwnProperty(v)){
    			this.MakeVariable(AST,v,Obj[v]);
    		} else if(Default!=undefined) {
    			this.MakeVariable(AST,v,Default);
    		}
    	}
    },
    UsingState:function(AST,Token){
        let PreUsing = AST.InUsing;
        let PreUse = AST.Using;
        AST.InUsing = true;
        AST.Using = this.Parse(AST,Token[1]);
        this.CondState(AST,Token[2]);
        AST.InUsing = PreUsing;
        AST.Using = PreUse;
    },
    SwitchState:function(AST,Token){
    	let Expression = this.Parse(AST,Token[1]);
    	let Cases = Token[2];
    	let Default = Token[3];
    	for (let v of Cases){
    		let e = this.Parse(AST,v.Expression);
    		if (Expression==e){
    			this.CondState(AST,v.Block)
    			return;
    		}
    	}
    	if (Default){
    		this.CondState(AST,Default);
    	}
    },
    IncState:function(AST,Token,State){
        let Item = Token[1];
        if (this.GetType(Item)!="array"){
            throw new CodeError(`Attempt to ${State?"increment":"decrement"} a ${this.GetType(Item)}`);
        }
        if (Item[0]=="IN_INDEX"){
            let Name = this.Parse(AST,Item[1]);
            let Value = this.Parse(AST,Item[2]);
            if (State){
                Name[Value]++;
            }else{
                Name[Value]--;
            }
        }else if(Item[0]=="IN_GET"){
            let Name = Item[1];
            let Var = this.GetHighestVariable(AST,Name);
            if (Var){
                if (Var.Const == true){
                    throw new CodeError(`Attempt to change const "${Name}"`);
                }
                if (State){
                    Var.Value++;
                }else{
                    Var.Value--;
                }
            } else {
                let CStack = NVM.CStack;
				let Stack = Interpreter.GetStack(NVM,CStack);
                if (Stack && Stack.VariableReference[Name]){
                    if (State){
                        Stack.VariableReference[Name]++;
                    }else{
                        Stack.VariableReference[Name]--;
                    }
				}
                if (State){
                    AST.Globals[Name]++;
                }else{
                    AST.Globals[Name]--;
                }
            }
        }
    },
    RepeatState:function(AST,Token){
        let Count = this.Parse(AST,Token[1]);
        if (this.GetType(Count)!="number"){
            throw new CodeError(`Expected type "number" for repeat loop, got type "${this.GetType(Count)}" instead!`);
        }
        let Stack = Token[2];
        let VarName = Token[3];
    	let PreLoop = AST.InLoop;
    	AST.InLoop = true;
    	for(let i=1;i<=Count;i++){
    		let NewStack = DeepCopy(Stack);
    		if (VarName){
    		    this.MakeVariable(AST,VarName,i,undefined,AST.Block+1);
    		}
    		this.CondState(AST,NewStack);
    		if (!AST.InLoop||AST.Returned){break}
    	}
        AST.Broken=false;
    	AST.InLoop = PreLoop;
    },
    Parse:function(AST,Token){
    	if (!(Token instanceof Array)){
        	return Token
        }
        //Non-Parsed
        if (Token[0]=="IN_FUNC"){
        	return this.FuncState(AST,Token);
        } else if (Token[0]=="IN_FASTFUNC"){
        	return this.FastFuncState(AST,Token[1],Token[2],Token[3],Token[10],Token[11]);
        } else if (Token[0]=="IN_IF"){
        	return this.IfState(AST,Token);
        } else if (Token[0]=="IN_WHILE"){
        	return this.WhileState(AST,Token);
        } else if (Token[0]=="IN_FOREACH"){
        	return this.ForEachState(AST,Token);
        } else if (Token[0]=="IN_FOR"){
        	return this.ForState(AST,Token);
        } else if (Token[0]=="IN_FORALL"){
        	return this.ForAllState(AST,Token);
        } else if (Token[0]=="IN_ARRAY"){
        	return this.ArrayState(AST,Token);
        } else if (Token[0]=="IN_USING"){
            return this.UsingState(AST,Token);
        } else if (Token[0]=="IN_AND"){
            let v1 = this.Parse(AST,Token[1]);
            let v2 = Token[2];
            if (v1){
                v2 = this.Parse(AST,v2);
                return v1&&v2;
            }
            return false;
        } else if (Token[0]=="IN_OR"){
        	let v1 = this.Parse(AST,Token[1]);
            let v2 = Token[2];
            if (v1){
                return v1;
            } else {
                v2 = this.Parse(AST,v2);
                if (v2){
                    return v2;
                }
                return v1||v2;
            }
        } else if (Token[0]=="IN_SWITCH"){
        	return this.SwitchState(AST,Token);
        } else if (Token[0]=="IN_INC"){
        	return this.IncState(AST,Token,true);
        } else if (Token[0]=="IN_DEINC"){
        	return this.IncState(AST,Token,false);
        } else if (Token[0]=="IN_REPEAT"){
            return this.RepeatState(AST,Token);
        }
        this.ParseToken(AST,Token);
        //Parsed
        if (Token[0] == "IN_SET"){
        	return this.SetState(AST,Token);
        } else if (Token[0] == "IN_NEW"){
        	return this.NewState(AST,Token);
        } else if (Token[0] == "IN_CONST"){
        	return this.ConstState(AST,Token);
        } else if (Token[0] == "IN_CALL"){
        	return this.CallState(AST,Token);
        } else if (Token[0] == "IN_SELFCALL"){
        	return this.SelfCallState(AST,Token);
        } else if (Token[0] == "IN_PROPCALL"){
        	return this.PropCallState(AST,Token);
        } else if (Token[0]=="IN_GET"){
        	return AST.Globals[Token[1]];
        } else if (Token[0]=="IN_ADD"){ //Math Start
            let Result=null,Method="__add";
            if (Token[1] instanceof Object && Token[1].hasOwnProperty(Method)){
                Result = Token[1][Method](Token[1],Token[2]);
            } else if (Token[2] instanceof Object && Token[2].hasOwnProperty(Method)){
                Result = Token[2][Method](Token[2],Token[1]);
            } else {
                Result = Token[1]+Token[2];
            }
        	return Result;
        } else if (Token[0]=="IN_SUB"){
        	let Result=null,Method="__sub";
            if (Token[1] instanceof Object && Token[1].hasOwnProperty(Method)){
                Result = Token[1][Method](Token[1],Token[2]);
            } else if (Token[2] instanceof Object && Token[2].hasOwnProperty(Method)){
                Result = Token[2][Method](Token[2],Token[1]);
            } else {
                Result = Token[1]-Token[2];
            }
        	return Result;
        } else if (Token[0]=="IN_MUL"){
        	let Result=null,Method="__mul";
            if (Token[1] instanceof Object && Token[1].hasOwnProperty(Method)){
                Result = Token[1][Method](Token[1],Token[2]);
            } else if (Token[2] instanceof Object && Token[2].hasOwnProperty(Method)){
                Result = Token[2][Method](Token[2],Token[1]);
            } else {
                Result = Token[1]*Token[2];
            }
        	return Result;
        } else if (Token[0]=="IN_DIV"){
        	let Result=null,Method="__div";
            if (Token[1] instanceof Object && Token[1].hasOwnProperty(Method)){
                Result = Token[1][Method](Token[1],Token[2]);
            } else if (Token[2] instanceof Object && Token[2].hasOwnProperty(Method)){
                Result = Token[2][Method](Token[2],Token[1]);
            } else {
                Result = Token[1]/Token[2];
            }
        	return Result;
        } else if (Token[0]=="IN_POW"){
        	let Result=null,Method="__pow";
            if (Token[1] instanceof Object && Token[1].hasOwnProperty(Method)){
                Result = Token[1][Method](Token[1],Token[2]);
            } else if (Token[2] instanceof Object && Token[2].hasOwnProperty(Method)){
                Result = Token[2][Method](Token[2],Token[1]);
            } else {
                Result = Token[1]**Token[2];
            }
        	return Result;
        } else if (Token[0]=="IN_MOD"){ //Math End
        	let Result=null,Method="__mod";
            if (Token[1] instanceof Object && Token[1].hasOwnProperty(Method)){
                Result = Token[1][Method](Token[1],Token[2]);
            } else if (Token[2] instanceof Object && Token[2].hasOwnProperty(Method)){
                Result = Token[2][Method](Token[2],Token[1]);
            } else {
                Result = Token[1]%Token[2];
            }
        	return Result;
        } else if (Token[0]=="IN_NOT"){
        	return !Token[1];
        } else if (Token[0]=="IN_EQ"){
        	return Token[1]==Token[2];
        } else if (Token[0]=="IN_GEQ"){
        	return Token[1]>=Token[2];
        } else if (Token[0]=="IN_LEQ"){
        	return Token[1]<=Token[2];
        } else if (Token[0]=="IN_NEQ"){
        	return Token[1]!=Token[2];
        } else if (Token[0]=="IN_GT"){
        	return Token[1]>Token[2];
        } else if (Token[0]=="IN_LT"){
        	return Token[1]<Token[2];
        } else if (Token[0]=="IN_INDEX"){
            let Result=null,Method="__index";
            if ((Token[1] instanceof Object) && Object.prototype.hasOwnProperty.call(Token[1],Method)){
                Result = Token[1][Method](Token[1],Token[2]);
            } else {
                Result = this.IndexState(AST,Token);
            }
        	return Result;
        } else if (Token[0]=="IN_SETINDEX"){
            let Type = Token[3];
            if (Type=="eq"){
                let v = Token[1];
                let Method="__setindex";
                if ((v instanceof Object) && Object.prototype.hasOwnProperty.call(v,Method)){
                    Result = v[Method](v,Token[2],Token[4]);
                } else {
                    v[Token[2]]=Token[4];
                }
            }else if (Type=="addeq"){
                Token[1][Token[2]]+=Token[4];    
            }else if (Type=="subeq"){
                Token[1][Token[2]]-=Token[4];    
            }else if (Type=="muleq"){
                Token[1][Token[2]]*=Token[4];    
            }else if (Type=="diveq"){
                Token[1][Token[2]]/=Token[4];    
            }else if (Type=="poweq"){
                Token[1][Token[2]]**=Token[4];    
            }else if (Type=="modeq"){
                Token[1][Token[2]]%=Token[4];    
            }
            return
        } else if (Token[0]=="IN_DEL"){
        	return this.RemoveVariable(AST,Token[1]);
        } else if (Token[0]=="IN_RETURN"){
        	if (!AST.InBlock){
            	throw new CodeError("Expected return");
            }
        	AST.Result = Token[1];
          	AST.Returned = true;
        	return Token[1];
        } else if (Token[0]=="IN_LEN"){
        	return Token[1].length;
        } else if (Token[0]=="IN_STOP"){
        	return;
        } else if (Token[0]=="IN_MAKENEW"){
        	if (Token[2]){
            	if (!(Token[2] instanceof Array)){
                	throw new CodeError(`Adding parameters to "new" with "with" must be an array`);
                }
            	return new Token[1](...Token[2]);
            } else {
            	return new Token[1];
            }
        } else if (Token[0]=="IN_CLASS"){
        	return this.ClassState(AST,Token);
        } else if (Token[0]=="IN_DESTRUCT"){
        	return this.DestructState(AST,Token);
        } else if (Token[0]=="IN_ROUND"){
        	return Math.round(Token[1]);
        } else if (Token[0]=="IN_UNM"){
            let Result=null,Method="__unm";
            if ((Token[1] instanceof Object) && Object.prototype.hasOwnProperty.call(Token[1],Method)){
                Result = Token[1][Method](Token[1]);
            } else {
                Result = -Token[1];
            }
        	return Result;
        } else if (Token[0]=="IN_UNSET"){
            delete Token[1][Token[2]];
            return;
        } else if (Token[0]=="IN_GLOBALASSIGN"){
            AST.GlobalSettings[Token[1]]=Token[2];
            return;
        } else if (Token[0]=="IN_ISA"){
            let v1 = Token[1];
            let v2 = Token[2];
            let vv = v1;
            try {
                vv=v1.constructor
            }catch(e){}
            let ex = this.GetExtendingClasses(vv);
            let inst = ex.includes(v2);
            return inst;
        } else if (Token[0]=="IN_SWAP"){
            let v1 = this.GetHighestVariable(AST,Token[1]);
            if (!v1){
                throw new CodeError(`Invalid variable name "${Token[1]}"`);   
            }
            let v2 = this.GetHighestVariable(AST,Token[2]);
            if (!v2){
                throw new CodeError(`Invalid variable name "${Token[2]}"`);   
            }
            let [v1v,v2v]=[v1.Value,v2.Value];
            this.SetVariable(AST,Token[1],v2v,"eq");
            this.SetVariable(AST,Token[2],v1v,"eq");
            return
        } else if (Token[0]=="IN_IN"){
            let v1 = Token[2];
            let v2 = Token[1];
            let ty = this.GetType(v1);
            if (ty == "string"){
                return !!v1.match(v2.replace(/[\+\-\{\}\(\)\[\]\|\=\?\&\.\>\<\*\$\^\\]/g,"\\$&"));
            } else if (ty == "object"){
                return Object.prototype.hasOwnProperty.call(v1,v2);
            } else if (ty == "array"){
                return v1.includes(v2);
            }
        }else if(Token[0]=="IN_BITAND"){
            return Token[1]&Token[2];
        }else if(Token[0]=="IN_BITOR"){
            return Token[1]|Token[2];
        }else if(Token[0]=="IN_BITXOR"){
            return Token[1]^Token[2];
        }else if(Token[0]=="IN_BITZLSHIFT"){
            return Token[1]<<Token[2];
        }else if(Token[0]=="IN_BITZRSHIFT"){
            return Token[1]>>>Token[2];
        }else if(Token[0]=="IN_BITRSHIFT"){
            return Token[1]>>Token[2];
        }else if(Token[0]=="IN_BITNOT"){
            return ~Token[1]
        }
        return Token;
    },
    New:function(Tokens,Library={}){
    	if (!Library.hasOwnProperty("Globals")){
    		Library.Globals={};
    	}
    	let Globals = Library.Globals;
    	const NVM = {
        	Stacks:[],
            MainStack:Tokens,
            Variables:[],
            Block:1,
            CStack:[],
            Returned:false,
            InBlock:false,
            InLoop:false,
            Result:null,
            InUsing:false,
            Using:null,
            StackCurrent:{},
            GlobalSettings:{},
            LibGlobals:Globals,
            Globals:new Proxy(Globals,{
            	get:function(_,Name){
				    let CStack = NVM.CStack;
				    let Stack = Interpreter.GetStack(NVM,CStack);
				    let Var = Interpreter.GetHighestVariable(NVM,Name);
				    if (Stack){
				        if (Stack.VariableReference[Name]){
				            return Stack.VariableReference[Name];
				        }
				        if (Var){
        					return Var.Value;
        				} else {
        				    if (NVM.InUsing && NVM.Using){
        				        if (NVM.Using[Name]){
        				            return NVM.Using[Name];
        				        } else {
        				            return _[Name];
        				        }
        				    } else {
        				        return _[Name];
        				    }
                        }
				    }
				    if (Var){
    					return Var.Value;
    				} else {
                    	if (NVM.InUsing && NVM.Using){
        				    if (NVM.Using[Name]){
        				        return NVM.Using[Name];
        				    } else {
        				        return _[Name];
        				    }
        				} else {
        				    return _[Name];
        				}
                    }
            	},
        	}),
        };
        if (Library.Settings?.ASTVariable===true){
          this.MakeVariable(NVM,"$AST",NVM,undefined,1);
        }
        this.NewStack(NVM,Tokens);
        return NVM;
    },
    Start:function(AST){
    	AST.CStack = AST.MainStack;
        let Stack = this.GetStack(AST,AST.MainStack);
        do {
        	this.Next(AST,AST.MainStack);
            this.Parse(AST,Stack.Token);
            Stack = this.GetStack(AST,AST.MainStack);
        }while(Stack.Current <= Stack.Tokens.length);
        return {
            GlobalSettings:AST.GlobalSettings,
            AST:AST,
        };
    },
});

//{{ Print }}\\

function ReduceValue(Value){
	let Type = typeof Value;
    if (Type == "string"){
    	return `"${Value}"`;
    } else {
    	return String(Value);
    }
}

function GetTabs(Count){
	let t = "";
    for (let i=1;i<=Count;i++){
    	t+="\t";
    }
    return t;
}

function NonReduceString(Add){
	let New = Add;
    let Type = typeof Add;
    if (Type == "string"){
    	if (Add.match(/\s/)){
        	New = `["${Add}"]`;	
        }
    } else {
    	New = `[${Add}]`;
    }
    return New;
}

function Print(Table,Arr,Tabs){
	let TabCount = Tabs || 0;
    let Arrr = Arr || [];
    for (let k in Table){
    	let v = Table[k];
        if (typeof v == "object"){
            Arrr.push(GetTabs(TabCount)+`${NonReduceString(k)} = `+`{`+"<br>");
            Print(v,Arrr,TabCount+1);
            Arrr.push(GetTabs(TabCount)+"}<br>");
        } else {
        	let sv = `${NonReduceString(k)} = `
        	Arrr.push(GetTabs(TabCount)+sv+ReduceValue(v)+"<br>");
        }
    }
    return Arrr;
}

//{{ XBS Proxy }}\\

const XBS = Object.freeze({
    Version:"0.0.0.3",
  Parse:function(Code){
    return AST.StartParser(Code);
  },
  StylePrint:function(Text){
    document.write(`<pre style="border-left:5px solid #eeeeee;padding-left:5px;tab-size:3;font-size:12px;line-height:12px;">${Text}</pre>`);
  },
  Run:function(Code,Library,Settings={}){
    Library.Globals._VERSION=XBS.Version;
    if (Settings.PrintCode===true){
      this.StylePrint(Code);
    }
    let ASTResult = this.Parse(Code);
    if (Settings.PrintAST===true){
      this.StylePrint(Print(ASTResult).join(""));
    }
    let VM = Interpreter.New(ASTResult,Library);
    return Interpreter.Start(VM);
  },
  Tokenize:function(Code){
    return Lex.Tokenize(Code);
  },
});
