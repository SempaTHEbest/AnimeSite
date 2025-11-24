using AnimeSite.Core.Models;

namespace AnimeSite.Core.Abstractions;

public interface IEpisodeService
{
    Task<List<Episode>> GetEpisodesByAnimeId(Guid animeId);
    Task CreateEpisode(string title, string summary, int seasonNumber, int episodeNumber, DateTime releaseDate, string episodeLink, Guid animeId);
    Task DeleteEpisode(Guid id);
}