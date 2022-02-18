/*
canvas.js XBS Extension
Adds drawing components to XBS for HTML canvas elements
*/

(()=>{
	
	//{{ Variable References }}\\
	
	const Tokenizer=XBS.Tokenizer,
		  AST=XBS.AST,
		  Interpreter=XBS.Interpreter,
		  ErrorHandler=XBS.ErrorHandler,
		  IState=XBS.IState,
		  ASTBase=XBS.ASTBase,
		  ASTNode=XBS.ASTNode,
		  ASTBlock=XBS.ASTBlock;
	
	function Lerp(a,b,t){
		return (1-t)*a+t*b;
	}
	
	class VectorBase {
		constructor(){
			return this;
		}
		Add(v){return this.Math(v,(a,b)=>a+b)}
		Sub(v){return this.Math(v,(a,b)=>a-b)}
		Mul(v){return this.Math(v,(a,b)=>a*b)}
		Div(v){return this.Math(v,(a,b)=>a/b)}
		Mod(v){return this.Math(v,(a,b)=>a%b)}
		Pow(v){return this.Math(v,(a,b)=>a**b)}
	}

	class Vector extends VectorBase {
		constructor(x=0,y=0){super();this.x=x;this.y=y}
		get X(){return this.x}
		get Y(){return this.y}
		set X(v){return this.x=v}
		set Y(v){return this.y=v}
		toString(){return `${this.x},${this.y}`}
		Math(v,c){let x=v,y=v;if(v instanceof Vector)x=v.x,y=v.y;return new Vector(c(this.x,x),c(this.y,y))}
		get Magnitude(){return Math.sqrt((this.x**2)+(this.y**2))}
		Normalize(){let m = this.Magnitude;return new Vector(this.x/m,this.y/m)}
		NoNan(){let{x,y}=this;return new Vector(isNaN(x)?0:x,isNaN(y)?0:y)}
		Lerp(v,t){return new Vector(Lerp(this.x,v.x,t),Lerp(this.y,v.y,t))}
	}
	
	//{{ Internal AST Functions }}\\
	
	const States = [
		{
			Value:"line",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("Line");
				Stack.Next();
				Node.Write("List",Stack.ParseExpression());
				return Node;
			},
		},
		{
			Value:"stroke",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("Stroke");
				Stack.Next();
				Node.Write("List",Stack.ParseExpression());
				return Node;
			},
		},
		{
			Value:"fill",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("Fill");
				Stack.Next();
				Node.Write("List",Stack.ParseExpression());
				return Node;
			},
		},
		{
			Value:"path",
			Type:"Identifier",
			Call:function(Stack){
				let Node = Stack.NewNode("Path");
				Stack.Next();
				if(AST.IsToken(Stack.Token,"begin","Identifier")){
					Node.Write("Type","Begin");
				}else if(AST.IsToken(Stack.Token,"close","Identifier")){
					Node.Write("Type","Close");	
				}else{
					Stack.ErrorIfEOS();
					ErrorHandler.AError(Stack,"Expected","begin or close for path",`${Stack.Token.RawValue}`);	
				}
				return Node;
			},
		},
	];
	function ParseState(Stack){
		let Result = undefined;
		let Token = Stack.Token;
		for(let State of States){
			if(AST.IsToken(Token,State.Value,State.Type)){
				Result = State.Call(Stack);
				break;
			}
		}
		return Result;
	}
	function ParseBlock(Stack){
		Stack.ErrorIfEOS();
		if(AST.IsToken(Stack.Token,"BOPEN","Bracket")){
			let Block = Stack.NewBlock("CanvasChunk");
			while(!Stack.IsEnd()){
				Stack.ErrorIfEOS();
				if(Stack.CheckNext("BCLOSE","Bracket"))break;
				Stack.Next();
				Block.Write(ParseState(Stack));
				if(this.CheckNext("LINEEND","Operator"))Stack.Next();
			}
			Stack.TestNext("BCLOSE","Bracket");
			Stack.Next();
			return Block;
		}else ErrorHandler.AError(Stack,"Expected","bracket {",`${Stack.Token.Type.toLowerCase()} ${Stack.Token.RawValue}`);
	}
	
	//{{ Internal Interpreter Functions }}\\
	
	const IStates = {
		Line:function(Stack,State,Token){
			let C = State.Context,
				List = Stack.Parse(State,Token.Read("List"));
			let V1 = List[0],
				V2 = List[1];
			if(!(V1 instanceof Vector))ErrorHandler.IError(Token,"Expected","Vector for line v1",Stack.GetType(V1));
			if(!(V2 instanceof Vector))ErrorHandler.IError(Token,"Expected","Vector for line v2",Stack.GetType(V2));
			if(List[2]===null||List[2]===undefined){
				List[2]=1;	
			}
			C.moveTo(V1.x,V1.y);
			C.lineTo(V2.x,V2.y);
			C.lineWidth=List[2];
		},
		Path:function(Stack,State,Token){
			let C = State.Context,
				Type = Token.Read("Type");
			if(Type==="Begin"){
				C.beginPath();	
			}else if(Type==="Close"){
				C.closePath();
			}
		},
		Stroke:function(Stack,State,Token){
			let C = State.Context,
				Style = Stack.Parse(State,Token.Read("Style"));
			if(Style){
				C.strokeStyle = Style;
				C.stroke();	
			}
		},
		Fill:function(Stack,State,Token){
			let C = State.Context,
				Style = Stack.Parse(State,Token.Read("Style"));
			if(Style){
				C.fillStyle = Style;
				C.fill();	
			}
		},
	};
	
	function ParseIState(Stack,State,Token){
		if(!(Token instanceof ASTBase))return Token;
		for(let Name in IStates){
			let Call = IStates[Name];
			if(Token.Type===Name){
				return Call(Stack,State,Token);
			}
		}
		return null;
	}
	
	function ParseCState(Stack,State){
		while(!State.IsEnd()){
			if (State.Read("InAs") === true) {
				if (!this.Parse(State, State.Read("AsExpression"))) {
					break;
				}
			}
			ParseIState(Stack,State,State.Token);
			if (State.Read("Returned") === true) {
				State.Write("InLoop", false);
				break;
			}
			if (State.Read("Stopped") === true) {
				State.Write("InLoop", false);
				break;
			}
			if (State.Read("Continued") === true) break;
			if (State.Read("Exited") === true) break;
		}
		State.Close();
	}
	
	//{{ Canvas Syntax }}\\
	
	XBS.NewToken("CANVAS","cdraw","Keyword");
	XBS.NewASTChunk({
		Value:"CANVAS",
		Type:"Keyword",
		Call:function(){
			let Node = this.NewNode("CanvasDraw");
			this.Next();
			Node.Write("Context",this.ParseExpression());
			this.Next();
			Node.Write("Body",ParseBlock(this));
			return Node;
		}
	});
	XBS.NewInterpreterParseState("CanvasDraw",function(Stack,State,Token){
		const Context = Stack.Parse(State,Token.Read("Context"));
		const Body = Token.Read("Body");
		let NS = new IState(Body,State,{Context:Context});
		NS.NewVariable("Vector",Vector);
		ParseCState(Stack,NS);
	});
})();
