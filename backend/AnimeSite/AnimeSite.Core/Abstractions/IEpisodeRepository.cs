using AnimeSite.Core.Models;

namespace AnimeSite.Core.Abstractions;

public interface IEpisodeRepository
{
    Task<List<Episode>> GetByAnimeId(Guid animeId);
    Task AddEpisode(Episode episode);
}