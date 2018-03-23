$(function () {
    "use strict";
	load_list();
	$('#search-field').on('input propertychange paste', load_list);
});


/*jslint indent: 4 */
/*global $, jQuery, window */
window.FontAwesomeConfig = {
	searchPseudoElements: true
};

function compareName(a, b) {
    "use strict";
    return a.name.localeCompare(b.name);
}

function compareCat(a, b) {
    "use strict";
	return a.cat - b.cat;
}

function load_list() {
    "use strict";
	
	//Noms des catégories
	var catNames = ["Pour tous...", "Administratif", "Etat Civil, Elections", "Ressources & Médias", "DSI", "Culture", "Espace public"];
	
	jQuery.getJSON('applis.conf', function (APPLIS) {
		
		var HTML = '', catSorted = [], DEFAULT = APPLIS.applis[0], applis = APPLIS.applis.sort(compareCat);
		//Ranger les applis par catégorie
		applis.forEach(function (cat) {
			if (catSorted[cat.cat] === void 0) { catSorted[cat.cat] = []; }
			catSorted[cat.cat].push(cat);
		});
		//Parcourir les catégories
		catSorted.forEach(function (thisCat, index) {
			//Ecrire le titre et créer la liste
			var UL = "<ul class='list_applis'>";
			//Parcourir les applis
			thisCat = thisCat.sort(compareName);
			//vérification du nombre d'applis
			var NB = 0;
			thisCat.forEach(function (obj) {
				if ((obj.name.search(new RegExp($('#search-field').val(), "i")) >= 0 || obj.tags.search(new RegExp($('#search-field').val(), "i")) >= 0 || $('#search-field').val() === '') && obj.name !== 'Default') {
					NB++;
					UL += "<li class='applis_item ";
					var ICLASS = '', DESC = '', ICON = '';
					if (obj.icon !== '') {
						ICON = obj.icon;
					} else {
						ICON = DEFAULT.icon;
					}
					//Ajout de classes pour le statut		
					var STATUT = null;
					if(obj.status_file !== void 0){
						$.ajax({
							url :'app_status/'+obj.status_file,
							async: false,
							dataType: "text",
							success: function(data, status, xhr) {
								//On regarde la date de dernière modification du fichier
								var LAST_M = moment(xhr.getResponseHeader('Last-Modified')).valueOf();
								//si elle est supérieure à 10 min, on considère que le serveur ne réussit plus à récupérer le statut.
								if(LAST_M !== void 0 && moment.duration(moment().valueOf()-LAST_M).asMinutes() < 10){
									STATUT = data.split('\n')[0];
								}else{
									STATUT = 'UNKNOWN';
								}
							}
						});
					}
					
					switch (STATUT) {
					case 'CRITICAL':
						UL += 'app_down';
						ICLASS = "fa-exclamation-circle";
						DESC = "Cette application est indisponible.";
						break;
					case 'OK':
						UL += 'app_up';
						ICLASS = "";
						DESC = obj.desc;
						break;
					case 'WARNING':
						UL += 'app_maintenance';
						ICLASS = "fa-cog fa-spin";
						DESC = "Maintenance en cours,<br>de retour bientôt...";
						break;
					/*case 3:
						UL += 'app_unreachable';
						ICLASS = "fa fa-question-circle";
						// ICON = "./img/warning.png";
						DESC = "Appli injoignable";
						break;*/
					case 'UNKNOWN':
					default:
						UL += 'app_no_status';
						ICLASS = "";
						DESC = obj.desc;
					}
					UL += "'><a class='main_link' href='" + obj.url + "' target='_BLANK' title=\"" + DESC + "\">";
					UL += "<img src='" + ICON + "'>";
					UL += "<span class='app_name'>" + obj.name + "</span></a>";
					UL += "<a class='fill_cont' href='" + obj.url + "' target='_BLANK' title=\"" + DESC + "\"><div class='right_img'></div><div class='filler'><i class='fa fa-lg " + ICLASS + "'></i><span class='text'>" + DESC + "</span></div></a></li>";
				}
			});
			UL += "</ul>";
			//S'il n'y a aucune application, on n'affiche pas la catégorie.
			if(NB > 0) HTML += "<h2>" + catNames[index] + " ("+NB+")</h2>"+UL;
		});
		$('.applis_cont').html(HTML);
	});
}