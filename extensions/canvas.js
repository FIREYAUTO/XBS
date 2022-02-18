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
	      	IState=XBS.IState;
	
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
				this.Next();
				Block.Write(ParseState(Stack));
				if(this.CheckNext("LINEEND","Operator"))this.Next();
			}
			Stack.TestNext("BCLOSE","Bracket");
			Stack.Next();
			return Block;
		}else ErrorHandler.AError(Stack,"Expected","bracket {",`${Stack.Token.Type.toLowerCase()} ${Stack.Token.RawValue}`);
	}
	
	//{{ Internal Interpreter Functions }}\\
	
	const IStates = {
		Line:function(Stack,State,Token){
			
		},
	};
	
	function ParseIState(Stack,State,Token){
		
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
			Node.Write("Body",ParseBlock(this));
			return Node;
		}
	});
	XBS.NewInterpreterParseState("CanvasDraw",function(Stack,State,Token){
		const Context = Stack.Parse(State,Token.Read("Context"));
		const Body = Token.Read("Body");
		let NS = new IState(Body,State,{Context:Context});
		ParseCState(Stack,NS);
	});
})();
