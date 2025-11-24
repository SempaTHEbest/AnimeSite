using AnimeSite.Core.Models;

namespace AnimeSite.Core.Abstractions;

public interface IAnimeRepository
{
    Task<(List<Anime> Items, int TotalCount)> Get(string? search, int page, int pageSize);
    Task<Anime?> GetById(Guid id);
    Task Add(Anime anime);
    Task Delete(Guid id);
}