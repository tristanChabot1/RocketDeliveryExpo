# RocketDeliveryExpo

* La différence entre une application mobile native et une application mobile multiplateforme.
    * Les applications mobiles natives sont spécifiques à un système d'exploitation, écrites dans des langages natifs pour chaque plateforme. Elles offrent de meilleures performances et une expérience utilisateur plus adaptée.

    * Les applications mobiles multiplateformes sont développées pour plusieurs systèmes d'exploitation, utilisant des langages de programmation pouvant être compilés pour plusieurs plateformes. Elles sont économiques mais peuvent être moins performantes et offrir une expérience utilisateur moins fluide.

* La différence entre React Native et React.
    * React est une bibliothèque JavaScript pour la construction d'interfaces utilisateur (UI) pour les applications web. Elle permet de créer des composants réutilisables qui rendent le développement web plus efficace.

    * React Native, quant à elle, est une extension de React qui permet de développer des applications mobiles natives pour iOS et Android en utilisant la syntaxe et les composants de React. Elle permet de partager du code entre les plates-formes mobiles, réduisant ainsi le temps et les coûts de développement.

* Planifiez approximativement les API à utiliser pour les fonctionnalités requises de l'application.
    * /api/login
        * API pour pouvoir se connecter.
    
    * /restaurants
        * API pour recevoir la liste de restaurants et leurs informations (de base).

    * /api/products?restaurant=${restaurant.id}
        * API pour avoir les informations (plus détaillés) d'un restaurant donné.

    * /api/orders?type=customer&id=${customerID}
        * API pour avoir la liste de commandes liée à un 'customer'.