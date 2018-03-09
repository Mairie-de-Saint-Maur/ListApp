$(function () {

	load_list();
	$('#search-field').on('input propertychange paste', load_list);
});
	window.FontAwesomeConfig = {
		searchPseudoElements: true
	}
function compare(a,b) {
  return a.name.localeCompare(b.name)
}

function load_list(){
	jQuery.getJSON('applis.conf', function(APPLIS) {
		HTML = '';
		//Récupérer les paramètres de l'appli Default
		DEFAULT = APPLIS.applis[0];
		applis = APPLIS.applis.sort(compare);
		applis.forEach(function (obj, index){
			if((obj.name.search(new RegExp($('#search-field').val(), "i")) >= 0 || obj.tags.search(new RegExp($('#search-field').val(), "i")) >= 0 || $('#search-field').val() == '') && obj.name != 'Default'){
				HTML += "<li class='applis_item ";
				if (obj.icon != ''){
					ICON = obj.icon;
				}else{
					ICON = DEFAULT.icon;
				}
				//Ajout de classes pour le statut
				// STATUT = true; //Utiliser les URI
				STATUT = Math.round(Math.random()*2); //Génère des statuts aléatoires pour test
				switch(STATUT) {
					case 0:
						HTML += 'app_down';
						// ICON = "./img/down.png";
						DESC = "Appli en panne !"
						break;
					case 2:
						HTML += 'app_maintenance';
						// ICON = "./img/warning.png";
						DESC = "Appli en maintenance, de retour bientôt..."
						break;
					case 1:
					default:
						HTML += 'app_up';
						DESC = obj.desc;
				}
				HTML += "' title='"+DESC+"'><a href='"+obj.url+"' target='_BLANK'>";
				HTML+= "<img src='"+ICON+"'>";
				HTML += obj.name;
				HTML += "</a></li>";
			}
		});
		$('.list_applis').html(HTML);
	});
}