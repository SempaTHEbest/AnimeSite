using AnimeSite.Core.Models;

namespace AnimeSite.Core.Abstractions;

public interface IAnimeRepository
{
    Task<List<Anime>> Get();
    Task<Anime?> GetById(Guid id);
    Task Add(Anime anime);
}