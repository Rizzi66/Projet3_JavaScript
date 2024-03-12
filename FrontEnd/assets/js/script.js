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
let formImageValid = false
let formTitreValid = false
affichageCategories(categories)
affichageProjets(projets, sectionGallery)

// Gestion de la page une fois connecté
let token = window.sessionStorage.getItem("token")
console.log(token)
if (token) {
    affichageModeEdition()
}

// Affichage des differentes categories et boutons des filtres (pour la modale ou la page d'accueil)
function affichageCategories(categories) {
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
        let categorieID = categories[i].id

        let button = document.createElement("button")
        button.innerText = categorieName;
        sectionFiltres.appendChild(button);

        const selectCategories = document.getElementById("categories")
        let option = document.createElement("option")
        option.innerText = categorieName
        option.value = categorieName
        option.dataset.id = categorieID
        selectCategories.appendChild(option);


		button.addEventListener("click", function () {
			const projetsFiltre = projets.filter(function (projet) {
				return projet.categoryId === i+1;
			});
			sectionGallery.innerHTML = "";
			affichageProjets(projetsFiltre, sectionGallery);
		});
    }
}

// Affichage des differents projets en fonction des filtres (pour la modale ou la page d'accueil)
function affichageProjets(projetsFiltre, section) {
    for (let i = 0; i < projetsFiltre.length; i++) {
        let projetImage = projetsFiltre[i].imageUrl
        let projetTitle = projetsFiltre[i].title
        let projetID = projetsFiltre[i].id
        let elementHTML

        if (modaleActive) {
            elementHTML = document.createElement("div")

            let elementHTML_img = document.createElement("img") 
            elementHTML_img.src = projetImage
            elementHTML_img.alt = projetTitle

            let elementHTML_icone = document.createElement("i") 
            elementHTML_icone.classList.add("fa-solid", "fa-trash-can", "fa-xs")
            elementHTML_icone.dataset.id = projetID

            elementHTML_icone.addEventListener("click", function () {
                SupprimerProjet(projetID)
            })

            elementHTML.appendChild(elementHTML_img)
            elementHTML.appendChild(elementHTML_icone)
            console.log(elementHTML)

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
        AjouterProjet(modaleForm)
    })
}

// Affichage ou masquage de la deuxième partie de la modale
function affichageAjoutPhoto(modaleRetour, modaleForm) {
    // Déclaration des différents éléments
    const modaleTitre = document.querySelector(".modaleContainer_titre")
    const modaleContent = document.querySelector(".modaleContainer_content") 

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
function MasquageModale(ajoutPhotoContainer, ajoutPhotoImage, erreur, modaleSubmit) {
    const inputTitre = document.getElementById("titre")

    modaleActive = false
    modale.classList.add("inactive")

    // Remise à zéro de la deuxième partie de la modale
    ajoutPhotoImage.src = ""
    ajoutPhotoImage.classList.add("inactive")
    ajoutPhotoContainer.classList.remove("inactive")
    formImageValid = false
    erreur.innerText = "";
    erreur.classList.add("inactive")
    inputTitre.value = ""
    formTitreValid = false

    GrisageSubmit(modaleSubmit)
}

// Chargement et affichage de l'image de prévisualisation dans la deuxième partie du module
function AffichageImagePrevisu(fichier, ajoutPhotoContainer, ajoutPhotoImage, erreur, modaleSubmit) {
    const reader = new FileReader()
    const tailleMax = 4194304 

    reader.addEventListener("load", function () {
        ajoutPhotoImage.src = reader.result;
        console.log(reader.result)
        ajoutPhotoImage.classList.remove("inactive")
        ajoutPhotoContainer.classList.add("inactive")
        formImageValid = true 
        GrisageSubmit(modaleSubmit)       
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
            ajoutPhotoImage.src = ""
            ajoutPhotoImage.classList.add("inactive")
            ajoutPhotoContainer.classList.remove("inactive")
            formImageValid = false
            GrisageSubmit(modaleSubmit)
        }
    } else {
        erreur.innerText = "L'image sélectionnée n'est pas un jpg / png";
        erreur.classList.remove("inactive")
        ajoutPhotoImage.src = ""
        ajoutPhotoImage.classList.add("inactive")
        ajoutPhotoContainer.classList.remove("inactive")
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

// Mise en forme du POST HTTP pour ajouter un nouveau projet
async function AjouterProjet(modaleForm) {
    const inputFile = modaleForm.file.files[0]
    console.log(inputFile)
    const inputCategories = modaleForm.categories
    const categorieSelected = inputCategories[inputCategories.selectedIndex]
    console.log(categorieSelected.getAttribute("data-id"))
    console.log(modaleForm.titre.value)


    const formData = new FormData();
    console.log(formData)
    formData.append("image", inputFile);
    console.log(formData)
    formData.append("title", modaleForm.titre.value);
    console.log(formData)
    formData.append("category", categorieSelected.getAttribute("data-id"));
    console.log(formData)


    // let token = window.sessionStorage.getItem("token")
    console.log(token)
    const formHeader = new Headers();
    formHeader.append('Authorization', `Bearer ${token}`);
    // const bodyLogin = {
    //     "email": form.email.value,
    //     "password": form.password.value,
    // }
    // const bodyLoginJSON = JSON.stringify(bodyLogin);
    
    // Envoie de la requète HTTP
    const reponse = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: formHeader,
        body: formData,
    })

    // Récupération de la réponse HTTP et stockage du token
    const data = await reponse.json()
    console.log(data)
    // if (reponse.ok) {
    //   const token = data.token
    //   window.sessionStorage.setItem("token", token);
    //   location.href = "./index.html";
    // } else {
    //     document.querySelector(".erreur").innerText = "Nom d'utilisateur ou mot de passe incorrect";
    // }

}

async function SupprimerProjet(id) {

    console.log(token)
    const formHeader = new Headers();
    formHeader.append('Authorization', `Bearer ${token}`);

    let url = "http://localhost:5678/api/works/" + id

    const reponse = await fetch(url, {
        method: "DELETE",
        headers: formHeader,
    })

    const data = await reponse.json()
    console.log(data)
}