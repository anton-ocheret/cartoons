import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const getSeasons = async () => {
  try {
    const seasons = await sql`SELECT * FROM seasons`;
    return seasons;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get seasons.');
  }
};

export const getEpisodes = async (seasonId: number) => {
  try {
    const episodes = await sql`SELECT * FROM episodes WHERE season_id = ${seasonId}`;
    return episodes;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get episodes.');
  }
};

export const getEpisode = async (seasonId: number, episodeNumber: number) => {
  try {
    const episode = await sql`SELECT * FROM episodes WHERE season_id = ${seasonId} AND number = ${episodeNumber}`;
    return episode[0];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get episode.');
  }
};

export const getSeasonsCount = async () => {
  try {
    const seasonsCount = await sql`SELECT COUNT(*) FROM seasons`;
    return Number(seasonsCount[0].count);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get seasons count.');
  }
};

export const getEpisodesCount = async (seasonId: number) => {
  try {
    const episodesCount = await sql`SELECT COUNT(*) FROM episodes WHERE season_id = ${seasonId}`;
    return Number(episodesCount[0].count);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get episodes count.');
  }
};

export const getAllEpisodesCount = async () => {
  try {
    const episodesCount = await sql`SELECT COUNT(*) FROM episodes`;
    return Number(episodesCount[0].count);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get all episodes.');
  }
};
