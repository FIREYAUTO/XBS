/*
canvas.js XBS Extension
Adds drawing components to XBS for HTML canvas elements
*/

(()=>{
	//{{ Internal Functions }}\\
	const States = [
		{
			Value:"line",
			Type:"Identifier",
			Call:function(Stack){
				
			},
		},
	];
	function ParseBlock(Stack){
		let Block = Stack.NewBlock("CanvasChunk");
		
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
