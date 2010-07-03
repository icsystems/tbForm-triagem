function argumentsNNet(){
	this.idade;
	this.tosse;
	this.hemoptoico;
	this.sudorese;
	this.febre;
	this.emagrecimento;
	this.dispneia;
	this.fumante;
	this.internacaoHospitalar;
	this.exameSida;
	this.sida;
}

function calculateIMC(peso, altura){
	imc = parseFloat(peso);
	imc = 100*imc/ parseFloat(altura);
	imc = 100*imc/ parseFloat(altura);
	return imc;
}

argumentsNNet.prototype.Set = function(
				idade,
				tosse,
				hemoptoico,
				sudorese,
				febre,
				emagrecimento,
				dispneia,
				fumante,
				internacaoHospitalar,
				exameSida,
				sida
){
	this.idade                   = idade;
	this.tosse                   = tosse ;
	this.hemoptoico              = hemoptoico;
	this.sudorese = sudorese;
	this.febre = febre;
	if(emagrecimento == 'Sim') this.emagrecimento = 'sim';
	else this.emagrecimento = 'nao';
	this.dispneia = dispneia;
	this.fumante = fumante;
	if(fumante != 'sim') this.fumante = 'nao';
	this.internacaoHospitalar = internacaoHospitalar;
	if(exameSida == 'nao' || exameSida == 'ignorado'){
		this.sida = 'ignorado';
	} else {
		if(exameSida == 'sim'){
			if (sida == 'pendente'){
				this.sida = 'ignorado';
			}else{
				this.sida = sida;
			}
		}
	}
}

//Custom validation rules
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
	retcode = (parseInt($(element).val()) < 140 && parseInt($(element).val()) != 0) ;
	if(retcode && !isNaN(parseInt($('#numeroAnosFumante').val())))
$.validator.addMethod("yearsSmokingLowerThanAge", function(value, element) {
	var age = $("#idade").val();
	retcode = parseInt($(element).val()) < parseInt(age);
	if(retcode && !isNaN(parseInt($('#numeroCigarros').val())))
		$('#cargaTabagistica').val(
			parseFloat($('#numeroCigarros').val()) * parseFloat($(element).val()) / 20. 
		);
	return retcode;
}, "Esse campo deve ser menor do que a idade do paciente.");
		$('#cargaTabagistica').val(
			parseFloat($('#numeroAnosFumante').val()) * parseFloat($(element).val()) / 20. 
		);
	return retcode;
}, "N&atilde;o é permitido fumar 0 ou mais que 140 cigarros em um dia");

$.validator.addMethod("GreaterThanBirthYear", function(value, element) {
	var age = $("#idade").val();
	var d = new Date()
	var cYear = d.getFullYear();
	retcode = parseInt($(element).val()) > parseInt(cYear) - parseInt(age);
	return retcode;
}, "Ano anterior ao nascimento do paciente");

$.validator.addMethod("LowerThanCurrentYear", function(value, element) {
	var age = $("#idade").val();
	var d = new Date()
	var cYear = d.getFullYear();
	retcode = parseInt($(element).val()) < parseInt(cYear);
	return retcode;
}, "Ano maior do que o ano atual.");


//After page is loaded set actions
$(document).ready(function(){
	var hlcolor = '#FFF8C6';
	var d = new Date()
	var cYear = d.getFullYear();
	var argNNet = new argumentsNNet();

	//Disables enter
	$("#form_triagem").keypress(function(e) {
		if (e.which == 13) {
			return false;
		}
	});

	//Disables stranges chars for input fields

	$('#nome').keypress(function(e){
		if((e.which > 32 && e.which < 65)||
		   (e.which > 90 && e.which < 97)||
		   (e.which > 122 && e.which < 127)||
		   (e.which > 127 && e.which < 192)){
		return false;
		}
	});

	$('#nome_mae').keypress(function(e){
		if((e.which > 32 && e.which < 65)||
		   (e.which > 90 && e.which < 97)||
		   (e.which > 122 && e.which < 127)||
		   (e.which > 127 && e.which < 192)){
			return false;
		}
	});

	$('#avaliador').keypress(function(e){
		if((e.which > 32 && e.which < 65)||
		   (e.which > 90 && e.which < 97)||
		   (e.which > 122 && e.which < 127)||
		   (e.which > 127 && e.which < 192)){
			return false;
		}
	});

	$('#cep').keypress(function(e){
		if((e.which > 31 && e.which < 48)||(e.which > 57)){
			return false;
		}
	});

	$('#cidade').keypress(function(e){
		if((e.which > 32 && e.which < 65)||
		   (e.which > 90 && e.which < 97)||
		   (e.which > 122 && e.which < 127)||
		   (e.which > 127 && e.which < 192)){
			return false;
		}
	});

	$('#bairro').keypress(function(e){
		if((e.which > 32 && e.which < 65)||
		   (e.which > 90 && e.which < 97)||
		   (e.which > 122 && e.which < 127)||
		   (e.which > 127 && e.which < 192)){
			return false;
		}
	});

	$('#endereco').keypress(function(e){
		if((e.which > 32 && e.which < 44)||
		   (e.which > 57 && e.which < 65)||
		   (e.which > 90 && e.which < 97)||
		   (e.which > 122 && e.which < 127)||
		   (e.which > 127 && e.which < 192)){
			return false;
		}
	});

	//Build birthday calendar
	$('#data_nascimento').datepicker({
			dateFormat: 'dd/mm/yy',
			monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			maxDate: '+0d',
			changeMonth: true,
			changeYear: true,
			maxDate   : '+0y',
			minDate   : '-130y',
			yearRange : '-130:+130',
			dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
			onSelect: function(dateStr){
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
				$('#idade').val(age);
				//After calculate age, check the possibility of TB
				if(age >= 0 && age <= 130){
					argNNet.Set(
									$('#idade').val(),
									$('#tosse').val(),
									$('#hemoptoico').val(),
									$('#sudorese').val(),
									$('#febre').val(),
									$('#emagrecimento').val(),
									$('#dispneia').val(),
									$('#fumante').val(),
									$('#internacaoHospitalar').val(),
									$('#exameSida').val(),
									$('#sida').val()
					);
					$.ajax({
							url:'./cgi-bin/runNet.py',
							dataType:'html',
							data: ({
								idade:argNNet.idade,
								tosse: argNNet.tosse,
								hemoptoico: argNNet.hemoptoico,
								sudorese: argNNet.sudorese,
								febre: argNNet.febre,
								emagrecimento:argNNet.emagrecimento,
								dispneia: argNNet.dispneia,
								fuma: argNNet.fumante,
								internacaoHospitalar: argNNet.internacaoHospitalar,
								sida: argNNet.sida
							}),
							success : function(msg){
								$('#divResultadoRede').html(msg);
								$('#score').val(msg);
							}
						});
				}
			}
	});

	//Checking aids exam date
	years = new Array();
	for (i=cYear-100; i <=cYear; i++)
		years.push(i.toString());

	$('#data_tratamento').autocomplete({
		lookup: years
	});

	$('#data_sida').autocomplete({
		lookup: years
	});


	//Fill States in 'Estado' selectbox
	$.ajax({
		url: './cgi-bin/autocomplete.py',
		data:({service:'state'}),
		dataType : 'json',
		cache: false,
		success : function(data){
			$.each(data.suggestions, function(i, item){
				$('#estado').append($('<option>'+item+'</option>' )
					.val(item)
				);
			});
		}
	});
	$.ajax({
		url: './cgi-bin/autocomplete.py',
		data:({service:'state'}),
		dataType : 'json',
		cache: false,
		success : function(data){
			$.each(data.suggestions, function(i, item){
				$('#naturalidade').append($('<option>'+item+'</option>' )
					.val(item)
				);
			});
		}
	});

	//Autocomplete features
	var ajaxOpt;
	//Set options
	ajaxOpt = {
		serviceUrl:'./cgi-bin/autocomplete.py',
		noCache: true
	};
	//autocomplete triggers
	ac_city = $('#cidade').autocomplete(ajaxOpt);
	ac_city.setOptions({params: {service:'city', state:function(){ return $('#estado').val()}}});

	ac_neighborhood = $('#bairro').autocomplete(ajaxOpt);
	ac_neighborhood.setOptions({params: {service:'neighborhood', city:function(){ return $('#cidade').val()}}});

	ac_street = $('#endereco').autocomplete(ajaxOpt);
	ac_street.setOptions({params: {service:'street', city:function(){ return $('#cidade').val()}}});

	//hide secondary fields
	$('div.secondary').css('display', 'none');
	$('*', 'div.secondary').each(function(){
		if($(this)[0].nodeName == 'SELECT' || $(this)[0].nodeName == 'INPUT' )
			$(this).attr('disabled', 'disabled');
	});

	$('*', 'div.tempoSinais').each(function(){
		if($(this)[0].nodeName == 'SELECT' || $(this)[0].nodeName == 'INPUT' )
			$(this).attr('disabled', 'disabled');
	});

//Take care about the address fields

	$('#cep').keyup(function() {
		var cepForm = $(this).val();
		var format = '#####-###';
		var i = cepForm.length;
		var output = format.substring(0,1);
		var text   = format.substring(i)
		if (text.substring(0,1) != output) $(this).val(cepForm + text.substring(0,1))
		if (cepForm.length == 9){
			$.getJSON('./cgi-bin/autocomplete.py?service=cep&query=' + cepForm, function(json){
				$('#estado').val(json.state);
				$('#cidade').val(json.city);
				$('#endereco').val(json.street);
			});
		}
	});

	$('#dispneia').change(function(){
		var dep = new Array();
		dep[0] = '#divFaltaAr';
		dep[1] = '#divCansaco';
		dep[2] = '#divInterrompeuAtividade';
		dep[3] = '#divAcordaSemAr';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim'){
			for(div in dep){
				var elems = $('*', dep[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).addClass('required');
						$(this).removeAttr('disabled');
				});
				if($(dep[div]).css('display') != 'block')
					$(dep[div]).toggle(function() {
						$(this).css('background-color', hlcolor);
						$(this).animate({backgroundColor : "white"}, 4000);
					});
			}
		} else {
			for(div in dep){
				if(dep[div] == '#divAcordaSemAr'){
					if( $('#chiado').val()  == 'sim' ||
						$('#tosse').val()   == 'sim'
					) continue;
				}
				var elems = $('*', dep[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).removeClass('required');
						$(this).attr('disabled', 'disabled');
				});
				if($(dep[div]).css('display') != 'none')
					$(dep[div]).toggle();
			}
		}
	});
	$('#chiado').change(function(){
		var dep = new Array();
		dep[0] = '#divAcordaSemAr';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim'){
			for(div in dep){
				var elems = $('*', dep[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).addClass('required');
						$(this).removeAttr('disabled');
				});
				if($(dep[div]).css('display') != 'block')
					$(dep[div]).toggle(function() {
						$(this).css('background-color', hlcolor);
						$(this).animate({backgroundColor : "white"}, 4000);
					});
			}
		} else {
			for(div in dep){
				if(dep[div] == '#divAcordaSemAr'){
					if( $('#dispneia').val() == 'sim' ||
						$('#tosse').val()   == 'sim'
					) continue;
				}
				var elems = $('*', dep[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).removeClass('required');
						$(this).attr('disabled', 'disabled');
				});
				if($(dep[div]).css('display') != 'none')
					$(dep[div]).toggle();
			}
		}
	});
	$('#tosse').change(function(){
		var dep = new Array();
		dep[0] = '#divAcordaSemAr';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim'){
			for(div in dep){
				var elems = $('*', dep[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).addClass('required');
						$(this).removeAttr('disabled');
				});
				if($(dep[div]).css('display') != 'block')
					$(dep[div]).toggle(function() {
						$(this).css('background-color', hlcolor);
						$(this).animate({backgroundColor : "white"}, 4000);
					});
			}
		} else {
			for(div in dep){
				if(dep[div] == '#divAcordaSemAr'){
					if( $('#dispneia').val() == 'sim' ||
						$('#tosse').val()   == 'sim'
					) continue;
				}
				var elems = $('*', dep[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).removeClass('required');
						$(this).attr('disabled', 'disabled');
				});
				if($(dep[div]).css('display') != 'none')
					$(dep[div]).toggle();
			}
		}
	});
	$('#tratamentoAnterior').change(function(){
		var dep = new Array();
		dep[0] = '#divDataTratamento';
		dep[1] = '#divLocalTuberculose';
		dep[2] = '#divDesfecho';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim'){
			for(div in dep){
				var elems = $('*', dep[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).addClass('required');
						$(this).removeAttr('disabled');
				});
				if($(dep[div]).css('display') != 'block')
					$(dep[div]).toggle(function() {
						$(this).css('background-color', hlcolor);
						$(this).animate({backgroundColor : "white"}, 4000);
					});
			}
		} else {
			for(div in dep){
				var elems = $('*', dep[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).removeClass('required');
						$(this).attr('disabled', 'disabled');
				});
				if($(dep[div]).css('display') != 'none')
					$(dep[div]).toggle();
			}
		}
	});
	$('#fumante').change(function(){
		var dep = new Array();
		dep[0] = '#divNumeroCigarros';
		dep[1] = '#divNumeroAnosFumante';
		dep[2] = '#divCargaTabagistica';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim' || $(this).val()=='exfumante'){
			for(div in dep){
				var elems = $('*', dep[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).addClass('required');
						$(this).removeAttr('disabled');
				});
				if($(dep[div]).css('display') != 'block')
					$(dep[div]).toggle(function() {
						$(this).css('background-color', hlcolor);
						$(this).animate({backgroundColor : "white"}, 4000);
					});
			}
		} else {
			for(div in dep){
				var elems = $('*', dep[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).removeClass('required');
						$(this).attr('disabled', 'disabled');
				});
				if($(dep[div]).css('display') != 'none')
					$(dep[div]).toggle();
			}
		}
	});

	$('#exameSida').change(function(){
		var dep = new Array();
		dep[0] = '#divDataSida';
		dep[1] = '#divSIDA';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim'){
			for(div in dep){
				var elems = $('*', dep[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).addClass('required');
						$(this).removeAttr('disabled');
				});
				if($(dep[div]).css('display') != 'block')
					$(dep[div]).toggle(function() {
						$(this).css('background-color', hlcolor);
						$(this).animate({backgroundColor : "white"}, 4000);
					});
			}
		} else {
			for(div in dep){
				var elems = $('*', dep[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).removeClass('required');
						$(this).attr('disabled', 'disabled');
				});
				if($(dep[div]).css('display') != 'none')
					$(dep[div]).toggle();
			}
		}
	});

// Check emagrecimento field

	$('#pesoAtual').change(function(){
		if((parseInt($(this).val()) - parseInt($('#pesoHabitual').val()))/parseInt($('#pesoHabitual').val()) < -0.10)
			$('#emagrecimento').val('Sim');
		else
			$('#emagrecimento').val('Não');
	});
	$('#pesoHabitual').change(function(){
		if((parseInt($('#pesoAtual').val()) - parseInt($(this).val()))/parseInt($('#pesoHabitual').val()) < -0.10)
			$('#emagrecimento').val('Sim');
		else
			$('#emagrecimento').val('Não');
	});


//Submit to the neural network to check the patient's possibility of having TB

	$('select.sinais').change(function(){
		if($('#idade').val() > 0 && $('#idade').val() <131){
			argNNet.Set(
						$('#idade').val(),
						$('#tosse').val(),
						$('#hemoptoico').val(),
						$('#sudorese').val(),
						$('#febre').val(),
						$('#dispneia').val(),
						$('#perdaDeApetite').val(),
						$('#fumante').val(),
						$('#internacaoHospitalar').val(),
						$('#exameSida').val(),
						$('#sida').val()
			);
			$.ajax({
					url:'./cgi-bin/runNet.py',
					dataType:'html',
					data: ({
						idade:argNNet.idade,
						tosse: argNNet.tosse,
						hemoptoico: argNNet.hemoptoico,
						sudorese: argNNet.sudorese,
						febre: argNNet.febre,
						emagrecimento:argNNet.emagrecimento,
						dispneia: argNNet.dispneia,
						fuma: argNNet.fumante,
						internacaoHospitalar: argNNet.internacaoHospitalar,
						sida: argNNet.sida
					}),
				success : function(msg){
					$('#divResultadoRede').html(msg);
					$('#score').val(msg);
				}
			});
		}
		elem_id  = $(this).attr('id');
		elem_id = elem_id.charAt(0).toUpperCase() + elem_id.substr(1);
		elem_id = '#tempo' + elem_id;
		if($(this).val() == 'sim'){
			$(elem_id).removeAttr('disabled');
		} else {
			$(elem_id).attr('disabled', true);
		}
	});

	$('#form_triagem').validate({
		rules:{
			altura:{
				range : [30, 230]
			},
			pesoAtual:{
				range : [0, 500]
			},
			pesoHabitual:{
				range : [0, 500]
			},
			data_tratamento:{
				minlength: 4,
				GreaterThanBirthYear : true,
				LowerThanCurrentYear: true,
				maxlength: 4
			},
			numeroAnosFumante:{
				yearsSmokingLowerThanAge: true
			},
			numeroCigarros:{
				numberOfCigarrettes: true
			},
			data_sida:{
				minlength: 4,
				GreaterThanBirthYear : true,
				LowerThanCurrentYear: true,
				maxlength: 4
			}
		}
	});
});
