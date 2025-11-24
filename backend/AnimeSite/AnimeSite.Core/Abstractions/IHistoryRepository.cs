using AnimeSite.Core.Models; // Підключаємо наші моделі

namespace AnimeSite.Core.Abstractions;

public interface IHistoryRepository
{
    Task AddOrUpdate(WatchHistory history);
    
    Task<List<HistoryDto>> GetLastWatchedEpisodes(Guid userId);
}