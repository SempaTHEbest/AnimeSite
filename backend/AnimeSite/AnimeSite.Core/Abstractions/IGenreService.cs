using AnimeSite.Core.Models;

namespace AnimeSite.Core.Abstractions;

public interface IGenreService
{
    Task<List<Genre>> GetAllGenres();
    Task CreateGenre(string name);
    Task DeleteGenre(Guid id);
}