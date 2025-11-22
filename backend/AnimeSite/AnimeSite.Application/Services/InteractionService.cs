using AnimeSite.Core.Abstractions;
using AnimeSite.Core.Models;

namespace AnimeSite.Application.Services;

public class InteractionService :  IInteractionService
{
    private readonly IInteractionRepository _repository;

    public InteractionService(IInteractionRepository repository)
    {
        _repository = repository;
    }

    public async Task RateAnime(Guid userId, Guid animeId, int rating)
    {
        var interaction = await _repository.Get(userId, animeId);
        if (interaction == null)
        {
            interaction = UserAnimeInteraction.Create(userId, animeId, rating, false);
        }
        else
        {
            interaction.SetRating(rating);
        }
        await _repository.AddOrUpdate(interaction);
    }

    public async Task AddToWatchLater(Guid userId, Guid animeId)
    {
        var interaction = await _repository.Get(userId, animeId);

        if (interaction == null)
        {
            interaction = UserAnimeInteraction.Create(userId, animeId, null, true);
        }
        else
        {
            interaction.SetWatchLater(true);
        }
        await _repository.AddOrUpdate(interaction);
    }

    public async Task RemoveFromWatchLater(Guid userId, Guid animeId)
    {
        var interaction = await _repository.Get(userId, animeId);
        if (interaction != null)
        {
            interaction.SetWatchLater(false);
            await _repository.AddOrUpdate(interaction);
        }
    }

    public async Task<List<Anime>> GetUserWatchLaterList(Guid userId)
    {
        return await _repository.GetWatchLaterList(userId);
    }
    
}