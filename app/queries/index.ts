import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const getSeasons = async () => {
  const seasons = await sql`SELECT * FROM seasons`;
  return seasons;
};
