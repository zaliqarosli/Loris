/* parser generated by jison 0.4.17 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var jsLogicParser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,15],$V1=[1,16],$V2=[1,17],$V3=[1,7],$V4=[1,5],$V5=[1,9],$V6=[1,4],$V7=[1,3],$V8=[1,10],$V9=[1,11],$Va=[1,12],$Vb=[1,13],$Vc=[1,14],$Vd=[1,19],$Ve=[1,20],$Vf=[1,21],$Vg=[1,22],$Vh=[1,23],$Vi=[1,24],$Vj=[1,25],$Vk=[1,26],$Vl=[1,27],$Vm=[1,28],$Vn=[1,29],$Vo=[1,30],$Vp=[1,31],$Vq=[1,32],$Vr=[1,33],$Vs=[5,7,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,34],$Vt=[5,7,18,31,32],$Vu=[5,7,18,19,20,21,22,23,24,31,32],$Vv=[5,7,18,19,20,21,22,23,24,25,26,31,32],$Vw=[5,7,18,19,20,21,22,23,24,25,26,27,28,31,32],$Vx=[1,61];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"e":4,"EOF":5,"arguments":6,",":7,"variable":8,"VARIABLE":9,"constant":10,"E":11,"PI":12,"accessors":13,"[":14,"]":15,"(":16,"NUMBER":17,")":18,"=":19,"<":20,">":21,"<>":22,"<=":23,">=":24,"+":25,"-":26,"*":27,"/":28,"^":29,"%":30,"and":31,"or":32,"not":33,"!":34,"STRING":35,"ESTRING":36,"false":37,"true":38,"null":39,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",7:",",9:"VARIABLE",11:"E",12:"PI",14:"[",15:"]",16:"(",17:"NUMBER",18:")",19:"=",20:"<",21:">",22:"<>",23:"<=",24:">=",25:"+",26:"-",27:"*",28:"/",29:"^",30:"%",31:"and",32:"or",33:"not",34:"!",35:"STRING",36:"ESTRING",37:"false",38:"true",39:"null"},
productions_: [0,[3,2],[6,3],[6,1],[8,1],[10,1],[10,1],[13,4],[13,7],[13,7],[13,6],[13,6],[13,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,2],[4,2],[4,2],[4,2],[4,3],[4,4],[4,4],[4,3],[4,7],[4,7],[4,6],[4,6],[4,1],[4,1],[4,1],[4,1],[4,1],[4,1],[4,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return $$[$0-1]; 
break;
case 2: case 7:
 this.$ = [$$[$0-2]].concat($$[$0]); 
break;
case 3:
 this.$ = [$$[$0]]; 
break;
case 4:
 this.$ = yytext; 
break;
case 5:
 this.$ = Math.E; 
break;
case 6:
 this.$ = Math.PI; 
break;
case 8: case 9:
 this.$ = [$$[$0-5]].concat($$[$0-3], $$[$0]); 
break;
case 10: case 11:
 this.$ = [$$[$0-4]].concat($$[$0-2]); 
break;
case 12:
 this.$ = [$$[$0-1]]; 
break;
case 13:
 this.$ = {tag: 'BinaryOp', op: 'eq', args: [$$[$0-2], $$[$0]]}; 
break;
case 14:
 this.$ = {tag: 'BinaryOp', op: 'lt', args: [$$[$0-2], $$[$0]]}; 
break;
case 15:
 this.$ = {tag: 'BinaryOp', op: 'gt', args: [$$[$0-2], $$[$0]]}; 
break;
case 16:
 this.$ = {tag: 'BinaryOp', op: 'neq', args: [$$[$0-2], $$[$0]]}; 
break;
case 17:
 this.$ = {tag: 'BinaryOp', op: 'leq', args: [$$[$0-2], $$[$0]]}; 
break;
case 18:
 this.$ = {tag: 'BinaryOp', op: 'geq', args: [$$[$0-2], $$[$0]]}; 
break;
case 19:
 this.$ = {tag: 'BinaryOp', op: 'add', args: [$$[$0-2], $$[$0]]}; 
break;
case 20:
 this.$ = {tag: 'BinaryOp', op: 'sub', args: [$$[$0-2], $$[$0]]}; 
break;
case 21:
 this.$ = {tag: 'BinaryOp', op: 'mul', args: [$$[$0-2], $$[$0]]}; 
break;
case 22:
 this.$ = {tag: 'BinaryOp', op: 'div', args: [$$[$0-2], $$[$0]]}; 
break;
case 23:
 this.$ = {tag: 'BinaryOp', op: 'pow', args: [$$[$0-2], $$[$0]]}; 
break;
case 24:
 this.$ = {tag: 'BinaryOp', op: 'mod', args: [$$[$0-2], $$[$0]]}; 
break;
case 25:
 this.$ = {tag: 'BinaryOp', op: 'and', args: [$$[$0-2], $$[$0]]}; 
break;
case 26:
 this.$ = {tag: 'BinaryOp', op: 'or', args: [$$[$0-2], $$[$0]]}; 
break;
case 27:
 this.$ = {tag: 'UnaryOp', op: 'not', args: [$$[$0]]}; 
break;
case 28:
 this.$ = {tag: 'UnaryOp', op: 'per', args: [$$[$0-1]]}; 
break;
case 29:
 this.$ = {tag: 'UnaryOp', op: 'fact', args: [$$[$0-1]]}; 
break;
case 30:
 this.$ = {tag: 'UnaryOp', op: 'negate', args: [$$[$0]]}; 
break;
case 31:
 this.$ = {tag: 'NestedExpression', args: [$$[$0-1]]}; 
break;
case 32:
 this.$ = {tag: 'FuncApplication', args:[$$[$0-3], $$[$0-1]]}; 
break;
case 33:
 this.$ = {tag: 'NestedVariables', args: [$$[$0-2], $$[$0]]}; 
break;
case 34:
 this.$ = {tag: 'Variable', args: [$$[$0-1]]}; 
break;
case 35: case 36:
 this.$ = {tag: 'NestedVariables', args: [$$[$0-5], [$$[$0-3]]]}; 
break;
case 37: case 38:
 this.$ = {tag: 'NestedVariables', args: [$$[$0-4], [$$[$0-2]]]}; 
break;
case 39:
 this.$ = {tag: 'Literal', args: [$$[$0]]}; 
break;
case 40:
 this.$ = {tag: 'Literal', args: [Number(yytext)]}; 
break;
case 41: case 42:
 this.$ = {tag: 'String', args: [yytext]}; 
break;
case 43:
 this.$ = {tag: 'Literal', args: [false]}; 
break;
case 44:
 this.$ = {tag: 'Literal', args: [true]}; 
break;
case 45:
 this.$ = {tag: 'Literal', args: [null]}; 
break;
}
},
table: [{3:1,4:2,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},{1:[3]},{5:[1,18],19:$Vd,20:$Ve,21:$Vf,22:$Vg,23:$Vh,24:$Vi,25:$Vj,26:$Vk,27:$Vl,28:$Vm,29:$Vn,30:$Vo,31:$Vp,32:$Vq,34:$Vr},{4:34,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},{4:35,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},{4:36,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},{16:[1,37]},{8:38,9:$V0},o($Vs,[2,39]),o($Vs,[2,40]),o($Vs,[2,41]),o($Vs,[2,42]),o($Vs,[2,43]),o($Vs,[2,44]),o($Vs,[2,45]),o([15,16,18],[2,4]),o($Vs,[2,5]),o($Vs,[2,6]),{1:[2,1]},{4:39,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},{4:40,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},{4:41,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},{4:42,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},{4:43,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},{4:44,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},{4:45,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},{4:46,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},{4:47,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},{4:48,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},{4:49,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},o($Vs,[2,28],{8:6,10:8,4:50,9:$V0,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc}),{4:51,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},{4:52,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},o($Vs,[2,29]),o($Vt,[2,27],{19:$Vd,20:$Ve,21:$Vf,22:$Vg,23:$Vh,24:$Vi,25:$Vj,26:$Vk,27:$Vl,28:$Vm,29:$Vn,30:$Vo,34:$Vr}),o($Vs,[2,30]),{18:[1,53],19:$Vd,20:$Ve,21:$Vf,22:$Vg,23:$Vh,24:$Vi,25:$Vj,26:$Vk,27:$Vl,28:$Vm,29:$Vn,30:$Vo,31:$Vp,32:$Vq,34:$Vr},{4:55,6:54,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},{15:[1,56],16:[1,57]},o($Vu,[2,13],{25:$Vj,26:$Vk,27:$Vl,28:$Vm,29:$Vn,30:$Vo,34:$Vr}),o($Vu,[2,14],{25:$Vj,26:$Vk,27:$Vl,28:$Vm,29:$Vn,30:$Vo,34:$Vr}),o($Vu,[2,15],{25:$Vj,26:$Vk,27:$Vl,28:$Vm,29:$Vn,30:$Vo,34:$Vr}),o($Vu,[2,16],{25:$Vj,26:$Vk,27:$Vl,28:$Vm,29:$Vn,30:$Vo,34:$Vr}),o($Vu,[2,17],{25:$Vj,26:$Vk,27:$Vl,28:$Vm,29:$Vn,30:$Vo,34:$Vr}),o($Vu,[2,18],{25:$Vj,26:$Vk,27:$Vl,28:$Vm,29:$Vn,30:$Vo,34:$Vr}),o($Vv,[2,19],{27:$Vl,28:$Vm,29:$Vn,30:$Vo,34:$Vr}),o($Vv,[2,20],{27:$Vl,28:$Vm,29:$Vn,30:$Vo,34:$Vr}),o($Vw,[2,21],{29:$Vn,30:$Vo,34:$Vr}),o($Vw,[2,22],{29:$Vn,30:$Vo,34:$Vr}),o([5,7,18,19,20,21,22,23,24,25,26,27,28,29,31,32],[2,23],{30:$Vo,34:$Vr}),o([5,7,18,19,20,21,22,23,24,25,26,27,28,29,31,32,34],[2,24],{30:$Vo}),o($Vt,[2,25],{19:$Vd,20:$Ve,21:$Vf,22:$Vg,23:$Vh,24:$Vi,25:$Vj,26:$Vk,27:$Vl,28:$Vm,29:$Vn,30:$Vo,34:$Vr}),o($Vt,[2,26],{19:$Vd,20:$Ve,21:$Vf,22:$Vg,23:$Vh,24:$Vi,25:$Vj,26:$Vk,27:$Vl,28:$Vm,29:$Vn,30:$Vo,34:$Vr}),o($Vs,[2,31]),{18:[1,58]},{7:[1,59],18:[2,3],19:$Vd,20:$Ve,21:$Vf,22:$Vg,23:$Vh,24:$Vi,25:$Vj,26:$Vk,27:$Vl,28:$Vm,29:$Vn,30:$Vo,31:$Vp,32:$Vq,34:$Vr},o($Vs,[2,34],{13:60,14:$Vx}),{8:63,9:$V0,17:[1,62]},o($Vs,[2,32]),{4:55,6:64,8:6,9:$V0,10:8,11:$V1,12:$V2,14:$V3,16:$V4,17:$V5,26:$V6,33:$V7,35:$V8,36:$V9,37:$Va,38:$Vb,39:$Vc},o($Vs,[2,33]),{8:65,9:$V0},{18:[1,66]},{18:[1,67]},{18:[2,2]},{15:[1,68],16:[1,69]},{15:[1,70]},{15:[1,71]},o($Vs,[2,12],{13:72,14:$Vx}),{8:74,9:$V0,17:[1,73]},o($Vs,[2,37],{13:75,14:$Vx}),o($Vs,[2,38],{13:76,14:$Vx}),o($Vs,[2,7]),{18:[1,77]},{18:[1,78]},o($Vs,[2,35]),o($Vs,[2,36]),{15:[1,79]},{15:[1,80]},o($Vs,[2,10],{13:81,14:$Vx}),o($Vs,[2,11],{13:82,14:$Vx}),o($Vs,[2,8]),o($Vs,[2,9])],
defaultActions: {18:[2,1],64:[2,2]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = Error;

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 39
break;
case 2:return 38
break;
case 3:return 37
break;
case 4:return 11
break;
case 5:return 12
break;
case 6:return 17
break;
case 7:return 27
break;
case 8:return 28
break;
case 9:return 26
break;
case 10:return 25
break;
case 11:return 29
break;
case 12:return 19
break;
case 13:return 34
break;
case 14:return 30
break;
case 15:return 16
break;
case 16:return 18
break;
case 17:return 7
break;
case 18:return 22
break;
case 19:return 23
break;
case 20:return 24
break;
case 21:return 20
break;
case 22:return 21
break;
case 23:return 31
break;
case 24:return 32
break;
case 25:return 33
break;
case 26:return 9
break;
case 27:return 36
break;
case 28:return 35
break;
case 29:return 14
break;
case 30:return 15
break;
case 31:return 5
break;
case 32:return 'INVALID'
break;
}
},
rules: [/^(?:\s+)/,/^(?:null\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:E\b)/,/^(?:PI\b)/,/^(?:\d+(\.\d+)?\b)/,/^(?:\*)/,/^(?:\/)/,/^(?:-)/,/^(?:\+)/,/^(?:\^)/,/^(?:=)/,/^(?:!)/,/^(?:%)/,/^(?:\()/,/^(?:\))/,/^(?:,)/,/^(?:<>)/,/^(?:<=)/,/^(?:>=)/,/^(?:<)/,/^(?:>)/,/^(?:and\b)/,/^(?:or\b)/,/^(?:not\b)/,/^(?:[_a-zA-Z0-9]\w*)/,/^(?:"[^"]*")/,/^(?:'[^']*')/,/^(?:\[)/,/^(?:\])/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = jsLogicParser;
exports.Parser = jsLogicParser.Parser;
exports.parse = function () { return jsLogicParser.parse.apply(jsLogicParser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
