using AnimeSite.Core.Abstractions;
using AnimeSite.Core.Models;

namespace AnimeSite.Application.Services;

public class EpisodeService : IEpisodeService
{
    private readonly IEpisodeRepository _episodeRepository;

    public EpisodeService(IEpisodeRepository episodeRepository)
    {
        _episodeRepository = episodeRepository;
    }

    public async Task<List<Episode>> GetEpisodesByAnimeId(Guid animeId)
    {
        return await _episodeRepository.GetByAnimeId(animeId);
    }

    public async Task CreateEpisode(string title, string summary, int seasonNumber, int episodeNumber, DateTime releaseDate, string episodeLink, Guid animeId)
    {
        var (episode, error) = Episode.Create(
            Guid.NewGuid(),
            title,
            summary,
            seasonNumber,
            episodeNumber,
            releaseDate,
            episodeLink,
            animeId
        );

        if (!string.IsNullOrEmpty(error))
        {
            throw new ArgumentException(error);
        }

        await _episodeRepository.AddEpisode(episode);
    }
}