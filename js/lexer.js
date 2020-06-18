let results = new Array();
let tokens = [{
    token: 'TD', 
    expr: /void|int|double|float|string|char/,
    cont: 0,
    err: 'Type error'
},{
    token: 'ID',
    expr: /^((?!int|void|string|char|float|double)[A-Z|a-z][a-zA-Z0-9]*)$/,
    cont: 0,
    err: 'Identifier error'
},{
    token: 'DELIM',
    expr: /\(|\)/,
    cont: 0,
    err: 'Delimiter error'
},{
    token: 'AS',
    expr: /\=/,
    cont: 0,
    err: 'Assignation error'
},{
    token: 'OA',
    expr: /^(\+|\-|\*|\/)$/,
    cont: 0,
    err: 'Operator error'
},{
    token: 'CNV',
    expr: /[0-9]+[\.0-9]*/,
    cont: 0,
    err: 'Invalid number'
},{
    token: 'MIS',
    expr: /^[\,|\;]$/,
    cont: 0,
    err: 'Miscellaneous error'
}]
const semantic = [
    {
        expr: /([A-za-z0-9!"#$%&/_()¡¿?]+[\s][A-za-z0-9!"#$%&/_()¡¿?]+[\s]*[(]([\s]*[A-za-z0-9!"#$%&/_()¡¿?]+[\s][A-za-z0-9!"#$%&/_()¡¿?]+([\,][\s]*[A-za-z0-9!"#$%&/_()¡¿?]+[\s][A-za-z0-9!"#$%&/_()¡¿?]+[\s]*)*)?[\)])/,
        id: 'function'
    },
    {
        expr: /([A-Za-z0-9!"#$%&/_()¡¿?]+[\s]*[\=]([\s]*[A-Za-z0-9!"#$%&/_()¡¿?]+([\s]*[\/\-\+\%\*][\s]*[A-Za-z0-9!"#$%&/_()¡¿?]+)*)+[\s]*[\;])/,
        id: 'operation'
    }
]
function setLexemes(code){
    let lines = code.split('\n');
    let results = new Array();
    lines.forEach(element => {
        for(item in semantic){
            if(semantic[item].expr.test(element)){
                results.push({ line: element, type: semantic[item].id});
            }
        }
    });
    return results
}

function checkExist(lex){
    let band = false
    results.forEach( (item, index) => {
        if(lex == item.lexeme && item.token.substring(0, 4) !== 'ERLX'){
            band = index;
        }
    })
    return band;
}

function setTokens(lines){
    let lexemes = new Array();
    let word = '';
    let tok, status;
    lines.forEach( item => {
        lexemes = []
        word = ''
        if(item.type === 'function'){
            tok = getTokensFunc(item.line);
            for(let letter in item.line){
                if(/[^A-Za-z0-9_.&!?¿]/.test(item.line[letter])){
                    lexemes.push(word);
                    lexemes.push(item.line[letter]);
                    word = '';
                }else{
                    if(item.line[letter] != '\t'){
                        word += item.line[letter];
                    }
                }
            }
            lexemes.push(word);
            let cont  = 0, band = 0;
            lexemes.forEach( lex => {
                if(lex != '' && lex != ' '){
                    for(tk in tokens){
                        if(tokens[tk].token == tok[cont]){
                            band = tk;
                            break;
                        }
                    }
                    status = checkExist(lex);
                    if(status){
                        results.push({lexeme:results[status].lexeme, token: results[status].token});
                    }else{
                        if(tokens[band].expr.test(lex)){
                            tokens[band].cont++;
                            results.push({lexeme: lex, token: tokens[band].token+tokens[band].cont})
                        }else{
                            tokens[band].cont++;
                            results.push({lexeme: lex, token: 'ERLX'+tokens[band].token+tokens[band].cont, err: tokens[band].err})
                        }
                    }
                    cont++;
                }
            })
        }else if(item.type === 'operation'){
            tok = getTokensOpe(item.line);
            for(let letter in item.line){
                if(/[^A-Za-z0-9_./*+-]/.test(item.line[letter])){
                    lexemes.push(word);
                    lexemes.push(item.line[letter]);
                    word = '';
                }else{
                    word += item.line[letter];
                }
            }
            lexemes.push(word);
            let cont  = 0, band = 0;;
            lexemes.forEach( lex => {
                if(lex != '' && lex != ' ' && lex != '\t'){
                    for(tk in tokens){
                        if(tokens[tk].token == tok[cont]){
                            band = tk;
                            break;
                        }else if(tok[cont] == 'X'){
                            band = false;
                            break;
                        }
                    }
                    status = checkExist(lex);
                    if(status){
                        results.push({lexeme:results[status].lexeme, token: results[status].token});
                    }else{
                        if(band){
                            if(tokens[band].expr.test(lex)){
                                tokens[band].cont++;
                                results.push({lexeme: lex, token: tokens[band].token != 'AS' ? tokens[band].token+tokens[band].cont:tokens[band].token })
                            }else{
                                tokens[band].cont++;
                                results.push({lexeme: lex, token: 'ERLX'+tokens[band].token+tokens[band].cont, err: tokens[band].err})
                            }
                        }else{
                            if(tokens[1].expr.test(lex)){
                                band = 1;
                            }else if(tokens[5].expr.test(lex)){
                                band = 5;
                            }
                            if(band){
                                tokens[band].cont++;
                                results.push({lexeme: lex, token: tokens[band].token+tokens[band].cont})
                            }else{
                                tokens[1].cont++;
                                results.push({lexeme: lex, token: 'ERLX'+tokens[1].token+tokens[1].cont, err: tokens[1].err})
                            }
                        }
                    }
                    cont++;
                }
            })
        }
        results.push({token: '\n', lexeme: '\n'});
    })
    tokens.forEach( item => {
        item.cont = 0;
    })
    lexeme = []
    return results;
}

function getTokensFunc(arr){
    let lexemes = new Array();
    let word = '';
    for(let letter in arr){
        if(/[^A-Za-z0-9_.&!?¿]/.test(arr[letter])){
            lexemes.push(word);
            lexemes.push(arr[letter]);
            word = '';
        }else{
            word += arr[letter];
        }
    }
    lexemes.push(word);
    let num = 0;
    for(let i in lexemes){
        if(lexemes[i] != ' ' && lexemes[i] != ''){
            num++;
        }
    }
    let position = ['TD','ID', 'DELIM'];
    num = num - 4;
    while(num > 0){
        position.push('TD');
        position.push('ID');
        num  -= 2;
        if( num > 0){
            position.push('MIS');
            num -= 1;
        }
    }
    position.push('DELIM');
    return position;
}

function getTokensOpe(arr){
    let lexemes = new Array();
    let word = '';
    for(let letter in arr){
        if(/[^A-Za-z0-9_./*+-]/.test(arr[letter])){
            lexemes.push(word);
            lexemes.push(arr[letter]);
            word = '';
        }else{
            word += arr[letter];
        }
    }
    lexemes.push(word);
    let position = ['ID', 'AS', 'X']
    let num = 0;
    for(let i in lexemes){
        if(lexemes[i] != ' ' && lexemes[i] != '' && lexemes[i] != '\t'){
            num++;
        }
    }
    num -= 4;
    while( num > 0){
        position.push('OA');
        position.push('X');
        num -= 2;
    }
    position.push('MIS');
    return position;
}