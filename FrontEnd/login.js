
const formulaire = document.querySelector(".info-login");
formulaire.addEventListener("submit", async function (event) {

    event.preventDefault(); 
 
    // Création de l’objet
    const login = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value
    };

    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(login);

    const requete = await fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },  
        body: chargeUtile
    });
    const reponse = await requete.json();

    console.log (reponse);


        

});