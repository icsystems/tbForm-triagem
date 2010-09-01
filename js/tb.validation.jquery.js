//Custom validation rules

function calculateIMC(peso, altura){
	imc = parseFloat(peso);
	imc = 10000 * (imc/ (parseFloat(altura)*parseFloat(altura)));
	return imc;
}
$.validator.addMethod("warningAge", function(value, element) {
	var retcode = parseInt(value) >= 1  && parseInt(value) <= 95;
	var options = {idTest: 'warningAge'};
	var msg = '';
	if (parseInt(value)> 95)
		msg = "A idade é maior que 95 anos. Confirma? "
	else if (parseInt(value) < 1)
		msg = "A idade é 0 anos. Confirma?"
	retcode = $(element).ConfirmUI(msg, function(element){
		return retcode;
	},options);
	return retcode;
}, 'Por favor, confira a data de nascimento');

$.validator.addMethod("warningCT", function(value, element) {
	var options = {idTest: 'warningCT'};
	var age = $("#idade").val();
	var target = 3*(parseInt(age)-10);
	retcode = $(element).ConfirmUI('O número de anos que o paciente fuma é igual a ' + $('#numeroAnosFumante').val() + ' e o número de cigarros por dia é igual a ' + $('#numeroCigarros').val() + ' cigarros/dia. Confirma?', function(element){
		return $(element).val() <= target;
	},options);
	return retcode;
}, 'Por favor, confira a quantidade de cigarros fumados e há quantos anos o paciente fuma.');

$.validator.addMethod("CantSmokeFor70Years", function(value, element) {
	var options = {idTest: 'CantSmokeFor70Years'};
	retcode = $(element).ConfirmUI('O paciente fuma há mais de 70 anos. Confirma?', function(element){
		return parseInt($(element).val()) <= 70
	},options);
	return retcode;
}, 'Por favor, confira a quantos anos o paciente fuma');

$.validator.addMethod("warningNumberOfCigarrettes", function(value, element) {
	var options = {idTest: 'warningNumberOfCigarrettes'};
	retcode = $(element).ConfirmUI('O paciente fuma mais que 80 cigarros/dia (4 maços). Confirma?', function(element){
		return $(element).val() <= 80;
	},options);
	return retcode;
}, 'Por favor, confira quantos cigarros o paciente fuma por dia');

$.validator.addMethod("validIMC", function(value, element) {
	var options = {idTest: 'validIMC'};
	var weight = $('#pesoAtual').val();
	var height = $('#altura').val();
	retcode = true
	if(weight.length != 0 && height.length != 0){
		var imc = calculateIMC(weight, height);
		retcode = $(element).ConfirmUI('O IMC do paciente está fora dos padrões (entre 12 e 40). Está correto?', function(element){
			return imc >= 12 && imc <= 40;
		},options);
	}
	return retcode;
}, 'Por favor, confira o peso e altura do paciente.');

$.validator.addMethod("warningWeight", function(value, element) {
	var options = {idTest: 'warningWeght'};
	retcode = $(element).ConfirmUI('O paciente tem mais do que 150 kg. Confirma?', function(element){
		return parseInt($(element).val()) <= 150;
	},options);
	return retcode;
}, 'Por favor, confira o peso do paciente');

$.validator.addMethod("warningHeight", function(value, element) {
	var options = {idTest: 'warningHeight'};
	retcode = $(element).ConfirmUI('O paciente tem mais do que 200 cm. Confirma?', function(element){
		return parseInt($(element).val()) <= 200;
	},options);
	return retcode;
}, 'Por favor, confira altura do paciente');

$.validator.addMethod("warningMaritalState", function(value, element) {
	var retcode = true;
	var options = {idTest: 'warningMaritalState'};
	if($('#idade').val() != '' && $('#estado_civil').val() != '----'){
		var idade = parseInt($('#idade').val());
		var mstate = $(element).val();
		var msg = "";
		if(idade >= 75 && mstate == 'solteiro')
		{
			msg = "O paciente tem "+ idade + " anos e é solteiro. Confirma?";
			retcode = false;
		}
		if(idade <= 17 && mstate == 'casado')
		{
			msg = "O paciente tem "+ idade + " anos e é casado. Confirma?";
			retcode = false;
		}
		if(idade <= 19 && mstate == 'divorciado')
		{
			msg = "O paciente tem "+ idade + " anos e é divorciado. Confirma?";
			retcode = false;
		}
		if(idade <= 24 && mstate == 'viuvo')
		{
			msg = "O paciente tem "+ idade + " anos e é viúvo. Confirma?";
			retcode = false;
		}
	}
	retcode = $(element).ConfirmUI(msg, function(element){
		return retcode;
	},options);
	return retcode;
}, 'Por favor, confira o estado civil do paciente e/ou idade.');

$.validator.addMethod("warningYearsSmoking", function(value, element) {
	var age = $("#idade").val();
	var retcode = parseInt($(element).val()) < parseInt(age) - 10;
	var msg ='O paciente começou a fumar  antes dos 10 anos. Confirma?';
	var options = {idTest: 'warningYearsSmoking'};
	retcode = $(element).ConfirmUI(msg, function(element){
		return retcode;
	},options);
	return retcode;
}, "Por favor confira a idade e há quanto tempo o paciente fuma.");

$.validator.addMethod("warningSymptoms", function(value, element, params) {
	var options = {idTest: 'warningSymptoms'};
	var retcode = true;
	t = $(element).val()
	if(t.search('menos') >= 0) return retcode;
	var n = parseInt(t);
	var n2 = parseInt(params);
	if(t.search('ano') >= 0) n=n*52;
	if(t.search('mes') >= 0) n=n*4;
	if(params.search('ano') >= 0 ) n2=n2*52;
	if(params.search('mes') >= 0 ) n2=n2*4;
	msg = 'O tempo de ' +$(element).attr('name').substr(5)+ ' é maior que ' +n2+ ' semanas. Confirma?';
	retcode = $(element).ConfirmUI(msg, function(element){
		return n < n2;
	},options);
	return retcode;
}, 'Por favor, confira há quanto tempo o paciente apresenta o sintoma.');


$.validator.addMethod("yearsSmokingLowerThanAge", function(value, element) {
	var age = $("#idade").val();
	retcode = parseInt($(element).val()) < parseInt(age);
	if(retcode && !isNaN(parseInt($('#numeroCigarros').val())))
		$('#cargaTabagistica').val(
			parseFloat($('#numeroCigarros').val()) * parseFloat($(element).val()) / 20. 
		);
	return retcode;
}, "Esse campo deve ser menor do que a idade do paciente.");

$.validator.addMethod("yearsLowerThanAge", function(value, element) {
	var age = $("#idade").val();
	retcode = parseInt($(element).val()) <= parseInt(age);
	return retcode;
}, "Esse campo deve ser menor do que a idade do paciente.");

$.validator.addMethod("yearsLowerThanAge", function(value, element) {
	var age = $("#idade").val();
	retcode = parseInt($(element).val()) <= parseInt(age);
	return retcode;
}, "Esse campo deve ser menor do que a idade do paciente.");

$.validator.addMethod("numberOfCigarrettes", function(value, element) {
	var retcode = (parseInt($(element).val()) < 140 && parseInt($(element).val()) != 0) ;
	if(retcode && !isNaN(parseInt($('#numeroAnosFumante').val())))
		$('#cargaTabagistica').val(
			parseFloat($('#numeroAnosFumante').val()) * parseFloat($(element).val()) / 20.
		);
	return retcode;
}, "O número de cigarros/dia deve ser menor ou igual a 140  (7 maços) e maior do que 0.");

$.validator.addMethod("GreaterThanBirthYear", function(value, element) {
	var age = $("#idade").val();
	var d = new Date()
	var cYear = d.getFullYear();
	var retcode = parseInt($(element).val()) >= parseInt(cYear) - parseInt(age);
	return retcode;
}, "Ano anterior ao nascimento do paciente");

$.validator.addMethod("LowerThanCurrentYear", function(value, element) {
	var age = $("#idade").val();
	var d = new Date()
	var cYear = d.getFullYear();
	var retcode = parseInt($(element).val()) <= parseInt(cYear);
	return retcode;
}, "Ano maior do que o ano atual.");

$.validator.addMethod("checkCT", function(value, element) {
	var age = $("#idade").val();
	var target = 5*(parseInt(age));
	return parseInt($(element).val()) < target
}, 'Por favor, confira a quantidade de cigarros fumados e a quantos anos o paciente fuma.');

$.validator.addMethod("lowerThanHIVTest", function(value, element) {
	return parseInt($('#data_sida').val()) > 1987;
}, 'O teste de HIV surgiu após 1987.');

