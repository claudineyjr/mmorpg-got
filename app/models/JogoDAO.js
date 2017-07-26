var ObjectID = require('mongodb').ObjectId;

function JogoDAO(connection){
	this._connection = connection();
}

JogoDAO.prototype.gerarParametros = function(usuario){
	this._connection.open( function(err, mongoclient){
		mongoclient.collection("jogo", function(err, collection){
			collection.insert({
				usuario: usuario,
				moeda: 15,
				suditos: 10,
				temor: Math.floor(Math.random() * 1000),	// gera um número entre 0 e 1 (floor arredonda)
				sabedoria: Math.floor(Math.random() * 1000),
				comercio: Math.floor(Math.random() * 1000),
				magia: Math.floor(Math.random() * 1000)
			});

			mongoclient.close();
		});
	}); 
}

JogoDAO.prototype.iniciaJogo = function(res, usuario, casa, msg){
	this._connection.open( function(err, mongoclient){
		mongoclient.collection("jogo", function(err, collection){
			collection.find({usuario: usuario}).toArray(function(err, result){
				res.render('jogo', {img_casa: casa, jogo: result[0], msg: msg});
				
				mongoclient.close();
			});
		});
	}); 
}

JogoDAO.prototype.acao = function(acao){
	this._connection.open( function(err, mongoclient){
		mongoclient.collection("acao", function(err, collection){
			var date = new Date();
			// retorna em ms a quantidade de tempo que se passou desde 01/01/1970

			var tempo = null;

			switch(parseInt(acao.acao)){
				case 1: tempo = 1 * 60 * 60000; break;
				case 2: tempo = 2 * 60 * 60000; break;
				case 3: tempo = 5 * 60 * 60000;	break;
				case 4: tempo = 5 * 60 * 60000; break;
			}

			acao.acao_termina_em = date.getTime() + tempo;

			collection.insert(acao);

			
		});

		mongoclient.collection("jogo", function(err, collection){

			var moedas = null;

			switch(parseInt(acao.acao)){
				case 1: moedas = -2 * acao.quantidade; break;
				case 2: moedas = -3 * acao.quantidade; break;
				case 3: moedas = -1 * acao.quantidade; break;
				case 4: moedas = -1 * acao.quantidade; break;
			}

			collection.update(
				{ usuario: acao.usuario}, // critério
				{ $inc: {moeda: moedas}} // instrução de atualização (inc faz um incremento do valor do banco com o valor passado)
			);		// era pra ter mais um parametro aqui, mas como, por padrão o valor é falso omitimos o mesmo. (multi)

			mongoclient.close();
		});
	}); 

}

JogoDAO.prototype.getAcoes = function(usuario, res){
	this._connection.open( function(err, mongoclient){
		mongoclient.collection("acao", function(err, collection){

			var date = new Date();
			var momento_atual = date.getTime();
			
			collection.find({usuario: usuario, acao_termina_em: {$gt: momento_atual}}).toArray(function(err, result){
				
				res.render("pergaminhos", {acoes: result});
				
				mongoclient.close();
			});
		});
	}); 
}

JogoDAO.prototype.revogarAcao = function(_id, res){
	this._connection.open( function(err, mongoclient){
		mongoclient.collection("acao", function(err, collection){
			collection.remove(
					{_id : ObjectID(_id)}, // critério para remoção da collection (_id vem como string, converter para objectID)
					function(err, result){
						res.redirect("jogo?msg=D");
						mongoclient.close();
					}
				);
			
		});
	}); 

}

module.exports = function(){
	return JogoDAO;
}

