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
//Make a clock
function showClock(argumento) {
	var time = new Date();
	var hours = time.getHours();
	if (hours.toString().length == 1)
		hours = '0' + hours;
	var minutes = time.getMinutes();
	if (minutes.toString().length == 1)
		minutes = '0' + minutes;
	var timeStr = hours+':'+minutes;
	document.getElementById(argumento).value = timeStr;
	return setInterval("showClock('" + argumento + "');",60000);
}

//After page is loaded set actions
$(document).ready(function(){

	showClock('horarioFimEntrevista');

/*--------------------------------- Logica da Classe Social do Paciente --------------------------------------*/
	$.fn.countPoints = function(){
		var points = 0;
		var fields = ['#quantidadeFreezer','#quantidadeGeladeira','#quantidadeMaquinaLavarRoupa',
					'#quantidadeVideoDVD','#quantidadeTelevisao','#quantidadeRadio','#quantidadeBanheiro',
					'#quantidadeAutomovel','#quantidadeEmpregadaMensalista'];
		for (i in fields){
			field = $(fields[i]);
			if (field.val())
				fieldValue = parseInt(field.val(),10);
			else
				fieldValue = 0;
			if (fields[i] == '#quantidadeFreezer' || fields[i] == '#quantidadeVideoDVD' || fields[i] == '#quantidadeMaquinaLavarRoupa')
			{
				if (fieldValue >= 1)
					points += 2;
			}
			if (fields[i] == '#quantidadeGeladeira')
			{
				if (fieldValue >= 1)
					points += 4;
			}
			if (fields[i] == '#quantidadeTelevisao' || fields[i] == '#quantidadeRadio')
			{
				if (fieldValue <= 4)
					points += fieldValue;
				else
					points += 4;
			}
			if (fields[i] == '#quantidadeBanheiro')
			{
				if (fieldValue >= 1 && fieldValue < 4)
					points += fieldValue + 3;
				else if (fieldValue >= 4 )
					points += 7;
			}
			if (fields[i] == '#quantidadeAutomovel')
			{
				if (fieldValue == 1)
					points += 4;
				else if (fieldValue == 2)
					points += 7;
				else if (fieldValue >= 3)
					points += 9;
			}
			if (fields[i] == '#quantidadeEmpregadaMensalista')
			{
				if (fieldValue == 1)
					points += 3;
				else if (fieldValue >= 2)
					points += 4;
			}
		}
		if ($('#grauInstrucaoChefeFamilia').val() == 'analfabetoPrimarioIncompleto' )
			points += 0;
		else if ($('#grauInstrucaoChefeFamilia').val() == 'primarioCompleto' )
			points += 1;
		else if ($('#grauInstrucaoChefeFamilia').val() == 'ginasialOuFundamentalCompleto' )
			points += 2;
		else if ($('#grauInstrucaoChefeFamilia').val() == 'colegialOuMedioCompleto' )
			points += 4;
		else if ($('#grauInstrucaoChefeFamilia').val() == 'superiorCompleto' )
			points += 8;

		return points;
	}
	$.fn.defineSocialClass = function(totalPoints){
		var points = parseInt(totalPoints,10);
		var socialClass = '';
		if (points >= 0 && points <= 7)
			socialClass = 'E';
		else if (points >= 8 && points <= 13)
			socialClass = 'D';
		else if (points >= 14 && points <= 17)
			socialClass = 'C2';
		else if (points >= 18 && points <= 22)
			socialClass = 'C1';
		else if (points >= 23 && points <= 28)
			socialClass = 'B2';
		else if (points >= 29 && points <= 34)
			socialClass = 'B1';
		else if (points >= 35 && points <= 41)
			socialClass = 'A2';
		else if (points >= 42 && points <= 46)
			socialClass = 'A1';
		return socialClass;
	}
	$('#quantidadeFreezer').change(function(){
		$('#classeSocial').val($().defineSocialClass($().countPoints()));
	});
	$('#quantidadeGeladeira').change(function(){
		$('#classeSocial').val($().defineSocialClass($().countPoints()));
	});
	$('#quantidadeMaquinaLavarRoupa').change(function(){
		$('#classeSocial').val($().defineSocialClass($().countPoints()));
	});
	$('#quantidadeVideoDVD').change(function(){
		$('#classeSocial').val($().defineSocialClass($().countPoints()));
	});
	$('#quantidadeTelevisao').change(function(){
		$('#classeSocial').val($().defineSocialClass($().countPoints()));
	});
	$('#quantidadeRadio').change(function(){
		$('#classeSocial').val($().defineSocialClass($().countPoints()));
	});
	$('#quantidadeBanheiro').change(function(){
		$('#classeSocial').val($().defineSocialClass($().countPoints()));
	});
	$('#quantidadeAutomovel').change(function(){
		$('#classeSocial').val($().defineSocialClass($().countPoints()));
	});
	$('#quantidadeEmpregadaMensalista').change(function(){
		$('#classeSocial').val($().defineSocialClass($().countPoints()));
	});
	$('#grauInstrucaoChefeFamilia').change(function(){
		$('#classeSocial').val($().defineSocialClass($().countPoints()));
	});
/* --------------------------------------------------------------------------------------------------------*/
	$('#numeroMesesFumante').keyup(function(){
		var meses = 0;
		var anos = 0;
		if ($('#numeroMesesFumante').val())
			meses = parseInt($('#numeroMesesFumante').val(),10);
		if ($('#numeroAnosFumante').val())
			anos = parseInt($('#numeroAnosFumante').val(),10);
		if (meses >= 12){
			$('#numeroMesesFumante').val(meses - 12);
			$('#numeroAnosFumante').val(anos + 1);
		}
	});
	$.fn.showFields = function(argumento){
		var dep = argumento;
		for(div in dep){
			var elems = $('*', dep[div]);
			$(elems).each(function(){
				var element = $(this);
				if (   element[0].nodeName != 'FIELDSET'
					&& element[0].nodeName != 'SMALL'
					&& element[0].nodeName != 'OPTION')
					$(this).addClass('required');
					$(this).removeAttr('disabled',false);
				});
			if($(dep[div]).css('display') != 'block')
				$(dep[div]).toggle(function() {
					$(this).css('background-color', hlcolor);
					$(this).animate({backgroundColor : "white"}, 4000);
					});
		}
	}
	$.fn.hideFields = function(argumento){
		var dep = argumento;
		for(div in dep){
			var elems = $('*', dep[div]);
			$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
						&& element[0].nodeName != 'SMALL'
						&& element[0].nodeName != 'OPTION')
						$(this).removeClass('required');
					});
			if($(dep[div]).css('display') != 'none')
				$(dep[div]).toggle();
		}
	}

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

	$('.text').keypress(function(e){
		if((e.which > 32 && e.which < 65)||
			(e.which > 90 && e.which < 97)||
			(e.which > 122 && e.which < 127)||
			(e.which > 127 && e.which < 192)){
		return false;
		}
	});
	$('.data').datepicker({
		dateFormat: 'dd/mm/yy',
		monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Aug','Set','Out','Nov','Dez'],
		maxDate: '+0d',
		changeMonth: true,
		changeYear: true,
		maxDate : '+0y',
		minDate : '-130y',
		yearRange : '-130:+130',
		dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
	});
	$('#cep').keypress(function(e){
		if((e.which > 31 && e.which < 48)||(e.which > 57)){
			return false;
		}
	});
	$('.number').keypress(function(e){
		if((e.which > 31 && e.which < 48)||(e.which > 57)){
			return false;
		}
	});
	$('.money').priceFormat({
		prefix: 'R$ ',
		centsSeparator: ',',
		thousandsSeparator: '.',
		centsLimit: 2
	});

	$('#data_consulta').writePortugueseDate();
	$('#dataFimTriagem').writePortugueseDate();
	//Build birthday calendar
	$('#data_nascimento').datepicker({
			dateFormat: 'dd/mm/yy',
			monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Aug','Set','Out','Nov','Dez'],
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
							dataType:'json',
							cache: false,
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
							success : function(response){
								$('#divResultadoRede').html('');
								var msg = $('<div />');
								var msgOrientacao = $('#msgResultado');
								msgOrientacao.html('');
								if(response.TB == 'no'){
									msgOrientacao.append('Se Doença Pulmonar(Asma brônquica, DPOC, Bronquiectasia), agilizar consulta com médico do pulmão. Caso contrário, encaminhar para consulta com clínico geral.');
									msg.append($('<strong />')
										.append('O paciente não possui TB')
									);
									$('#score').val('nao');
								} else {
									msg.append($('<strong />')
										.append('O paciente tem probabilidade '+response.probability.toUpperCase()+' de possuir TB.')
									);
									if(response.probability == 'baixa') { 
										msg.css('border', '10px green solid');
										msgOrientacao.append('Encaminhar para o clínico geral.');
									} else if (response.probability == 'média') {
										msg.css('border', '10px yellow solid');
										msgOrientacao.append('Agilizar realização de BAAR.');
									} else if(response.probability == 'alta'){
										msg.css('border', '10px red solid');
										msgOrientacao.append('Agilizar realização de BAAR e cultura (quando disponível), e consulta com médico da TB ou do pulmão.');
									}
									msg.css('padding', '15px');
									msg.css('width', '650px');
									$('#score').val(response.probability);
								}
									'O paciente não possui TB';
								$('#divResultadoRede').append(msg);
							}
						});
				}
			}
	});


	//Checking aids exam date
	years = new Array();
	for (i=cYear-100; i <=cYear; i++)
		years.push(i.toString());

	$('#data_ultimo_tratamento').autocomplete({
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

	$('#tipoUnidade').change(function(){
			var dep1 = new Array();
			dep1[0] = '#divMotivoVindaUnidadeSaude';
			dep1[1] = '#divProcurouUnidadeSaudePorOrientacao';
			var dep2 = new Array();
			dep2[0] = '#divCausasNaoMedicas';
			dep2[1] = '#divCausasMedicas';
			dep2[2] = '#divResponsavelPeloEncaminhamentoParaInternacao';
			if($(this).val()=='ambulatorio'){
				$().showFields(dep1);
				$().hideFields(dep2);
			}else if ($(this).val()=='hospital'){
				$().showFields(dep2);
				$().hideFields(dep1);
			}
	});
	$('#pacienteExcluido').change(function(){
			var dep = new Array();
			dep[0] = '#divDataAssinatura';
			if($(this).val()=='nao')
				$().showFields(dep);
			else
				$().hideFields(dep);
	});

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
		if($(this).val()=='sim')
			$().showFields(dep);
		else{
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
		if($(this).val()=='sim')
			$().showFields(dep);
		else {
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
		if($(this).val()=='sim')
			$().showFields(dep);
		else {
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
	$('#motivoVindaUnidadeSaude').change(function(){
		var dep = new Array();
		dep[0] = '#divEspecificarMotivoVindaUnidadeSaude';
		if ($(this).val() == 'outros')
			$().showFields(dep);
		else
			$().hideFields(dep);
	});
	$('#contatoTuberculosePositiva').change(function(){
			var dep = new Array();
			dep[0] = '#divTipoContatoTuberculosePositiva';
			if($(this).val()=='sim')
				$().showFields(dep);
			else
				$().hideFields(dep);
	});
	$('#contatoTuberculoseResistente').change(function(){
			var dep = new Array();
			dep[0] = '#divTipoContatoTuberculoseResistente';
			if($(this).val()=='sim')
				$().showFields(dep);
			else
				$().hideFields(dep);
	});
	$('#tratamentoAnterior').change(function(){
		var dep = new Array();
		dep[0] = '#divQuantasVezesTratouTB';
		dep[1] = '#divDataUltimoTratamento';
		dep[2] = '#divLocalTuberculose';
		dep[3] = '#divDesfecho';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim')
			$().showFields(dep);
		else
			$().hideFields(dep);
	});
	$('#fumante').change(function(){
		var dep = new Array();
		dep[0] = '#divNumeroCigarros';
		dep[1] = '#divTempoFumante';
		dep[2] = '#divCargaTabagistica';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim' || $(this).val()=='exfumante')
			$().showFields(dep);
		else
			$().hideFields(dep);
	});

	$('#exameSida').change(function(){
		var dep = new Array();
		dep[0] = '#divDataSida';
		dep[1] = '#divSIDA';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim')
			$().showFields(dep);
		else
			$().hideFields(dep);
	});

	$('#freezer').change(function(){
			var dep = new Array();
			dep[0] = '#divQuantidadeFreezer';
			if($(this).val()=='sim')
				$().showFields(dep);
			else
				$().hideFields(dep);
	});

	$('#geladeira').change(function(){
			var dep = new Array();
			dep[0] = '#divQuantidadeGeladeira';
			if($(this).val()=='sim')
				$().showFields(dep);
			else
				$().hideFields(dep);
	});
	$('#maquinaLavarRoupa').change(function(){
			var dep = new Array();
			dep[0] = '#divQuantidadeMaquinaLavarRoupa';
			if($(this).val()=='sim')
				$().showFields(dep);
			else
				$().hideFields(dep);
	});
	$('#videoDVD').change(function(){
			var dep = new Array();
			dep[0] = '#divQuantidadeVideoDVD';
			if($(this).val()=='sim')
				$().showFields(dep);
			else
				$().hideFields(dep);
	});
	$('#televisao').change(function(){
			var dep = new Array();
			dep[0] = '#divQuantidadeTelevisao';
			if($(this).val()=='sim'){
			for(div in dep){
			var elems = $('*', dep[div]);
			$(elems).each(function(){
				var element = $(this);
				if (   element[0].nodeName != 'FIELDSET'
					&& element[0].nodeName != 'SMALL'
					&& element[0].nodeName != 'OPTION')
					$(this).addClass('primary');
					$(this).removeAttr('disabled');
					$(this).addClass('number');
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
						});
				if($(dep[div]).css('display') != 'none')
					$(dep[div]).toggle();
			}
			}
	});
	$('#radio').change(function(){
			var dep = new Array();
			dep[0] = '#divQuantidadeRadio';
			if($(this).val()=='sim'){
			for(div in dep){
			var elems = $('*', dep[div]);
			$(elems).each(function(){
				var element = $(this);
				if (   element[0].nodeName != 'FIELDSET'
					&& element[0].nodeName != 'SMALL'
					&& element[0].nodeName != 'OPTION')
					$(this).addClass('primary');
					$(this).removeAttr('disabled');
					$(this).addClass('number');
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
						});
				if($(dep[div]).css('display') != 'none')
					$(dep[div]).toggle();
			}
			}
	});
	$('#banheiro').change(function(){
			var dep = new Array();
			dep[0] = '#divQuantidadeBanheiro';
			if($(this).val()=='sim'){
			for(div in dep){
			var elems = $('*', dep[div]);
			$(elems).each(function(){
				var element = $(this);
				if (   element[0].nodeName != 'FIELDSET'
					&& element[0].nodeName != 'SMALL'
					&& element[0].nodeName != 'OPTION')
					$(this).addClass('primary');
					$(this).removeAttr('disabled');
					$(this).addClass('number');
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
						});
				if($(dep[div]).css('display') != 'none')
					$(dep[div]).toggle();
			}
			}
	});
	$('#automovel').change(function(){
			var dep = new Array();
			dep[0] = '#divQuantidadeAutomovel';
			if($(this).val()=='sim'){
			for(div in dep){
			var elems = $('*', dep[div]);
			$(elems).each(function(){
				var element = $(this);
				if (   element[0].nodeName != 'FIELDSET'
					&& element[0].nodeName != 'SMALL'
					&& element[0].nodeName != 'OPTION')
					$(this).addClass('primary');
					$(this).removeAttr('disabled');
					$(this).addClass('number');
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
						});
				if($(dep[div]).css('display') != 'none')
					$(dep[div]).toggle();
			}
			}
	});
	$('#empregadaMensalista').change(function(){
			var dep = new Array();
			dep[0] = '#divQuantidadeEmpregadaMensalista';
			if($(this).val()=='sim'){
			for(div in dep){
			var elems = $('*', dep[div]);
			$(elems).each(function(){
				var element = $(this);
				if (   element[0].nodeName != 'FIELDSET'
					&& element[0].nodeName != 'SMALL'
					&& element[0].nodeName != 'OPTION')
					$(this).addClass('primary');
					$(this).removeAttr('disabled');
					$(this).addClass('number');
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
						});
				if($(dep[div]).css('display') != 'none')
					$(dep[div]).toggle();
			}
			}
	});
	$('#procurouUnidadeSaudePorOrientacao').change(function(){
			var dep = new Array();
			dep[0] = '#divEspecificacaoEncaminhamento';
			if($(this).val()=='encaminhadoPorOutroServicoDeSaude' || $(this).val() == 'outros'){
			for(div in dep){
			var elems = $('*', dep[div]);
			$(elems).each(function(){
				var element = $(this);
				if (   element[0].nodeName != 'FIELDSET'
					&& element[0].nodeName != 'SMALL'
					&& element[0].nodeName != 'OPTION')
					$(this).addClass('primary');
					$(this).removeAttr('disabled');
					$(this).addClass('text');
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
						});
				if($(dep[div]).css('display') != 'none')
					$(dep[div]).toggle();
			}
			}
	});
// Check emagrecimento field

	$('#pesoAtual').change(function(){
		if (($(this).val() != 0)&&($('#pesoHabitual').val() != 0))
		{
			var dep = new Array();
			dep[0] = '#divTempoEmagrecimento';
			if ($(this).val() < $('#pesoHabitual').val())
			{
				for(div in dep)
				{
					var elems = $('*', dep[div]);
					$(elems).each(function(){
						var element = $(this);
						if (   element[0].nodeName != 'FIELDSET'
							&& element[0].nodeName != 'SMALL'
							&& element[0].nodeName != 'OPTION')
							$(this).addClass('primary');
							$(this).removeAttr('disabled');
							$(this).addClass('number');
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
							});
					if($(dep[div]).css('display') != 'none')
						$(dep[div]).toggle();
					$('#emagrecimento').val('Não');
				}
			}
		}
	});
	$('#pesoHabitual').change(function(){
		if (($(this).val() != 0)&&($('#pesoAtual').val() != 0))
		{
			var dep = new Array();
			dep[0] = '#divTempoEmagrecimento';
			if ($('#pesoAtual').val() < $(this).val())
			{
				for(div in dep)
				{
					var elems = $('*', dep[div]);
					$(elems).each(function(){
						var element = $(this);
						if (   element[0].nodeName != 'FIELDSET'
							&& element[0].nodeName != 'SMALL'
							&& element[0].nodeName != 'OPTION')
							$(this).addClass('primary');
							$(this).removeAttr('disabled');
							$(this).addClass('number');
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
							});
					if($(dep[div]).css('display') != 'none')
						$(dep[div]).toggle();
					$('#emagrecimento').val('Não');
				}
			}
		}
	});

	$('#pesoAtual').change(function(){
		if ($('#tempoEmagrecimento').val()>=1 && $('#tempoEmagrecimento').val()<3)
		{
			if((parseInt($('#pesoHabitual').val()) - parseInt($('#pesoAtual').val()))/parseInt($('#pesoHabitual').val()) > 0.05)
				$('#emagrecimento').val('Sim');
			else
				$('#emagrecimento').val('Não');
		}else if ($('#tempoEmagrecimento').val()>=3 && $('#tempoEmagrecimento').val()<6){
			if((parseInt($('#pesoHabitual').val()) - parseInt($('#pesoAtual').val()))/parseInt($('#pesoHabitual').val()) > 0.075)
				$('#emagrecimento').val('Sim');
			else
				$('#emagrecimento').val('Não');
		}else if ($('#tempoEmagrecimento').val()>=6){
			if((parseInt($('#pesoHabitual').val()) - parseInt($('#pesoAtual').val()))/parseInt($('#pesoHabitual').val()) > 0.10)
				$('#emagrecimento').val('Sim');
			else
				$('#emagrecimento').val('Não');
		}
	});
	$('#pesoHabitual').change(function(){
		if ($('#tempoEmagrecimento').val()>=1 && $('#tempoEmagrecimento').val()<3)
		{
			if((parseInt($('#pesoHabitual').val()) - parseInt($('#pesoAtual').val()))/parseInt($('#pesoHabitual').val()) > 0.05)
				$('#emagrecimento').val('Sim');
			else
				$('#emagrecimento').val('Não');
		}else if ($('#tempoEmagrecimento').val()>=3 && $('#tempoEmagrecimento').val()<6){
			if((parseInt($('#pesoHabitual').val()) - parseInt($('#pesoAtual').val()))/parseInt($('#pesoHabitual').val()) > 0.075)
				$('#emagrecimento').val('Sim');
			else
				$('#emagrecimento').val('Não');
		}else if ($('#tempoEmagrecimento').val()>=6){
			if((parseInt($('#pesoHabitual').val()) - parseInt($('#pesoAtual').val()))/parseInt($('#pesoHabitual').val()) > 0.10)
				$('#emagrecimento').val('Sim');
			else
				$('#emagrecimento').val('Não');
		}
	});
	$('#tempoEmagrecimento').change(function(){
		if ($('#tempoEmagrecimento').val()>=1 && $('#tempoEmagrecimento').val()<3)
		{
			if((parseInt($('#pesoHabitual').val()) - parseInt($('#pesoAtual').val()))/parseInt($('#pesoHabitual').val()) > 0.05)
				$('#emagrecimento').val('Sim');
			else
				$('#emagrecimento').val('Não');
		}else if ($('#tempoEmagrecimento').val()>=3 && $('#tempoEmagrecimento').val()<6){
			if((parseInt($('#pesoHabitual').val()) - parseInt($('#pesoAtual').val()))/parseInt($('#pesoHabitual').val()) > 0.075)
				$('#emagrecimento').val('Sim');
			else
				$('#emagrecimento').val('Não');
		}else if ($('#tempoEmagrecimento').val()>=6){
			if((parseInt($('#pesoHabitual').val()) - parseInt($('#pesoAtual').val()))/parseInt($('#pesoHabitual').val()) > 0.10)
				$('#emagrecimento').val('Sim');
			else
				$('#emagrecimento').val('Não');
		}
	});


	$('#bebida').change(function(){
		var dep = new Array();
		dep[0] = '#divDiminuirQuantidadeBebida';
		dep[1] = '#divCriticasModoBeber';
		dep[2] = '#divBebePelaManha';
		dep[3] = '#divCulpadoManeiraBeber';
		dep[4] = '#divCriterioCage';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim'){
			$('#criterioCage').val('Negativo');
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
			$('#criterioCage').val('');
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

//Check bebida field
	var indiceCriterioCage;
	var contadorSim;
	var contadorNao;
	$('.criterio_cage').change(function(){
		indiceCriterioCage = 0;
		contadorSim = 0;
		contadorNao = 0;
		while (indiceCriterioCage <= 3)
		{
			if ($('#criterio_cage_' + indiceCriterioCage).val() == 'sim')
				contadorSim++;
			if ($('#criterio_cage_' + indiceCriterioCage).val() == 'nao')
				contadorNao++;
			indiceCriterioCage++;
		}
		if (contadorSim >= 2)
			$('#criterioCage').val('Positivo');
		if (contadorNao > 2)
			$('#criterioCage').val('Negativo');
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
				dataType:'json',
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
				success : function(response){
					$('#divResultadoRede').html('');
					var msg = $('<div />');
					var msgOrientacao = $('#msgResultado');
					msgOrientacao.html('');
					if(response.TB == 'no'){
						msgOrientacao.append('Se Doença Pulmonar, agilizar consulta com médico do pulmão. Caso contrário, encaminhar para consulta com clínico geral');
						msg.append($('<strong />')
							.append('O paciente não possui TB')
						);
						$('#score').val('nao');
					} else {
						msg.append($('<strong />')
							.append('O paciente tem probabilidade '+response.probability.toUpperCase()+' de possuir TB.')
						);
						if(response.probability == 'baixa') { 
							msg.css('border', '10px green solid');
							msgOrientacao.append('Encaminhar para o clínico geral.');
						} else if (response.probability == 'média') {
							msg.css('border', '10px yellow solid');
							msgOrientacao.append('Agilizar realização de BAAR.');
						} else if(response.probability == 'alta'){
							msg.css('border', '10px red solid');
							msgOrientacao.append('Agilizar realização de BAAR e cultura (quando disponível), e consulta com médico da TB ou do pulmão.');
						}
						msg.css('padding', '15px');
						msg.css('width', '650px');
						$('#score').val(response.probability);
					}
						'O paciente não possui TB';
					$('#divResultadoRede').append(msg);
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
	var valorOpcaoTempoExpectoracao;
	$('#tempoExpectoracao').change(function(){
	valorOpcaoTempoExpectoracao = $('#tempoExpectoracao').val();
	if (valorOpcaoTempoExpectoracao.substring(2,valorOpcaoTempoExpectoracao.length)== 'anos')
	{
		if(!$('#msgTosse').html())
			$('#msgTosse').append('<font color="red">Tempo de Expectoração maior que 24 meses, favor encaminhar para clínica.</font>');
	}else
		$('#msgTosse').html('');
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
			tempoResidenteEstadoAtual:{
				yearsLowerThanAge: true
			},
			cargaTabagistica:{
				max:   500,
				warningCT: true,
				checkCT: true
			},
			avaliacao:{
				max:	10
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
