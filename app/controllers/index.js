module.exports.index = function(application, req, res){
	res.render('index', {validacao: {}, dadosForm: {}});
}


module.exports.autenticar = function(application, req, res){
	var dadosForm = req.body;

	req.assert('usuario', 'Campo usuário não pode ser vazio').notEmpty();
	req.assert('senha', 'Campo senha não pode ser vazio').notEmpty();

	var erros = req.validationErrors();
	console.log(erros);
	if(erros){
		res.render('index', {validacao: erros, dadosForm: dadosForm});
		return;
	}

	// validacao com base no banco de dados
	var connection = application.config.dbConnection;
	// recebe o objeto de usuário.
	var UsuariosDAO = new application.app.models.UsuariosDAO(connection);

	UsuariosDAO.autenticar(dadosForm, req, res);

	//res.send('tudo ok para criar a sessão');

}