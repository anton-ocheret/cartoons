import postgres from 'postgres';
import seasons from '@/db';

const cartoon = {
  id: 1,
  name: 'Simpsons',
};



const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    await sql.begin(async () => [
      await seedCartoons(),
      await seedSeasons(),
      await seedEpisodes(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

async function seedCartoons() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS cartoons (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `;

    await sql`
      INSERT INTO cartoons (id, name) VALUES (${cartoon.id}, ${cartoon.name})
    `;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to seed cartoons.');
  }
}

async function seedSeasons() {
  try {
    const [cartoonId] = await sql`
      SELECT id FROM cartoons WHERE name = ${cartoon.name}
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS seasons (
        id SERIAL PRIMARY KEY,
        poster VARCHAR(255) NOT NULL,
        cartoon_id INTEGER NOT NULL,
        FOREIGN KEY (cartoon_id) REFERENCES cartoons(id)
      );
    `;

    for await (const season of seasons) {
      const { poster } = season;
      const cartoonIdRef = cartoonId.id;

      await sql`
        INSERT INTO seasons (poster, cartoon_id)
        VALUES (${poster}, ${cartoonIdRef})
      `;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to seed cartoons.');
  }
}

async function seedEpisodes() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS episodes (
        id SERIAL PRIMARY KEY,
        poster VARCHAR(255) NOT NULL,
        video VARCHAR(255) NOT NULL,
        number INTEGER NOT NULL,

        season_id INTEGER NOT NULL,
        cartoon_id INTEGER NOT NULL,
        FOREIGN KEY (season_id) REFERENCES seasons(id),
        FOREIGN KEY (cartoon_id) REFERENCES cartoons(id)
      );
    `;
    const [cartoonId] = await sql`
      SELECT id FROM cartoons WHERE name = ${cartoon.name}
    `;
    const cartoonIdRef = cartoonId.id;
    const seasonsData = await sql`SELECT * FROM seasons`;

    for await (const season of seasonsData) {
      const seasonIdRef = season.id;
      const episodesDb = seasons.find(({ number }) => Number(number) === Number(seasonIdRef))?.episodes;
      if (!episodesDb) throw new Error('No episodes found for season.');

      for await (const episode of episodesDb) {
        const { poster, video, number } = episode;

        await sql`
          INSERT INTO episodes (poster, video, number, season_id, cartoon_id)
          VALUES (${poster}, ${video}, ${number}, ${seasonIdRef}, ${cartoonIdRef})
        `;
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to seed episodes.');
  }
}
