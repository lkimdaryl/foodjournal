'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/app/ui/recipes.module.css';
import { pastaProps, recipeProps } from '@/app/lib/definitions';

const Pasta: React.FC<pastaProps> = ({img, label, url}) => {
  return (
    <>
    <img className={styles.weeklyPastaImg} src={img} alt={label} />
    <div className={styles.recipeInfo}>
      <h3 className={styles.weeklyPasta}>{label}</h3>
      <p className="">Check out this pasta dish! If you don't like what we have to offer, feel free to refresh the page for a new pasta dish!</p>
      <a className={styles.recipeInfoLink} href={url} target='_blank'>View Recipe</a>
    </div>              
    </>
  )
};

const Recipe: React.FC<recipeProps> = ({uri, url, img, label}) => {
  return (
    <div key={uri} className={styles.searchResult}>
      <img className={styles.searchResultImg} src={img} alt={label} />
      <div className={styles.recipeInfo}>
        <h3 className={styles.recipeInfoH3}>{label}</h3>
        <a className={styles.recipeInfoLink} href={url} target="_blank" rel="noopener noreferrer">
          View Recipe
        </a>
      </div>
    </div>
  )
};

export default function Recipes() {
  const [query, setQuery] = useState<string>('');
  const [recipes, setRecipes] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean | undefined>(false);
  const [error, setError] = useState<string | null>(null);
  const [pastaBank, setPastaBank] = useState<[]>([]);
  const [pastaOfTheWeek, setPastaOfTheWeek] = useState<any | null>();

  const applicationKey =  process.env.NEXT_PUBLIC_EDAMAM_API_KEY;
  const applicationId =  process.env.NEXT_PUBLIC_EDAMAM_API_ID;

  useEffect(() => {
    const getPasta = async() => {
      setLoading(true);
      setError(null);
      const url = `https://api.edamam.com/api/recipes/v2?type=public&q=pasta&app_id=${applicationId}&app_key=${applicationKey}`;
  
      try {
        const headers: HeadersInit = {
          "Accept": "application/json",
          "Accept-Language": "en",
        };
        if (applicationId) {
          headers["Edamam-Account-User"] = applicationId;
        }

        const response = await fetch(url, { headers });
  
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
  
        const data = await response.json();
        setPastaBank(data.hits);
      } catch (err) {
        console.log(`Failed to fetch recipes. Error: ${err}`);
      } finally {
        setLoading(false);
      }
    }
    getPasta();
  }, [applicationId, applicationKey]);

  useEffect(() => {
    const selectPastaOfTheWeek = () => {
      if (pastaBank.length > 0) {
        const randomPasta = pastaBank[Math.floor(Math.random() * pastaBank.length)];
        setPastaOfTheWeek(randomPasta);
      }
    };

    selectPastaOfTheWeek();
  }, [pastaBank]);

  const searchRecipes = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${applicationId}&app_key=${applicationKey}`;

    try {
      const headers: HeadersInit = {
        "Accept": "application/json",
        "Accept-Language": "en",
      };
      if (applicationId) {
        headers["Edamam-Account-User"] = applicationId;
      }
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setRecipes(data.hits);
    } catch (err: any) {
      setError(`Failed to fetch recipes. Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.recipesContainer}>
      <div className={styles.recipePostContainer}>
        <div className={styles.recipeWeek}>
          <h2>Recommended Pasta Recipe:</h2>
          <div className={styles.recipeCard}>
            { pastaOfTheWeek ? (
              <Pasta 
                img={pastaOfTheWeek.recipe.image} 
                label={pastaOfTheWeek.recipe.label} 
                url={pastaOfTheWeek.recipe.url} 
              />
            ) : <p>...Loading</p>
            }
          </div>
        </div>
        <div className={styles.recipeSearch}>
          <h1>Recipe Search</h1>
          <form className={styles.searchForm} onSubmit={searchRecipes}>
            <div className={styles.searchContainer}>
              <input
                className={styles.searchBox}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find new recipes..."
                required
              />
              <button className={styles.searchButton} type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
          {error && <p>{error}</p>}
          <div className={styles.recipesGrid}>
            {recipes.map((recipeData: {recipe: any}) => (
              <Recipe 
                key={recipeData.recipe.uri}
                uri={recipeData.recipe.uri} 
                url={recipeData.recipe.url} 
                img={recipeData.recipe.image} 
                label={recipeData.recipe.label} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
