let offset = 0;
    const limit = 15;
    let isLoading = false;

    async function getPokemonData(offset, limit) {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const pokemonList = response.data.results;
        const pokemonData = [];

        for (const pokemon of pokemonList) {
          const pokemonResponse = await axios.get(pokemon.url);
          const pokemonInfo = {
            name: pokemonResponse.data.name,
            type: pokemonResponse.data.types.map((type) => type.type.name),
            imageUrl: pokemonResponse.data.sprites.front_default,
          };
          pokemonData.push(pokemonInfo);
        }

        return pokemonData;
      } catch (error) {
        console.error('Erro ao obter dados dos Pokémons:', error);
        return [];
      }
    }

    function createPokemonCard(pokemon) {
      const pokemonCard = document.createElement('div');
      pokemonCard.classList.add('pokemon-card');

      const nameElement = document.createElement('h3');
      nameElement.textContent = pokemon.name;

      const typeElement = document.createElement('p');
      typeElement.textContent = pokemon.type.join(', ');

      const imageElement = document.createElement('img');
      imageElement.classList.add('pokemon-image');
      imageElement.src = pokemon.imageUrl;
      imageElement.alt = pokemon.name;

      pokemonCard.appendChild(imageElement);
      pokemonCard.appendChild(nameElement);
      pokemonCard.appendChild(typeElement);
      

      return pokemonCard;
    }

    async function loadMorePokemon() {
      if (isLoading) return;

      isLoading = true;

      try {
        const pokemonData = await getPokemonData(offset, limit);
        const pokemonGrid = document.querySelector('.pokemon-grid');

        pokemonData.forEach((pokemon) => {
          const pokemonCard = createPokemonCard(pokemon);
          pokemonGrid.appendChild(pokemonCard);
        });

        offset += limit;
      } catch (error) {
        console.error('Erro ao carregar mais Pokémon:', error);
      }

      isLoading = false;
    }

    const loadMoreButton = document.getElementById('loadMoreButton');
    loadMoreButton.addEventListener('click', loadMorePokemon);

    // Carregar os primeiros 12 Pokémon ao iniciar a página
    window.addEventListener('DOMContentLoaded', loadMorePokemon);
