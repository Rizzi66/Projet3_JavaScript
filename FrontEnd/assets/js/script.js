// Récupération des données "Catégories" via l'API
const categoriesJSON = await fetch("http://localhost:5678/api/categories");
const categories = await categoriesJSON.json();

// Récupération des données "Projets" via l'API
const projetsJSON = await fetch("http://localhost:5678/api/works");
const projets = await projetsJSON.json();

// Initialisation de la page
let sectionGallery = document.querySelector(".gallery");
let sectionFiltres = document.querySelector(".filtre");
let modaleActive = false
let eventListenersActive = false
let modalePart2Active = false
affichageFiltres(categories)
affichageProjets(projets, sectionGallery)

// Gestion de la page une fois connecté
let token = window.sessionStorage.getItem("token")
if (token) {
    affichageModeEdition()
}

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

        if (modaleActive) {
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

// Affichage du mode Edition
function affichageModeEdition() {
    // Ajout du bandeau noir
    const bandeau = document.getElementById("bandeau")
    bandeau.classList.remove("inactive")

    // Ajout du bouton "modifier"
    const modifProjets = document.getElementById("modifProjets")
    modifProjets.classList.remove("inactive")

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
            location.href="./index.html"
        });
        // Modifier
        modifProjets.addEventListener("click", function () {
            affichageModale()
        })
}

// Affichage de la modale
function affichageModale() {
    // Déclaration des différents éléments
    const modale = document.getElementById("modale")  
    const modaleImages = document.querySelector(".modaleContainer_images")

    // Ajouts des EventListeners de la modale (1 fois seulement)
    if (!eventListenersActive) {
        eventListenersActive = true
        AjoutEventListenerModale()
    }

    // Ajouts des différentes photos dans la modale
    modaleActive = true
    modaleImages.innerHTML = ""
    affichageProjets(projets, modaleImages);

    // Affichage de la modale
    modale.classList.remove("inactive")
}

// Ajouts des EventListeners de la modale
function AjoutEventListenerModale() {
    // Déclaration des différents éléments
    const modaleRetour = document.querySelector(".modaleContainer_retour")
    const modaleFermeture = document.querySelector(".modaleContainer_fermeture")
    const modaleValidation = document.querySelector(".modaleContainer_validation button")
    const ajoutPhotoBouton = document.querySelector(".ajoutPhoto_container input")
    const ajoutPhotoContainer = document.querySelector(".ajoutPhoto_container")
    const ajoutPhotoImage = document.querySelector(".modaleForm_Ajoutphoto img")

    // Fermeture de la modale en cliquant en dehors de la modale
    modale.addEventListener("click", function (event) {
        if (event.target.id === "modale") {
            MasquageModale(ajoutPhotoContainer, ajoutPhotoImage)
            modalePart2Active = false
            affichageAjoutPhoto(modaleRetour)
        }
    })

    // Fermeture de la modale avec la croix
    modaleFermeture.addEventListener("click", function () {
    MasquageModale(ajoutPhotoContainer, ajoutPhotoImage)
    modalePart2Active = false
    affichageAjoutPhoto(modaleRetour)
    })

    // Ouverture de la deuxième partie de la modale
    modaleValidation.addEventListener("click", function () {
        modalePart2Active = true
        affichageAjoutPhoto(modaleRetour)
    })

    // Retour à la première partie de la modale
    modaleRetour.addEventListener("click", function () {
        modalePart2Active = false
        affichageAjoutPhoto(modaleRetour)
    })

    // Chargement de l'image de prévisualisation
    ajoutPhotoBouton.addEventListener("change", function () {
        const fichier = this.files[0]
        AffichageImagePrevisu(fichier, ajoutPhotoContainer, ajoutPhotoImage)
    })

    // Création d'un lien entre l'image et l'input de sélection de fichier
    ajoutPhotoImage.addEventListener("click", function () {
        ajoutPhotoBouton.click()
    })
}

// Affichage ou masquage de la deuxième partie de la modale
function affichageAjoutPhoto(modaleRetour) {
    // Déclaration des différents éléments
    const modaleTitre = document.querySelector(".modaleContainer_titre")
    const modaleContent = document.querySelector(".modaleContainer_content") 
    const modaleForm = document.querySelector(".modaleContainer_form")

    // Verification de la partie de la modale afficher à l'écran pour afficher ou masquer les différents élements
    if (modalePart2Active) {
        modaleRetour.classList.remove("inactive")
        modaleTitre.innerText = "Ajout photo"
        modaleContent.classList.add("inactive")
        modaleForm.classList.remove("inactive")
    } else {
        modaleRetour.classList.add("inactive")
        modaleTitre.innerText = "Galerie photo"
        modaleContent.classList.remove("inactive")
        modaleForm.classList.add("inactive")
    }
}

// Masquage de la modale
function MasquageModale(ajoutPhotoContainer, ajoutPhotoImage) {
    modaleActive = false
    modale.classList.add("inactive")

    // Remise à zéro de la deuxième partie de la modale
    ajoutPhotoImage.src = ""
    ajoutPhotoImage.classList.add("inactive")
    ajoutPhotoContainer.classList.remove("inactive")
}

// Chargement et affichage de l'image de prévisualisation dans la deuxième partie du module
function AffichageImagePrevisu(fichier, ajoutPhotoContainer, ajoutPhotoImage) {
    const reader = new FileReader()
    const tailleMax = 4194304 
    const erreur = document.querySelector(".erreur")

    reader.addEventListener("load", function () {
        ajoutPhotoImage.src = reader.result;
        ajoutPhotoImage.classList.remove("inactive")
        ajoutPhotoContainer.classList.add("inactive")
    });

    if (fichier.type === "image/jpeg" || fichier.type === "image/png"){
        if (fichier.size <= tailleMax) {
            erreur.classList.add("inactive")
            erreur.innerText = "";
            reader.readAsDataURL(fichier);
        }
        else {
            erreur.innerText = "L'image sélectionnée a une taille supérieur à 4mo";
            erreur.classList.remove("inactive")
        }
    } else {
        erreur.innerText = "L'image sélectionnée n'est pas un jpg / png";
        erreur.classList.remove("inactive")
    }
}