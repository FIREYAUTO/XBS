const XBS = ((DebugMode=false)=>{
	
    //-- Debugger --\\
    
    function DebugLog(...a){
    	DebugMode&&(document.write(`<pre>${a.join(" ")}</pre>`,"<br>"));
    }
    
    //-- Error Handler --\\
    
    class XBSError extends Error{constructor(Message){super(Message).name=this.constructor.name}}
    
    const ErrorHandler = {
    	ErrorTypes:{
        	"Unexpected":(a)=>`Unexpected ${a}`,
            "Expected":(a,b)=>`Expected ${a}, got ${b} instead`,
		"Attempt":(a)=>`Attempt to ${a}`,
        },
        RawError:function(Type,StartMessage="",EndMessage="",...Parameters){
        	let Result = this.ErrorTypes[Type];
            if(!Result)return;
            throw new XBSError(`${StartMessage}${Result(...Parameters)}${EndMessage}`);
        },
        TError:function(Stack,Type,...Parameters){
        	this.RawError(Type,"",` on line ${Stack.Line} at index ${Stack.Index}`,...Parameters);
        },
        AError:function(Stack,Type,...Parameters){
        	this.RawError(Type,"",` on line ${Stack.Line} at index ${Stack.Index}`,...Parameters);
        },
        IError:function(Token,Type,...Parameters){
        	this.RawError(Type,"",` on line ${Token.Line} at index ${Token.Index}`,...Parameters);
        },
    };
    
    //-- Tokenizer --\\
    
    class TokenBase {
    	constructor(Value,Type){
        	this.Value = Value;
            this.Type = Type;
        }
        toString(){
        	return `Value:${this.Value},Type:${this.Type}`;
        }
    }
    
    const Tokenizer = {
        Tokens:{
        	//Whitespace Tokens
        	"SPACE":{Value:" ",Type:"Whitespace",LineBreak:false},
            "TAB":{Value:String.fromCharCode(9),Type:"Whitespace",LineBreak:false},
            "LINEFEED":{Value:String.fromCharCode(10),Type:"Whitespace",LineBreak:true},
            "LINETAB":{Value:String.fromCharCode(11),Type:"Whitespace",LineBreak:true},
            "FORMFEED":{Value:String.fromCharCode(12),Type:"Whitespace",LineBreak:true},
            "CRETURN":{Value:String.fromCharCode(13),Type:"Whitespace",LineBreak:true},
            "NEXTLINE":{Value:String.fromCharCode(133),Type:"Whitespace",LineBreak:true},
            //Keyword Tokens
        	"SET":{Value:"set",Type:"Keyword"},
            "IF":{Value:"if",Type:"Keyword"},
            "ELIF":{Value:"elif",Type:"Keyword"},
            "ELSE":{Value:"else",Type:"Keyword"},
            "WHILE":{Value:"while",Type:"Keyword"},
            "FOR":{Value:"for",Type:"Keyword"},
            "FOREACH":{Value:"foreach",Type:"Keyword"},
            "IN":{Value:"in",Type:"Keyword"},
            "OF":{Value:"of",Type:"Keyword"},
            "AS":{Value:"as",Type:"Keyword"},
            "FUNC":{Value:"func",Type:"Keyword"},
            "SEND":{Value:"send",Type:"Keyword"},
            "DEL":{Value:"del",Type:"Keyword"},
            "STOP":{Value:"stop",Type:"Keyword"},
            "NEW":{Value:"new",Type:"Keyword"},
            "WITH":{Value:"with",Type:"Keyword"},
            "CLASS":{Value:"class",Type:"Keyword"},
            "EXTENDS":{Value:"extends",Type:"Keyword"},
            "DESTRUCT":{Value:"destruct",Type:"Keyword"},
            "UNSET":{Value:"unset",Type:"Keyword"},
            "ISA":{Value:"isa",Type:"Keyword"},
            "USING":{Value:"using",Type:"Keyword"},
            "SWAP":{Value:"swap",Type:"Keyword"},
            "SWITCH":{Value:"switch",Type:"Keyword"},
            "DEFAULT":{Value:"def",Type:"Keyword"},
            "CASE":{Value:"case",Type:"Keyword"},
            "CONST":{Value:"const",Type:"Keyword"},
            "REPEAT":{Value:"repeat",Type:"Keyword"},
            "SETTYPE":{Value:"settype",Type:"Keyword"},
            "CHUNK":{Value:"chunk",Type:"Keyword"},
            "EXCLUDE":{Value:"exclude",Type:"Keyword"},
            "TRY":{Value:"try",Type:"Keyword"},
            "CATCH":{Value:"catch",Type:"Keyword"},
            "FINALLY":{Value:"finally",Type:"Keyword"},
            "DEFINE":{Value:"define",Type:"Keyword"},
            "ISTYPE":{Value:"istype",Type:"Keyword"},
            "DOERROR":{Value:"doerror",Type:"Keyword"},
            "CONTINUE":{Value:"continue",Type:"Keyword"},
            "EACH":{Value:"each",Type:"Keyword"},
            "LOCKVAR":{Value:"lockvar",Type:"Keyword"},
            "UPVAR":{Value:"upvar",Type:"Keyword"},
            "EXIT":{Value:"exit",Type:"Keyword"},
            //Operator Tokens
            "ADD":{Value:"+",Type:"Operator"},
            "SUB":{Value:"-",Type:"Operator"},
            "MUL":{Value:"*",Type:"Operator"},
            "DIV":{Value:"/",Type:"Operator"},
            "MOD":{Value:"%",Type:"Operator"},
            "POW":{Value:"^",Type:"Operator"},
            "PERCENTOF":{Value:"%%",Type:"Operator"},
            "FLOORDIV":{Value:"//",Type:"Operator"},
            "DOT":{Value:".",Type:"Operator"},
            "EQS":{Value:"==",Type:"Operator"},
            "GEQ":{Value:">=",Type:"Operator"},
            "LEQ":{Value:"<=",Type:"Operator"},
            "GT":{Value:">",Type:"Operator"},
            "LT":{Value:"<",Type:"Operator"},
            "AND":{Value:"&",Type:"Operator"},
            "OR":{Value:"|",Type:"Operator"},
            "NOT":{Value:"!",Type:"Operator"},
            "NEQ":{Value:"!=",Type:"Operator"},
            "PIPE":{Value:"|>",Type:"Operator"},
            "EPIPE":{Value:"<|",Type:"Operator"},
            "RANGE":{Value:"..",Type:"Operator"},
            "ROUND":{Value:"~",Type:"Operator"},
            "INC":{Value:"++",Type:"Operator"},
            "DEINC":{Value:"--",Type:"Operator"},
            "LINEEND":{Value:";",Type:"Operator"},
            "COMMA":{Value:",",Type:"Operator"},
            "SELFCALL":{Value:"::",Type:"Operator"},
            "COLON":{Value:":",Type:"Operator"},
            "QUESTION":{Value:"?",Type:"Operator"},
            "AT":{Value:"@",Type:"Operator"},
            "FORCEPARSE":{Value:"=>",Type:"Operator"},
            //Assignment Tokens
            "EQ":{Value:"=",Type:"Assignment"},
            "ADDEQ":{Value:"+=",Type:"Assignment"},
            "SUBEQ":{Value:"-=",Type:"Assignment"},
            "MULEQ":{Value:"*=",Type:"Assignment"},
            "DIVEQ":{Value:"/=",Type:"Assignment"},
            "MODEQ":{Value:"%=",Type:"Assignment"},
            "POWEQ":{Value:"^=",Type:"Assignment"},
            "PERCENTOFEQ":{Value:"%%=",Type:"Assignment"},
            "FLOORDIVEQ":{Value:"//=",Type:"Assignment"},
            //String Tokens
            "QUOTE":{Value:"\"",Type:"String"},
            "APOS":{Value:"'",Type:"String"},
            "GRAVE":{Value:"`",Type:"String"},
            //Bool Tokens
            "TRUE":{Value:"true",Type:"Bool"},
            "FALSE":{Value:"false",Type:"Bool"},
            //Null Tokens
            "NULL":{Value:"null",Type:"Null"},
            //Control Tokens
            "BACKSLASH":{Value:"\\",Type:"Control"},
            //Comment Tokens
            "COMMENT":{Value:"#",Type:"Comment"},
            "LONGCOMMENTOPEN":{Value:"#>",Type:"Comment"},
            "LONGCOMMENTCLOSE":{Value:"<#",Type:"Comment"},
            //Bracket Tokens
            "BOPEN":{Value:"{",Type:"Bracket"},
            "BCLOSE":{Value:"}",Type:"Bracket"},
            "POPEN":{Value:"(",Type:"Bracket"},
            "PCLOSE":{Value:")",Type:"Bracket"},
            "IOPEN":{Value:"[",Type:"Bracket"},
            "ICLOSE":{Value:"]",Type:"Bracket"},
        },
        Escape:function(Literal){
        	return Literal.replace(/(\<|\>|\*|\(|\)|\{|\}|\[|\]|\||\=|\?|\&|\^|\$|\\|\+|\-|\.|\#)/g,"\\$&");
        },
        IsLineBreak:function(Token){
        	return Token.Type==="Whitespace"&&Token.LineBreak===true;
        },
        IsIdentifier:function(Literal){
        	return Literal.match(/[A-Za-z0-9_]+/);
        },
        IsTokenValue:function(Value){
        	for(let Name in this.Tokens){
            	let Token = this.Tokens[Name];
                if(Token.Value===Value){
                	return true;
                }
            }
            return false;
        },
        TokenTypeFromValue:function(Value){
        	for(let Name in this.Tokens){
            	let Token = this.Tokens[Name];
                if(Token.Value===Value){
                	return Token.Type;
                }
            }
            return this.IsIdentifier(Value)?"Identifier":"Syntax";
        },
        TokenNameFromValue:function(Value){
        	for(let Name in this.Tokens){
            	let Token = this.Tokens[Name];
                if(Token.Value===Value){
                	return Name;
                }
            }
            return Value;
        },
        TokenFromValue:function(Value){
        	for(let Name in this.Tokens){
            	let Token = this.Tokens[Name];
                if(Token.Value===Value){
                	return Token;
                }
            }
        },
        ValueFromName:function(Name,Type){
        	let Token = this.Tokens[Name];
            if(Token&&Token.Type===Type){
            	return Token.Value;
            }
            return Name;
        },
        EscapeStringLiteral:function(Text){
        	switch(Text){
            	case "r":return "\r";
                case "n":return "\n";
                case "b":return "\b";
                case "t":return "\t";
                case "c":return "\c";
                case "f":return "\f";
                case "v":return "\v";
                default:return "\\"+Text;
            }
        },
        NewStack:function(Code){
        	return new TokenizerState(Code);
        },
    };
    
    class TokenizerState {
    	constructor(Code){
        	this.Code=Code,
            this.Character=undefined,
            this.Lines=[],
            this.Line=1,
            this.Index=0,
            this.Position=-1,
            this.Tokens=[];
        }
        IsEnd(){
        	return this.Position>=this.Code.length;
        }
        Next(Amount=1){
        	this.Position+=Amount;
            this.Character=this.Code.substr(this.Position,1);
            return this.Character;
        }
        CheckLine(Token){
        	if(Tokenizer.IsLineBreak(Token)){
            	this.Index=0;
                this.Line++;
            }
        }
        ComputeTokenValue(){
        	let Character = this.Character,
            	Escape = Tokenizer.Escape(Character),
                Result = [];
            if(Tokenizer.IsIdentifier(Escape)){
            	let NewCharacter = Character;
                for(let Index=this.Position+(Character.length),Length=this.Code.length-1;Index<=Length;Index++){
                	let Value = this.Code.substr(Index,1);
                    if(Tokenizer.IsIdentifier(Value)){
                    	NewCharacter+=Value;
                    }else{
                    	break;
                    }
                }
                if(Tokenizer.IsTokenValue(NewCharacter)){
                	this.Next(NewCharacter.length);
                    return NewCharacter;
                }
                Character=NewCharacter;
                Escape=Tokenizer.Escape(Character);
            }
            for(let Name in Tokenizer.Tokens){
            	let Token = Tokenizer.Tokens[Name];
                if(Token.Value.match(new RegExp(`^${Escape}`))){
                	let Matches = 0;
                    for(let Index=Character.length-1,Length=Token.Value.length-1;Index<=Length;Index++){
                    	let Value = Token.Value.substr(Index,1);
                        if(this.Code.substr(this.Position+Index,1)===Value){
                        	Matches++;
                        }else{
                        	break;
                        }
                    }
                    if(Matches===Token.Value.length){
                    	Result.push(Token.Value);
                        Character=Token.Value;
                        Escape=Tokenizer.Escape(Character);
                    }
                }
            }
            if(Result.length===0){
            	Result.push(Character);
            }
            let Final = Result.sort().pop();
            this.Next(Final.length);
            return Final;
        }
        Tokenize(){
        	this.Next();
            while(!this.IsEnd()){
                let TokenValue = this.ComputeTokenValue();
                let TokenType = Tokenizer.TokenTypeFromValue(TokenValue);
                let RawToken = Tokenizer.TokenFromValue(TokenValue);
                let Token = new TokenBase(TokenValue,TokenType);
                Token.RawValue=TokenValue;
                if(RawToken&&RawToken.LineBreak)Token.LineBreak=RawToken.LineBreak;
                this.Lines[this.Line]=(this.Lines[this.Line]||"")+Token.RawValue;
                this.CheckLine(Token);
                this.Index+=TokenValue.length;
                Token.Line=this.Line;
               	Token.Index=this.Index;
                this.Tokens.push(Token);
            }
            this.Tokens = this.HandleTokenTypes();
            this.Tokens = this.RemoveWhitespace();
            this.Tokens = this.ApplyTokenNames();
        }
        ENumberRead(Stack){
        	let Token = Stack.Token;
            if(Token.Value.toLowerCase().endsWith("e")){
            	let Result=Token.Value.substr(0,Token.Value.length-1);
                if(!isNaN(+Result)){
                	Result+="e";
                	let Next = Stack.Next();
                    if(Next){
                    	if(!isNaN(+Next.Value)){
                        	Result+=Next.Value;
                            return Result;
                        }else if(Next.Value==="+"&&Next.Type==="Operator"){
                        	Result+="+";
                            Next = Stack.Next();
                            if(Next&&!isNaN(+Next.Value)){
                            	Result+=Next.Value;
                            }else{
                            	Stack.Next(-2);
                            }
                            return Result;
                        }else if(Next.Value==="-"&&Next.Type==="Operator"){
                        	Result+="-";
                            Next = Stack.Next();
                            if(Next&&!isNaN(+Next.Value)){
                            	Result+=Next.Value;
                            }else{
                            	Stack.Next(-2);
                            }
                            return Result;
                        }else{
                        	Stack.Next(-1);
                        }
                    }else{
                    	Stack.Next(-1);
                    }
                }
            }
        }
        NumberRead(Stack){
        	let Token = Stack.Token;
            if(!isNaN(+Token.Value)){
            	let Result = Token.Value;
                let Next = Stack.Next();
                if(Next&&Next.Type==="Operator"&&Next.Value=="."){
                	Result+=".";
                    Stack.Next();
                    let Value = this.ENumberRead(Stack);
                    if(!Value){
                    	if(!isNaN(+Stack.Token.Value)){
                        	Result+=Stack.Token.Value;
                            return Result;
                        }else{
                        	Stack.Next(-1);
                            return;
                        }
                    }
                    Result+=Value;
                    return Result;
                }else{
                	Stack.Next(-1);
                    return Result;
                }
            }
        }
        TypeRead(Stack){
        	let Token = Stack.Token;
            if(Token.Type==="String"){
            	if(Token.Value==="\""){
                	let Tokens = this.BetweenRead(Stack,{End:{Value:"\"",Type:"String"},Control:{Value:"\\",Type:"Control"},AppendSurrounding:false}),Result = "";
                    for(let Value of Tokens){
                    	let Text = Value.RawValue,Add = undefined;
                        if(Value.Escaped===true){
                        	if(Text.length>1)Add=Text.substr(1,Text.length),Text=Text.substr(0,1);
                        	Text=Tokenizer.EscapeStringLiteral(Text);
                        }
                    	Result+=Text;
                        if(Add)Result+=Add;
                    }
                    Token.Type="Constant";
                    Token.Value=Result;
                    Token.RawValue="String";
                }else if(Token.Value==="\'"){
                	let Tokens = this.BetweenRead(Stack,{End:{Value:"\'",Type:"String"},Control:{Value:"\\",Type:"Control"},AppendSurrounding:false}),Result = "";
                    for(let Value of Tokens){
                    	let Text = Value.RawValue,Add = undefined;
                        if(Value.Escaped===true){
                        	if(Text.length>1)Add=Text.substr(1,Text.length),Text=Text.substr(0,1);
                        	Text=Tokenizer.EscapeStringLiteral(Text);
                        }
                    	Result+=Text;
                        if(Add)Result+=Add;
                    }
                    Token.Type="Constant";
                    Token.Value=Result;
                    Token.RawValue="String";
                }
            }else if(Token.Type==="Identifier"){
            	let Value = this.NumberRead(Stack);
                if(Value){
                	Token.Type="Constant";
                    Token.Value=+Value;
                    Token.RawValue="Number";
                    return Token;
                }
                Value = this.ENumberRead(Stack);
                if(Value){
                	Token.Type="Constant";
                    Token.Value=+Value;
                    Token.RawValue="Number";
                    return Token;
                }
                if(Token.Value.match(/^[0-9]/)){
                	ErrorHandler.TError(this,"Unexpected",`identifier ${Token.Value}`);
                }
            }else if(Token.Type==="Bool"){
            	Token.RawValue=Token.Value;
                Token.Value=Token.Value==="true"?true:false;
            }else if(Token.Type==="Null"){
            	Token.RawValue=Token.Value;
                Token.Value=null;
            }else if(Token.Type==="Comment"){
            	if(Token.Value==="#"){
                	this.BetweenRead(Stack,{End:{LineBreak:true},Control:{Value:"\\",Type:"Control"},AppendSurrounding:false});
                    return;
                }else if(Token.Value==="#>"){
                	this.BetweenRead(Stack,{End:{Value:"<#",Type:"Comment"},Control:{Value:"\\",Type:"Control"},AppendSurrounding:false});
                    return;
                }else{
                	ErrorHandler.TError(this,"Unexpected","long comment close token");
                }
            }
            return Token;
        }
        BetweenRead(Stack,Options={}){
        	let Result = [];
            let {End,Control,AppendSurrounding}=Options;
            if(AppendSurrounding)Result.push(Stack.Token);
            Stack.Next();
            while(!Stack.IsEnd()){
            	let Token = Stack.Token;
                if(End.LineBreak){
                	if(Token.LineBreak===true){
                    	if(AppendSurrounding)Result.push(Stack.Token);
                		break;
                    }
                }else{
                	if(Token.Value===End.Value&&Token.Type===End.Type){
                		if(AppendSurrounding)Result.push(Stack.Token);
                		break;
                	}
                }
                if(Token.Value===Control.Value&&Token.Type===Control.Type){
                	Token = Stack.Next();
                    Token.Escaped=true;
                }
                Result.push(Token);
                Stack.Next();
            }
            if(Stack.IsEnd()&&!End.LineBreak){
            	ErrorHandler.TError(this,"Unexpected","end of script");
            }
            return Result;
        }
        HandleTokenTypes(){
        	let Tokens = this.Tokens,
            	Result = [];
            let Stack = {
            	Tokens:Tokens,
                Position:0,
                Token:Tokens[0],
                Next:function(Amount=1){
                	this.Position+=Amount;
                    this.Token=this.Tokens[this.Position];
                    return this.Token;
                },
                IsEnd:function(){
                	return this.Position>=this.Tokens.length;
                },
            };
            while(!Stack.IsEnd()){
            	let TR = this.TypeRead(Stack);
                if(TR)Result.push(TR);
                Stack.Next();
            }
            return Result;
        }
        RemoveWhitespace(){
        	return this.Tokens.filter(Token=>Token.Type!="Whitespace");
        }
        ApplyTokenNames(){
        	this.Tokens.forEach(Token=>Token.Value=Tokenizer.TokenNameFromValue(Token.Value));
            return this.Tokens;
        }
    }
    
    //-- AST --\\
    
    class ASTBase {
    	constructor(Stack,Type="Base"){
        	this.Stack=Stack,
            this.Line=Stack.Line,
            this.Index=Stack.Index,
            this.EndLine=Stack.Line,
            this.EndIndex=Stack.Index,
            this.LineText=Stack.Lines[this.Line],
            this.Type=Type;
        }
        Close(){
        	this.EndLine=this.Stack.Line,
            this.EndIndex=this.Stack.Index;
        }
    }
    
    class ASTNode extends ASTBase {
    	constructor(Stack,Type){
        	super(Stack,Type);
            this.Data={};
        }
        Write(Name,Value){
        	this.Data[Name]=Value;
        }
        Read(Name){
        	return this.Data[Name];
        }
        toString(){
        	let Text=[];
            for(let k in this.Data){
            	let v = this.Data[k];
                Text.push(`<span style="color:#127fdf">${String(k)}</span>:${String(v)}`);
            }
        	return `<b>ASTNode</b>.<span style="color:#ff1a43"><b>${this.Type}</b></span>{${Text.join(", ")}}`;
        }
    }
    
    class ASTBlock extends ASTBase {
    	constructor(Stack,Type){
        	super(Stack,Type);
            this.Data=[];
        }
        Write(Value){
        	this.Data.push(Value);
        }
        Read(Name){
        	return this.Data[Name];
        }
        toString(){
        	let Data = [];
            for(let v of this.Data)Data.push(String(v));
        	return `<b>ASTBlock</b>.<span style="color:#ff1a43"><b>${this.Type}</b></span>[${Data.join(", ")}]`;
        }
    }
    
    const AST = {
    	NewStack:function(TStack){
        	return new ASTStack(TStack);
        },
        IsToken:function(Token,Value,Type){
        	if(!Token)return false;
        	return Token.Value===Value&&Token.Type===Type;
        },
        IsType:function(Token,Type){
        	if(!Token)return false;
        	return Token.Type===Type;
        },
        Chunks:[
        	{
            	Value:"SET",
                Type:"Keyword",
                Call:function(){
                	let Node = this.NewNode("NewVariable");
                    this.Next();
                    Node.Write("Variables",this.IdentifierList({AllowDefault:true,Priority:-1}));
                    return Node;
                },
            },
		{
            	Value:"CONST",
                Type:"Keyword",
                Call:function(){
                	let Node = this.NewNode("NewVariable");
                    this.Next();
			let List = this.IdentifierList({AllowDefault:true,Priority:-1});
                    Node.Write("Variables",List);
			for(let v of List){
				v.Constant = true;	
			}
                    return Node;
                },
            },
		{
            	Value:"UPVAR",
                Type:"Keyword",
                Call:function(){
                	let Node = this.NewNode("NewVariable");
                    this.Next();
			Node.Write("Type","Upvar");
                    Node.Write("Variables",this.IdentifierList({AllowDefault:true,Priority:-1}));
                    return Node;
                },
            },
		{
            	Value:"IF",
                Type:"Keyword",
                Call:function(){
                	let Node = this.NewNode("If");
			this.TestNext("POPEN","Bracket");
                    this.Next();
			Node.Write("Expression",this.ExpressionInside({Value:"POPEN",Type:"Bracket"},{Value:"PCLOSE",Type:"Bracket"}));
			this.Next();
			Node.Write("Body",this.ParseBlock());
			let Conditions = [];
			while(this.CheckNext("ELIF","Keyword")||this.CheckNext("ELSE","Keyword")){
				if(this.CheckNext("ELIF","Keyword")){
					this.Next();
					let Condition = this.NewNode("Elif");
					this.TestNext("POPEN","Bracket");
					this.Next();
					Condition.Write("Expression",this.ExpressionInside({Value:"POPEN",Type:"Bracket"},{Value:"PCLOSE",Type:"Bracket"}));
					this.Next();
					Condition.Write("Body",this.ParseBlock());
					Conditions.push(Condition);
				}else if(this.CheckNext("ELSE","Keyword")){
					this.Next(2);
					let Condition = this.NewNode("Else");
					Condition.Write("Body",this.ParseBlock());
					Conditions.push(Condition);
					break;
				}
			}
			Node.Write("Conditions",Conditions);
                    return Node;
                },
            },
		{
            	Value:"WHILE",
                Type:"Keyword",
                Call:function(){
                	let Node = this.NewNode("While");
                    	this.TestNext("POPEN","Bracket");
			this.Next();
			Node.Write("Expression",this.ExpressionInside({Value:"POPEN",Type:"Bracket"},{Value:"PCLOSE",Type:"Bracket"}));
			this.Next();
			Node.Write("Body",this.ParseBlock());
                    return Node;
                },
            },
		{
            	Value:"REPEAT",
                Type:"Keyword",
                Call:function(){
                	let Node = this.NewNode("Repeat");
                    	this.Next();
			Node.Write("Amount",this.ParseExpression());
			if(this.CheckNext("AS","Keyword")){
				this.Next();
				this.TypeTestNext("Identifier");
				this.Next();
				Node.Write("Name",this.Token.Value);
			}
			this.Next();
			Node.Write("Body",this.ParseBlock());
                    return Node;
                },
            },
		{
            	Value:"FOR",
                Type:"Keyword",
                Call:function(){
                	let Node = this.NewNode("For");
                    	this.TestNext("POPEN","Bracket");
			this.Next(2);
			let Result = this.ParseRChunk();
			if(!(Result instanceof ASTBase)||Result.Type!="NewVariable"){
				ErrorHandler.AError(this,"Unexpected","statement, expected variable declaration for loop");
			}
			Node.Write("Variable",Result);
			this.TestNext("LINEEND","Operator");
			this.Next(2);
			Node.Write("Condition",this.ParseExpression());
			this.TestNext("LINEEND","Operator");
			this.Next(2);
			Node.Write("Increment",this.ParseExpression());
			this.TestNext("PCLOSE","Bracket");
			this.Next(2);
			Node.Write("Body",this.ParseBlock());
                    return Node;
                },
		},
		{
            	Value:"FOREACH",
                Type:"Keyword",
                Call:function(){
                	let Node = this.NewNode("Foreach");
                    	this.TestNext("POPEN","Bracket");
			this.Next(2);
			Node.Write("Names",this.IdentifierList());
			if(this.CheckNext("IN","Keyword")){
				this.Next();
				Node.Write("Type","In");
			}else if(this.CheckNext("OF","Keyword")){
				this.Next();
				Node.Write("Type","Of");
			}else if(this.CheckNext("AS","Keyword")){
				this.Next();
				Node.Write("Type","As");
			}else{
				this.ErrorIfEOS();
				ErrorHandler.AError(this,"Expected","as, of, in keywords",`${this.Token.Type.ToLowerCase} ${this.Token.RawValue}`);
			}
			this.Next();
			this.Write("Iterator",this.ParseExpression());
			this.TestNext("PCLOSE","Bracket");
			this.Next(2);
			this.Write("Body",this.ParseBlock());
                    return Node;
                },
            },
        	/*
        	{
            	Value:"Value",
                Type:"Type",
                Call:function(){
                	let Node = this.NewNode("Type");
                    
                    return Node;
                },
            },
            */
        ],
        Expressions:[
        	{
                Type:"Constant",
                Stop:false,
                Call:function(Priority){
                    return [this.Token.Value,Priority];
                },
            },
            {
                Type:"Bool",
                Stop:false,
                Call:function(Priority){
                    return [this.Token.Value,Priority];
                },
            },
            {
                Type:"Null",
                Stop:false,
                Call:function(Priority){
                    return [this.Token.Value,Priority];
                },
            },
            {
                Type:"Identifier",
                Stop:false,
                Call:function(Priority){
                	let Node = this.NewNode("GetVariable");
                    Node.Write("Name",this.Token.Value);
                    return [Node,Priority];
                },
            },
            {
                Value:"POPEN",
                Type:"Bracket",
                Stop:false,
                Call:function(Priority){
                	this.Next();
                    if(AST.IsToken(this.Token,"PCLOSE","Bracket")){
                        ErrorHandler.AError(this,"Expected","expression inside ()","none");
                    }
                    let Result = this.ParseExpression(-1,true);
                    this.TestNext("PCLOSE","Bracket");
			this.Next();
                    return [Result,Priority];
                },
            },
            {
                Value:"NOT",
                Type:"Operator",
                Stop:false,
                Call:function(Priority){
                	this.Next();
                    let Node = this.NewNode("Not");
                    Node.Write("V1",this.ParseExpression(400));
                    return [Node,Priority];
                },
            },
            {
                Value:"SUB",
                Type:"Operator",
                Stop:false,
                Call:function(Priority){
                	this.Next();
                    let Node = this.NewNode("Negative");
                    Node.Write("V1",this.ParseExpression(400));
                    return [Node,Priority];
                },
            },
        	/*
        	{
            	Value:"Value",
                Type:"Type",
                Stop:false,
                Call:function(Priority){
                	let Node = this.NewNode("Type");
                    
                    return [Node,Priority];
                },
            },
            */
        ],
        ComplexExpressions:[
        	{
            	Value:"SUB",
                Type:"Operator",
                Stop:false,
                Priority:300,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Sub");
                   	Node.Write("V1",Value);
                    Node.Write("V2",this.ParseExpression(Priority));
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"ADD",
                Type:"Operator",
                Stop:false,
                Priority:320,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Add");
                   	Node.Write("V1",Value);
                    Node.Write("V2",this.ParseExpression(Priority));
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"DIV",
                Type:"Operator",
                Stop:false,
                Priority:340,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Div");
                   	Node.Write("V1",Value);
                    Node.Write("V2",this.ParseExpression(Priority));
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"MUL",
                Type:"Operator",
                Stop:false,
                Priority:360,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Mul");
                   	Node.Write("V1",Value);
                    Node.Write("V2",this.ParseExpression(Priority));
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"POW",
                Type:"Operator",
                Stop:false,
                Priority:380,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Pow");
                   	Node.Write("V1",Value);
                    Node.Write("V2",this.ParseExpression(Priority));
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"MOD",
                Type:"Operator",
                Stop:false,
                Priority:340,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Mod");
                   	Node.Write("V1",Value);
                    Node.Write("V2",this.ParseExpression(Priority));
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"PERCENTOF",
                Type:"Operator",
                Stop:false,
                Priority:390,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("PercentOf");
                   	Node.Write("V1",Value);
                    Node.Write("V2",this.ParseExpression(Priority));
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"FLOORDIV",
                Type:"Operator",
                Stop:false,
                Priority:340,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("FloorDiv");
                   	Node.Write("V1",Value);
                    Node.Write("V2",this.ParseExpression(Priority));
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"IOPEN",
                Type:"Bracket",
                Stop:false,
                Priority:700,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("GetIndex");
                   	Node.Write("Object",Value);
                    Node.Write("Index",this.ParseExpression());
                    this.TestNext("ICLOSE","Bracket");
                    this.Next();
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"DOT",
                Type:"Operator",
                Stop:false,
                Priority:700,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("GetIndex");
                   	Node.Write("Object",Value);
                    if(this.Token.Type!="Identifier"&&this.Token.Type!="Keyword"){
                    	ErrorHandler.AError(this,"Expected","identifier for index name",this.Token.RawValue);
                    }
                    Node.Write("Index",this.Token.RawValue);
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"EQ",
                Type:"Assignment",
                Stop:false,
                Priority:50,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Assignment");
                    Node.Write("Type",0);
                   	Node.Write("Name",Value);
                    Node.Write("Value",this.ParseExpression());
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"ADDEQ",
                Type:"Assignment",
                Stop:false,
                Priority:50,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Assignment");
                    Node.Write("Type",1);
                   	Node.Write("Name",Value);
                    Node.Write("Value",this.ParseExpression());
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"SUBEQ",
                Type:"Assignment",
                Stop:false,
                Priority:50,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Assignment");
                    Node.Write("Type",2);
                   	Node.Write("Name",Value);
                    Node.Write("Value",this.ParseExpression());
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"MULEQ",
                Type:"Assignment",
                Stop:false,
                Priority:50,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Assignment");
                    Node.Write("Type",3);
                   	Node.Write("Name",Value);
                    Node.Write("Value",this.ParseExpression());
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"DIVEQ",
                Type:"Assignment",
                Stop:false,
                Priority:50,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Assignment");
                    Node.Write("Type",4);
                   	Node.Write("Name",Value);
                    Node.Write("Value",this.ParseExpression());
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"MODEQ",
                Type:"Assignment",
                Stop:false,
                Priority:50,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Assignment");
                    Node.Write("Type",5);
                   	Node.Write("Name",Value);
                    Node.Write("Value",this.ParseExpression());
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"POWEQ",
                Type:"Assignment",
                Stop:false,
                Priority:50,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Assignment");
                    Node.Write("Type",6);
                   	Node.Write("Name",Value);
                    Node.Write("Value",this.ParseExpression());
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"FLOORDIVEQ",
                Type:"Assignment",
                Stop:false,
                Priority:50,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Assignment");
                    Node.Write("Type",7);
                   	Node.Write("Name",Value);
                    Node.Write("Value",this.ParseExpression());
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"PERCENTOFEQ",
                Type:"Assignment",
                Stop:false,
                Priority:50,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Assignment");
                    Node.Write("Type",8);
                   	Node.Write("Name",Value);
                    Node.Write("Value",this.ParseExpression());
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"EQS",
                Type:"Operator",
                Stop:false,
                Priority:200,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Eqs");
                   	Node.Write("V1",Value);
                    Node.Write("V2",this.ParseExpression(Priority));
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"LT",
                Type:"Operator",
                Stop:false,
                Priority:200,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Lt");
                   	Node.Write("V1",Value);
                    Node.Write("V2",this.ParseExpression(Priority));
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"LEQ",
                Type:"Operator",
                Stop:false,
                Priority:200,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Leq");
                   	Node.Write("V1",Value);
                    Node.Write("V2",this.ParseExpression(Priority));
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"GT",
                Type:"Operator",
                Stop:false,
                Priority:200,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Gt");
                   	Node.Write("V1",Value);
                    Node.Write("V2",this.ParseExpression(Priority));
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"GEQ",
                Type:"Operator",
                Stop:false,
                Priority:200,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Geq");
                   	Node.Write("V1",Value);
                    Node.Write("V2",this.ParseExpression(Priority));
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"NEQ",
                Type:"Operator",
                Stop:false,
                Priority:200,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Neq");
                   	Node.Write("V1",Value);
                    Node.Write("V2",this.ParseExpression(Priority));
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"AND",
                Type:"Operator",
                Stop:false,
                Priority:150,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("And");
                   	Node.Write("V1",Value);
                    Node.Write("V2",this.ParseExpression(Priority));
                    return new ASTExpression(Node,Priority);
                },
            },
            {
            	Value:"OR",
                Type:"Operator",
                Stop:false,
                Priority:151,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Node = this.NewNode("Or");
                   	Node.Write("V1",Value);
                    Node.Write("V2",this.ParseExpression(Priority));
                    return new ASTExpression(Node,Priority);
                },
            },
		{
            	Value:"POPEN",
                Type:"Bracket",
                Stop:false,
                Priority:1000,
                Call:function(Value,Priority){
			this.Next();
                	let Node = this.NewNode("Call");
                   	Node.Write("Call",Value);
                    Node.Write("Arguments",this.ExpressionListInside({Value:"POPEN",Type:"Bracket"},{Value:"PCLOSE",Type:"Bracket"}));
                    return new ASTExpression(Node,Priority);
                },
            },
		{
            	Value:"INC",
                Type:"Operator",
                Stop:false,
                Priority:50,
                Call:function(Value,Priority){
                	this.Next();
                	let Node = this.NewNode("Assignment");
			Node.Write("Type",9);
                   	Node.Write("Name",Value);
			Node.Write("Value",null);
                    return new ASTExpression(Node,Priority);
                },
            },
		{
            	Value:"DEINC",
                Type:"Operator",
                Stop:false,
                Priority:50,
                Call:function(Value,Priority){
                	this.Next();
                	let Node = this.NewNode("Assignment");
			Node.Write("Type",10);
                   	Node.Write("Name",Value);
			Node.Write("Value",null);
                    return new ASTExpression(Node,Priority);
                },
            },
        	/*
        	{
            	Value:"Value",
                Type:"Type",
                Stop:false,
                Priority:0,
                Call:function(Value,Priority){
                	let Node = this.NewNode("Type");
                    
                    return Node;
                },
            },
            */
        ],
    };
    
    class ASTExpression {
    	constructor(Value,Priority){
        	this.Value=Value,
            this.Priority=Priority;
        }
    }
    
    class ASTStack {
    	constructor(TStack){
        	this.TStack=TStack,
            this.Tokens=TStack.Tokens,
            this.Lines=TStack.Lines,
            this.Line=0,
            this.Index=0,
            this.Position=0,
            this.Result=this.NewBlock("Chunk"),
            this.Chunk=this.Result,
            this.OpenChunks=[],
            this.Token=TStack.Tokens[0];
        }
        OpenChunk(){
        	this.OpenChunks.push(this.Chunk);
            this.Chunk=this.NewBlock("Chunk");
        }
        ChunkWrite(Value){
        	this.Chunk.Write(Value);
        }
        CloseChunk(){
        	if(this.OpenChunks.length>0){
            	let Previous = Stack.Chunk;
                Stack.Chunk = Stack.OpenChunks.pop();
                Stack.Chunk.Write(Previous);
            }
        }
        Next(Amount=1){
        	this.Position+=Amount;
            this.Token=this.Tokens[this.Position];
            if(this.Token)
            	this.Line=this.Token.Line,
                this.Index=this.Token.Index;
            return this.Token;
        }
        IsEnd(){
        	return this.Position>=this.Tokens.length;
        }
        NewNode(Type){
        	return new ASTNode(this,Type);
        }
        NewBlock(Type){
        	return new ASTBlock(this,Type);
        }
        CheckNext(Value,Type){
        	let Token=this.Next();
            this.Next(-1);
        	return AST.IsToken(Token,Value,Type);
        }
        TypeCheckNext(Type){
        	let Token=this.Next();
            this.Next(-1);
        	return AST.IsType(Token,Type);
        }
        TestNext(Value,Type){
        	if(!this.CheckNext(Value,Type)){
            	let Token=this.Next();
            	this.Next(-1);
                if(Token)ErrorHandler.AError(this,"Expected",`${Type.toLowerCase()} ${Tokenizer.ValueFromName(Value,Type)}`,`${Token.Type.toLowerCase()} ${Token.RawValue}`);	
                else ErrorHandler.AError(this,"Expected",`${Type.toLowerCase()} ${Tokenizer.ValueFromName(Value,Type)}`,"end of script");
            }
        }
        TypeTestNext(Type){
        	if(!this.TypeCheckNext(Type)){
            	let Token=this.Next();
            	this.Next(-1);
                if(Token)ErrorHandler.AError(this,"Expected",Type.toLowerCase(),Token.Type.toLowerCase());	
                else ErrorHandler.AError(this,"Expected",Type.toLowerCase(),"end of script");
            }
        }
        ParseComplexExpression(Expression){
        	if(!(Expression instanceof ASTExpression)){
            	return Expression;
            }
            let Priority=Expression.Priority,
            	Next=this.Tokens[this.Position+1];
            if(!Next)return Expression.Value;
            if(AST.IsToken(Next,"LINEEND","Operator"))return Expression.Value;
            for(let Complex of AST.ComplexExpressions){
            	if(!AST.IsToken(Next,Complex.Value,Complex.Type))continue;
                if(Expression.Priority<=Complex.Priority){
                	Expression=Complex.Call.bind(this)(Expression.Value,Complex.Priority);
                    Expression.Priority=Priority;
                    if(Complex.Stop===true)break;
                    let Result = this.ParseComplexExpression(Expression);
                    Expression = new ASTExpression(Result,Expression.Priority);
                    return Expression.Value;
                }
            }
            return Expression.Value;
        }
        ParseExpression(Priority=-1,AllowComma=false){
        	let Token = this.Token;
            let Result = undefined;
            for(let Chunk of AST.Expressions){
                let Do = false;
                if(Chunk.Value){
                	Do=AST.IsToken(Token,Chunk.Value,Chunk.Type);
                }else{
                	Do=AST.IsType(Token,Chunk.Type);
                }
                if(Do){
                	let [R,P] = Chunk.Call.bind(this)(Priority);
                    Result=R;
                    Priority=P;
                    if(Chunk.Stop===true)return Result;
                    break;
                }
            }
            if(AllowComma===true){
            	if(this.CheckNext("COMMA","Operator")){
                	let List=[Result];
                    while(this.CheckNext("COMMA","Operator")){
                    	this.Next(2);
                        List.push(this.ParseExpression(Priority,false));
                        if(this.IsEnd())break;
                    }
                    Result=this.NewNode("CommaExpression");
                    Result.Write("List",List);
                    return Result;
                }
            }
            if(Result===undefined){
            	ErrorHandler.AError(this,"Unexpected",`${this.Token.Type.toLowerCase()} ${this.Token.RawValue}`);
            }
            return this.ParseComplexExpression(new ASTExpression(Result,Priority));
        }
        ParseFullExpression(Priority=-1,AllowComma=false){
        	let Result = this.ParseExpression(Priority,AllowComma);
            if(this.CheckNext("LINEEND","Operator")){
            	this.Next();
            }
            return Result;
        }
        ExpressionList(Priority){
            let List = [];
            do{
                List.push(this.ParseExpression(Priority));
		if(this.CheckNext("COMMA","Operator")){
			this.Next(2);
			continue;
		}
                break;
            }while(true);
            return List;
        }
	    ErrorIfEOS(){
		    if(this.IsEnd())ErrorHandler.AError(this,"Unexpected","end of script");    
	    }
	ExpressionListInside(Start,End,Priority){
		if(AST.IsToken(this.Token,Start.Value,Start.Type)){
			this.Next();
			let List = this.ExpressionList(Priority);
			this.TestNext(End.Value,End.Type);
			this.Next();
			return List;
		}else{
			this.ErrorIfEOS();
			ErrorHandler.AError(this,"Expected",`${Start.Type.toLowerCase} ${Start.Value}`,`${this.Token.Type.toLowerCase} ${this.Token.Value}`);	
		}
	}
	ExpressionInside(Start,End,Priority,AllowComma){
		if(AST.IsToken(this.Token,Start.Value,Start.Type)){
			this.Next();
			let List = this.ParseExpression(Priority,AllowComma);
			this.TestNext(End.Value,End.Type);
			this.Next();
			return List;
		}else{
			this.ErrorIfEOS();
			ErrorHandler.AError(this,"Expected",`${Start.Type.toLowerCase} ${Start.Value}`,`${this.Token.Type.toLowerCase} ${this.Token.Value}`);	
		}
	}
	IdentifierList(Options={}){
		let List = [];
		do{
			let Token = this.Token;
			this.ErrorIfEOS();
			if(!AST.IsType(Token,"Identifier")){
				ErrorHandler.AError(this,"Expected","identifier",Token.Type.toLowerCase());	
			}
			let Identifier = {
				Name:Token.Value,
				Value:undefined,
				Type:undefined,
			}
			if(Options.AllowDefault===true){
				this.TestNext("EQ","Assignment");
				this.Next(2);
				Identifier.Value = this.ParseExpression(Options.Priority);
			}
			List.push(Identifier);
			if(this.CheckNext("COMMA","Operator")){
				this.Next(2);
				continue;
			}
			break;
		}while(true);
		return List;
	}
	    ParseBlock(){
		    let Token = this.Token;
		    this.OpenChunk();
		    let Block = this.Chunk;
		    if(AST.IsToken(Token,"BOPEN","Bracket")){
			    this.Next();
			    while(!AST.IsToken(this.Token,"BCLOSE","Bracket")){
				    this.ParseChunk();
				    this.Next();
				    if(this.IsEnd()){
					    ErrorHandler.AError(this,"Unexpected","end of script while parsing code block");
				    	    break;
				    }    
			    }
		    }else{
			    this.ParseChunk();
		    }
		    this.Chunk=this.OpenChunks.pop();
		    return Block;
	    }
	SkipLineEnd(){
		if(this.CheckNext("LINEEND","Operator")){
                    	this.Next();
                    }
	}
	ParseSpecificChunk(Value,Type){
		let Token = this.Token;
		for(let Chunk of AST.Chunks){
			if(Chunk.Type===Type&&Chunk.Value===Value){
				if(AST.IsToken(Token,Chunk.Value,Chunk.Type)){
					return Chunk.Call.bind(this)();
				}else{
					this.ErrorIfEOS();
					ErrorHandler.AError(this,"Expected",`${Type.toLowerCase()} ${Tokenizer.ValueFromName(Value)}`,`${Token.Type.toLowerCase()} ${Token.RawValue}`);	
				}
			}
		}
	}
	ParseRChunk(){
		let Token = this.Token;
		for(let Chunk of AST.Chunks){
			if(AST.IsToken(Token,Chunk.Value,Chunk.Type)){
				return Chunk.Call.bind(this)();
			}
		}
	}
        ParseChunk(){
        	let Token = this.Token;
            for(let Type in AST.Chunks){
            	let Chunk = AST.Chunks[Type];
                if(AST.IsToken(Token,Chunk.Value,Chunk.Type)){
                	let Result = Chunk.Call.bind(this)();
                    this.SkipLineEnd();
                    this.ChunkWrite(Result);
                    return;
                }
            }
            let Result = this.ParseFullExpression(-1,true);
            if(Result===undefined){
            	ErrorHandler.AError(this,"Unexpected",`${this.Token.Type.toLowerCase()} ${this.Token.RawValue}`);
            }
            this.ChunkWrite(Result);
        }
        Parse(){
        	while(!this.IsEnd()){
            	this.ParseChunk();
                this.Next();
            }
        }
    }
    
    //-- Interpreter --\\
    
    class IState {
    	constructor(Tokens,Parent,Data={}){
        	this.Tokens=Tokens,
            this.Token=Tokens.Data[0],
            this.Parent=Parent,
            this.Data={
            	InFunction:false,
                IsFunction:false,
                InLoop:false,
                IsLoop:false,
                Returned:false,
                Return:undefined,
                Stopped:false,
                Continued:false,
            },
            this.Variables=[],
            this.Children=[],
            this.Position=0;
            for(let k in Data)this.Data[k]=Data[k];
            if(Parent&&Parent instanceof IState){
            	Parent.Children.push(this);
            }
        }
        Write(Name,Value){
        	this.Data[Name]=Value;
            if(this.Parent){
            	if(Name==="Returned"||Name==="Return"){
                	if(!this.Read("IsFunction")){
                    	this.Parent.Write(Name,Value);
                    }
                }else if(Name==="Stopped"){
                	if(!this.Read("IsLoop")){
                    	this.Parent.Write(Name,Value);
                    }
                }else if(Name==="Continued"){
			if(!this.Read("IsLoop")){
				this.Parent.Write(Name,Value);	
			}
		}
            }
        }
        Read(Name){
        	return this.Data[Name];
        }
        Next(Amount=1){
        	this.Position+=Amount;
            this.Token=this.Tokens.Data[this.Position];
            return this.Token;
        }
        IsEnd(){
        	return this.Position>=this.Tokens.Data.length;
        }
        Close(){
        	if(this.Parent){
            	this.Parent.Children.splice(this.Parent.Children.indexOf(this),1);
            }
            let Variables = this.GetAllGlobalVariables();
            for(let Child of this.Children){
            	for(let Variable of Variables){
                	this.TransferVariable(Child,Variable);
                }
                Child.Parent = undefined;
            }
            this.Variables=[];
        }
        TransferVariable(To,Variable){
        	if(!To.IsVariable(Variable.Name)){
            	To.Variables.push(Variable);
            }
        }
        GetAllGlobalVariables(){
        	let Variables = [];
            let Search = this;
            while(Search){
            	for(let Variable of Search.Variables){
                	Variables.push(Variable);
                }
            	Search=Search.Parent;
            }
            return Variables;
        }
       	GetRawVariable(Name){
        	for(let Variable of this.Variables){
            	if(Variable.Name===Name){
                	return Variable;
                }
            }
        }
        IsVariable(Name){
        	return !!this.GetRawVariable(Name);
        }
        VariablePrototype(Name,Value){
        	return {
            	Name:Name,
                Value:Value,
            };
        }
        GetGlobalRawVariable(Name){
        	let Variable = this.GetRawVariable(Name);
            if(!Variable&&this.Parent){
            	Variable = this.Parent.GetGlobalRawVariable(Name);
            }
            return Variable;
        }
        GetVariable(Name){
        	if(this.IsVariable(Name)){
            	return this.GetRawVariable(Name).Value;
            }else if(this.Parent){
            	return this.Parent.GetVariable(Name);
            }
        }
        SetVariable(Name,Value){
        	if(this.IsVariable(Name)){
            	let Variable = this.GetRawVariable(Name);
                Variable.Value = Value;
            }else if(this.Parent){
            	this.Parent.SetVariable(Name,Value);
            }else{
            	this.NewVariable(Name,Value);
            }
        }
        NewVariable(Name,Value,Extra={}){
        	let Variable = this.VariablePrototype(Name,Value);
            for(let k in Extra)Variable[k]=Extra[k];
            if(this.IsVariable(Name)){
            	this.DeleteVariable(Name,true);
            }
            this.Variables.push(Variable);
        }
        DeleteVariable(Name,Local=false){
        	if(this.IsVariable(Name)){
            	for(let Key in this.Variables){
                	Key=+Key;
                    let Variable = this.Variables[Key];
                    if(Variable.Name===Name){
                    	this.Variables.splice(Key,1);
                        break;
                    }
                }
            }else if(this.Parent&&!Local){
            	this.Parent.DeleteVariable(Name);
            }
        }
    }
    
    const Interpreter = {
    	NewStack:function(AStack,Environment,IsEvaluation){
        	return new InterpreterStack(AStack,Environment,IsEvaluation);
        },
        AssignmentStates:{
        	0:(a,b)=>b,
            1:(a,b)=>a+b,
            2:(a,b)=>a-b,
            3:(a,b)=>a*b,
            4:(a,b)=>a/b,
            5:(a,b)=>a%b,
            6:(a,b)=>a**b,
            7:(a,b)=>Math.floor(a/b),
            8:(a,b)=>(b/100)*a,
		9:(a,b)=>a+1,
		10:(a,b)=>a-1,
        },
    	ParseStates:{
        	"GetVariable":function(State,Token){
            	return State.GetVariable(Token.Read("Name"));
            },
		"NewVariable":function(State,Token){
			let Variables = Token.Read("Variables");
			let Append = State;
			if(Token.Read("Type")==="Upvar"&&State.Parent){
			   	Append=State.Parent;
			   }
			for(let Variable of Variables){
				let Name = Variable.Name;
				let Value = this.Parse(State,Variable.Value);
				let IsConstant = Variable.Constant;
				Append.NewVariable(Name,Value,{
					Constant:IsConstant,
				});
			};
		},
            "Assignment":function(State,Token){
            	let Name = Token.Read("Name");
                let Value = this.Parse(State,Token.Read("Value"));
                let Call = Interpreter.AssignmentStates[Token.Read("Type")];
                if(Name instanceof ASTBase){
                	if(Name.Type==="GetVariable"){
                    	Name = Name.Read("Name");
			let Variable = State.GetGlobalRawVariable(Name);
			if(Variable.Constant===true){
				ErrorHandler.IError(Token,"Attempt",`modify constant variable ${Variable.Name}`);	
			}
			let Previous = Variable.Value;
                        State.SetVariable(Name,Call(Variable.Value,Value));
			return Token.Read("Type")>=9?Previous:Variable.Value;
                    }else if(Name.Type==="GetIndex"){
                    	let Object = this.Parse(State,Name.Read("Object")),
                        	Index = this.Parse(State,Name.Read("Index")),
                            ObjectValue=Object[Index];
                        Object[Index]=Call(ObjectValue,Value);
                        return Object[Index];
                    }else{
                    	ErrorHandler.IError(Token,"Unexpected","assignment operator");
                    }
                }else{
                	ErrorHandler.IError(Token,"Unexpected","assignment operator");
                }
            },
            "Add":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1")),
                	V2 = this.Parse(State,Token.Read("V2"));
                return V1+V2;
            },
            "Sub":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1")),
                	V2 = this.Parse(State,Token.Read("V2"));
                return V1-V2;
            },
            "Mul":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1")),
                	V2 = this.Parse(State,Token.Read("V2"));
                return V1*V2;
            },
            "Div":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1")),
                	V2 = this.Parse(State,Token.Read("V2"));
                return V1/V2;
            },
            "Mod":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1")),
                	V2 = this.Parse(State,Token.Read("V2"));
                return V1%V2;
            },
            "Pow":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1")),
                	V2 = this.Parse(State,Token.Read("V2"));
                return V1**V2;
            },
            "FloorDiv":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1")),
                	V2 = this.Parse(State,Token.Read("V2"));
                return Math.floor(V1/V2);
            },
            "PercentOf":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1")),
                	V2 = this.Parse(State,Token.Read("V2"));
                return (V1/100)*V2;
            },
            "Eqs":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1")),
                	V2 = this.Parse(State,Token.Read("V2"));
                return V1==V2;
            },
            "Leq":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1")),
                	V2 = this.Parse(State,Token.Read("V2"));
                return V1<=V2;
            },
            "Lt":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1")),
                	V2 = this.Parse(State,Token.Read("V2"));
                return V1<V2;
            },
            "Geq":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1")),
                	V2 = this.Parse(State,Token.Read("V2"));
                return V1>=V2;
            },
            "Gt":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1")),
                	V2 = this.Parse(State,Token.Read("V2"));
                return V1>V2;
            },
            "Neq":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1")),
                	V2 = this.Parse(State,Token.Read("V2"));
                return V1!=V2;
            },
            "And":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                if(V1){
                    let V2 = this.Parse(State,Token.Read("V2"));
                    return V1&&V2;
                }else{
                    return false;
                }
            },
            "Or":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                if(V1){
                    return V1;
                }else{
                    let V2 = this.Parse(State,Token.Read("V2"));
                    return V1||V2;
                }
            },
            "Not":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                return !V1;
            },
		"Negative":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                return -V1;
            },
            "GetIndex":function(State,Token){
                let Object = this.Parse(State,Token.Read("Object")),
                    Index = this.Parse(State,Token.Read("Index")),
                    Value = Object[Index];
                if(Value instanceof Function){
                	Value = Value.bind(Object);
                }
                return Value;
            },
		"Call":function(State,Token){
			let Call = this.Parse(State,Token.Read("Call"));
			let Arguments = this.ParseArray(State,Token.Read("Arguments"));
			if(!(Call instanceof Function)){
				ErrorHandler.IError(Token,"Attempt","call non-function");
			}
			return Call(...Arguments);
		},
		"If":function(State,Token){
			let Expression = this.Parse(State,Token.Read("Expression"));
			let Conditions = Token.Read("Conditions");
			if(Expression){
				let NewState = new IState(Token.Read("Body"),State);
				this.ParseState(NewState);
			}else if(Conditions.length>0){
				for(let Condition of Conditions){
					if(Condition.Type==="Elif"){
						let CExpression = this.Parse(State,Condition.Read("Expression"));
						if(CExpression){
							let NewState = new IState(Condition.Read("Body"),State);	
							this.ParseState(NewState);
							break;
						}
					}else if(Condition.Type==="Else"){
						let NewState = new IState(Condition.Read("Body"),State);
						this.ParseState(NewState);
						break;
					}
				}
			}
		},
		"While":function(State,Token){
			let Expression = Token.Read("Expression");
			let Body = Token.Read("Body");
			while(this.Parse(State,Expression)){
				let NewState = new IState(Body,State,{InLoop:true,IsLoop:true});
				this.ParseState(NewState);
				if(!NewState.Read("InLoop"))break;
			}
		},
		"Repeat":function(State,Token){
			let Amount = this.Parse(State,Token.Read("Amount"));
			let Body = Token.Read("Body");
			let Name = Token.Read("Name");
			for(let i=1;i<=Amount;i++){
				let NewState = new IState(Body,State,{InLoop:true,IsLoop:true});
				if(Name!==undefined)NewState.NewVariable(Name,i);
				this.ParseState(NewState);
				if(!NewState.Read("InLoop"))break;	
			}
		},
		"For":function(State,Token){
			let _State = new IState({Data:[],Line:Token.Line,Index:Token.Index},State);
			this.Parse(_State,Token.Read("Variable"));
			let Body = Token.Read("Body");
			let Condition = Token.Read("Condition");
			let Increment = Token.Read("Increment");
			while(this.Parse(_State,Condition)){
				let NewState = new IState(Body,_State,{InLoop:true,IsLoop:true});
				this.ParseState(NewState);
				if(!NewState.Read("InLoop"))break;
				this.Parse(_State,Increment);
			}
		},
		"Foreach":function(State,Token){
			let Body = Token.Read("Body");
			let Names = Token.Read("Name");
			let Iterator = this.Parse(State,Token.Read("Iterator"));
			let Type = Token.Read("Type");
			for(let k in Iterator){
				let v = Iterator[k];
				let NewState = new IState(Body,State,{InLoop:true,IsLoop:true});
				if(Type==="In"){
					NewState.NewVariable(Names[0].Name,k);	
				}else if(Type==="Of"){
					NewState.NewVariable(Names[0].Name,v);	
				}else if(Type==="As"){
					let Vars=[k,v];
					for(let x in Vars){
						let n = Names[x];
						if(!n)break;
						NewState.NewVariable(n.Name,Vars[x])
					}
				}
				this.ParseState(NewState);
				if(!NewState.Read("InLoop"))break;	
			}
		},
        },
    };
    
    class UnpackState {
    	constructor(List){
        	this.List=List;
        }
    }
    
    class InterpreterStack {
    	constructor(AStack,Environment,IsEvaluation=false){
        	this.AStack=AStack,
            this.Tokens=AStack.Result,
            this.MainState=new IState(this.Tokens),
            this.Evaluation=undefined,
            this.IsEvaluation=IsEvaluation,
            this.Environment=Environment;
            for(let Name in Environment)this.MainState.NewVariable(Name,Environment[Name]);
            this.ParseStates={};
            for(let Name in Interpreter.ParseStates)this.ParseStates[Name]=Interpreter.ParseStates[Name].bind(this);
        }
	ParseArray(State,List){
		let Result = [];
		for(let k in List){
			let v = List[k];
			let r;
			if(typeof v==="object"&&!(v instanceof ASTBase)){
				r=this.ParseArray(State,v);	
			}else{
				r=this.Parse(State,v,true);	
			}
			if(r instanceof UnpackState){
				for(let x of r.List){
					Result.push(x);	
				}
			}else{
				Result.push(r);	
			}
		}
		return Result;
	}
        Parse(State,Token,Unpack=false){
        	if(!(Token instanceof ASTBase))return Token;
            for(let Name in this.ParseStates){
            	let Call = this.ParseStates[Name];
                if(Token.Type===Name){
                	return Call(State,Token);
                }else if(Token.Type==="UnpackArray"){
                	if(Unpack===true){
                    	return new UnpackState(this.Parse(State,Token.Read("V1"),true));
                    }else ErrorHandler.IError(Token,"Unexpected","unpacking operator");
                }
            }
        }
        ParseState(State,Unpack=false){
        	while(!State.IsEnd()){
            	let Result = this.Parse(State,State.Token,Unpack);
                if(this.IsEvaluation){
                	this.Evaluation = Result;
                }
                State.Next();
                if(State.Read("Returned")===true){
                	State.Write("InLoop",false);
                    break;
                }
                if(State.Read("Stopped")===true){
                	State.Write("InLoop",false);
                    break;
                }
                if(State.Read("Continued")===true)break;
            }
            State.Close();
        }
    }
    
    //-- Language Setup --\\
    
    return function(Code="",Library={},Settings={}){
    	const CodeResult = {Success:false,Error:undefined,Result:undefined};
    	try{
        	//-- Token --\\
            const TokenizerStack = Tokenizer.NewStack(Code);
            TokenizerStack.Tokenize();
            if(Settings.PrintTokens===true){
            	DebugLog(TokenizerStack.Tokens.join("<br>"));
            }	
            //-- AST --\\
            let AStack = AST.NewStack(TokenizerStack);
            AStack.Parse();
            if(Settings.PrintAST===true){
            	DebugLog(AStack.Result.toString());
            }
            //-- Interpret --\\
            let IStack = Interpreter.NewStack(AStack,Library,true);
            IStack.ParseState(IStack.MainState);
            //-- Finish --\\
            CodeResult.Success = true;
           	CodeResult.Result = IStack.Evaluation;
        }catch(Error){
        	CodeResult.Success = false;
            CodeResult.Error = Error.stack;
        }
        return CodeResult;
    }
    
})(true);
