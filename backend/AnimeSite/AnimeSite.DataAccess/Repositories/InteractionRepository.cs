using AnimeSite.Core.Abstractions;
using AnimeSite.Core.Models;
using AnimeSite.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace AnimeSite.DataAccess.Repositories;

public class InteractionRepository : IInteractionRepository
{
    private readonly AnimeSiteDbContext _context;

    public InteractionRepository(AnimeSiteDbContext context)
    {
        _context = context;
    }

    public async Task<UserAnimeInteraction?> Get(Guid userId, Guid animeId)
    {
        var entity = await _context.Interactions
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserId == userId && x.AnimeId == animeId);
        if (entity == null) return null;
        return UserAnimeInteraction.Create(entity.UserId, entity.AnimeId, entity.Rating, entity.IsWatchLater);
    }

    public async Task<List<Anime>> GetWatchLaterList(Guid userId)
    {
        var entities = await _context.Interactions
            .AsNoTracking()
            .Where(i => i.UserId == userId && i.IsWatchLater)
            .Include(i => i.Anime)
            .ThenInclude(a => a.AnimeGenres)
            .ThenInclude(ag => ag.Genre)
            .Select(i => i.Anime)
            .ToListAsync();
        
        return entities.Select(e => Anime.Create(e.Id, e.Title, e.Description, e.ImageUrl, e.Rating, e.Studio, e.Status, e.Type, e.ReleaseDate, e.TotalEpisodes).anime).ToList();
    }
    
    public async Task AddOrUpdate(UserAnimeInteraction interaction)
    {
        var entity = await _context.Interactions
            .FirstOrDefaultAsync(i => i.UserId == interaction.UserId && i.AnimeId == interaction.AnimeId);

        if (entity == null)
        {
            // Створюємо новий
            entity = new UserAnimeInteractionEntity
            {
                UserId = interaction.UserId,
                AnimeId = interaction.AnimeId,
                Rating = interaction.Rating,
                IsWatchLater = interaction.IsWatchLater
            };
            await _context.Interactions.AddAsync(entity);
        }
        else
        {
            // Оновлюємо існуючий
            entity.Rating = interaction.Rating;
            entity.IsWatchLater = interaction.IsWatchLater;
            _context.Interactions.Update(entity);
        }

        await _context.SaveChangesAsync();
    }
}