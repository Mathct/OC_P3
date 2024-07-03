//////////////////////////////////////////////////////////////////
/// Déclaration des variables au chargement de la page
//////////////////////////////////////////////////////////////////

const textlog = document.getElementById("login_logout");
const modifier = document.getElementById("bouton-modifier");
const groupefiltre = document.getElementById("filtres");
const editionmode = document.getElementById("edition-mode");

let token = window.localStorage.getItem('TokenAuth');


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

///////////////////////////////////////////////////////////////////////////////////////////////////
/// fonction login et logout - Afin de ne pas avoir besoin de recharger la page après un logout
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
    afficherWorksModal(works);
    modal.addEventListener ('click', CloseModal);

    const ajouter = document.getElementById("butt_ajouter_photo");
    ajouter.addEventListener ('click', openModal2);

        
});

//fermeture modale
function CloseModal (e)
{

    if ((e.target === document.querySelector("#modal"))||(e.target === document.querySelector(".close1"))||(e.target === document.querySelector(".close2")))
    {
        
        const modal1 = document.querySelector(".modal1-content");
        modal1.classList.remove('hidden');
        const modal2 = document.querySelector(".modal2-content");
        modal2.classList.add('hidden');
        modal.classList.add('hidden');

        // suppression de la photo preview s'il y en a eu une de chargée
        var previewElement = document.getElementById('preview');
        if (previewElement) 
        {
            previewElement.remove();
            var imagePreviewDiv = document.getElementById('photo_preview');
            imagePreviewDiv.classList.add('hidden');
        }

        // Réinitialiser la valeur du champ de fichier pour permettre de re-sélectionner le même fichier
        document.getElementById("photo_file").value ='';

        // on affcihe les elements de la modale2 qui ont peut etre été masqués (si photo preview chargée)
        const icon_upload_image = document.getElementById('icon_choisir_photo');
        icon_upload_image.classList.remove('hidden');
        const butt_upload_image = document.getElementById('choisir_photo');
        butt_upload_image.classList.remove('hidden');
        const bloc_upload_image = document.getElementById('blocphoto');
        const text_upload_image = bloc_upload_image.querySelector('p');
        text_upload_image.classList.remove('hidden');
        
        
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

    }
    
}

//////////////////////////////////////////////////////////////////
/// confirmation de suppression
//////////////////////////////////////////////////////////////////

function ConfirmerSupprimerWork (e)
{
    
    const validation = confirm("Êtes-vous sûr de vouloir supprimer le projet ?");
    if (validation) {
        SupprimerWork(e);
    } 
}

//////////////////////////////////////////////////////////////////
/// fonction Supprimer Projet
//////////////////////////////////////////////////////////////////

function SupprimerWork (e)
{
    token = window.localStorage.getItem('TokenAuth');
    
    const suppId = e.target.id.split("_")[1];

    fetch('http://localhost:5678/api/works/'+suppId, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }).then((reponseAPI) => {
        
        if (reponseAPI.ok) 
        {
          alert("Le projet a été supprimé avec succés")
          
          // Je recrée mon works sans l'image supprimé (pour eviter de refaire un fetch)
          works = works.filter((work) => work.id != suppId);
          //je relance mes 3 fonctions d'affichage
          afficherWorks(works);
          afficherWorksModal(works);
          afficherCategorie(works);
          
        } 
        
        else 
        {
          alert("Une erreur est survenue: "+response.status);
        }
      });
    
}

//////////////////////////////////////////////////////////////////
/// Gestion de la modale d'Ajout de projet
//////////////////////////////////////////////////////////////////

// ouverture modale 2
function openModal2()
{
    document.getElementById("photo_file").value ='';


    const modal1 = document.querySelector(".modal1-content");
    modal1.classList.add('hidden');
    const modal2 = document.querySelector(".modal2-content");
    modal2.classList.remove('hidden');
    const prev = document.querySelector(".prev");
    prev.addEventListener('click', Previous)

    // pour supprimer le titre si l'utilisation a taper un titre puis fermé la modale et qu'il revient sur la modale (le champ doit être de nouveau vide)
    const titre = document.getElementById("titre");
    titre.value  = "";

    // charger la liste des categories dans le menu déroulant //
    //nettoyage menu
    document.querySelector("#menu_deroulant").innerHTML = "";
    // premiere option vide //
    let option = document.createElement("option");
    document.querySelector("#menu_deroulant").appendChild(option);
    
    for (let i=0; i<category.length; i++)
    {
        let option = document.createElement("option");
        option.value = category[i].name;
        option.innerText = category[i].name;
        option.id = "categorie_"+category[i].id;
        document.getElementById("menu_deroulant").appendChild(option);
    }

    // ajout listener sur bouton valider
    const valider = document.getElementById("butt_valider");
    valider.addEventListener ('click', ValiderAjout);

    // traitement de la selection d'image
    //listener sur l'id 'insererphoto' (input du champs file du formulaire) pour detecter un changement (qui signifie que l'utilisateur a selectionné une photo)
    document.getElementById('photo_file').addEventListener('change', function(event) {
        // Récupérer le fichier sélectionné ... ici on recupere le premier (si jmamais il y en a plusieurs de selectionné)
        var file = event.target.files[0];

        if (file && file.size > 4 * 1024 * 1024) { // 4 Mo en octets
            alert('Le fichier sélectionné dépasse la taille maximale de 4 Mo.');
            // on vide le champs... sinon on cumule les fichiers uploadés et les messages d'erreur
            document.getElementById("photo_file").value ='';

        }
        
        // Vérifie si file n'est pas null ou undefined, c'est-à-dire si un fichier a effectivement été sélectionné
        if (file && file.size < 4 * 1024 * 1024) {
            // Crée un nouvel objet FileReader pour lire le contenu du fichier.
            var reader = new FileReader();
            
            // Définit une fonction à exécuter lorsque le fichier est complètement lu. L'événement load est déclenché lorsqu'une lecture réussie est terminée.
            reader.onload = function(e) {
                // Créer une nouvelle balise img
                var img = document.createElement('img');
                img.id = "preview";
                
                // Définir l'attribut src de la balise img à l'URL de l'image lue
                img.src = e.target.result;
                
                // S'assurer que l'image s'ajuste à la div
                img.style.maxHeight = '100%';
                
                // Sélectionner la div où l'image doit être affichée
                var imagePreviewDiv = document.getElementById('photo_preview');
                
                // Vider le contenu de la div avant d'ajouter une nouvelle image
                imagePreviewDiv.innerHTML = '';
                
                // Ajouter l'image à la div
                imagePreviewDiv.appendChild(img);

                //enlever le hidden sur photo_preview
                imagePreviewDiv.classList.remove('hidden');

            };
    
            // Conversion du fichier en format affichable... je pouvais utiliser aussi URL.createObjectURL(file) (autre methode de programmation/idéal pour les fichier plus volumineux comme des video par exemple)
            reader.readAsDataURL(file);


            // on masque les elements de la modale à cacher
            const icon_upload_image = document.getElementById('icon_choisir_photo');
            icon_upload_image.classList.add('hidden');
            const butt_upload_image = document.getElementById('choisir_photo');
            butt_upload_image.classList.add('hidden');
            const bloc_upload_image = document.getElementById('blocphoto');
            const text_upload_image = bloc_upload_image.querySelector('p');
            text_upload_image.classList.add('hidden');

        }

        

    });


    // Sélectionner le formulaire
    const form = document.getElementById('form_add_projet');
    // Sélectionner tous les champs du formulaire (input de type texte, input de type file, select, textarea)
    const elements = form.querySelectorAll('input[type="text"], input[type="file"], select');

    // Ajouter un écouteur d'événements 'input' ou 'change' à chaque champ selon le type
    elements.forEach(function(element) {
        if (element.type === 'file') {
            element.addEventListener('change', changeBoutonColor); // Utiliser 'change' pour input de type file
        } else {
            element.addEventListener('input', changeBoutonColor); // Utiliser 'input' pour les autres champs
        }
    });


}



// fonction pour switcher la couleur du bouton "valider"
function changeBoutonColor()
{
    
    const select = document.getElementById("menu_deroulant");
    
    if ((document.getElementById("titre").value != "") && (document.getElementById("photo_file").files[0] !== undefined) && (select.options[select.selectedIndex].id != ""))
        {
            document.querySelector("#butt_valider").style.backgroundColor = "#1D6154";
        }
        
    else
        {
            document.querySelector("#butt_valider").style.backgroundColor = "#A7A7A7";
        }
}



// fonction du bouton "fleche" pour revenir a la modale precedente
function Previous () 
{
    const modal1 = document.querySelector(".modal1-content");
    modal1.classList.remove('hidden');
    const modal2 = document.querySelector(".modal2-content");
    modal2.classList.add('hidden');

    // suppression de la photo preview s'il y en a eu une de chargée
    var previewElement = document.getElementById('preview');
    if (previewElement) 
        {
            previewElement.remove();
            var imagePreviewDiv = document.getElementById('photo_preview');
            imagePreviewDiv.classList.add('hidden');
        }

    // Réinitialiser la valeur du champ de fichier pour permettre de re-sélectionner le même fichier
    document.getElementById("photo_file").value ='';

    // on affcihe les elements de la modale2 qui ont peut etre été masqués (si photo preview chargée)
    const icon_upload_image = document.getElementById('icon_choisir_photo');
    icon_upload_image.classList.remove('hidden');
    const butt_upload_image = document.getElementById('choisir_photo');
    butt_upload_image.classList.remove('hidden');
    const bloc_upload_image = document.getElementById('blocphoto');
    const text_upload_image = bloc_upload_image.querySelector('p');
    text_upload_image.classList.remove('hidden');
}

// fonction du bouton valider pour l'ajout d'un projet
function ValiderAjout ()
{
    token = window.localStorage.getItem('TokenAuth');
    
    const select = document.getElementById("menu_deroulant");

    const titre = document.getElementById("titre").value;
    const id_categorie = parseInt(select.options[select.selectedIndex].id.split("_")[1]);
    const nom_categorie = select.options[select.selectedIndex].innerText;
    const image = document.getElementById("photo_file").files[0];

    // je crée manuellement mon FormData car tous les champs de mon formulaire ne sont pas utilisé et certaines données viennent de l'exterieur comme le "calcul" de id_categorie
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", titre);
    formData.append("category", id_categorie);

    if (image == undefined)
        {
            alert("Veuillez ajouter une image");
        }

    if (titre.length == 0)
        {    
            alert("Veuillez ajouter un titre");
        }
        
    if (nom_categorie == "")
        {
            alert("Veuillez choisir une catégorie");
        }
      
    else
        {

            fetch('http://localhost:5678/api/works', {
                method: "POST",
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: formData,
            })
                .then((reponseAPI) => {
                    if (reponseAPI.ok) 
                    {
                        alert("Votre projet " +titre+ " a été créé avec succés");

                        return reponseAPI.json();
                                        
                    } 
                    else 
                    {
                        alert("Une erreur est survenue: "+response.status);
                    }
                })

                .then((data) => {
                    
                    const NewPoject = {}
                    NewPoject.id = data.id;
                    NewPoject.title = data.title;
                    NewPoject.imageUrl = data.imageUrl;
                    NewPoject.categoryId = 1;
                    NewPoject.userId = id_categorie;
                    NewPoject.category = {"id" : id_categorie, "name" : nom_categorie};
                    
                    works.push(NewPoject);

                    const modal1 = document.querySelector(".modal1-content");
                    modal1.classList.remove('hidden');
                    const modal2 = document.querySelector(".modal2-content");
                    modal2.classList.add('hidden');

                    afficherWorks(works);
                    afficherWorksModal(works);
                    afficherCategorie(works);
                })
        }

   
    
}

