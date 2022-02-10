# XBS

## Questions

### What is XBS?
* XBS is an interpreted programming language written in JavaScript with similar syntax design to the following languages: JavaScript and Python. The syntax design mainly stems from JavaScript rather than Python.

### What is the purpose of XBS
* The purpose for this language is flexible. I mainly wrote this as a fun project to work on, but also to expand my creativity and other aspects of programming.
	XBS can be used in just about any web-based client-side application you need it for.
***
## Notes
* XBS is not finished.
* The wiki is being rewritten.
***
## Features
- [x] Declaring & Updating Variables
- [x] Indexing & Setting Indexes
- [x] Math Operators
- [x] Logical & Conditional Operators
- [x] If Statement
- [x] As Statement
- [x] Define Statement
- [x] Functions
- [x] Varargs & Array Unpacking
- [x] Using Statement
- [x] Calling Functions
- [x] Objects & Arrays
- [x] Pipe & EPipe Operators
- [x] Send, Stop, and Continue Statements
- [x] ACP Operator
- [x] Ternary Operator
- [x] Bitwise Operators
- [x] Unary Negation & Round Operators
- [x] While, For, Foreach, Repeat, Each Loop Statements 
- [x] Destructure Statement
- [x] Comment Syntax 
- [x] Range Operator
- [x] Del & Unset Statements
- [x] Chunk Statement
- [x] Try Statement
- [x] Switch Statement
- [x] In Operator
- [x] Swap Statement 
- [x] Lockvar Statement
- [x] Global Settings
- [x] New Statement
- [x] Exit Statement
- [x] Self-Calling Operator
- [ ] Type System
- [ ] Isa operator
- [ ] Classes
- [ ] Istype Statement
- [ ] Expressional Strings
***
## Using XBS

### Load in HTML

```html
<script src="https://fireyauto.github.io/XBS/src.js"></script>
```

### Run Code

```js
XBS(Code: string, Environment: {}, Settings: { PrintTokens: boolean, PrintAST: boolean });
```
Example:
```js
XBS(`log("Hello, world!");`,{log:(...a)=>document.write(a.join(" "),"<br>")})
```
Returns:
```js
{
	Success: boolean,
	Error: ?string,
	Result: any,
}
```
