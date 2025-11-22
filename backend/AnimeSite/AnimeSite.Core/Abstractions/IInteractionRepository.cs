using AnimeSite.Core.Models;

namespace AnimeSite.Core.Abstractions;

public interface IInteractionRepository
{
    Task<UserAnimeInteraction?> Get(Guid userId,Guid animeId);
    Task<List<Anime>> GetWatchLaterList(Guid userId);
    Task AddOrUpdate(UserAnimeInteraction interaction);
}