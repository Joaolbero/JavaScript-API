let valorMedio = 0;
let fii_user = [];
let fii_table = [];
let tabela = document.querySelector("#tabela")

// função para chamar a url e atribuir dados ao json
async function carregarDadosUser(url){
    await fetch(url)
            .then(resp => resp.json())
            .then(json => fii_user = json);
    carregarDadosFundos();
}

//função de atribuir dados da api para variáveis
//e também criar a tabela
async function carregarDadosFundos(){
    
    for (let fii of fii_user){
        let json = await fetch(`https://api-simple-flask.herokuapp.com/api/${fii.nome}`)
                        .then(resp => resp.json());
        fii_table.push(json);  

        let precoMedio = (fii.totalgasto/fii.qtde).toFixed(2)
        let provento = json.proximoRendimento.rendimento
        let cotaBase = json.proximoRendimento.cotaBase
        let database = json.proximoRendimento.dataBase
        let datapag = json.proximoRendimento.dataPag

        if(cotaBase = "-"){
            cotaBase = json.ultimoRendimento.cotaBase
        }

        if (provento = "-"){
            provento = json.ultimoRendimento.rendimento
        }

        if (database = "-"){
            database = json.ultimoRendimento.dataBase
        }

        if (datapag = "-"){
            datapag = json.ultimoRendimento.dataPag
        }

        let rendimento = ((provento*100)/cotaBase).toFixed(2)

        if(rendimento>=0.6){
        tabela.innerHTML += `<tr class="positivo">
        <td>${json.fundo}</td>
        <td>${json.setor}</td>
        <td>${database}</td>
        <td>${datapag}</td>
        <td>R$ ${provento}</td>
        <td>R$ ${cotaBase}</td>
        <td>${fii.qtde}</td>
        <td>R$ ${fii.totalgasto}</td>
        <td>R$ ${precoMedio}</td>
        <td>${rendimento}%</td>
        <td>${json.dividendYield}%</td>
        <td>R$ ${(json.rendimentoMedio24M).toFixed(2)}</td>
        </tr>`
        } else {
        tabela.innerHTML += `<tr class="negativo">
        <td>${json.fundo}</td>
        <td>${json.setor}</td>
        <td>${json.proximoRendimento.dataBase}</td>
        <td>${json.proximoRendimento.dataPag}</td>
        <td>R$ ${json.proximoRendimento.rendimento}</td>
        <td>R$ ${json.proximoRendimento.cotaBase}</td>
        <td>${fii.qtde}</td>
        <td>R$ ${fii.totalgasto}</td>
        <td>R$ ${precoMedio}</td>
        <td>${rendimento}%</td>
        <td>${json.dividendYield}%</td>
        <td>R$ ${(json.rendimentoMedio24M).toFixed(2)}</td>
        </tr>`
        }

        valorMedio += provento * fii.qtde
        
    } 

    
//calculos para exibição
    let gastoTotal = 0;
    for (tot of fii_user){
        gastoTotal += tot.totalgasto
    }

    let cotasTotal = 0;
    for (tot of fii_user){
        cotasTotal += tot.qtde
    }

    let precoMedioTotal = gastoTotal/cotasTotal

    exibirTabela(valorMedio,cotasTotal,gastoTotal,precoMedioTotal);
}
//chama a função carregar dados com os parametros da url do arquivo do usuário
carregarDadosUser("json/fii.json");

//função que exibe a parte debaixo da tabela
function exibirTabela(valorMedio,cotasTotal,gastoTotal,precoMedioTotal){ 

    document.querySelector("#tabela").innerHTML +=
    `
    <tr class='fundo_total'>
    <td colspan='4'>Total Geral</td>
    <td>R$ ${(valorMedio).toFixed(2)}</td>
    <td>-</td>
    <td>${cotasTotal}</td>
    <td>R$ ${(gastoTotal).toFixed(2)}</td>
   <td>R$ ${precoMedioTotal.toFixed(2)}</td> <td>-</td> <td>-</td>
   <td>-</td>
    </tr>`

    document.querySelector("#tabela").style.display = "block";
    document.querySelector("#loading").style.display = "none";
}
