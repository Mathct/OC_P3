// Test connexion et déconnexion //

const textlog = document.getElementById("login_logout");
let token = window.localStorage.getItem('TokenAuth');
    if (token != null)
    {
        
        textlog.textContent = "logout";
    }

textlog.addEventListener ("click", function () {

    if (token == null)
    {
        window.location.href = 'login.html';
        
    }

    else
    {
        window.localStorage.removeItem("TokenAuth");
        window.location.href = 'index.html';
    }   

});



//recuperation et stockage des données works sur l'api
const reponse = await fetch('http://localhost:5678/api/works');
const works = await reponse.json();
//recuperation et stockage des données categories sur l'api
const reponse2 = await fetch('http://localhost:5678/api/categories');
const category = await reponse2.json();


//fonction pour afficher la liste complete des works
function afficherWorks(works){
    for (let i = 0; i < works.length; i++) {

        const work = works[i];
        // Récupération de l'élément du DOM qui accueillera les "works"
        const groupWork = document.querySelector(".gallery"); 
        // Création d’une balise dédiée aux "works"
        const workElement = document.createElement("figure"); 
        // Création des img (lien + alt) 
        const imageWork = document.createElement("img");
        imageWork.src = work.imageUrl;
        imageWork.alt = work.title;
        // Création des titres en "figcaption" afin de respecter le html
        const titreWork = document.createElement("figcaption");
        titreWork.innerText = work.title;

        // On rattache le workElement (figures) au groupWork (gallery)
        groupWork.appendChild(workElement);
        // On rattache les deux elements (img et title) au workElement (figures) 
        workElement.appendChild(imageWork);
        workElement.appendChild(titreWork);
    }
}

// et on execute la fonction
afficherWorks(works);



// Extraction des noms uniques des catégories 
const uniqueNamesSet = new Set(category.map(item => item.name));
// Transformation en tableau pour faire le sort et avoir un resultat en tableau
const uniqueNamesArray = Array.from(uniqueNamesSet);
// Tri des noms uniques par ordre décroissant d'ID associé
const listeNames = uniqueNamesArray.sort((nameA, nameB) => {
    // Trouver les IDs associés aux noms pour le tri
    const idA = category.find(item => item.name === nameA).id;
    const idB = category.find(item => item.name === nameB).id;
    // Comparaison pour le tri décroissant
    return idA - idB;
});

if (listeNames.length != 0)
{
    listeNames.unshift('Tous');
}



// Gestion des bouton filtres

const group = document.getElementById("filtres");
group.innerHTML = "";

    // creation des boutons
for (let i=0; i<listeNames.length; i++)
    {
        const bouton = document.createElement("div");
        bouton.id = "bouton_"+i;
        bouton.innerText = listeNames[i];
        group.appendChild(bouton);
        var element = document.getElementById('bouton_'+i);
        element.classList.add('filtre');
        if (i==0)
            {
                element.classList.add('filtre_actif');
            }
    }

    // Creation des EventListener
    // on recupere tous les boutons avec la classe filtre et on applique les modifications de styles
const buttons = document.querySelectorAll('.filtre');

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
        
        if(i==0)
            {
                document.querySelector(".gallery").innerHTML = "";
                for (let j=0; j<listeNames.length; j++)
                {
                    var element = document.getElementById('bouton_'+j);
                    if (element.classList.contains('filtre_actif'))
                        {
                            element.classList.remove('filtre_actif');
                        }
                        
                }
                document.querySelector("#bouton_"+i).classList.add('filtre_actif');
                afficherWorks(works);
            }

        else
        {
            
                const filtrework = works.filter(objet=> objet.categoryId == i);
                document.querySelector(".gallery").innerHTML = "";
                for (let j=0; j<listeNames.length; j++)
                    {
                        var element = document.getElementById('bouton_'+j);
                        if (element.classList.contains('filtre_actif'))
                            {
                                element.classList.remove('filtre_actif');
                            }
                            
                    }
                document.querySelector("#bouton_"+i).classList.add('filtre_actif');
                afficherWorks(filtrework);
            

        }

    });
}

