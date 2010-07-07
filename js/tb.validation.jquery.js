function calculateIMC(peso, altura){
	imc = parseFloat(peso);
	imc = 10000 * (imc/ (parseFloat(altura)*parseFloat(altura)));
	return imc;
}

function calculateAge(dateStr){
	var cd = new Date();
	var cEpochs = parseInt(cd.getTime()-cd.getMilliseconds())/1000;
	var d = new Date();
	d.setDate(parseInt(dateStr.charAt(0)+dateStr.charAt(1)));
	d.setMonth(parseInt(dateStr.charAt(3)+dateStr.charAt(4))-1);
	d.setYear(parseInt(dateStr.charAt(6)+dateStr.charAt(7)+dateStr.charAt(8)+dateStr.charAt(9)));
	var epochs = (d.getTime()-d.getMilliseconds())/1000;
	var age = parseInt((cEpochs - epochs)/31556926);
	if(d.getDate() == cd.getDate() && d.getMonth() == cd.getMonth())
		age++;
	return age;
}

//Custom validation rules
$.validator.addMethod("warningAge", function(value, element) {
	var retcode = true;
	if (parseInt($('#idade').val()) < 1  || parseInt($('#idade').val()) > 95)
		retcode = confirm('O paciente tem '+ $('#idade').val() + ' anos. Está correto? Caso não, pressione Cancelar.');
	return retcode;
}, 'Por favor, confira a data de nascimento');

$.validator.addMethod("warningBirthAge", function(value, element) {
	var retcode = true;
	var age = calculateAge($(element).val());
	alert(age);
	if (parseInt(age) < 1  || parseInt(age) > 95)
		retcode = confirm('O paciente tem '+ age + ' anos. Está correto? Caso não, pressione Cancelar.');
	return retcode;
}, 'Por favor, confira a data de nascimento');

$.validator.addMethod("warningCT", function(value, element) {
	var age = $("#idade").val();
	var retcode = true;
	var target = 3*(parseInt(age)-10);
	if (parseInt($(element).val()) > target)
		retcode = confirm('Carga tabágica superior a '+ target +' maços/ano. Está correto? Caso não, pressione Cancelar.');
	return retcode;
}, 'Por favor, confira a quantidade de cigarros fumados e a quantos anos o paciente fuma.');

$.validator.addMethod("CantSmokeFor70Years", function(value, element) {
	var retcode = true;
	if (parseInt($(element).val()) > 70)
		retcode = confirm('O paciente fuma a mais de 70 anos. Está correto? Caso não, pressione Cancelar.');
	return retcode;
}, 'Por favor, confira a quantos anos o paciente fuma');

$.validator.addMethod("warningNumberOfCigarrettes", function(value, element) {
	var retcode = true;
	if (parseInt($(element).val()) >= 80)
		retcode = confirm('O paciente fuma mais do que 80 cigarros (4 maços) por dia. Está correto? Caso não, pressione Cancelar.');
	return retcode;
}, 'Por favor, confira a quantos cigarros o paciente fuma por dia');

$.validator.addMethod("validIMC", function(value, element) {
	var retcode = true;
	if($('#pesoAtual').val() != '' && $('#altura').val() !='' ){
		var imc = calculateIMC($('#pesoAtual').val(), $('#altura').val())
		retcode = imc <= 40 && imc >= 12;
		if(!retcode) retcode = confirm('O IMC do paciente esta fora dos padrões (entre 12 e 40). Está correto? Caso não, pressione Cancelar e corrija a ALTURA e/ou PESO do paciente.');
	}
	return retcode;
}, 'Por favor, confira o peso e altura do paciente.');

$.validator.addMethod("warningWeight", function(value, element) {
	var retcode = true;
	if (parseInt($(element).val()) > 150)
		retcode = confirm('O paciente tem '+ $(element).val() + ' kg. Está correto? Caso não, pressione Cancelar.');
	return retcode;
}, 'Por favor, confira o peso do paciente');

$.validator.addMethod("warningHeight", function(value, element) {
	var retcode = true;
	if (parseInt($(element).val()) > 200)
		retcode = confirm('O paciente tem '+ $(element).val() + ' cm. Está correto? Caso não, pressione Cancelar.');
	return retcode;
}, 'Por favor, confira altura do paciente');

$.validator.addMethod("warningMaritalState", function(value, element) {
	var retcode = true;
	if($('#idade').val() != '' && $('#estado_civil').val() != '----'){
		var idade = parseInt($('#idade').val());
		var mstate = $(element).val();
		if(idade >= 75 && mstate == 'solteiro')
			retcode = false;
		if(idade < 17 && mstate == 'solteiro')
			retcode = false;
		if(idade <= 15 && mstate == 'casado')
			retcode = false;
		if(idade <= 19 && mstate == 'divorciado')
			retcode = false;
		if(idade <= 24 && mstate == 'viuvo')
			retcode = false;
		if(!retcode) retcode = confirm('O estado civil do paciente é ' + $(element).val() + ' e possui '+ $('#idade').val() +' anos. Está correto? Caso não, pressione Cancelar.');
	}
	return retcode;
}, 'Por favor, confira o estado civil do paciente e/ou idade.');

$.validator.addMethod("warningYearsSmoking", function(value, element) {
	var age = $("#idade").val();
	retcode = parseInt($(element).val()) < parseInt(age) - 10;
	if(!retcode) retcode = confirm('O paciente começou a fumar com menos de 10 anos. Está correto? Caso não, pressione Cancelar.');
	return retcode;
}, "Por favor confira a idade e a quanto tempo o paciente fuma.");

$.validator.addMethod("yearsSmokingLowerThanAge", function(value, element) {
	var age = $("#idade").val();
	retcode = parseInt($(element).val()) < parseInt(age);
	if(retcode && !isNaN(parseInt($('#numeroCigarros').val())))
		$('#cargaTabagistica').val(
			parseFloat($('#numeroCigarros').val()) * parseFloat($(element).val()) / 20. 
		);
	return retcode;
}, "Esse campo deve ser menor do que a idade do paciente.");

$.validator.addMethod("numberOfCigarrettes", function(value, element) {
	var retcode = (parseInt($(element).val()) < 140 && parseInt($(element).val()) != 0) ;
	if(retcode && !isNaN(parseInt($('#numeroAnosFumante').val())))
		$('#cargaTabagistica').val(
			parseFloat($('#numeroAnosFumante').val()) * parseFloat($(element).val()) / 20.
		);
	return retcode;
}, "N&atilde;o é permitido fumar 0 ou mais que 140 cigarros em um dia");

$.validator.addMethod("GreaterThanBirthYear", function(value, element) {
	var age = $("#idade").val();
	var d = new Date()
	var cYear = d.getFullYear();
	var retcode = parseInt($(element).val()) > parseInt(cYear) - parseInt(age);
	return retcode;
}, "Ano anterior ao nascimento do paciente");

$.validator.addMethod("LowerThanCurrentYear", function(value, element) {
	var age = $("#idade").val();
	var d = new Date()
	var cYear = d.getFullYear();
	var retcode = parseInt($(element).val()) < parseInt(cYear);
	return retcode;
}, "Ano maior do que o ano atual.");

$.validator.addMethod("checkCT", function(value, element) {
	var age = $("#idade").val();
	var target = 5*(parseInt(age));
	return parseInt($(element).val()) < target
}, 'Por favor, confira a quantidade de cigarros fumados e a quantos anos o paciente fuma.');

$.validator.addMethod("warningSymptoms", function(value, element, params) {
	var retcode = true;
	t = $(element).val()
	if(t.search('menos') >= 0) return retcode;
	var n = parseInt(t);
	var n2 = parseInt(params);
	if(t.search('ano') >= 0) n=n*52;
	if(t.search('mes') >= 0) n=n*4;
	if(params[0].search('ano') >= 0 ) n2=n2*52;
	if(params[0].search('mes') >= 0 ) n2=n2*4;
	alert(n);
	alert(n2);
	if(n>n2){
		retcode = confirm('O sintoma ' +$(element).attr('name').substr(5)+ ' possui mais do que ' +n2+ ' semanas. Está correto? Caso não pressione "Cancelar".');
	}
	return retcode;
}, 'Por favor, confira a quantidade de tempo que o paciente apresenta o sintoma.');


