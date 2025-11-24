using AnimeSite.Core.Abstractions;
using AnimeSite.Core.Models;

namespace AnimeSite.Application.Services;

public class AnimeService : IAnimeService
{
    private readonly IAnimeRepository _animeRepository;

    public AnimeService(IAnimeRepository animeRepository)
    {
        _animeRepository = animeRepository;
    }

    public async Task<(List<Anime> Items, int TotalCount)> GetAllAnimes(string? search, int page, int pageSize)
    {
        return await _animeRepository.Get(search, page, pageSize);
    }

    public async Task<Anime?> GetAnimeById(Guid id)
    {
        return await _animeRepository.GetById(id);
    }

    public async Task CreateAnime(string title, string description, string imageUrl, double rating, string studio, string status, string type, DateTime releaseDate, int? totalEpisodes)
    {
        // 1. Викликаємо бізнес-логіку створення (Domain Logic)
        var (anime, error) = Anime.Create(
            Guid.NewGuid(), // Генеруємо ID тут, у сервісі
            title,
            description,
            imageUrl,
            rating,
            studio,
            status,
            type,
            releaseDate,
            totalEpisodes
        );

        // 2. Перевіряємо помилки валідації
        if (!string.IsNullOrEmpty(error))
        {
            throw new ArgumentException(error); // Кидаємо помилку, яку зловить глобальний обробник або контролер
        }

        // 3. Зберігаємо через репозиторій
        await _animeRepository.Add(anime);
    }
    public async Task DeleteAnime(Guid id)
    {
        // Просто передаємо ID в репозиторій. 
        // Репозиторій сам знайде і видалить.
        await _animeRepository.Delete(id);
    }
}