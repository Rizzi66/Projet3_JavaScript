const reponse = await fetch("http://localhost:5678/api/works");
const projets = await reponse.json();

for (let i = 0; i < projets.length; i++) {
    let projetImage = projets[i].imageUrl
    let projetTitle = projets[i].title

    let figure = document.createElement("figure")
    figure.innerHTML = `
        <img src="${projetImage}" alt="${projetTitle}">
        <figcaption>${projetTitle}</figcaption>
        `;

    let parentElement = document.querySelector(".gallery");
    parentElement.appendChild(figure);
 }

