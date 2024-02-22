//Récupération des données "Projets" via l'API
const reponse = await fetch("http://localhost:5678/api/works");
const projets = await reponse.json();

//Initialisation de la page
let sectionGallery = document.querySelector(".gallery");
affichageProjets(projets)


//Affichage des differents projets en fonction des filtres
function affichageProjets(projetsfiltrer) {

    for (let i = 0; i < projetsfiltrer.length; i++) {
        let projetImage = projetsfiltrer[i].imageUrl
        let projetTitle = projetsfiltrer[i].title
    
        let figure = document.createElement("figure")
        figure.innerHTML = `
            <img src="${projetImage}" alt="${projetTitle}">
            <figcaption>${projetTitle}</figcaption>
            `;

        sectionGallery.appendChild(figure);
     }

}


//gestion des bouttons
const boutonTous = document.querySelector(".filtre_tous");
boutonTous.addEventListener("click", function () {
	sectionGallery.innerHTML = "";
	affichageProjets(projets);
});

const boutonObjets = document.querySelector(".filtre_objets");
boutonObjets.addEventListener("click", function () {
	const projetsObjets = projets.filter(function (projet) {
		return projet.categoryId === 1;
	});
	sectionGallery.innerHTML = "";
	affichageProjets(projetsObjets);
});

const boutonAppart = document.querySelector(".filtre_appart");
boutonAppart.addEventListener("click", function () {
	const projetsAppart = projets.filter(function (projet) {
		return projet.categoryId === 2;
	});
	sectionGallery.innerHTML = "";
	affichageProjets(projetsAppart);
});

const boutonHotel = document.querySelector(".filtre_hotel");
boutonHotel.addEventListener("click", function () {
	const projetsHotel = projets.filter(function (projet) {
		return projet.categoryId === 3;
	});
	sectionGallery.innerHTML = "";
	affichageProjets(projetsHotel);
});
