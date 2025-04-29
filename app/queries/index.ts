import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const getSeasons = async () => {
  const seasons = await sql`SELECT * FROM seasons`;
  return seasons;
};

export const getEpisodes = async (seasonId: number) => {
  const episodes = await sql`SELECT * FROM episodes WHERE season_id = ${seasonId}`;
  return episodes;
};

export const getEpisode = async (seasonId: number, episodeNumber: number) => {
  const episode = await sql`SELECT * FROM episodes WHERE season_id = ${seasonId} AND number = ${episodeNumber}`;
  return episode[0];
};

export const getSeasonsCount = async () => {
  const seasonsCount = await sql`SELECT COUNT(*) FROM seasons`;
  return Number(seasonsCount[0].count);
};

export const getEpisodesCount = async (seasonId: number) => {
  const episodesCount = await sql`SELECT COUNT(*) FROM episodes WHERE season_id = ${seasonId}`;
  return Number(episodesCount[0].count);
};
