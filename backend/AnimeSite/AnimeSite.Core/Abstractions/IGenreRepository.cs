using AnimeSite.Core.Models;

namespace AnimeSite.Core.Abstractions;

public interface IGenreRepository
{
    Task<List<Genre>> GetAll();
    Task Add(Genre genre);
    Task Delete(Guid id);
}