// Variáveis globais para controle do carregamento dos Pokémon
let offset = 0;
const limit = 12;
let isLoading = false;
let pokemonData = [];

function setLimitBasedOnResolution() {
  if (window.innerWidth <= 768) {
    limit = 11; // Valor para resoluções menores, como dispositivos móveis
  } else {
    limit = 12; // Valor padrão para resoluções maiores
  }
}

async function getPokemonData(offset, limit) {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const pokemonList = response.data.results;

    const requests = pokemonList.map((pokemon) => axios.get(pokemon.url));
    const responses = await Promise.all(requests);

    pokemonData = responses.map((response) => {
      const pokemon = response.data;
      return {
        name: pokemon.name,
        number: pokemon.id,
        type: pokemon.types.map((type) => type.type.name),
        imageUrl: pokemon.sprites.front_default,
      };
    });

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

function clearPokemonGrid() {
  const pokemonGrid = document.querySelector('.pokemon-grid');
  pokemonGrid.innerHTML = '';
}

function searchPokemon() {
  const searchBar = document.getElementById('searchBar');
  const searchQuery = searchBar.value.trim().toLowerCase();

  if (!searchQuery) {
    // Se a barra de pesquisa estiver vazia, recarrega todos os Pokémon
    offset = 0;
    clearPokemonGrid();
    loadMorePokemon();
    return;
  }

  const filteredPokemon = pokemonData.filter((pokemon) => {
    return pokemon.name.toLowerCase().includes(searchQuery);
  });

  clearPokemonGrid();

  if (filteredPokemon.length === 0) {
    const pokemonGrid = document.querySelector('.pokemon-grid');
    const noResultsElement = document.createElement('p');
    noResultsElement.textContent = 'Nenhum Pokémon encontrado.';
    pokemonGrid.appendChild(noResultsElement);
  } else {
    filteredPokemon.forEach((pokemon) => {
      const pokemonCard = createPokemonCard(pokemon);
      const pokemonGrid = document.querySelector('.pokemon-grid');
      pokemonGrid.appendChild(pokemonCard);
    });
  }
}

const loadMoreButton = document.getElementById('loadMoreButton');
loadMoreButton.addEventListener('click', loadMorePokemon);

const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', searchPokemon);

const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    searchPokemon();
  }
});

// Carregar os primeiros 12 Pokémon ao iniciar a página
window.addEventListener('DOMContentLoaded', loadMorePokemon);
