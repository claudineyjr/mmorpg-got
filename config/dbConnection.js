/* Importar o mongodb */
var mongo = require('mongodb');

var connMongoDB = function(){
	
	var db = new mongo.Db(
		'got',		// iniciais de Game of Thrones
		new mongo.Server(
				'localhost',	// string contendo o endereço do servidor do banco de dados
				27017, // porta de conexão
				{} // objeto com opções de configuração do servidor
			),
			{} // configurações adicionais do Db
	);

	return db;
}

module.exports = function(){
	return connMongoDB;
}