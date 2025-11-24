using AnimeSite.Core.Models; 

namespace AnimeSite.Core.Abstractions;

public interface IHistoryService
{
    Task AddToHistory(Guid userId, Guid episodeId);
    
    Task<List<HistoryDto>> GetResumeList(Guid userId);
}