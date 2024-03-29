var pokemons;
//CARREGAMENTO DE PAGINA
window.onload = function() {
    const pokedex = document.getElementById("result");
    const fetchPokemon = (callback) => { //callback é passada como argumento de outra função e chamada quando um evento for acontecido
        const promises = [];
        for (let i = 1; i <= 802; i++) { //número de pokemons
            const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
            promises.push(fetch(url).then((res) => res.json()));
        }
        //FUNÇÃO PARA MAPEAR O POKEDEX
        Promise.all(promises).then((results) => { //promise é um objeto usado para processamento assíncrono

            pokemons = results.map((data) => ({
                name: data.name,
                id: data.id,
                image: data.sprites['front_default'],
                type: data.types.map((type) => type.type.name).join(','),
                height: data.height
            }));

            if (typeof callback == "function")
                callback();
        });
    };

    const displayPokemon = (pokemon) => {

        const pokemonString = pokemon
            .map(
                (pokeman) =>
                `
            <li class="card" onclick=\"exibirPopUp(${pokeman.id})\">
                <h2 class="card-title">${pokeman.id}. ${pokeman.name} </h2>
                <img class="card-image" src="${pokeman.image}"/>
                </li>
                `

            )
            .join('');
        pokedex.innerHTML = pokemonString;
    };

    fetchPokemon(setEvent);

    function setEvent() { //seta os eventos na tela para fazer o load

        displayPokemon(pokemons);
        //FUNÇÃO PARA FILTRAR O NOME E NUMERO DO POKEMON
        function getPokemonsByName() {
            var nome = document.getElementById("filtrar-nome").value;
            displayPokemon(pokemons.filter(function(obj) {
                if (obj.name.indexOf(nome) >= 0 || nome == obj.id)
                    return true;
                return false;
            }))
        }
        //FUNÇÃO PARA FILTRAR O TIPO
        function getPokemonsByType() {
            var tipo = document.getElementById("filtrar-tipo").value;

            displayPokemon(pokemons.filter(function(obj) {
                if (tipo == "all")
                    return true;
                else if (obj.type.indexOf(tipo) >= 0)
                    return true;
                return false;
            }))
        }

        //PESQUISAR PELA ORDEM DO POKEDEX
        function getPokemonByOrdem() {
            var ordem = document.getElementById("ordem").selectedIndex;

            var ordenacao;
            switch (ordem) {
                case 0:
                    ordenacao = function(a, b) {
                        if (a.height > b.height) {
                            return 1;
                        }
                        if (a.height < b.height) {
                            return -1;
                        }

                        return 0;
                    }
                    break;
                case 1:
                    ordenacao = function(a, b) {
                        if (a.height > b.height) {
                            return -1;
                        }
                        if (a.height < b.height) {
                            return 1;
                        }

                        return 0;
                    }
                    break;
                case 2:
                    ordenacao = function(a, b) {
                        if (a.name > b.name) {
                            return 1;
                        }
                        if (a.name < b.name) {
                            return -1;
                        }

                        return 0;
                    }
                    break;
                default:
                    ordenacao = function(a, b) {
                        if (a.name > b.name) {
                            return -1;
                        }
                        if (a.name < b.name) {
                            return 1;
                        }

                        return 0;
                    }
            }

            displayPokemon(pokemons.sort(ordenacao));

        }

        document.getElementById("filtrar-nome").addEventListener("input", getPokemonsByName)
        document.getElementById("filtrar-tipo").addEventListener("change", getPokemonsByType)
        document.getElementById("ordem").addEventListener("change", getPokemonByOrdem)
    }


};
//MODAL PARA EXIBIR INFORMAÇÕES AO CLICAR NO CARD
function exibirPopUp(id) {
    document.getElementById("popUp").style.display = "block";

    let pokemon = pokemons.filter(x => x.id == id)[0];

    document.getElementById("infoPopUp").innerHTML += " " + `<h2 class="card-title">${pokemon.id}. ${pokemon.name} </h2>`;
    document.getElementById("infoPopUp").innerHTML += " " + `<img class="card-image" src="${pokemon.image}"/>`;
    document.getElementById("infoPopUp").innerHTML += " " + `<p class="card-subtitle">Tipo: ${pokemon.type}</p>`;
    document.getElementById("infoPopUp").innerHTML += " " + `<p class="card-subtitle">Altura: ${pokemon.height}</p>`;

}
//FUNÇÃO PARA FECHAR MODAL
function fecharPop() {
    document.getElementById("popUp").style.display = "none";
    document.getElementById("infoPopUp").innerHTML = "";
}