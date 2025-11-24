using AnimeSite.Core.Abstractions;
using AnimeSite.Core.Models;

namespace AnimeSite.Application.Services;

public class HistoryService : IHistoryService
{
    private readonly IHistoryRepository _repository;

    public HistoryService(IHistoryRepository repository)
    {
        _repository = repository;
    }

    public async Task AddToHistory(Guid userId, Guid episodeId)
    {
        var history = WatchHistory.Create(userId, episodeId);
        await _repository.AddOrUpdate(history);
    }

    public async Task<List<HistoryDto>> GetResumeList(Guid userId)
    {
        // Просто передаємо дані з репозиторія
        return await _repository.GetLastWatchedEpisodes(userId);
    }
}