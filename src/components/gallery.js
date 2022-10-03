import React, { useEffect, useState } from 'react';
import Airtable from 'airtable';

Airtable.configure({ apiKey: process.env.GATSBY_AIRTABLE_API_KEY });

console.log("What's the API key?", process.env.GATSBY_AIRTABLE_API_KEY);

const base = Airtable.base('appKjIv7utFmqAkdT');

function Gallery() {
  const [paintings, setPaintings] = useState([]);

  useEffect(() => {
    const allRecs = [];

    base('Paintings')
      .select()
      .eachPage((records, fetchNextPage) => {
        records.forEach((rec) => allRecs.push(rec));
        fetchNextPage();
      })
      .then(() => setPaintings(allRecs));
  }, []);

  function updateRecord(recId, titel) {
    base('Paintings').update(
      [
        {
          id: recId,
          fields: {
            Titel: titel,
          },
        },
      ],
      function (err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach((rec) => {
          console.log(rec.get('Titel'));
        });
      }
    );
  }

  function updateRec(event) {
    event.preventDefault();
    updateRecord(event.target.dataset.id, event.target.form[0].value);
    console.log(event.target.form[0].value);
    console.log(event.target.dataset.id);
  }

  function openFullImage(event) {
    window.open(event.target.dataset.full);
  }

  return (
    <>
      <h1>Collection Werner Geller (1928 - 2017)</h1>
      <h2>Anzahl Bilder: {paintings.length}</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '75px',
          padding: '2rem',
        }}
      >
        {paintings.map((painting, i) => {
          return (
            <div key={painting.id} style={{ margin: '0 auto' }}>
              <img
                style={{ display: 'block', cursor: 'zoom-in' }}
                width={250}
                src={painting.get('Bild')[0].thumbnails.large.url}
                onClick={openFullImage}
                data-full={painting.get('Bild')[0].thumbnails.full.url}
                alt={painting.get('Titel')}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '10px',
                }}
              >
                <form>
                  <input
                    type="text"
                    placeholder={painting.get('Titel')}
                  ></input>
                  <input
                    type="submit"
                    value="Submit"
                    onClick={updateRec}
                    data-id={painting.id}
                  ></input>
                </form>
              </div>
              <p style={{ textAlign: 'center', margin: '0' }}>
                {painting.get('Breite (cm)')} x {painting.get('Höhe (cm)')} (cm)
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Gallery;
