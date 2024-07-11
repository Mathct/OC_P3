//////////////////////////////////////////////////////////////////
///Gestion du login
//////////////////////////////////////////////////////////////////


// recuperation du formulaire et ma zone de message d'erreur
const formulaire = document.querySelector(".info-login");
const message = document.getElementById("message-error");

// Gestion du submit de mon formulaire
formulaire.addEventListener("submit", async function (event) {

    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
 
    // Création de l’objet login
    const login = {
        email: email,
        password: password
    };

    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(login);

    try 
    {
        const requete = await fetch("http://localhost:5678/api/users/login", {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },  
            body: chargeUtile
        });

        const reponse = await requete.json();

        // si probleme d'identifiant ou mdp

        if (!requete.ok)
        {
            message.style.visibility = 'visible';
            message.textContent = "Erreur dans l’identifiant ou le mot de passe";
    
        }

        // si identification ok
        else
        {
            
            message.style.visibility = 'hidden';
            const token = reponse.token;
            localStorage.setItem('TokenAuth', token);
            window.location.href = 'index.html';

        }

    }

    // si mon serveur n'est pas lancé
    catch (error) 
    {
        message.style.visibility = 'visible';
        message.textContent = "Serveur indisponible. Veuillez réessayer plus tard";
    }


    


        

});