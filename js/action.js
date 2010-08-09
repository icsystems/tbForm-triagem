
(function($){
	$.fn.writePortugueseDate = function(){
		var element = $(this[0]);
		var mydate=new Date()
		var year=mydate.getYear()
		if (year<2000)
		year += (year < 1900) ? 1900 : 0
		var day=mydate.getDay()
		var month=mydate.getMonth()
		var daym=mydate.getDate()
		if (daym<10)
		daym="0"+daym
		var dayarray=new Array(
			"Domingo",
			"Segunda-feira",
			"Terça-feira",
			"Quarta-feira",
			"Quinta-feira",
			"Sexta-feira",
			"Sábado"
		);
		var montharray=new Array(
			"de Janeiro de ",
			"de Fevereiro de ",
			"de Março de ",
			"de Abril de ",
			"de Maio de ",
			"de Junho de",
			"de Julho de ",
			"de Agosto de ",
			"de Setembro de ",
			"de Outubro de ",
			"de Novembro de ",
			"de Dezembro de "
		);
		var msg = dayarray[day]+", "+daym+" "+montharray[month]+year;
		element.val(msg);
	};
})(jQuery);

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

function calculateAge(dateStr){
	var data = new Date();
	var arrayData = dateStr.split('/');
	var ano = parseInt(arrayData[2]);
	var mes = parseInt(arrayData[1],10);
	var dia = parseInt(arrayData[0],10);
	var mesAtual = data.getMonth() + 1;
	var diaAtual = data.getDate();
	var anoAtual = data.getFullYear();
	var idade = anoAtual - ano;
	if (mesAtual < mes) idade--;
	if (mes == mesAtual && diaAtual < dia) idade--;
	return idade;
}

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

	$('#pesoAtual').keypress(function(e){
		if((e.which > 31 && e.which < 48)||(e.which > 57)){
			return false;
		}
	});

	$('#pesoHabitual').keypress(function(e){
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

	$('#data_consulta').writePortugueseDate();
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
				var age = calculateAge(dateStr);
				$('#idade').val(age);
				$('#idade').valid();
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
		onkeyup: false,
		onclick: false,
		rules:{
			altura:{
				range : [30, 250],
				validIMC : true,
				warningHeight : true
			},
// JQuery UI calendar confuses the focus and blur events
// The validation will be done directly to the calendar's code
			idade:{
				warningAge: true,
				warningMaritalState: true
			},
			pesoAtual:{
				range : [1, 500],
				validIMC : true,
				warningWeight : true
			},
			pesoHabitual:{
				range : [1, 500]
			},
			estado_civil:{
				warningMaritalState:true
			},
			data_tratamento:{
				minlength: 4,
				GreaterThanBirthYear : true,
				LowerThanCurrentYear: true,
				maxlength: 4
			},
			numeroAnosFumante:{
				CantSmokeFor70Years: true,
				yearsSmokingLowerThanAge: true,
				warningYearsSmoking: true
			},
			numeroCigarros:{
				numberOfCigarrettes: true,
				warningNumberOfCigarrettes: true
			},
			cargaTabagistica:{
				max:   500,
				warningCT: true,
				checkCT: true
			},
			data_sida:{
				lowerThanHIVTest:true,
				minlength: 4,
				GreaterThanBirthYear : true,
				LowerThanCurrentYear: true,
				maxlength: 4
			},
			tempoTosse:{
				warningSymptoms:'20meses'
			},
			tempoExpectoracao:{
				warningSymptoms:'12meses'
			},
			tempoHemoptoico:{
				warningSymptoms:'16semanas'
			},
			tempoSudorese:{
				warningSymptoms:'24semanas'
			},
			tempoFebre:{
				warningSymptoms:'20semanas'
			},
			tempoDispneia:{
				warningSymptoms:'12meses'
			},
			tempoPerdaDeApetite:{
				warningSymptoms:'14meses'
			}
		}
	});
});
