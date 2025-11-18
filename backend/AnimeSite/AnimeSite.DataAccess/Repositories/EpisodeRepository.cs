using AnimeSite.Core.Models;
using AnimeSite.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace AnimeSite.DataAccess.Repositories;

public class EpisodeRepository
{
    private readonly AnimeSiteDbContext _context;

    public EpisodeRepository(AnimeSiteDbContext context)
    {
        _context = context;
    }

    public async Task<List<Episode>> GetAnimeById(Guid animeId)
    {
        var entities = await _context.Episodes
            .AsNoTracking()
            .Where(e => e.AnimeId == animeId)
            .ToListAsync();
        return entities.Select(e => MapToDomain(e)).ToList();
    }

    public async Task AddEpisode(Episode episode)
    {
        var entity = new EpisodeEntity
        {
            Id =  episode.Id,
            Title =   episode.Title,
            Summary =    episode.Summary,
            SeasonNumber =  episode.SeasonNumber,
            EpisodeNumber =   episode.EpisodeNumber,
            ReleaseDate =   episode.ReleaseDate,
            EpisodeLink =   episode.EpisodeLink,
            AnimeId = episode.AnimeId
        };
        await _context.Episodes.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    private Episode MapToDomain(EpisodeEntity entity)
    {
        var (episode, error) = Episode.Create(
            entity.Id,
            entity.Title,
            entity.Summary,
            entity.SeasonNumber,
            entity.EpisodeNumber,
            entity.ReleaseDate,
            entity.EpisodeLink,
            entity.AnimeId
        );
        if (!string.IsNullOrEmpty(error))
        {
            throw new InvalidOperationException(error);
        }
        return episode;
    }
}