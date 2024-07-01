//////////////////////////////////////////////////////////////////
/// Déclaration des variables au chargement de la page
//////////////////////////////////////////////////////////////////

const textlog = document.getElementById("login_logout");
const modifier = document.getElementById("bouton-modifier");
const groupefiltre = document.getElementById("filtres");
const editionmode = document.getElementById("edition-mode");

const token = window.localStorage.getItem('TokenAuth');

///////////////////////////////////////////////////////////////////////////////////////////////////
/// declaration des deux fonction login et logout - Afin de ne pas avoir besoin de recharger la page après un logout
///////////////////////////////////////////////////////////////////////////////////////////////////

function Login ()
{
    window.location.href = 'login.html';
}

function Logout ()
{
    window.localStorage.removeItem("TokenAuth");
    textlog.textContent = "login";
    modifier.classList.add('hidden');
    groupefiltre.classList.remove('hidden');
    editionmode.classList.add('hidden');
    textlog.addEventListener('click', Login)
}

//////////////////////////////////////////////////////////////////
/// Init lors du chargement de la page en fonction de l'etat du TokenAuth
//////////////////////////////////////////////////////////////////

if (token != null)
{
    textlog.textContent = "logout";
    modifier.classList.remove('hidden');
    groupefiltre.classList.add('hidden');
    editionmode.classList.remove('hidden');
    textlog.addEventListener('click', Logout)
}

else
{
    textlog.addEventListener('click', Login)
}

//////////////////////////////////////////////////////////////////
/// Recuperation des données de l'API
//////////////////////////////////////////////////////////////////

//recuperation et stockage des données works sur l'api .... je mets le works en let pour pouvoir le mettre à jour lors de la suppression de projet sans avoir à refaire un fetch
const reponse = await fetch('http://localhost:5678/api/works');
let works = await reponse.json();
//recuperation et stockage des données categories sur l'api pour le menu deroulant de la modale pour ajouter des projets
const reponse2 = await fetch('http://localhost:5678/api/categories');
const category = await reponse2.json();


//////////////////////////////////////////////////////////////////
/// fonction pour afficher la liste complete des works
//////////////////////////////////////////////////////////////////

function afficherWorks(works){

    // Récupération de l'élément du DOM qui accueillera les "works"
    // on vide la gallery pour ne pas que les works se rajoutent automatiquement à l'ouverture et a la modification (suppression et ajout)
    const groupWork = document.querySelector(".gallery");
    groupWork.innerHTML = "";


    for (let i = 0; i < works.length; i++) {

        const work = works[i];
        
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




//////////////////////////////////////////////////////////////////
/// Creation des boutons categories
//////////////////////////////////////////////////////////////////

function afficherCategorie(works)
{
    let listcategory = [];

    for (let i = 0; i < works.length; i++) 
    {
        listcategory.push(works[i].category)
    }
    
    
    // Extraction des noms uniques des catégories 
    const uniqueNamesSet = new Set(listcategory.map(item => item.name));
    // Transformation en array pour appliquer .sort et avoir un resultat en tableau
    const uniqueNamesArray = Array.from(uniqueNamesSet);
    // Tri des noms uniques par ordre décroissant d'ID associé
    let listeNames = uniqueNamesArray.sort((nameA, nameB) => {
    // Trouver les IDs associés aux noms pour le tri
    const idA = listcategory.find(item => item.name === nameA).id;
    const idB = listcategory.find(item => item.name === nameB).id;
    // Comparaison pour le tri croissant
    return idA - idB;
    });

    
    if (listeNames.length != 0)
    {
        listeNames.unshift('Tous');  // on rajoute "Tous" en premiere place
    }

    
    // nettoyage des boutons
    const group = document.getElementById("filtres");
    group.innerHTML = "";

    // creation des boutons (le but est d'avoir le numero de l'id de la categorie dans les id des boutons respectifs afin de ne pas afficher les categories vides)

    // Extraction des ids uniques des catégories 
    const uniqueIdSet = new Set(listcategory.map(item => item.id));
    // transformation en array et Tri par ordre croissant des id
    const uniqueIdTri= Array.from(uniqueIdSet).sort((a, b) => a - b);

    if (uniqueIdTri.length != 0)
        {
            uniqueIdTri.unshift("tous"); // on rajoute "tous" en premiere place (id du bouton "Tous").. je ne mets pas 0 si jamais un id 0 de categorie est créé
        }

    for (let i=0; i<listeNames.length; i++)
        {
            const bouton = document.createElement("div");
            bouton.id = "bouton_"+uniqueIdTri[i];
            bouton.innerText = listeNames[i];
            group.appendChild(bouton);
            var element = document.getElementById('bouton_'+uniqueIdTri[i]);
            element.classList.add('filtre');
            if (i==0)
                {
                    element.classList.add('filtre_actif');
                }
        }

//////////////////////////////////////////////////////////////////
/// Creation des EventListener et modificications des styles
//////////////////////////////////////////////////////////////////

    // on recupere tous les boutons avec la classe filtre et on applique les modifications de styles
    const buttons = document.querySelectorAll('.filtre');

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function () {
            
            if(i==0)
                {
                    document.querySelector(".gallery").innerHTML = "";
                    for (let j=0; j<listeNames.length; j++)
                    {
                        var element = document.getElementById('bouton_'+uniqueIdTri[j]);
                        if (element.classList.contains('filtre_actif'))
                            {
                                element.classList.remove('filtre_actif');
                            }
                            
                    }
                    document.querySelector("#bouton_"+uniqueIdTri[i]).classList.add('filtre_actif');
                    afficherWorks(works);
                }

            else
            {
                
                    const filtrework = works.filter(objet=> objet.categoryId == uniqueIdTri[i]);
                    document.querySelector(".gallery").innerHTML = "";
                    for (let j=0; j<listeNames.length; j++)
                        {
                            var element = document.getElementById('bouton_'+uniqueIdTri[j]);
                            if (element.classList.contains('filtre_actif'))
                                {
                                    element.classList.remove('filtre_actif');
                                }
                                
                        }
                    document.querySelector("#bouton_"+uniqueIdTri[i]).classList.add('filtre_actif');
                    afficherWorks(filtrework);
                

            }

        });
    }

}

// et on execute la fonction
afficherCategorie(works)



//////////////////////////////////////////////////////////////////
///////////////////////GESTION DES MODALES ///////////////////////
//////////////////////////////////////////////////////////////////

const modal = document.getElementById("modal");

// ouverture modale1
modifier.addEventListener ('click', function () {

    modal.classList.remove('hidden');
    modal.addEventListener ('click', CloseModal);
    afficherWorksModal(works);

        
});

//fermeture modale
function CloseModal (e)
{
    
    if ((e.target === document.querySelector("#modal"))||(e.target === document.querySelector(".fa-times")))
    {
        modal.classList.add('hidden');
        
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
/// fonction pour afficher la liste complete des works dans la modale ainsi que les boutons delete
///////////////////////////////////////////////////////////////////////////////////////////////////

function afficherWorksModal(works)
{

    // Récupération de l'élément du DOM qui accueillera les "works"
    // on vide la gallery pour ne pas que les works se rajoutent automatiquement à l'ouverture et a la modification (suppression et ajout)
    const groupWorkModal = document.querySelector(".modal-gallery");
    groupWorkModal.innerHTML = "";

    for (let i = 0; i < works.length; i++) {

        const work = works[i];
        
        // Création d’une balise dédiée aux "works"
        const workElementModal = document.createElement("figure"); 
        // Création des img (lien + alt) 
        const imageWorkModal = document.createElement("img");
        imageWorkModal.src = work.imageUrl;
        imageWorkModal.alt = work.title;
        //creation des boutons delete
        const poubelle = document.createElement("i");
        poubelle.id = "poubelle_"+work.id;
        poubelle.classList.add("fa-solid", "fa-trash-can");

        
        // On rattache le workElement (figures) au groupWork (modal-gallery)
        groupWorkModal.appendChild(workElementModal);
        // On rattache imageWorkModal (img) au workElement (figures) 
        workElementModal.appendChild(imageWorkModal);
        // on rattache la poubelle à workElement 
        workElementModal.appendChild(poubelle);

             
    }

    // ajout addEventListener à tous les boutons "poubelle"
    const poubellelistener = document.querySelectorAll(".fa-trash-can");
    for (let i=0; i<poubellelistener.length; i++)
    {
        let a = poubellelistener[i].id;
        let b = document.getElementById(a);
        b.addEventListener('click', ConfirmerSupprimerWork);

        console.log ("ok")
    }
    
}

//////////////////////////////////////////////////////////////////
/// confirmation de suppression
//////////////////////////////////////////////////////////////////

function ConfirmerSupprimerWork (e)
{
    
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer le projet ?");
    if (confirmation) {
        SupprimerWork(e);
    } 
}

//////////////////////////////////////////////////////////////////
/// fonction Supprimer Projet
//////////////////////////////////////////////////////////////////

function SupprimerWork (e)
{
    
    const suppId = e.target.id.split("_")[1];

    fetch('http://localhost:5678/api/works/'+suppId, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }).then((reponseAPI) => {
        
        if (reponseAPI.ok) 
        {
          alert("Projet supprimé")
          
          // Je recrée mon works sans l'image supprimé (pour eviter de refaire un fetch)
          works = works.filter((work) => work.id != suppId);
          //je relance mes deux fonctions d'affichage
          afficherWorks(works);
          afficherWorksModal(works);
          afficherCategorie(works);
          
        } 
        
        else 
        {
          alert("Erreur : " + response.status);
        }
      });
    
}

//////////////////////////////////////////////////////////////////
/// Gestion de la modale d'Ajout de projet
//////////////////////////////////////////////////////////////////

