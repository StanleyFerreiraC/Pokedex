async function getPokemonData() {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
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

async function loadPokemon() {
  const pokemonData = await getPokemonData();
  const pokemonGrid = document.querySelector('.pokemon-grid');

  pokemonData.forEach((pokemon) => {
    const pokemonCard = createPokemonCard(pokemon);
    pokemonGrid.appendChild(pokemonCard);
  });
}

// Carrega todos os Pokémon ao carregar a página
loadPokemon();