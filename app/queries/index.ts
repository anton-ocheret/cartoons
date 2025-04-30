import postgres from 'postgres';
import { revalidatePath } from 'next/cache';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const getSeasonsPageData = async () => {
  try {
    const result = await sql`
      SELECT s.id AS season_id, s.poster, COUNT(e.id) AS total_episodes, COUNT(DISTINCT seen.episode_id) AS seen_episodes
      FROM seasons s
      LEFT JOIN episodes e ON s.id = e.season_id
      LEFT JOIN seen ON s.id = seen.season_id AND e.id = seen.episode_id
      GROUP BY s.id, s.cartoon_id
      ORDER BY s.cartoon_id, s.id
    `;
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get seasons page data.');
  }
}

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
    const episodes = await sql`
      SELECT episodes.*, CASE WHEN seen.episode_id IS NOT NULL THEN TRUE ELSE FALSE END AS seen FROM episodes
      LEFT JOIN seen ON episodes.id = seen.episode_id
      WHERE episodes.season_id = ${seasonId}
      ORDER BY episodes.number
    `;
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

export const getSeen = async (seasonId: number, episodeId: number) => {
  try {
    const seen = await sql`SELECT * FROM seen WHERE season_id = ${seasonId} AND episode_id = ${episodeId}`;
    return seen[0];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get seen.');
  }
}

export const getSeenEpisodes = async (seasonId: number) => {
  try {
    const seenEpisodes = await sql`SELECT * FROM seen WHERE season_id = ${seasonId}`;
    return seenEpisodes;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get seen episodes.');
  }
}

export const getSeenEpisodesCount = async (seasonId: number) => {
  try {
    const seenEpisodesCount = await sql`SELECT COUNT(*) FROM seen WHERE season_id = ${seasonId}`;
    return Number(seenEpisodesCount[0].count);
  } catch (error) {
    console.error(error); 
    throw new Error('Failed to get seen episodes count.');
  }
}

export const getSeenCount = async () => {
  try {
    const seenCount = await sql`SELECT COUNT(*) FROM seen`;
    return Number(seenCount[0].count);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get seen count.');
  }
}

export const togleSeenAction = async (formData: FormData) => {
  'use server';
  try {
    const cartoonId = 1;
    const seasonId = formData.get('seasonId');
    const episodeNumber = formData.get('episodeNumber');
    const episode = await getEpisode(Number(seasonId), Number(episodeNumber));
    const episodeId = episode.id;
    const seen = await getSeen(Number(seasonId), Number(episodeId));
    if (seen) {
      await sql`DELETE FROM seen WHERE season_id = ${Number(seasonId)} AND episode_id = ${Number(episodeId)}`;
    } else {
      await sql`INSERT INTO seen (cartoon_id, season_id, episode_id) VALUES (${Number(cartoonId)}, ${Number(seasonId)}, ${Number(episodeId)})`;
    }

    revalidatePath(`/simpsons/${seasonId}/episode/${episodeNumber}`);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to mark as seen.');
  }
};