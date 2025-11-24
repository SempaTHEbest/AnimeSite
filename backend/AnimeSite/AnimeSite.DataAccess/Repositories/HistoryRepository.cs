using AnimeSite.Core.Abstractions;
using AnimeSite.Core.Models;
using AnimeSite.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace AnimeSite.DataAccess.Repositories;

public class HistoryRepository : IHistoryRepository
{
    private readonly AnimeSiteDbContext _context;

    public HistoryRepository(AnimeSiteDbContext context)
    {
        _context = context;
    }

    // --- ДОДАНИЙ ПРОПУЩЕНИЙ МЕТОД ---
    public async Task AddOrUpdate(WatchHistory history)
    {
        var entity = await _context.WatchHistory
            .FirstOrDefaultAsync(h => h.UserId == history.UserId && h.EpisodeId == history.EpisodeId);

        if (entity == null)
        {
            entity = new WatchHistoryEntity
            {
                UserId = history.UserId,
                EpisodeId = history.EpisodeId,
                WatchedDate = history.WatchedDate
            };
            await _context.WatchHistory.AddAsync(entity);
        }
        else
        {
            entity.WatchedDate = history.WatchedDate;
            _context.WatchHistory.Update(entity);
        }

        await _context.SaveChangesAsync();
    }

    // --- Твій метод (все вірно) ---
    public async Task<List<HistoryDto>> GetLastWatchedEpisodes(Guid userId)
    {
        var history = await _context.WatchHistory
            .AsNoTracking()
            .Where(h => h.UserId == userId)
            .Include(h => h.Episode)
            .ThenInclude(e => e.Anime)
            .ToListAsync();

        var lastWatchedEntities = history
            .GroupBy(h => h.Episode.AnimeId)
            .Select(g => g.OrderByDescending(h => h.WatchedDate).First())
            .OrderByDescending(h => h.WatchedDate)
            .ToList();

        var result = lastWatchedEntities.Select(h => new HistoryDto
        {
            AnimeId = h.Episode.AnimeId,
            AnimeTitle = h.Episode.Anime.Title,
            AnimeImageUrl = h.Episode.Anime.ImageUrl,
            TotalEpisodes = h.Episode.Anime.TotalEpisodes,
            
            EpisodeId = h.EpisodeId,
            EpisodeNumber = h.Episode.EpisodeNumber,
            
            WatchedDate = h.WatchedDate
        }).ToList();

        return result;
    }
}