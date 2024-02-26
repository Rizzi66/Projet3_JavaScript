// Mise en place d'un listener sur le bouton "Se connecter"
const form = document.querySelector("form")

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Récupération des différentes valeurs présente dans les champs de saisies
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value

    // Mise en forme pour POST HTTP
    const bodyLogin = {
        "email": email,
        "password": password,
    }
    const bodyLoginJSON = JSON.stringify(bodyLogin);
    
    // Envoie de la requète HTTP
    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyLoginJSON,
    })

    // Récupération de la réponse HTTP et stockage du token
    const data = await reponse.json()
    if (reponse.ok) {
      const token = data.token
      window.localStorage.setItem("token", token);
      location.href = "./index.html";
    } else {
        document.getElementById("erreur").innerText = "Nom d'utilisateur ou mot de passe incorrect";
    }
});


