class Atividade {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id') /*verifica se já tem algum id com informações*/
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {

		//array de atividades
		let atividades = Array()

		let id = localStorage.getItem('id')

		//recuperar atividades cadastradas em localStorage
		for(let i = 1; i <= id; i++) {

			//recuperar a atividade
			let atividade = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver índices que foram pulados/removidos
			//nestes casos nós vamos pular esses índices
			if(atividade === null) {
				continue
			}
			atividade.id = i
			atividades.push(atividade)
		}

		return atividades
	}

	pesquisar(atividade){

		let atividadesFiltradas = Array()
		atividadesFiltradas = this.recuperarTodosRegistros()
		console.log(atividadesFiltradas);
		console.log(atividade)

		//ano
		if(atividade.ano != ''){
			console.log("filtro de ano");
			atividadesFiltradas = atividadesFiltradas.filter(d => d.ano == atividade.ano)
		}
			
		//mes
		if(atividade.mes != ''){
			console.log("filtro de mes");
			atividadesFiltradas = atividadesFiltradas.filter(d => d.mes == atividade.mes)
		}

		//dia
		if(atividade.dia != ''){
			console.log("filtro de dia");
			atividadesFiltradas = atividadesFiltradas.filter(d => d.dia == atividade.dia)
		}

		//tipo
		if(atividade.tipo != ''){
			console.log("filtro de tipo");
			atividadesFiltradas = atividadesFiltradas.filter(d => d.tipo == atividade.tipo)
		}

		//descricao
		if(atividade.descricao != ''){
			console.log("filtro de descricao");
			atividadesFiltradas = atividadesFiltradas.filter(d => d.descricao == atividade.descricao)
		}

		//valor
		if(atividade.valor != ''){
			console.log("filtro de valor");
			atividadesFiltradas = atividadesFiltradas.filter(d => d.valor == atividade.valor)
		}

		
		return atividadesFiltradas

	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()


function cadastrarAtividade() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let atividade = new Atividade(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value,
		valor.value
	)


	if(atividade.validarDados()) {
		bd.gravar(atividade)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-dark'
		document.getElementById('modal_conteudo').innerHTML = 'Atividade foi cadastrada!'
		document.getElementById('modal_btn').innerHTML = 'ok'
		document.getElementById('modal_btn').className = 'btn btn-dark'                                    //aqui muda a cor da mensagem

		//dialog de sucesso
		$('#modalRegistraAtividade').modal('show') 

		ano.value = '' 
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
		
	} else {
		
		document.getElementById('modal_titulo').innerHTML = 'Erro ao inserir registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-dark'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique todos os campos!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-dark'                                           //aqui muda a cor da msg

		//dialog de erro
		$('#modalRegistraAtividade').modal('show') 
	}
}

function carregaListaAtividades(atividades = Array(), filtro = false) {

    if(atividades.length == 0 && filtro == false){
		atividades = bd.recuperarTodosRegistros() 
	}
	

	let listaAtividades = document.getElementById("listaAtividades")
    listaAtividades.innerHTML = ''
	atividades.forEach(function(d){

		//Criando a linha (tr)
		var linha = listaAtividades.insertRow();

		//Criando as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

		//Ajustar o tipo
		switch(d.tipo){
			case '1': d.tipo = 'Manutenção'
				break
			case '2': d.tipo = 'Montagem'
				break

			case '3': d.tipo = 'Obras civis'
				break
			
		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		//Criar o botão de exclusão
		let btn = document.createElement('button')
		btn.className = 'btn btn-dark'                            //cor do botão
		btn.innerHTML = '<i class="fa fa-times" ></i>'
		btn.id = `id_atividade_${d.id}`
		btn.onclick = function(){
			let id = this.id.replace('id_atividade_','')
			//alert(id)
			bd.remover(id)
			window.location.reload()
		}
		linha.insertCell(4).append(btn)
		console.log(d)
	})

 }

 
 function pesquisarAtividade(){
	 
	let ano  = document.getElementById("ano").value
	let mes = document.getElementById("mes").value
	let dia = document.getElementById("dia").value
	let tipo = document.getElementById("tipo").value
	let descricao = document.getElementById("descricao").value
	let valor = document.getElementById("valor").value

	let atividade = new Atividade(ano, mes, dia, tipo, descricao, valor)

	let atividades = bd.pesquisar(atividade)
	 
	this.carregaListaAtividades(atividades, true)

 }
