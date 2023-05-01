import React, { useEffect, useState } from 'react';
//axios for making HTTP requests to APIs
import axios from 'axios';

//define a function, a react component to render the contents of the page
function App() {
    //hook to define a variable and a function to use to update value of actors
  const [actors, setActors] = useState([]);

  useEffect(() => {
    //make the HTTP request to the API endpoints when component first loads. CORS token for access.
    axios.get('https://switch-yam-equator.azurewebsites.net/api/actors', {
      headers: {
        'x-chmura-cors': 'c3ed0d1a-98f4-42e8-bff9-956b17323892'
      }
    })
    .then(response => {
      const movies = response.data;

      // Get movies with both actorId Nicolas Cage and actorId Keanu Reeves if API request is successful
      const filteredMovies = movies.filter(movie => {
        const actors = movie.actors;
        return actors?.includes('115') && actors?.includes('206');
      }, []);

      // Get  and create unique list of actors who appeared in those movies
      const actorIds = filteredMovies.reduce((actorIds, movie) => {
        const actors = movie.actors;
        return actorIds.concat(actors.filter(actorId => actorId !== '115' && actorId !== '206'));
      }, []);
      const uniqueActorIds = [...new Set(actorIds)];

      // Create another HTTP request to get actor names from API based on their IDs and update state
      axios.get(`https://switch-yam-equator.azurewebsites.net/api/actors?ids=${uniqueActorIds.join(',')}`, {
        headers: {
          'x-chmura-cors': 'c3ed0d1a-98f4-42e8-bff9-956b17323892'
        }
      })
      //if second API HTTP request is successful, setActors function is called to update the value of actors with the data from response.
      .then(response => {
        setActors(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    })
    .catch(error => {
      console.log(error);
    });
  }, []);

  //Render a heading and an list of the actors names. Use .map to loop through the actors array and render each actor in an <li> element.
  return (
    <div>
      <h1>Actors in Movies with Nicolas Cage and Keanu Reeves</h1>
      <ul>
        {actors.map((actor, key) => (
          <li key={key}>{actor.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
