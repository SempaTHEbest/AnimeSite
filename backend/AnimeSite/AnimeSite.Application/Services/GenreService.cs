using AnimeSite.Core.Abstractions;
using AnimeSite.Core.Models;

namespace AnimeSite.Application.Services;

public class GenreService : IGenreService
{
    private readonly IGenreRepository _genreRepository;

    public GenreService(IGenreRepository genreRepository)
    {
        _genreRepository = genreRepository;
    }

    public async Task<List<Genre>> GetAllGenres()
    {
        return await _genreRepository.GetAll();
    }

    public async Task CreateGenre(string name)
    {
        var (genre, error) = Genre.Create(Guid.NewGuid(), name);

        if (!string.IsNullOrEmpty(error))
        {
            throw new ArgumentException(error);
        }

        await _genreRepository.Add(genre);
    }

    public async Task DeleteGenre(Guid id)
    {
        await _genreRepository.Delete(id);
    }
}