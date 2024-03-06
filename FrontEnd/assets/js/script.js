// Récupération des données "Catégories" via l'API
const categoriesJSON = await fetch("http://localhost:5678/api/categories");
const categories = await categoriesJSON.json();

// Récupération des données "Projets" via l'API
const projetsJSON = await fetch("http://localhost:5678/api/works");
const projets = await projetsJSON.json();


// Initialisation de la page
let sectionGallery = document.querySelector(".gallery");
let sectionFiltres = document.querySelector(".filtre");
let module = false
affichageFiltres(categories)
affichageProjets(projets, sectionGallery)


// Affichage des differents boutons des filtres
function affichageFiltres(categories) {

	const buttonTous = document.createElement("button")
	buttonTous.innerText = "Tous"
	sectionFiltres.appendChild(buttonTous);

	buttonTous.addEventListener("click", function () {
		sectionGallery.innerHTML = "";
		affichageProjets(projets, sectionGallery);
	});

    // Création des boutons et de leur eventListener
	for (let i = 0; i < categories.length; i++) {
        let categorieName = categories[i].name   
        let button = document.createElement("button")
        button.innerText = categorieName;
        sectionFiltres.appendChild(button);

		button.addEventListener("click", function () {
			const projetsFiltre = projets.filter(function (projet) {
				return projet.categoryId === i+1;
			});
			sectionGallery.innerHTML = "";
			affichageProjets(projetsFiltre, sectionGallery);
		});
    }
}


// Affichage des differents projets en fonction des filtres
function affichageProjets(projetsFiltre, section) {
    for (let i = 0; i < projetsFiltre.length; i++) {
        let projetImage = projetsFiltre[i].imageUrl
        let projetTitle = projetsFiltre[i].title
        let elementHTML

        if (module) {
            elementHTML = document.createElement("div")
            elementHTML.innerHTML = `
                <img src="${projetImage}" alt="${projetTitle}">
                <i class="fa-solid fa-trash-can fa-xs"></i>
                `;  
        } else {
            elementHTML = document.createElement("figure")
            elementHTML.innerHTML = `
                <img src="${projetImage}" alt="${projetTitle}">
                <figcaption>${projetTitle}</figcaption>
                `;
        }

        section.appendChild(elementHTML);
     }
}


// Gestion de la page une fois connecté
let token = window.sessionStorage.getItem("token")
if (token) {
    affichageModeEdition()
}

// Affichage du mode Edition
function affichageModeEdition() {
    // Ajout du bandeau noir
    const bandeau = document.getElementById("bandeau")
    bandeau.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>
    <span>Mode édition</span>`
    bandeau.classList.add("bandeau")

    // Ajout du bouton "modifier"
    const modifProjets = document.getElementById("modifProjets")
    modifProjets.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>
    <span>modifier</span>`

    // Décalage du titre "Mes Projets"
    const titreProjets = document.getElementById("titreProjets")
    titreProjets.classList.add("titreProjets")

    // Masquage des filtres
    const filtres = document.querySelector(".filtre")
    filtres.classList.add("inactive")

    // Modification du bouton log-in en log-out
    const log_in_out = document.getElementById("log_in_out")
    log_in_out.innerHTML = `<a href="#">logout</a>` 

    // Ajouts des EventListeners
        // LogOut
        log_in_out.addEventListener("click", function () {
            window.sessionStorage.removeItem("token")
            location.reload()
        });
        // Modifier
        modifProjets.addEventListener("click", function () {
            affichageModule()
        })
}


// Affichage du PopUp
function affichageModule() {
    // Création du PopUp en HTML
    const popup = document.getElementById("popup")
    popup.innerHTML = `<div class="popupContainer">
        <div class="popupContainer_boutons">
            <a class="popupContainer_fermeture" id="popupContainer_fermeture" href="#"><i class="fa-solid fa-xmark fa-lg"></i></a>
            <a class="popupContainer_retour" href="#"><i class="fa-solid fa-arrow-left fa-xl"></i></a>
        </div>
        <div class="popupContainer_titre">Galerie photo</div>
        <div class="popupContainer_content">
            <div class="popupContainer_images"></div>
            <div class="popupContainer_validation">
                <button class="bouton">Ajouter une photo</button>
            </div>
        </div>
        <form action="#" method="post" class="popupContainer_form">
            <div class="popupForm_Ajoutphoto" id="ajoutPhoto">
                <i class="fa-regular fa-image fa-5x"></i>
                <input type="button" value="+ Ajouter photo"></input>
                <p>jpg, png : 4mo max</p>
            </div>
            <label for="titre">Titre</label>
            <input type="titre" name="titre" id="titre">
            <label for="categories">Catégorie</label>
            <input type="categories" name="categories" id="categories">
            <div class="popupContainer_validation">
                <input type="submit" value="Valider">
                <div class="erreur"></div>
            </div>
        </form>
    </div>`

    // Déclaration des différents éléments créés pour le PopUp
    const popupRetour = document.querySelector(".popupContainer_retour")
    const popupFermeture = document.querySelector(".popupContainer_fermeture")
    const popupTitre = document.querySelector(".popupContainer_titre")
    const popupContent = document.querySelector(".popupContainer_content")   
    const popupImages = document.querySelector(".popupContainer_images")
    const popupValidation = document.querySelector(".popupContainer_validation button")
    const popupForm = document.querySelector(".popup form")

    // Masquage du bouton retour et du formulaire
    popupRetour.classList.add("inactive")
    popupForm.classList.add("inactive")

    // Ajouts des différentes photos dans le PopUp
    module = true
    popupImages.innerHTML = ""
    affichageProjets(projets, popupImages);

    // Affichage du PopUp
    popup.classList.add("active")

    // Ajouts des EventListeners
        // Fermeture du PopUp avec la croix
        popupFermeture.addEventListener("click", function () {
            MasquageModule()
        })
        // Fermeture du PopUp en cliquant en dehors du PopUp
        popup.addEventListener("click", function (event) {
            if (event.target.id === "popup") {
                MasquageModule()
                console.log("test")
            }
        })
        // Ouverture de la deuxième partie du PopUp
        popupValidation.addEventListener("click", function () {
            AffichageAjoutPhoto(popupRetour, popupTitre, popupContent, popupForm)
        })
        // Retour à la première partie du PopUp
        popupRetour.addEventListener("click", function () {
            MasquageAjoutPhoto(popupRetour, popupTitre, popupContent, popupForm)
        })
}

// Masquage du PopUp
function MasquageModule() {
    module = false
    popup.classList.remove("active")
}

// Affichage de la deuxième partie du PopUp
function AffichageAjoutPhoto(popupRetour, popupTitre, popupContent, popupForm) {
    popupRetour.classList.remove("inactive")
    popupTitre.innerText = "Ajout photo"
    popupContent.classList.add("inactive")
    popupForm.classList.remove("inactive")

    // Déclaration des différents éléments
    const form = document.querySelector("form")
    const boutonAjoutPhoto = document.querySelector(".popupForm_Ajoutphoto input")

    // Ajouts des EventListeners
        // Choix d'une image
        boutonAjoutPhoto.addEventListener("click", function (event) {
            event.preventDefault();
        })
}

// Retour à la première partie du PopUp
function MasquageAjoutPhoto(popupRetour, popupTitre, popupContent, popupForm) {
    popupRetour.classList.add("inactive")
    popupTitre.innerText = "Galerie photo"
    popupContent.classList.remove("inactive")
    popupForm.classList.add("inactive")
}

