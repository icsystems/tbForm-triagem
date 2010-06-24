
function argumentsNNet(){
	this.idade;
	this.tosse;
	this.hemoptoico;
	this.sudorese;
	this.febre;
	this.emagrecimento;
	this.dispneia;
	this.anorexia;
	this.fumante;
	this.TBXPulmonar;
	this.internacaoHospitalar;
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
				hemoptise,
				sudorese,
				febre,
				emagrecimento,
				dispneia,
				anorexia,
				fumante,
				localTuberculose,
				tratamentoAnterior,
				internacaoHospitalar,
				sida
){
	this.idade                   = idade;
	this.tosse                   = tosse ;
	this.hemoptoico              = hemoptoico;
	if(hemoptise == 'sim')
		this.hemoptoico          = 'sim';
	this.sudorese = sudorese;
	this.febre = febre;
	if(emagrecimento == 'Sim') this.emagrecimento = 'sim';
	else this.emagrecimento = 'nao';
	this.dispneia = dispneia;
	this.anorexia = anorexia;
	this.fumante = fumante;
	if(fumante != 'sim') this.fumante = 'nao';
	if(tratamentoAnterior == 'sim' &&
		(localTuberculose=='extrapulmonar' ||
		localTuberculose=='pulmonarEExtrapulmonar')
		){
		this.TBXPulmonar = 'sim';
	}else{
		if (tratamentoAnterior == 'ignorado' || localTuberculose == 'ignorado')
			this.TBXPulmonar = 'ignorado';
		else this.TBXPulmonar = 'nao';
	}
	this.internacaoHospitalar = internacaoHospitalar;
	this.sida = sida;
}

//After page is loaded set actions
$(document).ready(function(){
	var hlcolor = '#FFF8C6';
	var argNNet = new argumentsNNet();

	//Disables enter
	$("#form_triagem").keypress(function(e) {
		if (e.which == 13) {
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
			onSelect: function(date){
				var cd = new Date();
				var cEpochs = parseInt(cd.getTime()-cd.getMilliseconds())/1000;
				var d = new Date();
				d.setDate(parseInt(date[0]+date[1]));
				d.setMonth(parseInt(date[3]+date[4])-1);
				d.setYear(parseInt(date[6]+date[7]+date[8]+date[9]));
				var epochs = parseInt(d.getTime()-d.getMilliseconds())/1000;
				var age = parseInt((cEpochs - epochs)/31556926);
				if(d.getDate() == cd.getDate()) age++;
				$('#idade').val(age);
				//After calculate age, check the possibility of TB
				if(age >= 0 && age <= 130){
					argNNet.Set(
									$('#idade').val(),
									$('#tosse').val(),
									$('#hemoptoico').val(),
									$('#hemoptise').val(),
									$('#sudorese').val(),
									$('#febre').val(),
									$('#emagrecimento').val(),
									$('#dispneia').val(),
									$('#perdaDeApetite').val(),
									$('#fumante').val(),
									$('#localTuberculose').val(),
									$('#tratamentoAnterior').val(),
									$('#internacaoHospitalar').val(),
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
								anorexia: argNNet.anorexia,
								fuma: argNNet.fumante,
								TBXPulmonar: argNNet.TBXPulmonar,
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

	//Checking previous treatment date
	$('#data_tratamento').datepicker({
			dateFormat: 'dd/mm/yy',
			monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			maxDate: '+0d',
			changeMonth: true,
			changeYear: true,
			maxDate   : '+0y',
			minDate   : '-130y',
			yearRange : '-130:+130',
			dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
	});
	//Checking previous treatment date
	$('#data_sida').datepicker({
			dateFormat: 'dd/mm/yy',
			monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			maxDate: '+0d',
			changeMonth: true,
			changeYear: true,
			maxDate   : '+0y',
			minDate   : new Date(1980, 1 - 1, 1),
			yearRange : '-10:+10',
			dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
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

	$('#sida').change(function(){
		var dep = new Array();
		dep[0] = '#divDataSida';
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
//Submit to the neural network to check the patient's possiblity of having TB

	$('select.sinais').change(function(){
			if($('#idade').val() > 0 && $('#idade').val() <131)
				argNNet.Set(
							$('#idade').val(),
							$('#tosse').val(),
							$('#hemoptoico').val(),
							$('#hemoptise').val(),
							$('#sudorese').val(),
							$('#febre').val(),
							$('#emagrecimento').val(),
							$('#dispneia').val(),
							$('#perdaDeApetite').val(),
							$('#fumante').val(),
							$('#localTuberculose').val(),
							$('#tratamentoAnterior').val(),
							$('#internacaoHospitalar').val(),
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
							anorexia: argNNet.anorexia,
							fuma: argNNet.fumante,
							TBXPulmonar: argNNet.TBXPulmonar,
							internacaoHospitalar: argNNet.internacaoHospitalar,
							sida: argNNet.sida
						}),
					success : function(msg){
						$('#divResultadoRede').html(msg);
						$('#score').val(msg);
					}
				});
		});



	$('#form_triagem').validate({
		rules:{
			altura:{
				range : [30, 230]
			},
			pesoAtual:{
				range : [0, 400]
			},
			pesoHabitual:{
				range : [0, 300]
			}
		}
	});

});
