using AnimeSite.Core.Models;

namespace AnimeSite.Core.Abstractions;

public interface IInteractionService
{
    Task RateAnime(Guid userId, Guid animeId, int rating);
    Task AddToWatchLater(Guid userId, Guid animeId);
    Task RemoveFromWatchLater(Guid userId, Guid animeId);
    Task <List<Anime>> GetUserWatchLaterList(Guid userId);
}