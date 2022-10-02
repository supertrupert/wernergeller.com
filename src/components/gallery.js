import React, { useEffect, useState } from 'react';
import Airtable from 'airtable';

const wrapper = {
  display: 'grid',
};

const base = new Airtable({ apiKey: 'keyZynWxF2U4Xhhpi' }).base(
  'appKjIv7utFmqAkdT'
);

function Gallery() {
  const [paintings, setPaintings] = useState([]);

  useEffect(() => {
    const allRecs = [];

    const result = base('Paintings')
      .select()
      .eachPage((records, fetchNextPage) => {
        records.forEach((rec) => allRecs.push(rec));
        fetchNextPage();
      })
      .then((result) => setPaintings(allRecs));
  }, []);

  return (
    <>
      <h1>Total amount of Paintings: {paintings.length}</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          justifyItems: 'center',
          gap: '20px',
        }}
      >
        {paintings.map((painting, i) => (
          <div key={i}>
            <img
              style={{ display: 'block' }}
              width={250}
              src={painting.get('Bild')[0].thumbnails.large.url}
            />
            <h3 style={{ textAlign: 'center', marginBottom: '0' }}>
              {painting.get('Titel')}
            </h3>
            <p style={{ textAlign: 'center', margin: '0' }}>
              {painting.get('Breite (cm)')} x {painting.get('Höhe (cm)')} (cm)
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Gallery;
