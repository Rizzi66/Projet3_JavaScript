// Récupération des données "Catégories" via l'API
const categoriesJSON = await fetch("http://localhost:5678/api/categories");
const categories = await categoriesJSON.json();

// Récupération des données "Projets" via l'API
let projetsJSON = await fetch("http://localhost:5678/api/works");
let projets = await projetsJSON.json();

// Gestion de la page une fois connecté
let token = window.sessionStorage.getItem("token")
if (token) {
    affichageModeEdition()
}

// Initialisation de la page
const sectionGallery = document.querySelector(".gallery");
const modaleImages = document.querySelector(".modaleContainer_images")
let photoModale = true
let eventListenersActive = false
let modalePart2Active = false
let formImageValid = false
let formTitreValid = false

// Lancement des fonctions de démarrage
affichageCategories(categories)
affichageProjets(projets)

// Affichage des differentes categories et boutons des filtres
function affichageCategories(categories) {
    // Création bouton "Tous"
    const sectionFiltres = document.querySelector(".filtre");
	const buttonTous = document.createElement("button")
	buttonTous.innerText = "Tous"
	sectionFiltres.appendChild(buttonTous);

    // Eventlistener du bouton "Tous"
	buttonTous.addEventListener("click", function () {
        photoModale = false
		sectionGallery.innerHTML = "";
		affichageProjets(projets);
	});

    //  Boucle pour la création des autres catégories
	for (let i = 0; i < categories.length; i++) {
        // Récupération des différents éléments utile
        let categorieName = categories[i].name   
        let categorieID = categories[i].id

        // Création des différents boutons
        const button = document.createElement("button")
        button.innerText = categorieName;
        sectionFiltres.appendChild(button);

        // Multiples eventlistener des boutons (pour filtrage)
        button.addEventListener("click", function () {
			const projetsFiltre = projets.filter(function (projet) {
				return projet.categoryId === i+1;
			});
            photoModale = false
			sectionGallery.innerHTML = "";
			affichageProjets(projetsFiltre);
		});

        // Création et ajout des catégories dans le formulaire de la modale
        const selectCategories = document.getElementById("categories")
        const option = document.createElement("option")
        option.innerText = categorieName
        option.value = categorieName
        option.dataset.id = categorieID
        selectCategories.appendChild(option);
    }
}

// Affichage des differents projets en fonction des filtres (pour la modale et la page d'accueil)
function affichageProjets(projets) {
    // Boucle pour sélectionné les projets à afficher
    for (let i = 0; i < projets.length; i++) {
        // Récupération des différents éléments utile
        let projetImage = projets[i].imageUrl
        let projetTitle = projets[i].title
        let projetID = projets[i].id

        // Création image (en double) 
        const elementHTML_img = document.createElement("img") 
        const elementHTML_img2 = document.createElement("img") 
        elementHTML_img.src = projetImage
        elementHTML_img2.src = projetImage
        elementHTML_img.alt = projetTitle
        elementHTML_img2.alt = projetTitle

        // Création figcaption pour titre
        const elementHTML_figcap = document.createElement("figcaption")
        elementHTML_figcap.innerText = projetTitle

        // Création et Ajout dans le code du HTML
        const elementHTML_fig = document.createElement("figure")
        elementHTML_fig.appendChild(elementHTML_img)
        elementHTML_fig.appendChild(elementHTML_figcap)
        sectionGallery.appendChild(elementHTML_fig);

        // Vérif si les photos de la modale doivent etre ajouté
        if (photoModale) {        
            // Création icone suppression
            const elementHTML_icone = document.createElement("i") 
            elementHTML_icone.classList.add("fa-solid", "fa-trash-can", "fa-xs")
            elementHTML_icone.dataset.id = projetID

            // Multiples eventlistener de la suppression des photos
            elementHTML_icone.addEventListener("click", function () {
                SupprimerProjet(projetID)
            })

            // Création et ajout des photos dans la modale
            const elementHTML_div = document.createElement("div")
            elementHTML_div.appendChild(elementHTML_img2)
            elementHTML_div.appendChild(elementHTML_icone)
            modaleImages.appendChild(elementHTML_div)
        }
     }
}

// Affichage du mode Edition
function affichageModeEdition() {
    // Ajout du bandeau noir
    const bandeau = document.getElementById("bandeau")
    bandeau.classList.remove("inactive")

    // Masquage de la marge du header
    const header = document.querySelector("header")
    header.classList.add("margin")

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
    log_in_out.innerText = "logout" 

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
    // Ajouts des EventListeners de la modale (1 fois seulement)
    if (!eventListenersActive) {
        eventListenersActive = true
        AjoutEventListenerModale()
    }

    // Affichage de la modale
    const modale = document.getElementById("modale")  
    modale.classList.remove("inactive")
}

// Ajouts des EventListeners de la modale
function AjoutEventListenerModale() {
    // Déclaration des différents éléments
    const modaleRetour = document.querySelector(".modaleContainer_retour")
    const modaleFermeture = document.querySelector(".modaleContainer_fermeture")
    const modaleValidation = document.querySelector(".modaleContainer_validation button")
    const modaleForm = document.querySelector(".modaleContainer_form")
    const ajoutPhotoBouton = document.querySelector(".ajoutPhoto_container input")
    const ajoutPhotoContainer = document.querySelector(".ajoutPhoto_container")
    const ajoutPhotoImage = document.querySelector(".modaleForm_ajoutPhoto img")
    const erreur = document.querySelector(".erreur")    
    const formTitre = document.getElementById("titre")
    const modaleSubmit = document.getElementById("modaleForm_valider")

    // Fermeture de la modale en cliquant en dehors de la modale
    modale.addEventListener("click", function (event) {
        if (event.target.id === "modale") {
            MasquageModale(ajoutPhotoContainer, ajoutPhotoImage, erreur, modaleSubmit)
            modalePart2Active = false
            affichageAjoutPhoto(modaleRetour, modaleForm)
        }
    })

    // Fermeture de la modale avec la croix
    modaleFermeture.addEventListener("click", function () {
    MasquageModale(ajoutPhotoContainer, ajoutPhotoImage, erreur, modaleSubmit)
    modalePart2Active = false
    affichageAjoutPhoto(modaleRetour, modaleForm)
    })

    // Ouverture de la deuxième partie de la modale
    modaleValidation.addEventListener("click", function () {
        modalePart2Active = true
        affichageAjoutPhoto(modaleRetour, modaleForm)
    })

    // Retour à la première partie de la modale
    modaleRetour.addEventListener("click", function () {
        modalePart2Active = false
        affichageAjoutPhoto(modaleRetour, modaleForm)
    })

    // Chargement de l'image de prévisualisation
    ajoutPhotoBouton.addEventListener("change", function () {
        const fichier = this.files[0]
        AffichageImagePrevisu(fichier, ajoutPhotoContainer, ajoutPhotoImage, erreur, modaleSubmit)
    })

    // Création d'un lien entre l'image et l'input de sélection de fichier
    ajoutPhotoImage.addEventListener("click", function () {
        ajoutPhotoBouton.click()
    })

    // Vérification de l'input "titre"
    formTitre.addEventListener("keyup", function () {
        if (formTitre.value.trim() === "") {
            formTitreValid = false
        } else {
            formTitreValid = true
        }
        GrisageSubmit(modaleSubmit)
    })

    // Envoie du formulaire AjoutPhoto
    modaleForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        AjouterProjet(modaleRetour, modaleForm)
    })
}

// Affichage ou masquage de la deuxième partie de la modale
function affichageAjoutPhoto(modaleRetour, modaleForm) {
    // Déclaration des différents éléments
    const modaleTitre = document.querySelector(".modaleContainer_titre")
    const modaleContent = document.querySelector(".modaleContainer_content") 

    // Verification de la partie actuellement affiché sur la modale pour (de)afficher l'autre partie
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
function MasquageModale(ajoutPhotoContainer, ajoutPhotoImage, erreur, modaleSubmit) {
    // Masquage de la modale
    modale.classList.add("inactive")

    // Remise à zéro de la prévisualisation
    ajoutPhotoImage.src = ""
    ajoutPhotoImage.classList.add("inactive")
    ajoutPhotoContainer.classList.remove("inactive")
    formImageValid = false

    // Remise à zéro du champ "erreur"
    erreur.innerText = "";
    erreur.classList.add("inactive")

    // Remise à zéro du champ "titre"
    const inputTitre = document.getElementById("titre")
    inputTitre.value = ""
    formTitreValid = false

    // Gestion de la couleur du bouton "Valider"
    GrisageSubmit(modaleSubmit)
}

// Chargement et affichage de l'image de prévisualisation dans la deuxième partie de la modale
function AffichageImagePrevisu(fichier, ajoutPhotoContainer, ajoutPhotoImage, erreur, modaleSubmit) {
    // Déclaration des éléments
    const reader = new FileReader()
    const tailleMax = 4194304 

    // Ajout d'un EventListener pour savoir quand le reader à charger l'image sélectionné
    reader.addEventListener("load", function () {
        // Prévisualisation de l'image
        ajoutPhotoImage.src = reader.result;
        ajoutPhotoImage.classList.remove("inactive")
        ajoutPhotoContainer.classList.add("inactive")

        // Gestion de la couleur du bouton "Valider"
        formImageValid = true 
        GrisageSubmit(modaleSubmit)       
    });

    // Vérification du format de l'image sélectionné
    if (fichier.type === "image/jpeg" || fichier.type === "image/png"){
        // Vérification de la taille de l'image sélectionné
        if (fichier.size <= tailleMax) {
            // Suppression de l'erreur et chargement du fichier dans le reader
            erreur.classList.add("inactive")
            erreur.innerText = "";
            reader.readAsDataURL(fichier);
        }
        else {
            // Affichage de l'erreur
            erreur.innerText = "L'image sélectionnée a une taille supérieur à 4mo";
            erreur.classList.remove("inactive")

            // Remise à zéro de la prévisualisation
            ajoutPhotoImage.src = ""
            ajoutPhotoImage.classList.add("inactive")
            ajoutPhotoContainer.classList.remove("inactive")

            // Gestion de la couleur du bouton "Valider"
            formImageValid = false
            GrisageSubmit(modaleSubmit)
        }
    } else {
        // Affichage de l'erreur
        erreur.innerText = "L'image sélectionnée n'est pas un jpg / png";
        erreur.classList.remove("inactive")

        // Remise à zéro de la prévisualisation
        ajoutPhotoImage.src = ""
        ajoutPhotoImage.classList.add("inactive")
        ajoutPhotoContainer.classList.remove("inactive")

        // Gestion de la couleur du bouton "Valider"
        formImageValid = false
        GrisageSubmit(modaleSubmit)
    }
}

// Grisage du bouton submit "Valider" lorsque les champs ne sont pas correctement rempli
function GrisageSubmit(modaleSubmit) {
    if (formImageValid && formTitreValid) {
        modaleSubmit.classList.remove("nonValide")
    } else {
        modaleSubmit.classList.add("nonValide")
    }
}

// Ajout d'un nouveau projet via un POST HTTP
async function AjouterProjet(modaleRetour, modaleForm) {
    // Récupération des différents éléments
    const formFile = modaleForm.file
    const formTitre = modaleForm.titre
    const formCategories = modaleForm.categories
    const categorieSelected = formCategories[formCategories.selectedIndex]

    // Conversion au bon formats des différents éléments
    const inputFile = formFile.files[0]
    const inputTitre = formTitre.value
    const inputCategories = categorieSelected.getAttribute("data-id")

    // Création du FormData avec les différents éléments
    const formData = new FormData();
    formData.append("image", inputFile);
    formData.append("title", inputTitre);
    formData.append("category", inputCategories);

    // Création du FormHeaders avec l'authorization
    const formHeader = new Headers();
    formHeader.append('Authorization', `Bearer ${token}`);
    
    // Envoi de la requète HTTP POST
    const reponse = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: formHeader,
        body: formData,
    })

    // Récupération des données "Projets" via l'API
    projetsJSON = await fetch("http://localhost:5678/api/works");
    projets = await projetsJSON.json();

    // Rechargement des projets
    photoModale = true
    sectionGallery.innerHTML = "";
    modaleImages.innerHTML = "";
    affichageProjets(projets)

    // Retour à la page précédente de la modale
    modalePart2Active = false
    affichageAjoutPhoto(modaleRetour, modaleForm)
}

async function SupprimerProjet(id) {
    // Création du FormHeaders avec l'authorization
    const formHeader = new Headers();
    formHeader.append('Authorization', `Bearer ${token}`);

    // Configuration de l'url de l'élément à supprimer
    let url = "http://localhost:5678/api/works/" + id

    // Envoi de la requète HTTP DELETE
    const reponse = await fetch(url, {
        method: "DELETE",
        headers: formHeader
    })

    // Récupération des données "Projets" via l'API
    projetsJSON = await fetch("http://localhost:5678/api/works");
    projets = await projetsJSON.json();

    // Rechargement des projets
    photoModale = true
    sectionGallery.innerHTML = "";
    modaleImages.innerHTML = "";
    affichageProjets(projets)
}