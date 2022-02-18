/*
canvas.js XBS Extension
Adds drawing components to XBS for HTML canvas elements
*/

(()=>{
	//{{ Variable References }}\\
	const Tokenizer=XBS.Tokenizer,
		AST=XBS.AST,
		Interpreter=XBS.Interpreter,
		ErrorHandler=XBS.ErrorHandler;
	
	//{{ Internal AST Functions }}\\
	const States = [
		{
			Value:"line",
			Type:"Identifier",
			Call:function(Stack){
				
			},
		},
	];
	function ParseState(Stack){
		let Result = undefined;
		let Token = Stack.Token;
		for(let State of States){
			if(){
				
			}
		}
		return Result;
	}
	function ParseBlock(Stack){
		Stack.ErrorIfEOS();
		if(AST.IsToken(Stack.Token,"BOPEN","")){
			let Block = Stack.NewBlock("CanvasChunk");
			while(!Stack.IsEnd()){
				Stack.ErrorIfEOS();
				if(Stack.CheckNext("BCLOSE","Bracket"))break;
				this.Next();
				Block.Write(ParseState(Stack));
			}
			Stack.TestNext("BCLOSE","Bracket");
			Stack.Next();
			return Block;
		}else ErrorHandler.AError(Stack,"Expected","bracket {",`${Stack.Token.Type.toLowerCase()} ${Stack.Token.RawValue}`);
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
})();
